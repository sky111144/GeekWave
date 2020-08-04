<template>
  <view class='node-page-wrapper'>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list'  v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex f-ai-c'>
              <view class='node-wrapper'>{{ item.node.title }}</view>
              <view class='user-wrapper'>{{ item.member.username }}</view>
            </view>
            <view class='content-wrapper' @tap="gotoTopic(item)">{{ item.title }}</view>
            <view class='time-wrapper flex'>
              <view class='last-reply-wrapper'>{{ item.last_touched_str }}</view>
              <view class='last-reply-wrapper'>最后回复来自</view>
              <view class='user-wrapper'>{{ item.last_reply_by }}</view>
            </view>
          </view>
        </view>
        <view class='right-wrapper flex f-ai-c'>
          <view class='count-wrapper bg-brown'>{{ item.replies }}</view>
        </view>
      </view>
      <view class='loading-wrapper' v-if='list.length === 0'></view>
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
    this.getTopicList(page.options.nodeId);
  },
  methods: {
    gotoTopic (item) {
      Taro.navigateTo({ url: `/pages/topic/index?topicId=${item.id}` });
    },

    async getTopicList (nodeId) {
      try {
        const res = await Taro.request({ url: `https://www.v2ex.com/api/topics/show.json?node_id=${nodeId}` });

        this.list = res.data.map((item, index) => {
          item.last_touched_str = this.$utils.time.format(item.last_touched);
          return item;
        });
      } catch (e) {
        this.list = [];
      }
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
