<template>
  <view class='nodes-wrapper'>
    <view class='node-list-wrapper'>

      <view class='pagination-wrapper flex f-jc-sb bg-white border-bottom' v-if='nodes.length !== 0'>
        <view class='pagination-count-wrapper flex f-ai-c'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex'>
          <view class='pagination-goto flex f-ai-c' @tap='prev'>上一页</view>
          <view class='pagination-goto flex f-ai-c' @tap='getNodes'>重置</view>
          <view class='pagination-goto'>
            <input style='width:80px' type='text' placeholder='Search in this' v-model='query' />
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

      <view class='loading-wrapper flex f-jc-c f-ai-c' v-if='nodes.length === 0'>加载中~</view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Nodes',
  data () {
      return {
          type: wx.getStorageSync('data_type') || 'v2ex',
          query: '',
          backup: [],
          nodes: [],
          page: 0,
          pageSize: 20,
          totalPage: 0
      }
  },

  mounted () {
      this.getNodes();
  },

  onShow () {
    let curType = wx.getStorageSync('data_type');
    if (this.type !== curType) {
      this.type = curType;
      this.getNodes();
    }
  },
  methods: {
      input (e) {
        this.query = e.detail.value;
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

        this.totalPage = Math.ceil(total/this.pageSize);
        this.nodes = this.$utils.array.matrix(result, this.pageSize);
      },

      getNodes () {
        this.query = '';
        this.$utils.api.getNodes()
        .then((res) => {
          this.totalPage = Math.ceil(res.data.length/this.pageSize);
          this.nodes = this.$utils.array.matrix(res.data, this.pageSize);
          this.backup = this.$utils.array.matrix(res.data, this.pageSize);
        })
        .catch(() => {
          this.fetchNodes();
        });
      },

      fetchNodes () {
        this.$utils.api.fetchNodes()
        .then((res) => {
          this.totalPage = Math.ceil(res.data.length/this.pageSize);
          this.nodes = this.$utils.array.matrix(res.data, this.pageSize);
          this.backup = this.$utils.array.matrix(res.data, this.pageSize);
        })
        .catch((err) => {
          this.nodes = [];
          this.backup = [];
        })
      },

      gotoNode (nodeId) {
        this.$utils.router.gotoNode(nodeId);
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
