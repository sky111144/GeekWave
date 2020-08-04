<template>
  <view class='personal-wrapper'>
    <view class='panel-wrapper' @tap="gotoLog">更新日志</view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Personal',
  components: {
  },
  methods: {
      gotoLog () {
          // 跳转到目的页面，打开新页面
          Taro.navigateTo({
            url: '/pages/log/index'
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
  width: 100%;
  text-align: left;
  color: #000;
  background-color: #fff;
}
</style>
