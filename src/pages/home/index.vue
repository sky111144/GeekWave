<template>
  <view class='home-wrapper'>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-fs f-fw-w' v-if='nodes.length > 1'>
        <view v-for='(type, index) in nodes' class='node-tag-wrapper' :class='[type.id === curType ? "actived" : "unactived"]' @tap='gotoType(type)'>
          {{ type.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-fs f-fw-w' v-if='nodes[curType]'>
        <view v-for='(node, index) in nodes[curType].nodes' class='node-tag-wrapper' :class='[node.id === curNode ? "actived" : "unactived"]' @tap='getNode(node)'>
          {{ node.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list' v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper' @tap='gotoUser(item.member.username)' v-if='item.member'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex' v-if='item.node'>
              <view class='node-wrapper' @tap='gotoNode(item.node.id)'>{{ item.node.title }}</view>
              <view class='user-wrapper' @tap='gotoUser(item.member.username)'>{{ item.member.username }}</view>
            </view>
            <view class='content-wrapper' @tap="gotoTopic(item)">{{ item.title }}</view>
            <view class='time-wrapper flex'>
              <view class='last-reply-wrapper'>{{ item.last_touched_str }}</view>
              <view class='last-reply-wrapper' v-if='item.last_reply_by'>最后回复来自</view>
              <view class='user-wrapper' @tap="gotoUser(item.last_reply_by)" v-if='item.last_reply_by'>{{ item.last_reply_by }}</view>
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
import getData from './nodes.js';

export default {
  name: 'Home',
  data () {
    return {
      type: wx.getStorageSync('data_type') || 'cnode',
      list: [],
      nodes: getData(),
      curType: 0,
      curNode: 300
    }
  },

  onShareAppMessage (res) {
    return {
      title: 'IT 新鲜事儿',
      path: '/pages/home/index'
    }
  },

  mounted () {
    this.getTopics(this.nodes[0].nodes[0]);
  },

  onShow () {
    let curType = wx.getStorageSync('data_type');
    if (this.type !== curType) {
      this.nodes = getData();
      this.type = curType;
      this.getTopics(this.nodes[0].nodes[0]);
    }
  },

  methods: {
    gotoNode (nodeId) {
      this.$utils.router.gotoNode(nodeId);
    },
    gotoUser (username) {
      this.$utils.router.gotoUser(username);
    },
    gotoTopic (item) {
      this.$utils.router.gotoTopic(item);
    },

    gotoType (type) {
      this.curType = type.id;
      this.list = [];
      this.getTopics(type.nodes[0]);
    },
    getNode (node) {
      this.list = [];
      this.getTopics(node);
    },
    getTopics (node) {
      this.$utils.api.getTopicsInHome(node)
      .then((res) => {
        this.curNode = node.id;
        this.list = res.data;
      })
      .catch(() => {
        this.fetchTopics(node);
      });
    },

    fetchTopics (node) {
      let oldNodeId = this.curNode;

      this.curNode = node.id;
      this.$utils.api.fetchTopicsInHome(node)
      .then((res) => {
        res.data.forEach((item) => {
          if (item.last_touched) {
            item.last_touched_str = this.$utils.time.format(item.last_touched);
          }
        });
        if (this.curNode === node.id) {
          this.list = res.data;
        }
      })
      .catch(() => {
        this.curNode = oldNodeId;
        this.list = [];
      });
    }
  }
}
</script>

<style>
.home-wrapper {
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
