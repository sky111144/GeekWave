<template>
  <view class='user-home-wrapper'>
    <view class='user-info-wrapper bg-white flex'>
      <image class='avatar' :src='userinfo.avatar_mini'></image>
      <view>
        <view class='p-l-xs m-l-xs flex f-ai-c'>
          <view>{{ userinfo.username }}</view>
        </view>
        <view class='p-l-xs m-l-xs font-12' v-if='userinfo.tagline'>{{ userinfo.tagline }}</view>
        <view class='flex p-l-xs m-l-xs font-12'>
          <view v-if='userinfo.id'>V2EX第 {{ userinfo.id }} 号会员，</view>加入于 {{ userinfo.created_str }}
        </view>
      </view>
    </view>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list' v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper' v-if='item.member'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex' v-if='item.node'>
              <view class='node-wrapper' @tap='gotoNode(item.node.id)'>{{ item.node.title }}</view>
              <view class='user-wrapper'>{{ item.member.username }}</view>
            </view>
            <view class='content-wrapper' @tap="gotoTopic(item)">{{ item.title }}</view>
            <view class='time-wrapper flex'>
              <view class='last-reply-wrapper'>{{ item.last_touched_str }}</view>
              <view class='last-reply-wrapper' v-if='item.last_reply_by'>最后回复来自</view>
              <view class='user-wrapper' @tap='gotoUser(item.last_reply_by)' v-if='item.last_reply_by'>{{ item.last_reply_by }}</view>
            </view>
          </view>
        </view>
        <view class='right-wrapper flex f-ai-c'>
          <view class='count-wrapper bg-brown' v-if='item.replies !== undefined'>{{ item.replies }}</view>
        </view>
      </view>
      <view class='loading-wrapper flex f-jc-c f-ai-c' v-if='list.length === 0'>加载中~</view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'User',
  data () {
    return {
      userinfo: {},
      list: []
    }
  },

  onShareAppMessage (res) {
    return {
      title: 'IT 新鲜事儿',
      path: '/pages/home/index'
    }
  },

  mounted () {
    let page = Taro.getCurrentPages().slice(-1)[0] || { options: {} };
    this.getUserInfo(page.options.username);
    this.getTopics(page.options.username);
  },

  methods: {
    gotoUser (username) {
      this.$utils.router.gotoUser(username);
    },
    gotoNode (nodeId) {
      this.$utils.router.gotoNode(nodeId);
    },
    gotoTopic (item) {
      this.$utils.router.gotoTopic(item);
    },

    getUserInfo (username) {
      this.$utils.api.getUserInfo(username)
      .then((res) => {
        this.userinfo = res.data;
      })
      .catch(() => {
        this.fetchUserInfo(username);
      })
    },

    getTopics (username) {
      this.$utils.api.getTopicsByUsername(username)
      .then((res) => {
        this.list = res.data;
      })
      .catch(() => {
        this.fetchTopics(username);
      });
    },

    fetchUserInfo (username) {
      this.$utils.api.fetchUserInfo(username)
      .then((res) => {
        if (res.data.created) {
          res.data.created_str = this.$utils.time.format(res.data.created);
        }
        this.userinfo = res.data;
      })
      .catch((err) => {
        this.userinfo = {};
      });
    },

    fetchTopics (username) {
      this.$utils.api.fetchTopicsByUsername(username)
      .then((res) => {
        res.data.forEach((item, index) => {
          if (item.last_touched) {
            item.last_touched_str = this.$utils.time.format(item.last_touched);
          }
        });
        this.list = res.data;
      })
      .catch((err) => {
        this.list = [];
      });
    }
  }
}
</script>

<style>
.user-home-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px 0;
  padding: 0 20px;
}

.user-info-wrapper {
  min-height: 80px;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
}

.list-wrapper {
  background-color: #ffffff;
  border-radius: 10px;
}

.item-wrapper:first-child {
  padding-top: 20px;
}
.item-wrapper:last-child {
  padding-bottom: 20px;
}
.item-wrapper {
  padding: 10px 20px;
  border-bottom: 1Px solid #ededed;
}

.left-wrapper {
}

.middle-wrapper {
  padding-left: 20px;
}

.header-wrapper {
  justify-content: flex-start;
}

.node-tag-wrapper {
  padding: 10px;
  font-size: 12Px;
  border-radius: 10px;
  margin-right: 10px;
  overflow: hidden;
}

.node-tag-wrapper.actived {
  color: #fff;
  background-color: #334;
}

.node-tag-wrapper.unactived {
  color: #555;
  background-color: #fff;
}

.content-wrapper {
  margin-top: 10px;
  padding-right: 20px;
  font-size: 14Px;
}
</style>
