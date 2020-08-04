<template>
  <view class='nodes-wrapper'>
    <view class='node-list-wrapper'>

      <view class='pagination-wrapper flex f-jc-sb bg-white border-bottom' v-if='nodes.length !== 0'>
        <view class='pagination-count-wrapper'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex'>
          <view class='pagination-goto' @tap='prev'>上一页</view>
          <view class='pagination-goto'></view>
          <view class='pagination-goto' @tap='next'>下一页</view>
        </view>
        <view class='pagination-count-wrapper'>共{{ totalPage }}页</view>
      </view>

      <view class='node-item-wrapper border-bottom flex' @tap='gotoNode(node.id)' v-for='(node, index) in nodes[page]' v-if='nodes.length !== 0'>
        <view class='node-wrapper'>{{ page * pageSize + index + 1}}</view>
        <view>{{ node.title }}</view>
      </view>

      <view class='pagination-wrapper flex f-jc-sb bg-white' v-if='nodes.length !== 0'>
        <view class='pagination-count-wrapper'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex'>
          <view class='pagination-goto' @tap='prev'>上一页</view>
          <view class='pagination-goto'></view>
          <view class='pagination-goto' @tap='next'>下一页</view>
        </view>
        <view class='pagination-count-wrapper'>共{{ totalPage }}页</view>
      </view>

      <view class='loading-wrapper' v-if='nodes.length === 0'></view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Nodes',
  data () {
      return {
          nodes: [],
          page: 0,
          pageSize: 20,
          totalPage: 0
      }
  },
  mounted () {
      let that = this;
      wx.getStorage({
        key: 'nodes',
        success (res) {
          that.totalPage = parseInt(res.data.length/that.pageSize);
          that.nodes = that.$utils.array.matrix(res.data, that.pageSize);
        },
        fail () {
          that.getNodes();
        }
      });
  },
  methods: {
      prev () {
        if (this.page > 0) {
          this.page -= 1;
        }
      },
      next () {
        if (this.page < this.totalPage - 1) {
          this.page += 1;
        }
      },
      async getNodes () {
        try {
          const res = await Taro.request({ url: 'https://www.v2ex.com/api/nodes/all.json' });
          this.totalPage = parseInt(res.data.length/this.pageSize);
          this.nodes = this.$utils.array.matrix(res.data, this.pageSize);
          wx.setStorage({ key: 'nodes', data: res.data });
        } catch (e) {
          console.log(e);
          this.nodes = [];
        }
      },

      gotoNode (nodeId) {
        Taro.navigateTo({ url: `/pages/node/index?nodeId=${nodeId}` });
      }
  }
};
</script>

<style>
.nodes-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;

}

.node-list-wrapper {
  border-radius: 10px;
  overflow: hidden;
}

.node-item-wrapper {
  padding: 20px;
  text-align: left;
  color: #000;
  background-color: #fff;
}
</style>
