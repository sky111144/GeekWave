<template>
  <view class='personal-wrapper'>
    <view class='panel-wrapper' @tap="gotoLog">更新日志</view>
    <view class='panel-wrapper' @tap="changeOrigin">数据源（{{type}}）</view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Personal',
  data () {
    return {
      type: wx.getStorageSync('data_type') || 'v2ex'
    };
  },
  methods: {
      gotoLog () {
          this.$utils.router.gotoLog();
      },

      changeOrigin () {
          if (this.type === 'cnode') {
            wx.setStorageSync('data_type', 'v2ex');
            this.type = 'v2ex';
          } else if (this.type === 'v2ex') {
            wx.setStorageSync('data_type', 'cnode');
            this.type = 'cnode';
          }
          Taro.startPullDownRefresh({
            complete: function () {
              Taro.stopPullDownRefresh();
            }
          });
      }
  }
};
</script>

<style>
.personal-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.panel-wrapper {
  height: 30Px;
  line-height: 30Px;
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
  text-align: left;
  color: #000;
  background-color: #fff;
}
</style>
