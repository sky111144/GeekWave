<template>
  <view class='user-home-wrapper'>
    <view class='user-info-wrapper bg-white flex'>
      <image class='avatar' :src='userinfo.avatar_large'></image>
      <view>
        <view class='p-l-xs m-l-xs flex f-ai-c'>
          <view>{{ userinfo.username }}</view>
        </view>
        <view class='p-l-xs m-l-xs font-12'>{{ userinfo.tagline }}</view>
        <view class='p-l-xs m-l-xs font-12'>V2EX第 {{ userinfo.id }} 号会员，加入于 {{ userinfo.created }}</view>
      </view>
    </view>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list' v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex'>
              <view class='node-wrapper' @tap='gotoNode(item.node.id)'>{{ item.node.title }}</view>
              <view class='user-wrapper'>{{ item.member.username }}</view>
            </view>
            <view class='content-wrapper' @tap="gotoTopic(item)">{{ item.title }}</view>
            <view class='time-wrapper flex'>
              <view class='last-reply-wrapper'>{{ item.last_touched_str }}</view>
              <view class='last-reply-wrapper'>最后回复来自</view>
              <view class='user-wrapper' @tap='gotoUser(item.last_reply_by)'>{{ item.last_reply_by }}</view>
            </view>
          </view>
        </view>
        <view class='right-wrapper flex f-ai-c'>
          <view class='count-wrapper bg-brown'>{{ item.replies }}</view>
        </view>
      </view>
      <view class='loading-wrapper flex f-jc-c f-ai-c' v-if='list.length === 0'>加载中~</view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Home',
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
    this.getTopicList(page.options.username);
  },
  methods: {
    gotoUser (username) {
      Taro.navigateTo({ url: `/pages/user/index?username=${username}` });
    },

    gotoNode (nodeId) {
      Taro.navigateTo({ url: `/pages/node/index?nodeId=${nodeId}` });
    },

    gotoTopic (item) {
      Taro.navigateTo({ url: `/pages/topic/index?topicId=${item.id}` });
    },

    getUserInfo (username) {
      let that = this;
      let time = wx.getStorageSync(`userinfo_time_${username}`) || 0;

      if (Date.now() - time < 10000000) {
        wx.getStorage({
          key: `userinfo_${username}`,
          success (res) {
            console.log('缓存：');
            that.userinfo = res.data;
          },
          fail () {
            console.log('失败走接口：');
            that.fetchUserInfo(username);
          }
        });
      } else {
        console.log('失效走接口：');
        that.fetchUserInfo(username);
      }
    },

    async fetchUserInfo (username) {
      try {
        let res = await Taro.request({ url: `https://www.v2ex.com/api/members/show.json?username=${username}` });
        res.data.created = this.$utils.time.format(res.data.created);
        this.userinfo = res.data;

        wx.setStorage({ key: `userinfo_${username}`, data: res.data });
        wx.setStorage({ key: `userinfo_time_${username}`, data: Date.now() });

        console.log(res.data);
      } catch (e) {
        this.userinfo = {};
        console.log(e);
      }
    },

    getTopicList (username) {
      let that = this;
      let time = wx.getStorageSync(`user_time_${username}`) || 0;

      if (Date.now() - time < 10000000) {
        wx.getStorage({
          key: `user_${username}`,
          success (res) {
            console.log('缓存：');
            that.list = res.data;
          },
          fail () {
            console.log('失败走接口：');
            that.fetchTopicList(username);
          }
        });
      } else {
        console.log('失效走接口：');
        that.fetchTopicList(username);
      }
    },

    async fetchTopicList (username) {
      try {

        let res = await Taro.request({ url: `https://www.v2ex.com/api/topics/show.json?username=${username}` });
        let topics = res.data.map((item, index) => {
          item.last_touched_str = this.$utils.time.format(item.last_touched);
          return item;
        });

        wx.setStorage({ key: `user_${username}`, data: topics });
        wx.setStorage({ key: `user_time_${username}`, data: Date.now() });
        this.list = topics;
      } catch (e) {
        this.list = [];
      }
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
