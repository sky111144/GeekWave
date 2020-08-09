export default function getData () {
  let type = wx.getStorageSync('data_type') || 'cnode';
  if (type === 'cnode') {
    return [
      {
        name: 'CNode',
        id: 0,
        show: false,
        nodes: [
          { name: '问答', id: 'ask', type: 'ask', cache: 900000 },
          { name: '分享', id: 'share', type: 'share', cache: 900000 },
          { name: '工作', id: 'job', type: 'job', cache: 900000 },
          { name: '精华', id: 'good', type: 'good', cache: 900000 }
        ]
      }
    ];
  }

  return [
    {
      name: '技术',
      id: 0,
      show: true,
      nodes: [
        { name: '程序员', id: 300, cache: 90000 },
        { name: 'Python', id: 90, cache: 90000 },
        { name: 'iDev', id: 13, cache: 90000 },
        { name: 'Android', id: 606, cache: 90000 },
        { name: 'Linux', id: 11, cache: 90000 },
        { name: 'node.js', id: 436, cache: 90000 },
        { name: '云计算', id: 104, cache: 90000 },
        { name: '宽带症候群', id: 108, cache: 90000 }
      ]
    },
    {
      name: '创意',
      id: 1,
      show: true,
      nodes: [
        { name: '分享创造', id: 17, cache: 90000 },
        { name: '设计', id: 215, cache: 90000 },
        { name: '奇思妙想', id: 519, cache: 90000 },
      ]
    },
    {
      name: '好玩',
      id: 2,
      show: true,
      nodes: [
        { name: '分享发现', id: 16, cache: 90000 },
        { name: '游戏', id: 55, cache: 90000 },
        { name: '电影', id: 5, cache: 90000 },
        { name: '剧集', id: 48, cache: 90000 },
        { name: '音乐', id: 4, cache: 90000 },
        { name: '旅行', id: 181, cache: 90000 },
        { name: '摄影', id: 27, cache: 90000 },
        { name: 'Android', id: 39, cache: 90000 },
      ]
    },
    {
      name: 'Apple',
      id: 3,
      show: true,
      nodes: [
        { name: 'macOS', id: 22, cache: 90000 },
        { name: 'iPhone', id: 8, cache: 90000 },
        { name: 'iPad', id: 9, cache: 90000 },
        { name: 'MBP', id: 10, cache: 90000 },
        { name: 'iMac', id: 40, cache: 90000 },
        { name: 'Apple', id: 184, cache: 90000 },
      ]
    },
    {
      name: '酷工作',
      id: 4,
      show: true,
      nodes: [
        { name: '酷工作', id: 43, cache: 90000 },
        { name: '求职', id: 507, cache: 90000 },
        { name: '职场话题', id: 770, cache: 90000 },
        { name: '外包', id: 190, cache: 90000 },
      ]
    },
    {
      name: '交易',
      id: 5,
      show: true,
      nodes: [
        { name: '二手交易', id: 69, cache: 90000 },
        { name: '物物交换', id: 285, cache: 90000 },
        { name: '免费赠送', id: 551, cache: 90000 },
        { name: '域名', id: 527, cache: 90000 },
        { name: '团购 ', id: 293, cache: 90000 }
      ]
    },
    {
      name: '城市',
      id: 6,
      show: true,
      nodes: [
        { name: '北京', id: 19, cache: 90000 },
        { name: '上海', id: 18, cache: 90000 },
        { name: '广州', id: 20, cache: 90000 },
        { name: '深圳', id: 21, cache: 90000 },
        { name: '杭州', id: 26, cache: 90000 },
        { name: '成都', id: 30, cache: 90000 }
      ]
    },
    {
      name: '问与答',
      id: 7,
      show: true,
      nodes: [
        { name: '问与答', id: 12, cache: 900000 }
      ]
    },
    {
      name: '最热',
      id: 8,
      show: true,
      nodes: [
        { name: '最热', id: 'hot', type: 'hot', cache: 30000 },
        { name: '最新', id: 'latest', type: 'latest', cache: 30000 }
      ]
    }
  ]
};
