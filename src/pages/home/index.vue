<template>
  <view class='home-wrapper'>
    <view class='list-wrapper'>
      <view class='item-wrapper flex f-jc-fs'>
        <view v-for='(type, index) in nodes' class='node-tag-wrapper' :class='[type.id === curType ? "actived" : "unactived"]' @tap='gotoType(type)'>
          {{ type.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-fs f-fw-w'>
        <view v-for='(node, index) in nodes[curType].nodes' class='node-tag-wrapper' :class='[node.id === curNode ? "actived" : "unactived"]' @tap='gotoNode(node.id)'>
          {{ node.name }}
        </view>
      </view>
      <view class='item-wrapper flex f-jc-sb' v-for='(item, index) in list' v-if='list.length !== 0'>
        <view class='flex'>
          <view class='left-wrapper'>
            <image class='avatar' :src='item.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='header-wrapper flex'>
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
  name: 'Home',
  data () {
    return {
      list: [],
      nodes: [
        {
          name: '技术',
          id: 0,
          nodes: [
            { name: '程序员', id: 300 },
            { name: 'Python', id: 90 },
            { name: 'iDev', id: 13 },
            { name: 'Android', id: 606 },
            { name: 'Linux', id: 11 },
            { name: 'node.js', id: 436 },
            { name: '云计算', id: 104 },
            { name: '宽带症候群', id: 108 }
          ]
        },
        {
          name: '城市',
          id: 1,
          nodes: [
            { name: '北京', id: 19 },
            { name: '上海', id: 18 },
            { name: '广州', id: 20 },
            { name: '深圳', id: 21 },
            { name: '杭州', id: 26 },
            { name: '成都', id: 30 }
          ]
        },
        {
          name: '创意',
          id: 2,
          nodes: [
            { name: '分享创造', id: 17 }
          ]
        },
        {
          name: '酷工作',
          id: 3,
          nodes: [
            { name: '酷工作', id: 43 }
          ]
        },
        {
          name: '交易',
          id: 4,
          nodes: [
            { name: '二手交易', id: 69 },
            { name: '物物交换', id: 285 }
          ]
        }
      ],
      curType: 0,
      curNode: 300
    }
  },
  components: {
  },

  onShareAppMessage (res) {
    return {
      title: 'IT 新鲜事儿',
      path: '/pages/home/index'
    }
  },

  mounted () {
    this.getTopicList(this.curNode);
  },
  methods: {
    gotoType (type) {
      this.curType = type.id;
      this.getTopicList(type.nodes[0].id);
    },
    gotoNode (nodeId) {
      this.getTopicList(nodeId);
    },
    gotoTopic (item) {
      Taro.navigateTo({ url: `/pages/topic/index?topicId=${item.id}` });
    },

    async getTopicList (nodeId) {
      try {
        const res = await Taro.request({ url: `https://www.v2ex.com/api/topics/show.json?node_id=${nodeId}` });
        this.curNode = nodeId;
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
