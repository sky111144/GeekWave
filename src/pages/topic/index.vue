<template>
  <view class='topic-wrapper'>
    <view class='topic-header-wrapper bg-white' v-if='topic && topic.member'>
      <view class='topic-info flex f-jc-sb'>
        <view class='topic-node flex' v-if='topic.node'>
          <view class='topic-node-name' @tap='gotoHome'>首页</view>
          <view class='topic-node-name' @tap='gotoNode(topic.node.id)'>&nbsp/&nbsp{{ topic.node.title }}</view>
        </view>
        <view class='user-avatar'>
          <image class='avatar' :src='topic.member.avatar_mini' />
        </view>
      </view>
      <view class='topic-title'>
        {{ topic.title }}
      </view>
      <view class='topic-creator border-bottom' @tap='gotoUser(topic.member.username)'>
        By {{ topic.member.username }} at {{ topic.last_modified_str }}
      </view>
      <view class='rich-text'>
        <rich-text :nodes="topic.content_rendered"></rich-text>
      </view>
    </view>

    <view class='reply-list-wrapper bg-white' v-if='replies.length'>
      <view class='total-wrapper'>共{{ total }}条回复</view>
      <view class='pagination-wrapper border-bottom flex f-jc-sb'>
        <view class='pagination-count-wrapper'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex' v-if='totalPage > 1'>
          <view class='pagination-goto' @tap='prev'>上一页</view>
          <view class='pagination-goto'></view>
          <view class='pagination-goto' @tap='next'>下一页</view>
        </view>
        <view class='pagination-count-wrapper'>共{{ totalPage }}页</view>
      </view>

      <view class='reply-item-wrapper flex f-jc-sb' v-for='(reply, index) in replies[page]'>
        <view class='flex'>
          <view class='left-wrapper'>
            <image class='avatar' :src='reply.member.avatar_mini' />
          </view>
          <view class='middle-wrapper'>
            <view class='flex'>
              <view class='user-wrapper' @tap='gotoUser(reply.member.username)'>{{ reply.member.username }}</view>
              <view class='last-reply-wrapper'>{{ reply.last_modified_str }}</view>
            </view>
            <view class='rich-text'>
              <rich-text :nodes="reply.content_rendered"></rich-text>
            </view>
          </view>
        </view>
        <view class='right-wrapper'>
            <view class='count-wrapper bg-grey'>{{ reply.rank }}</view>
        </view>
      </view>

      <view class='pagination-wrapper flex f-jc-sb'>
        <view class='pagination-count-wrapper'>第{{ page + 1 }}页</view>
        <view class='pagination-goto-wrapper flex' v-if='totalPage > 1'>
          <view class='pagination-goto' @tap='prev'>上一页</view>
          <view class='pagination-goto'></view>
          <view class='pagination-goto' @tap='next'>下一页</view>
        </view>
        <view class='pagination-count-wrapper'>共{{ totalPage }}页</view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';

export default {
  name: 'Topic',
  data () {
    return {
      topic: {},
      replies: [],
      total: 0,
      totalPage: 1,
      page: 0,
      pageSize: 30
    }
  },

  mounted () {
    let page = Taro.getCurrentPages().slice(-1)[0] || { options: {} };
    this.getTopic(page.options.topicId);
    this.getReplies(page.options.topicId, 1, 20);
  },

  onShareAppMessage (res) {
    let share = {
      title: 'IT 新鲜事儿',
      path: '/pages/topic/index'
    };

    if (this.topic.title) {
      share.title = this.topic.title;
    }

    if (this.topic.id) {
      share.path = `/pages/topic/index?topicId=${this.topic.id}`;
    }
    return share;
  },

  methods: {
    gotoHome () {
      this.$utils.router.gotoHome();
    },
    gotoNode (nodeId) {
      this.$utils.router.gotoNode(nodeId);
    },
    gotoUser (username) {
      this.$utils.router.gotoUser(username);
    },

    prev () {
      if (this.page > 0) {
        this.page = this.page - 1;
      }
    },
    next () {
      if (this.page < this.totalPage - 1) {
        this.page = this.page + 1;
      }
    },

    getTopic (topicId) {
      this.$utils.api.getTopic(topicId)
      .then((res) => {
        res.data[0].content_rendered = res.data[0].content_rendered === '<br/>\n' ? '<p>如题</p>' : res.data[0].content_rendered;
        res.data[0].content_rendered = res.data[0].content_rendered.replace(/<img/gi, "<img class='rich-img'");

        this.topic = res.data[0];
      })
      .catch(() => {
        this.fetchTopic(topicId);
      });
    },

    fetchTopic (topicId) {
      this.$utils.api.fetchTopic(topicId)
      .then((res) => {
        res.data[0].content_rendered = res.data[0].content_rendered === '<br/>\n' ? '<p>如题</p>' : res.data[0].content_rendered;
        res.data[0].content_rendered = res.data[0].content_rendered.replace(/<img/gi, "<img class='rich-img'");
        if (res.data[0].last_modified) {
          res.data[0].last_modified_str = this.$utils.time.format(res.data[0].last_modified);
        }
        this.topic = res.data[0];
      })
      .catch((err) => {
        this.topic = {};
      });
    },

    getReplies (topicId, page, pageSize) {
      this.$utils.api.fetchReplies(topicId, page, pageSize)
      .then((res) => {
        res.data = res.data.map((item, index) => {
          item.rank = index + 1;
          if (item.last_modified) {
            item.last_modified_str = this.$utils.time.format(item.last_modified);
          }
          item.content_rendered = item.content_rendered.replace(/http\:/gi, 'https:');
          item.content_rendered = item.content_rendered.replace(/src\=\"\/\//gi, 'src="https://');
          return item;
        });

        this.total = res.data.length;
        this.totalPage = Math.ceil(res.data.length/this.pageSize);
        this.replies = this.$utils.array.matrix(res.data, this.pageSize);
      })
      .catch((err) => {
        this.replies = [];
      });
    }
  }
};
</script>

<style>
.topic-wrapper {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 20px;
}

.topic-header-wrapper {
  border-radius: 10px;
  overflow: hidden;
}

.topic-info {
  padding: 10rpx 10rpx 0 10rpx;
  font-size: 14Px;
  height: 30Px;
}

.topic-title {
  padding: 10rpx;
  font-size: 18Px;
}

.topic-node-name {
  line-height: 15Px;
  height: 15Px;
}

.topic-creator {
  color: #999999;
  font-size: 12Px;
  padding: 0 10px 10px 10px;
}

.reply-list-wrapper {
  margin-top: 20px;
  border-radius: 10px;
  overflow: hidden;
}

.reply-item-wrapper {
  padding: 10px;
  border-bottom: 1Px solid #ededed;
}

.left-wrapper {
  margin-right: 10px;
}

.total-wrapper {
  padding: 10px;
  font-size: 12Px;
  color: #999999;
  border-bottom: 1Px solid #ededed;
}

</style>
