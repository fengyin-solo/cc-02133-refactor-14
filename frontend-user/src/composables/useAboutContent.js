/**
 * 关于我们页面的共用内容流程。
 *
 * 四个章节（公司简介 / 发展历程 / 企业文化 / 核心团队）统一走同一条管线：
 *
 *   读取（loadAboutContent，带缓存的异步管线）
 *     -> 归一化（normalizeAboutContent，章节缺项恢复、节点去重、残缺字段补默认）
 *     -> 排序（按 data/about.js 中的 ABOUT_SECTIONS 固定顺序输出）
 *
 * 视图层只消费最终的 sections 数组，不感知数据来源与异常修复逻辑，
 * 因此前进后退、刷新或窄屏切换后内容结构始终一致。
 */
import { shallowRef, onScopeDispose } from 'vue'
import {
  SECTION_KEYS,
  ABOUT_SECTIONS,
  createDefaultAboutContent,
  ABOUT_FALLBACK_TEXT as FALLBACK
} from '@/data/about'

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== ''
const toText = (value, fallback) => (isNonEmptyString(value) ? value.trim() : fallback)
const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

/**
 * 默认数据读取器：返回内置的完整数据。
 * 统一采用异步接口，后续接入接口或静态 JSON 时只需替换读取器，
 * 归一化与展示流程无需改动。
 */
const defaultReader = async () => createDefaultAboutContent()

let reader = defaultReader
// 模块级 Promise 缓存：同一会话内前进/后退复用同一份已读取的数据
let inflightPromise = null

/**
 * 替换内容读取器（例如改为请求后端接口），并清空已缓存的读取结果。
 */
export function setAboutContentReader(nextReader) {
  reader = typeof nextReader === 'function' ? nextReader : defaultReader
  inflightPromise = null
}

/**
 * 读取原始内容。读取异常或返回空数据时回落到统一默认数据；
 * 并发调用共享同一个 Promise。该 Promise 始终 resolve，
 * 因此前进/后退、刷新复用缓存时不会拿到被拒绝的结果。
 */
export function loadAboutContent() {
  if (!inflightPromise) {
    inflightPromise = Promise.resolve()
      .then(() => reader())
      .then((raw) => (isPlainObject(raw) ? raw : createDefaultAboutContent()))
      .catch(() => createDefaultAboutContent())
  }
  return inflightPromise
}

/* ------------------------- 各章节归一化 ------------------------- */

function normalizeCompany(rawSection, fallback) {
  const raw = isPlainObject(rawSection) ? rawSection : {}

  // 段落：取非空字符串；全缺时恢复默认两段，保证既有信息不丢失
  const paragraphs = Array.isArray(raw.paragraphs)
    ? raw.paragraphs.filter(isNonEmptyString).map((text) => text.trim())
    : []

  // 数据节点：按 label 去重（重复节点保留首个），数字/文案缺失补统一默认
  const stats = []
  const seenLabels = new Set()
  const rawStats = Array.isArray(raw.stats) ? raw.stats : []
  for (const item of rawStats) {
    if (!isPlainObject(item)) continue
    const label = isNonEmptyString(item.label) ? item.label.trim() : FALLBACK.statLabel
    if (seenLabels.has(label)) continue
    seenLabels.add(label)
    stats.push({
      value: isNonEmptyString(item.value) ? item.value.trim() : FALLBACK.statValue,
      label
    })
  }

  const rawImage = isPlainObject(raw.image) ? raw.image : {}

  return {
    paragraphs: paragraphs.length > 0 ? paragraphs : [...fallback.paragraphs],
    stats: stats.length > 0 ? stats : fallback.stats.map((item) => ({ ...item })),
    image: {
      icon: toText(rawImage.icon, fallback.image.icon),
      text: toText(rawImage.text, fallback.image.text)
    }
  }
}

function normalizeHistory(rawSection, fallback) {
  const raw = isPlainObject(rawSection) ? rawSection : {}

  // 年份有效（四位数字）的节点才保留；同年份视为重复节点，保留首个，
  // 其缺失的标题/描述在下一轮按字段补全
  const byYear = new Map()
  const rawItems = Array.isArray(raw.items) ? raw.items : []
  for (const item of rawItems) {
    if (!isPlainObject(item)) continue
    const year = String(item.year ?? '').trim()
    if (!/^\d{4}$/.test(year)) continue
    if (byYear.has(year)) continue
    byYear.set(year, {
      year,
      title: isNonEmptyString(item.title) ? item.title.trim() : '',
      description: isNonEmptyString(item.description) ? item.description.trim() : ''
    })
  }

  let items = [...byYear.values()]
  // 历史数据不完整（一个有效节点都没有）时整段恢复默认
  if (items.length === 0) {
    items = fallback.items.map((item) => ({ ...item }))
  } else {
    // 单个节点字段残缺时用统一兜底文案补齐
    items = items.map((item) => ({
      year: item.year,
      title: item.title || FALLBACK.historyTitle,
      description: item.description || FALLBACK.historyDescription
    }))
  }

  // 时间线始终按年份先后展示
  items.sort((a, b) => Number(a.year) - Number(b.year))
  return { items }
}

/**
 * 卡片型章节（企业文化 / 核心团队）的通用归一化：
 * - 以 nameField 对应的文案作为节点唯一标识去重
 * - 标准节点按默认顺序对齐（标题缺失的节点按序号套用默认标题）
 * - 多余的自定义节点保持其原始先后顺序追加在后
 *
 * @param {object} rawSection     数据源中该章节的原始内容
 * @param {object} fallback       该章节的默认完整数据
 * @param {string} nameField      节点唯一标识字段（文化用 title，团队用 name）
 * @param {string[]} fields       需要补齐的其他字段
 * @param {object} extraFallback  非标准节点的残缺字段兜底文案
 */
function normalizeCardSection(rawSection, fallback, nameField, fields, extraFallback) {
  const raw = isPlainObject(rawSection) ? rawSection : {}
  const rawItems = Array.isArray(raw.items) ? raw.items : []

  const cleanItems = []
  const seenNames = new Set()
  for (const item of rawItems) {
    if (!isPlainObject(item)) continue
    const name = isNonEmptyString(item[nameField]) ? item[nameField].trim() : ''
    if (!name || seenNames.has(name)) continue
    seenNames.add(name)

    const clean = { [nameField]: name }
    for (const field of fields) {
      clean[field] = isNonEmptyString(item[field]) ? item[field].trim() : ''
    }
    cleanItems.push(clean)
  }

  if (cleanItems.length === 0) {
    return { items: fallback.items.map((item) => ({ ...item })) }
  }

  const items = []
  const consumed = new Set()

  // 第一轮：按默认顺序匹配同名标准节点，保证文化/团队顺序稳定
  fallback.items.forEach((defaultItem) => {
    const index = cleanItems.findIndex(
      (item, i) => !consumed.has(i) && item[nameField] === defaultItem[nameField]
    )
    if (index === -1) {
      // 标准节点缺失：恢复默认
      items.push({ ...defaultItem })
      return
    }
    consumed.add(index)
    const item = cleanItems[index]
    const merged = { [nameField]: item[nameField] }
    for (const field of fields) {
      merged[field] = item[field] || defaultItem[field]
    }
    items.push(merged)
  })

  // 第二轮：默认集合之外的节点保持原顺序追加，残缺字段补兜底文案
  cleanItems.forEach((item, index) => {
    if (consumed.has(index)) return
    const merged = { [nameField]: item[nameField] }
    for (const field of fields) {
      merged[field] = item[field] || extraFallback[field]
    }
    items.push(merged)
  })

  return { items }
}

/**
 * 将任意来源的原始内容归一化为结构完整、顺序固定的章节数组。
 * 返回 [{ key, theme, title, subtitle, showTitle, data }]
 */
export function normalizeAboutContent(rawContent) {
  const defaults = createDefaultAboutContent()
  const raw = isPlainObject(rawContent) ? rawContent : {}

  const dataByKey = {
    [SECTION_KEYS.COMPANY]: normalizeCompany(raw[SECTION_KEYS.COMPANY], defaults[SECTION_KEYS.COMPANY]),
    [SECTION_KEYS.HISTORY]: normalizeHistory(raw[SECTION_KEYS.HISTORY], defaults[SECTION_KEYS.HISTORY]),
    [SECTION_KEYS.CULTURE]: normalizeCardSection(
      raw[SECTION_KEYS.CULTURE],
      defaults[SECTION_KEYS.CULTURE],
      'title',
      ['icon', 'description'],
      { icon: FALLBACK.cultureIcon, description: FALLBACK.cultureDescription }
    ),
    [SECTION_KEYS.TEAM]: normalizeCardSection(
      raw[SECTION_KEYS.TEAM],
      defaults[SECTION_KEYS.TEAM],
      'name',
      ['title', 'description'],
      { title: FALLBACK.memberTitle, description: FALLBACK.memberDescription }
    )
  }

  // 统一按章节规范的固定顺序输出，数据源乱序或缺项都不影响页面结构
  return [...ABOUT_SECTIONS]
    .sort((a, b) => a.order - b.order)
    .map(({ key, theme, title, subtitle, showTitle }) => ({
      key,
      theme,
      title,
      subtitle,
      showTitle,
      data: dataByKey[key]
    }))
}

/**
 * 组合式入口：读取 -> 归一化 -> 排序，供 AboutView 直接消费。
 * sections 初始即为完整默认内容，首屏不闪空；读取完成后整体替换。
 */
export function useAboutContent() {
  const sections = shallowRef(normalizeAboutContent(createDefaultAboutContent()))
  const loading = shallowRef(false)

  let cancelled = false
  onScopeDispose(() => {
    cancelled = true
  })

  const refresh = async () => {
    loading.value = true
    const raw = await loadAboutContent()
    if (!cancelled) {
      sections.value = normalizeAboutContent(raw)
      loading.value = false
    }
  }

  refresh()

  return { sections, loading, refresh }
}
