<template>
  <view class='node-page-wrapper'>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list'  v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper' @tap='gotoUser(item.member.username)'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex f-ai-c'>
              <view class='node-wrapper' @tap="gotoTopic(item)">{{ item.node.title }}</view>
              <view class='user-wrapper' @tap='gotoUser(item.member.username)'>{{ item.member.username }}</view>
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
  name: 'Node',
  data () {
    return {
      list: []
    }
  },

  mounted () {
    let page = Taro.getCurrentPages().slice(-1)[0] || { options: {} };
    this.getTopics(page.options.nodeId);
  },

  methods: {
    gotoUser (username) {
      this.$utils.router.gotoUser(username);
    },
    gotoTopic (item) {
      this.$utils.router.gotoTopic(item);
    },

    getTopics (nodeId) {
      this.$utils.api.getTopicsByNodeId(nodeId)
      .then((res) => {
        this.list = res.data;
      })
      .catch(() => {
        this.fetchTopics(nodeId);
      });
    },

    fetchTopics (nodeId) {
      this.$utils.api.fetchTopicsByNodeId(nodeId)
      .then((res) => {
        this.list = res.data.map((item, index) => {
          if (item.last_touched) {
            item.last_touched_str = this.$utils.time.format(item.last_touched);
          }
          return item;
        });
      })
      .catch((err) => {
        this.list = [];
      });
    }
  }
}
</script>

<style>
.node-page-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 20px 0;
  padding: 0 20px;
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

.middle-wrapper {
  padding-left: 20px;
}

.header-wrapper {
  justify-content: flex-start;
}

.content-wrapper {
  margin-top: 10px;
  padding-right: 20px;
  font-size: 14Px;
}
</style>
