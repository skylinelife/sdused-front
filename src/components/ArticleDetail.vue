<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { userInfoStore } from "@/stores/user.ts";
import { List, Button, Spin, Alert, Modal, message } from 'ant-design-vue';
import {deleteComment, getArticleComment, getArticleDetail} from "@/api/manager.ts";
import {HeartOutlined}from '@ant-design/icons-vue'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true,
  },
});


interface Article {
  id: number|string;
  article_name: string;
  content: string;

}

interface Comment {
  id: number;
  content: string;
  author_name: string;
  user_id?: string | number;
  created_at: string;
}

// 响应式状态
const articleDetails = ref<Article | null>(null);
const commentsList = ref<Comment[]>([]);
const isLoadingArticle = ref(false);
const isLoadingComments = ref(false);
const articleError = ref<string | null>(null);
const commentsError = ref<string | null>(null);

// 获取文章详情的方法
const fetchArticleDetails = async (id: string | number) => {
  isLoadingArticle.value = true;
  articleError.value = null;
  try {
    const response = await getArticleDetail(id);
    articleDetails.value = response.data || response;
    console.log(articleDetails.value);
  } catch (err: any) {
    console.error('获取文章详情失败:', err);
    articleError.value = `无法加载文章详情: ${err.message || '未知错误'}`;
    articleDetails.value = null;
  } finally {
    isLoadingArticle.value = false;
  }
};

//获取评论列表的方法
const fetchComments = async (id: string | number) => {
  isLoadingComments.value = true;
  commentsError.value = null;
  try {
    const response = await getArticleComment(id);
    commentsList.value = response.data || response;
  } catch (err: any) {
    console.error('获取评论列表失败:', err);
    commentsError.value = `无法加载评论列表: ${err.message || '未知错误'}`;
    commentsList.value = [];
  } finally {
    isLoadingComments.value = false;
  }
};

//处理删除评论的方法
const handleDeleteComment = (commentId: string | number) => {
  // const operator=userStore.userInfo.user_name;
  const operator='root';
  const data={
    user_name:operator,
    comment_id:commentId,
  }
  Modal.confirm({
    title: '确认删除评论',
    content: '您确定要删除这条评论吗？此操作无法撤销。',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: async () => {
      try {
        await deleteComment(data);
        message.success('评论删除成功！');
        // 重新加载评论列表
        if (props.articleId) {
          await fetchComments(props.articleId);
        }
      } catch (err: any) {
        console.error('删除评论失败:', err);
        message.error(`删除评论失败: ${err.message || '未知错误'}`);
      }
    },
  });
};

// 监听 articleId prop 的变化，以便在 ID 更改时重新加载数据
watch(
    () => props.articleId,
    async (newId) => {
      if (newId) {
        // 清空旧数据
        articleDetails.value = null;
        commentsList.value = [];
        articleError.value = null;
        commentsError.value = null;

        await fetchArticleDetails(newId);
        if (articleDetails.value && !articleError.value) {
          await fetchComments(newId);
        }
      } else {
        articleDetails.value = null;
        commentsList.value = [];
        articleError.value = null;
        commentsError.value = null;
      }
    },
    { immediate: true }
);

</script>

<template>
  <div class="article-comment-viewer">
    <!-- 文章详情展示 -->
    <div v-if="articleDetails && !isLoadingArticle && !articleError" class="article-section">
      <a-descriptions title="文章详情" bordered :column="2">
        <a-descriptions-item label="文章名称">
          {{ articleDetails.article_name }}
        </a-descriptions-item>
        <a-descriptions-item label="作者">
          {{ articleDetails.user_name || '未知' }}
        </a-descriptions-item>
        <a-descriptions-item label="点赞数">
          {{articleDetails.useful_num}}
        </a-descriptions-item>
        <a-descriptions-item label="发布日期">
          {{ articleDetails.publish_date ? new Date(articleDetails.publish_date).toLocaleString() : '未知' }}
        </a-descriptions-item>
        <a-descriptions-item label="文章内容">
          <div class="article-content-wrapper" v-html="articleDetails.article_content"></div>
        </a-descriptions-item>
        <!-- 您可以根据 articleDetails 中的实际字段添加更多的 a-descriptions-item -->
      </a-descriptions>
    </div>
    <hr v-if="articleDetails" />

    <!-- 评论列表展示 -->
    <div v-if="articleDetails && !articleError" class="comments-section">
      <h2>评论 ({{ commentsList.length }})</h2>
      <div v-if="isLoadingComments" class="loading-indicator">
        <Spin tip="正在加载评论列表..." />
      </div>
      <Alert v-if="commentsError" :message="commentsError" type="error" show-icon closable />

      <div v-if="!isLoadingComments && !commentsError">
        <a-list
            v-if="commentsList.length > 0"
            class="comment-list"
            item-layout="horizontal"
            :data-source="commentsList"
        >
          <template #renderItem="{ item: comment }">
            <a-list-item>
              <template #actions>
                <a-button type="link" danger @click="handleDeleteComment(comment.comment_id)">
                  删除
                </a-button>
              </template>
              <a-list-item-meta>
                <template #title>
                  <span style="font-size: large; font-weight: bolder">{{ comment.user_name   || '匿名用户' }}</span>
                </template>
                <template #description>
                  <p style="font-size: medium;font-weight: bold">{{ comment.comment_content }}</p>
                  <HeartOutlined />
                  <small>{{comment.useful_num}}&nbsp&nbsp&nbsp&nbsp{{ new Date(comment.publish_date).toLocaleString() }}</small>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
        <div v-else-if="!isLoadingComments && !commentsError" class="empty-state">
          <p>暂无评论</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>