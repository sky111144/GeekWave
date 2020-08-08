<template>
  <view class='home-wrapper'>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-fs f-fw-w'>
        <view v-for='(type, index) in nodes' class='node-tag-wrapper' :class='[type.id === curType ? "actived" : "unactived"]' @tap='gotoType(type)'>
          {{ type.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-fs f-fw-w'>
        <view v-for='(node, index) in nodes[curType].nodes' class='node-tag-wrapper' :class='[node.id === curNode ? "actived" : "unactived"]' @tap='getNode(node)'>
          {{ node.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list' v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper' @tap='gotoUser(item.member.username)'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex'>
              <view class='node-wrapper' @tap='gotoNode(item.node.id)'>{{ item.node.title }}</view>
              <view class='user-wrapper' @tap='gotoUser(item.member.username)'>{{ item.member.username }}</view>
            </view>
            <view class='content-wrapper' @tap="gotoTopic(item)">{{ item.title }}</view>
            <view class='time-wrapper flex'>
              <view class='last-reply-wrapper'>{{ item.last_touched_str }}</view>
              <view class='last-reply-wrapper'>最后回复来自</view>
              <view class='user-wrapper' @tap="gotoUser(item.last_reply_by)">{{ item.last_reply_by }}</view>
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
      list: [],
      nodes: [
        {
          name: '技术',
          id: 0,
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
          nodes: [
            { name: '分享创造', id: 17, cache: 90000 },
            { name: '设计', id: 215, cache: 90000 },
            { name: '奇思妙想', id: 519, cache: 90000 },
          ]
        },
        {
          name: '好玩',
          id: 2,
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
          nodes: [
            { name: '问与答', id: 12, cache: 900000 }
          ]
        },
        {
          name: '最热',
          id: 8,
          nodes: [
            { name: '最热', id: 'hot', type: 'hot', cache: 30000 },
            { name: '最新', id: 'latest', type: 'latest', cache: 30000 }
          ]
        }
      ],
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
    this.getTopicList(this.nodes[0].nodes[0]);
  },
  methods: {
    gotoType (type) {
      this.curType = type.id;
      this.list = [];
      this.getTopicList(type.nodes[0]);
    },
    getNode (node) {
      this.list = [];
      this.getTopicList(node);
    },
    gotoNode (nodeId) {
      Taro.navigateTo({ url: `/pages/node/index?nodeId=${nodeId}` });
    },
    gotoUser (username) {
      Taro.navigateTo({ url: `/pages/user/index?username=${username}` });
    },

    gotoTopic (item) {
      Taro.navigateTo({ url: `/pages/topic/index?topicId=${item.id}` });
    },

    getTopicList (node) {
      let that = this;
      let time = wx.getStorageSync(`nodes_time_${node.id}`) || 0;

      if (Date.now() - time < node.cache) {
        wx.getStorage({
          key: `nodes_${node.id}`,
          success (res) {
            console.log('缓存：');
            that.curNode = node.id;
            that.list = res.data;
          },
          fail () {
            console.log('失败走接口：');
            that.fetchTopicList(node);
          }
        });
      } else {
        console.log('失效走接口：');
        that.fetchTopicList(node);
      }
    },

    async fetchTopicList (node) {
      let oldNodeId = this.curNode;

      try {
        this.curNode = node.id;

        let map = {
          hot: 'https://www.v2ex.com/api/topics/hot.json',
          latest: 'https://www.v2ex.com/api/topics/latest.json',
          'undefined': `https://www.v2ex.com/api/topics/show.json?node_id=${node.id}`
        }

        let res = await Taro.request({ url: map[node.type] });
        let topics = res.data.map((item, index) => {
          item.last_touched_str = this.$utils.time.format(item.last_touched);
          return item;
        });

        wx.setStorage({ key: `nodes_${node.id}`, data: topics });
        wx.setStorage({ key: `nodes_time_${node.id}`, data: Date.now() });
        if (this.curNode === node.id) {
          this.list = topics;
        }
      } catch (e) {
        this.curNode = oldNodeId;
        this.list = [];
      }
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
