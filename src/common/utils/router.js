import Taro from '@tarojs/taro';

function gotoHome () {
  Taro.switchTab({ url: '/pages/home/index' });
}

function gotoNode (nodeId) {
  Taro.navigateTo({ url: `/pages/node/index?nodeId=${nodeId}` });
}

function gotoUser (username) {
  Taro.navigateTo({ url: `/pages/user/index?username=${username}` });
}

function gotoTopic (item) {
  Taro.navigateTo({ url: `/pages/topic/index?topicId=${item.id}` });
}

function gotoLog () {
  Taro.navigateTo({ url: '/pages/log/index' });
}

export default {
  gotoHome,
  gotoNode,
  gotoUser,
  gotoTopic,
  gotoLog
};
