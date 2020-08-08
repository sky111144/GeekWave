<template>
  <view class='log-wrapper'>
    <view class='log-item-wrapper flex'>
      2020-08-07：调整状态栏颜色；开放主题详情页面分享好友功能。
      <view class="grey">（v1.0.4）</view>
    </view>

    <view class='log-item-wrapper flex'>
      2020-08-06：修复节点列表搜索问题。
      <view class="grey">（v1.0.3）</view>
    </view>

    <view class='log-item-wrapper flex'>
      2020-08-05：支持个人详情功能。
      <view class="grey">（v1.0.2）</view>
    </view>

    <view class='log-item-wrapper flex'>
      2020-08-04：支持节点列表、主题列表功能。
      <view class="grey">（v1.0.1）</view>
    </view>

    <view class='log-item-wrapper flex'>
      2020-08-03：支持首页、主题详情功能。
      <view class="grey">（v1.0.0）</view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Log'
};
</script>

<style>
.log-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 20px;
}

.log-item-wrapper {
  padding: 20px;
  width: 100%;
  text-align: left;
  color: #000;
  background-color: #fff;
}
</style>
