let tabMap = {
  ask: '问答',
  share: '分享',
  job: '工作',
  good: '精华'
};

function filterTopicURL(topicId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let map = {
    v2ex: `https://www.v2ex.com/api/topics/show.json?id=${topicId}`,
    cnode: `https://cnodejs.org/api/v1/topic/${topicId}`
  };

  return map[type];
}

function filterTopicData (res) {
  let type = wx.getStorageSync('data_type') || 'cnode';

  if (type === 'cnode') {
    res.data.data.member = res.data.data.author;
    res.data.data.member.username = res.data.data.author.loginname;
    res.data.data.member.avatar_mini = res.data.data.author.avatar_url;

    res.data.data.node = {};
    res.data.data.node.title = tabMap[res.data.data.tab];
    res.data.data.node.id = res.data.data.tab;

    res.data.data.content_rendered = res.data.data.content;
    res.data.data.last_modified_str = res.data.data.create_at.replace('T', ' ');
    res.data.data.last_modified_str = res.data.data.last_modified_str.replace(/\.\d{3}Z/, '');

    res.data = [res.data.data];
  }

  return res;
}

function filterRepliesURL (topicId, page, pageSize) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let map = {
    v2ex: `https://www.v2ex.com/api/replies/show.json?topic_id=${topicId}&page=${page}&page_size=${pageSize}`,
    cnode: `https://cnodejs.org/api/v1/topic/${topicId}`
  };

  return map[type];
}

function filterRepliesData (res) {
  let type = wx.getStorageSync('data_type') || 'cnode';

  if (type === 'cnode') {
    return {
      data: res.data.data.replies.map(item => {
        item.member = item.author;
        item.member.username = item.author.loginname;
        item.member.avatar_mini = item.author.avatar_url;

        item.last_modified_str = item.create_at.replace('T', ' ');
        item.last_modified_str = item.last_modified_str.replace(/\.\d{3}Z/, '');

        item.content_rendered = item.content;
        return item;
      })
    };
  }

  return res;
}

function filterHomeURL (node) {
  let type = wx.getStorageSync('data_type') || 'cnode';

  let map = {
    v2ex: {
      hot: 'https://www.v2ex.com/api/topics/hot.json',
      latest: 'https://www.v2ex.com/api/topics/latest.json',
      'undefined': `https://www.v2ex.com/api/topics/show.json?node_id=${node.id}`
    },
    cnode: {
      ask: 'https://cnodejs.org/api/v1/topics?tab=ask',
      share: 'https://cnodejs.org/api/v1/topics?tab=share',
      good: 'https://cnodejs.org/api/v1/topics?tab=good',
      job: 'https://cnodejs.org/api/v1/topics?tab=job'
    }
  };

  return map[type][node.type];
}

function filterHomeData (res) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  if (type === 'cnode') {
    res.data.data = res.data.data.map((item) => {
      item.member = item.author;
      item.member.username = item.author.loginname;
      item.member.avatar_mini = item.author.avatar_url;

      item.node = {};
      item.node.title = tabMap[item.tab];
      item.node.id = item.tab;

      item.last_touched_str = item.last_reply_at.replace('T', ' ');
      item.last_touched_str = item.last_touched_str.replace(/\.\d{3}Z/, '');

      item.replies = item.reply_count
      return item;
    });
    return res.data;
  }

  return res;
}

function filterNodeURL (nodeId) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let map = {
    v2ex: `https://www.v2ex.com/api/topics/show.json?node_id=${nodeId}`,
    cnode: `https://cnodejs.org/api/v1/topics?tab=${nodeId}`
  };
  return map[type];
}

function filterUserURL (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let map = {
    v2ex: `https://www.v2ex.com/api/members/show.json?username=${username}`,
    cnode:  `https://cnodejs.org/api/v1/user/${username}`
  }
  return map[type];
}

function filterUserData (res) {
  let type = wx.getStorageSync('data_type') || 'cnode';

  if (type === 'cnode') {
    res.data.data.avatar_mini = res.data.data.avatar_url;
    res.data.data.username = res.data.data.loginname;
    res.data.data.created_str = res.data.data.create_at.replace('T', ' ');
    res.data.data.created_str = res.data.data.created_str.replace(/\.\d{3}Z/, '');

    return res.data;
  }

  return res;
}

function filterRepliesByUsernameURL (username) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  let map = {
    v2ex: `https://www.v2ex.com/api/topics/show.json?username=${username}`,
    cnode: `https://cnodejs.org/api/v1/user/${username}`
  }
  return map[type];
}

function filterRepliesByUsernameData (res) {
  let type = wx.getStorageSync('data_type') || 'cnode';
  if (type === 'cnode') {
    return {
      data: res.data.data.recent_replies.map((item, index) => {
        item.member = item.author;
        item.member.avatar_mini = item.author.avatar_url;
        item.member.username = item.author.loginname;

        item.last_touched_str = item.last_reply_at.replace('T', ' ');
        item.last_touched_str = item.last_touched_str.replace(/\.\d{3}Z/, '');
        return item;
      })
    };
  }
  return res;
}

export default {
  filterRepliesByUsernameURL,
  filterRepliesByUsernameData,
  filterTopicURL,
  filterTopicData,
  filterRepliesURL,
  filterRepliesData,
  filterNodeURL,
  filterNodeData: filterHomeData,
  filterUserURL,
  filterUserData,
  filterHomeURL,
  filterHomeData
}
