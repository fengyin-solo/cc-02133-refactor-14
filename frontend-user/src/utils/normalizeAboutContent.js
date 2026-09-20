import {
  ABOUT_SECTION_ORDER,
  defaultAboutContent
} from '@/data/aboutContent'

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]'

const toArray = (value) => {
  if (Array.isArray(value)) {
    return value
  }
  return value === undefined || value === null ? [] : [value]
}

const toText = (value, fallback = '') => {
  if (value === undefined || value === null) {
    return fallback
  }
  const text = String(value).trim()
  return text || fallback
}

const cloneValue = (value) => {
  if (Array.isArray(value) || isPlainObject(value)) {
    return JSON.parse(JSON.stringify(value))
  }
  return value
}

const fillMissing = (target, source) => {
  if (!isPlainObject(target) || !isPlainObject(source)) {
    return target
  }

  Object.entries(source).forEach(([key, sourceValue]) => {
    const targetValue = target[key]

    if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
      fillMissing(targetValue, sourceValue)
    } else if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      targetValue.forEach((item, index) => {
        if (isPlainObject(item) && isPlainObject(sourceValue[index])) {
          fillMissing(item, sourceValue[index])
        }
      })
    } else if (targetValue === undefined || targetValue === null || targetValue === '') {
      target[key] = cloneValue(sourceValue)
    }
  })

  return target
}

const mergeWithDefault = (value, fallback) => {
  if (isPlainObject(fallback)) {
    const result = cloneValue(fallback)
    if (isPlainObject(value)) {
      Object.entries(value).forEach(([key, itemValue]) => {
        if (isPlainObject(result[key]) && isPlainObject(itemValue)) {
          result[key] = fillMissing(cloneValue(itemValue), result[key])
        } else {
          result[key] = cloneValue(itemValue)
        }
      })
    }
    return result
  }

  if (Array.isArray(fallback)) {
    return toArray(value).map(cloneValue)
  }

  return value === undefined || value === null ? cloneValue(fallback) : value
}

const createId = (value) => toText(value)
  .toLowerCase()
  .replace(/[\s_]+/g, '-')
  .replace(/[^\p{L}\p{N}-]/gu, '')

const normalizeId = (item, fields, index) => {
  for (const field of fields) {
    const id = createId(item[field])
    if (id) {
      return id
    }
  }
  return `item-${index + 1}`
}

const mergeItems = (items, fallbackItems, idFields = []) => {
  const rawItems = toArray(items).filter(isPlainObject)
  const list = rawItems.length ? rawItems : toArray(fallbackItems)
  const itemMap = new Map()

  list.forEach((rawItem, index) => {
    const normalized = cloneValue(rawItem)
    const id = normalizeId(normalized, idFields, index)
    const existing = itemMap.get(id)

    if (existing) {
      fillMissing(existing, normalized)
      return
    }

    normalized.id = id
    itemMap.set(id, normalized)
  })

  return Array.from(itemMap.values())
}

const withUniqueIds = (items, createItemId) => {
  const idCounts = new Map()

  return items.map((item, index) => {
    const baseId = createItemId(item, index)
    const count = idCounts.get(baseId) || 0
    idCounts.set(baseId, count + 1)

    return {
      ...item,
      id: count ? `${baseId}-${count + 1}` : baseId
    }
  })
}

const normalizeTimeline = (section) => {
  const items = withUniqueIds(
    mergeItems(
      section.items,
      defaultAboutContent.sections.timeline.items,
      ['id', 'year', 'title']
    ).map((item, index) => ({
      ...item,
      year: toText(item.year, '待补充'),
      title: toText(item.title, `发展历程 ${index + 1}`),
      description: toText(item.description, '发展历程内容待完善')
    })),
    (item, index) => {
      const yearId = createId(item.year)
      return yearId && yearId !== '待补充' ? yearId : `timeline-${index + 1}`
    }
  )

  return {
    ...section,
    items: items.sort((prev, next) => {
      const prevYear = Number.parseInt(prev.year, 10)
      const nextYear = Number.parseInt(next.year, 10)

      if (Number.isNaN(prevYear) && Number.isNaN(nextYear)) {
        return 0
      }
      if (Number.isNaN(prevYear)) {
        return 1
      }
      if (Number.isNaN(nextYear)) {
        return -1
      }
      return prevYear - nextYear
    })
  }
}

const normalizeCulture = (section) => ({
  ...section,
  items: withUniqueIds(
    mergeItems(
      section.items,
      defaultAboutContent.sections.culture.items,
      ['id', 'title']
    ).map((item, index) => ({
      ...item,
      icon: toText(item.icon, 'Star'),
      title: toText(item.title, `企业文化 ${index + 1}`),
      description: toText(item.description, '企业文化内容待完善')
    })),
    (item, index) => {
      const titleId = createId(item.title)
      return titleId && !titleId.startsWith('企业文化-')
        ? titleId
        : `culture-${index + 1}`
    }
  )
})

const normalizeTeam = (section) => ({
  ...section,
  items: withUniqueIds(
    mergeItems(
      section.items,
      defaultAboutContent.sections.team.items,
      ['id', 'name']
    ).map((item, index) => ({
      ...item,
      name: toText(item.name, `核心成员 ${index + 1}`),
      title: toText(item.title, '核心成员'),
      description: toText(item.description, '团队成员介绍待完善')
    })),
    (item) => createId(item.name) || 'core-member'
  )
})

const normalizeIntro = (section) => {
  const paragraphs = toArray(section.paragraphs)
    .map((paragraph) => toText(paragraph))
    .filter(Boolean)
  const fallbackParagraphs = defaultAboutContent.sections.intro.paragraphs

  const stats = toArray(section.stats)
    .filter(isPlainObject)
    .map((stat) => {
      const value = toText(stat.value)
      const label = toText(stat.label)
      return value || label ? { value, label } : null
    })
    .filter(Boolean)

  const image = isPlainObject(section.image) ? section.image : {}

  return {
    ...section,
    paragraphs: paragraphs.length ? paragraphs : [...fallbackParagraphs],
    stats: stats.length ? stats : cloneValue(defaultAboutContent.sections.intro.stats),
    image: {
      icon: toText(image.icon, defaultAboutContent.sections.intro.image.icon),
      caption: toText(image.caption, defaultAboutContent.sections.intro.image.caption)
    }
  }
}

const normalizeSection = (section, config) => {
  const fallback = defaultAboutContent.sections[config.id]
  const merged = mergeWithDefault(section, fallback)
  const normalized = {
    ...merged,
    id: config.id,
    type: config.type,
    theme: config.theme,
    title: toText(isPlainObject(section) ? section.title : '', config.title),
    subtitle: toText(isPlainObject(section) ? section.subtitle : '', config.subtitle)
  }

  if (config.type === 'intro') {
    return normalizeIntro(normalized)
  }
  if (config.type === 'timeline') {
    return normalizeTimeline(normalized)
  }
  if (config.type === 'culture') {
    return normalizeCulture(normalized)
  }
  return normalizeTeam(normalized)
}

const asSectionSource = (source) => {
  if (isPlainObject(source)) {
    return source
  }
  if (Array.isArray(source)) {
    return { items: source }
  }
  return undefined
}

export const normalizeAboutContent = (content = defaultAboutContent) => {
  const sourceSections = isPlainObject(content?.sections)
    ? content.sections
    : isPlainObject(content)
      ? content
      : {}

  return ABOUT_SECTION_ORDER.map((config) => {
    const source = asSectionSource(sourceSections[config.id] || sourceSections[config.type])
    return normalizeSection(source, config)
  })
}
