import Taro from '@tarojs/taro';
import adapter from './adapter.js';

function currifyCacheMethod (timeKey, dataKey, cacheTime) {
  return function () {
    return new Promise((resolve, reject) => {
      let time = wx.getStorageSync(timeKey) || 0;
      if (Date.now() - time < cacheTime) {
        wx.getStorage({
          key: dataKey,
          success (res) {
            console.log('cache success:', timeKey);
            resolve(res);
          },
          fail () {
            console.log('cache fail:', timeKey);
            reject();
          }
        });
      } else {
        console.log('api:', timeKey);
        reject();
      }
    });
  }
}

function getTopic (topicId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleTopic = currifyCacheMethod(`${type}_topic_time_${topicId}`, `${type}_topic_${topicId}`, 10000000);
  return handleTopic();
}

function getTopicsByNodeId (nodeId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleTopicByNodeId = currifyCacheMethod(`${type}_topics_time_${nodeId}`, `${type}_topics_${nodeId}`, 10000000);
  return handleTopicByNodeId();
}

function getTopicsByUsername (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleTopicsByUsername = currifyCacheMethod(`${type}_user_time_${username}`, `${type}_user_${username}`, 10000000)
  return handleTopicsByUsername();
}

function getUserInfo (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleUserInfo = currifyCacheMethod(`${type}_userinfo_time_${username}`, `${type}_userinfo_${username}`, 10000000)
  return handleUserInfo();
}

function getNodes () {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleNodes = currifyCacheMethod(`${type}_nodes_time`, `${type}_nodes`, 10000000);
  return handleNodes();
}

function getTopicsInHome (node) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let handleTopicsInHome = currifyCacheMethod(`${type}_topics_time_${node.id}`, `${type}_topics_${node.id}`, node.cache);
  return handleTopicsInHome();
}

function currifyRequestMethod ({ url, handle, timeKey, dataKey }) {
  return function () {
    return new Promise((resolve, reject) => {
      Taro.request({ url })
      .then((res) => {
        console.log('request success:', timeKey);
        res = handle(res);
        resolve(res);
        wx.setStorage({ key: dataKey, data: res.data  });
        wx.setStorage({ key: timeKey, data: Date.now()  });
      })
      .catch((err) => {
        console.log('request fail:', timeKey);
        reject(err);
      });
    });
  }
}

function fetchTopic (topicId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestTopic = currifyRequestMethod({
    url:     adapter.filterTopicURL(topicId),
    handle:  adapter.filterTopicData,
    timeKey: `${type}_topic_time_${topicId}`,
    dataKey: `${type}_topic_${topicId}`
  });
  return requestTopic();
}

function fetchReplies (topicId, page, pageSize) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestReplies = currifyRequestMethod({
    url: adapter.filterRepliesURL(topicId, page, pageSize),
    handle: adapter.filterRepliesData,
    timeKey: `${type}_replies_time_${topicId}`,
    dataKey: `${type}_replies_${topicId}`
  })
  return requestReplies();
}

function fetchTopicsByNodeId (nodeId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestTopicsByNodeId = currifyRequestMethod({
    url: adapter.filterNodeURL(nodeId),
    handle: adapter.filterNodeData,
    timeKey: `${type}_topics_time_${nodeId}`,
    dataKey: `${type}_topics_${nodeId}`
  });
  return requestTopicsByNodeId();
}

function fetchTopicsByUsername (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestTopicsByUsername = currifyRequestMethod({
    url: adapter.filterRepliesByUsernameURL(username),
    handle: adapter.filterRepliesByUsernameData,
    timeKey: `${type}_user_time_${username}`,
    dataKey: `${type}_user_${username}`
  })
  return requestTopicsByUsername();
}

function fetchUserInfo (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestUserInfo = currifyRequestMethod({
    url: adapter.filterUserURL(username),
    handle: adapter.filterUserData,
    timeKey: `${type}_userinfo_${username}`,
    dataKey: `${type}_userinfo_time_${username}`
  });
  return requestUserInfo();
}

function fetchTopicsInHome (node) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let requestTopicsInHome = currifyRequestMethod({
    url: adapter.filterHomeURL(node),
    handle: adapter.filterHomeData,
    timeKey: `${type}_topics_time_${node.id}`,
    dataKey: `${type}_topics_${node.id}`
  });
  return requestTopicsInHome();
}


function fetchNodes () {
  let type = wx.getStorageSync('data_type') || 'cnode';

  if (type === 'cnode') {
    return new Promise((resolve, reject) => {
      let res = {
        data: [
          { title: '问答', id: 'ask' },
          { title: '分享', id: 'share' },
          { title: '工作', id: 'job' },
          { title: '精华', id: 'good' }
        ]
      };
      resolve(res);
      wx.setStorage({ key: `${type}_nodes`, data: res.data });
      wx.setStorage({ key: `${type}_nodes_time`, data: Date.now() });
    });
  } else {
    let requestNodes = currifyRequestMethod({
      url: 'https://www.v2ex.com/api/nodes/all.json',
      handle: (res) => res,
      timeKey: `${type}_nodes_time`,
      dataKey: `${type}_nodes`
    });
    return requestNodes();
  }
}

export default {
  getTopic,
  fetchTopic,

  fetchReplies,

  getNodes,
  fetchNodes,

  getUserInfo,
  fetchUserInfo,

  getTopicsByNodeId,
  fetchTopicsByNodeId,

  getTopicsByUsername,
  fetchTopicsByUsername,

  getTopicsInHome,
  fetchTopicsInHome
};
