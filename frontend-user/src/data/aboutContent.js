export const ABOUT_SECTION_ORDER = Object.freeze([
  {
    id: 'intro',
    type: 'intro',
    theme: 'light',
    title: '公司简介',
    subtitle: ''
  },
  {
    id: 'timeline',
    type: 'timeline',
    theme: 'gray',
    title: '发展历程',
    subtitle: '砥砺前行，不断突破'
  },
  {
    id: 'culture',
    type: 'culture',
    theme: 'light',
    title: '企业文化',
    subtitle: '以客户为中心，以创新为驱动'
  },
  {
    id: 'team',
    type: 'team',
    theme: 'gray',
    title: '核心团队',
    subtitle: '汇聚行业精英，打造专业团队'
  }
])

export const defaultAboutContent = Object.freeze({
  sections: {
    intro: {
      paragraphs: [
        '广州知运信息技术有限公司成立于2018年，是一家专注于智慧物流系统研发与服务的高新技术企业。公司总部位于广州市天河区科技园，拥有一支由资深物流专家和技术精英组成的核心团队。',
        '我们致力于为企业提供全方位的智慧物流解决方案，涵盖仓储管理、运输调度、配送优化、数据分析等核心业务领域。通过先进的人工智能、大数据、物联网等技术，帮助客户实现物流运营的数字化、智能化升级。'
      ],
      stats: [
        { value: '6+', label: '年行业经验' },
        { value: '500+', label: '服务客户' },
        { value: '50+', label: '技术专利' }
      ],
      image: {
        icon: 'OfficeBuilding',
        caption: '公司大楼'
      }
    },
    timeline: {
      items: [
        {
          year: '2018',
          title: '公司成立',
          description: '广州知运信息技术有限公司在广州正式成立，开启智慧物流创业之路'
        },
        {
          year: '2019',
          title: '产品发布',
          description: '首款智慧仓储系统正式发布，获得首批客户认可'
        },
        {
          year: '2020',
          title: '业务拓展',
          description: '推出运输管理系统，服务客户突破100家'
        },
        {
          year: '2021',
          title: '技术突破',
          description: '获得多项技术专利，被认定为高新技术企业'
        },
        {
          year: '2022',
          title: '规模扩张',
          description: '团队规模突破200人，服务客户超过300家'
        },
        {
          year: '2024',
          title: '行业领先',
          description: '成为智慧物流领域领先服务商，服务客户超过500家'
        }
      ]
    },
    culture: {
      items: [
        {
          icon: 'Aim',
          title: '使命',
          description: '用科技让物流更简单，助力企业降本增效'
        },
        {
          icon: 'View',
          title: '愿景',
          description: '成为中国最值得信赖的智慧物流服务商'
        },
        {
          icon: 'Star',
          title: '价值观',
          description: '客户第一、创新驱动、诚信务实、合作共赢'
        },
        {
          icon: 'Promotion',
          title: '精神',
          description: '追求卓越、永不止步、勇于担当、团队协作'
        }
      ]
    },
    team: {
      items: [
        {
          name: '张总',
          title: 'CEO / 创始人',
          description: '20年物流行业经验，曾任知名物流企业高管'
        },
        {
          name: '李总',
          title: 'CTO / 联合创始人',
          description: '15年技术研发经验，前互联网大厂技术总监'
        },
        {
          name: '王总',
          title: 'COO',
          description: '10年运营管理经验，精通供应链管理'
        },
        {
          name: '陈总',
          title: '产品VP',
          description: '12年产品经验，深耕物流行业产品设计'
        }
      ]
    }
  }
})
