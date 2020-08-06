<template>
  <view class='nodes-wrapper'>
    <view class='node-list-wrapper'>

      <view class='pagination-wrapper flex f-jc-sb bg-white border-bottom' v-if='nodes.length !== 0'>
        <view class='pagination-count-wrapper flex f-ai-c'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex'>
          <view class='pagination-goto flex f-ai-c' @tap='prev'>上一页</view>
          <view class='pagination-goto flex f-ai-c' @tap='init'>重置</view>
          <view class='pagination-goto'>
            <input style='width:80px' type='text' placeholder='Search in this' @input='input' :value='query' />
          </view>
          <view class='pagination-goto flex f-ai-c' @tap='search'>搜索</view>
          <view class='pagination-goto flex f-ai-c' @tap='next'>下一页</view>
        </view>
        <view class='pagination-count-wrapper flex f-ai-c'>共{{ totalPage }}页</view>
      </view>

      <view class='node-item-wrapper border-bottom flex f-ai-c' @tap='gotoNode(node.id)' v-for='(node, index) in nodes[page]' v-if='nodes.length !== 0'>
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
          backup: [],
          nodes: [],
          page: 0,
          pageSize: 20,
          totalPage: 0
      }
  },
  mounted () {
      this.init();
  },
  methods: {
      init () {
        let that = this;
        this.query = '';
        wx.getStorage({
          key: 'nodes',
          success (res) {
            that.totalPage = parseInt(res.data.length/that.pageSize);
            that.nodes = that.$utils.array.matrix(res.data, that.pageSize);
            that.backup = that.$utils.array.matrix(res.data, that.pageSize);
          },
          fail () {
            that.getNodes();
          }
        });
      },

      input (e) {
        this.query = e.detail.value;
      },

      search () {
        let result = [];
        let total = 0;
        this.backup.forEach((arr, i) => {
          arr.forEach((item, j) => {
            if (item.title.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase()) > -1) {
              total += 1;
              result.push(item);
            };
          });
        });

        this.totalPage = parseInt(total/this.pageSize);
        this.nodes = this.$utils.array.matrix(result, this.pageSize);
      },

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
          let res = await Taro.request({ url: 'https://www.v2ex.com/api/nodes/all.json' });
          this.totalPage = parseInt(res.data.length/this.pageSize);

          this.nodes = this.$utils.array.matrix(res.data, this.pageSize);
          this.backup = this.$utils.array.matrix(res.data, this.pageSize);
          wx.setStorage({ key: 'nodes', data: res.data });
        } catch (e) {
          this.nodes = [];
          this.backup = [];
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
