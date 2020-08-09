export default {
  pages: [
    'pages/home/index',
    'pages/log/index',
    'pages/nodes/index',
    'pages/node/index',
    'pages/topic/index',
    'pages/personal/index',
    'pages/user/index',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#4499ff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'white',
    enablePullDownRefresh: true
  },
  tabBar: {
    color: '#000000',
    selectedColor: '#4499ff',
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home_unactived.png',
        selectedIconPath: 'assets/icons/home_actived.png'
      },
      {
        pagePath: 'pages/nodes/index',
        text: '节点',
        iconPath: 'assets/icons/nodes_unactived.png',
        selectedIconPath: 'assets/icons/nodes_actived.png'
      },
      {
        pagePath: 'pages/personal/index',
        text: '我的',
        iconPath: 'assets/icons/personal_unactived.png',
        selectedIconPath: 'assets/icons/personal_actived.png'
      }
    ]
  }
}
