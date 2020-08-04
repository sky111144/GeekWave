import Vue from 'vue'
import store from './store'

// Vue.config.productionTip = false
import './common/style/index.css';
import utils from './common/utils/index.js';

Vue.prototype.$utils = utils;

const App = new Vue({
  store,
  onShow (options) {
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  }
})

export default App
