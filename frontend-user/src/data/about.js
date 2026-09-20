/**
 * 关于我们页面的内容数据源与章节规范。
 *
 * 页面由四个章节组成：公司简介、发展历程、企业文化、核心团队。
 * 这里只存放“原始数据”和章节元信息；数据的读取、归一化与顺序整理
 * 统一在 composables/useAboutContent.js 中完成，展示组件不再关心
 * 缺项、重复或历史数据不完整等异常情况。
 */

// 章节唯一标识，任何来源的数据都以此 key 归位
export const SECTION_KEYS = {
  COMPANY: 'company',
  HISTORY: 'history',
  CULTURE: 'culture',
  TEAM: 'team'
}

/**
 * 章节规范：
 * - order   固定的章节顺序，数据源乱序或缺项时都按此恢复
 * - theme   章节底色，对应全局 section-light / section-gray
 * - title   章节标题
 * - subtitle 章节副标题（公司简介区块原本无副标题，故为空串）
 * - showTitle 标题由区块自身排版（公司简介）还是统一由章节外壳渲染
 */
export const ABOUT_SECTIONS = [
  {
    key: SECTION_KEYS.COMPANY,
    order: 0,
    theme: 'light',
    title: '公司简介',
    subtitle: '',
    showTitle: false
  },
  {
    key: SECTION_KEYS.HISTORY,
    order: 1,
    theme: 'gray',
    title: '发展历程',
    subtitle: '砥砺前行，不断突破',
    showTitle: true
  },
  {
    key: SECTION_KEYS.CULTURE,
    order: 2,
    theme: 'light',
    title: '企业文化',
    subtitle: '以客户为中心，以创新为驱动',
    showTitle: true
  },
  {
    key: SECTION_KEYS.TEAM,
    order: 3,
    theme: 'gray',
    title: '核心团队',
    subtitle: '汇聚行业精英，打造专业团队',
    showTitle: true
  }
]

// 章节缺项 / 字段缺失时的统一兜底文案
const FALLBACK = {
  paragraph: '更多公司信息正在完善中，敬请期待。',
  statValue: '--',
  statLabel: '数据更新中',
  historyTitle: '持续发展',
  historyDescription: '更多发展历程正在完善中，敬请期待。',
  cultureIcon: 'Star',
  cultureTitle: '文化理念',
  cultureDescription: '更多企业文化内容正在完善中，敬请期待。',
  memberTitle: '核心成员',
  memberDescription: '更多团队信息正在完善中，敬请期待。',
  buildingIcon: 'OfficeBuilding',
  buildingText: '公司大楼'
}

// 公司简介默认数据（与页面既有信息保持一致）
export const DEFAULT_COMPANY = {
  paragraphs: [
    '广州知运信息技术有限公司成立于2018年，是一家专注于智慧物流系统研发与服务的高新技术企业。公司总部位于广州市天河区科技园，拥有一支由资深物流专家和技术精英组成的核心团队。',
    '我们致力于为企业提供全方位的智慧物流解决方案，涵盖仓储管理、运输调度、配送优化、数据分析等核心业务领域。通过先进的人工智能、大数据、物联网等技术，帮助客户实现物流运营的数字化、智能化升级。'
  ],
  stats: [
    { value: '6+', label: '年行业经验' },
    { value: '500+', label: '服务客户' },
    { value: '50+', label: '技术专利' }
  ],
  image: { icon: FALLBACK.buildingIcon, text: FALLBACK.buildingText }
}

// 发展历程默认数据（与页面既有信息保持一致）
export const DEFAULT_HISTORY = {
  items: [
    { year: '2018', title: '公司成立', description: '广州知运信息技术有限公司在广州正式成立，开启智慧物流创业之路' },
    { year: '2019', title: '产品发布', description: '首款智慧仓储系统正式发布，获得首批客户认可' },
    { year: '2020', title: '业务拓展', description: '推出运输管理系统，服务客户突破100家' },
    { year: '2021', title: '技术突破', description: '获得多项技术专利，被认定为高新技术企业' },
    { year: '2022', title: '规模扩张', description: '团队规模突破200人，服务客户超过300家' },
    { year: '2024', title: '行业领先', description: '成为智慧物流领域领先服务商，服务客户超过500家' }
  ]
}

// 企业文化默认数据（与页面既有信息保持一致）
export const DEFAULT_CULTURE = {
  items: [
    { icon: 'Aim', title: '使命', description: '用科技让物流更简单，助力企业降本增效' },
    { icon: 'View', title: '愿景', description: '成为中国最值得信赖的智慧物流服务商' },
    { icon: 'Star', title: '价值观', description: '客户第一、创新驱动、诚信务实、合作共赢' },
    { icon: 'Promotion', title: '精神', description: '追求卓越、永不止步、勇于担当、团队协作' }
  ]
}

// 团队风采默认数据（与页面既有信息保持一致）
export const DEFAULT_TEAM = {
  items: [
    { name: '张总', title: 'CEO / 创始人', description: '20年物流行业经验，曾任知名物流企业高管' },
    { name: '李总', title: 'CTO / 联合创始人', description: '15年技术研发经验，前互联网大厂技术总监' },
    { name: '王总', title: 'COO', description: '10年运营管理经验，精通供应链管理' },
    { name: '陈总', title: '产品VP', description: '12年产品经验，深耕物流行业产品设计' }
  ]
}

/**
 * 页面完整内容的默认值，同时也是数据读取失败、章节缺项时的恢复基准。
 */
export function createDefaultAboutContent() {
  return {
    [SECTION_KEYS.COMPANY]: {
      paragraphs: [...DEFAULT_COMPANY.paragraphs],
      stats: DEFAULT_COMPANY.stats.map((item) => ({ ...item })),
      image: { ...DEFAULT_COMPANY.image }
    },
    [SECTION_KEYS.HISTORY]: {
      items: DEFAULT_HISTORY.items.map((item) => ({ ...item }))
    },
    [SECTION_KEYS.CULTURE]: {
      items: DEFAULT_CULTURE.items.map((item) => ({ ...item }))
    },
    [SECTION_KEYS.TEAM]: {
      items: DEFAULT_TEAM.items.map((item) => ({ ...item }))
    }
  }
}

export const ABOUT_FALLBACK_TEXT = FALLBACK
