<script setup lang="ts">
import { ref, watch, defineProps, computed } from 'vue';
import { userInfoStore } from "@/stores/user.ts";
import {deleteComment, getArticleComment, getArticleDetail, } from "@/api/manager.ts";
import {addArticleComment} from "@/api/user.ts";
import {HeartOutlined}from '@ant-design/icons-vue'

const props = defineProps({
  articleId: {
    type: [String, Number],
    required: true,
  },
});

interface Comment {
  id: number;
  content: string;
  author_name: string;
  user_id?: string | number;
  created_at: string;
}

const store=userInfoStore();

const commentsList = ref<Comment[]>([]);
const isLoadingComments = ref(false);
const commentsError = ref<string | null>(null);

type comment = Record<string, string>;
const comments = ref<comment[]>([]);
const submitting = ref<boolean>(false);
const value = ref<string>('');

const fetchComments = async (id: string | number) => {
  isLoadingComments.value = true;
  commentsError.value = null;
  try {
    const response = await getArticleComment(id);
    commentsList.value = response.data || response;
    console.log(commentsList.value);
  } catch (err: any) {
    console.error('获取评论列表失败:', err);
    commentsError.value = `无法加载评论列表: ${err.message || '未知错误'}`;
    commentsList.value = [];
  } finally {
    isLoadingComments.value = false;
  }
};

console.log(commentsList)

const handleSubmit= async ()=>{
  if (!value.value) {
    alert("评论内容为空！");
    return;
  }else{
    submitting.value = true;
    const data={
      article_id: props.articleId,
      comment_content:value.value,
      user_name:store.userInfo.user_name,
    }
    try{
      console.log(data);
      const res=await addArticleComment(data);
      value.value='';
      await fetchComments(props.articleId);
    }catch(err){
      alert("评论失败！");
      console.log(err);
    }finally{
      submitting.value = false;
    }
  }

}

watch(
    () => props.articleId,
    async (newId) => {
      if (newId) {
        // 清空旧数据
        commentsList.value = [];
        commentsError.value = null;

        await fetchComments(newId);
      } else {
        commentsList.value = [];
        commentsError.value = null;
      }
    },
    { immediate: true }
);

</script>

<template>
  <a-list
    v-if="commentsList.length"
    :data-source="commentsList"
    item-layout="horizontal"
  >
    <template #renderItem="{item:comment}">
      <a-list-item>
        <a-comment
          :author="comment.user_name"
          :avatar="comment.avatar"
        >
          <template #content>
            <p>
              {{comment.comment_content}}
            </p>
          </template>
          <template #datetime>
            <a-tooltip :title="comment.publish_date">
              <span>{{ comment.publish_date?new Date(comment.publish_date).toLocaleString():"未知" }}</span>
            </a-tooltip>
          </template>
        </a-comment>
      </a-list-item>
    </template>
  </a-list>
  <a-comment>
    <template #avatar>
<!--      <a-avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />-->
    </template>
    <template #content>
      <a-form-item>
        <a-textarea v-model:value="value" :rows="4" />
      </a-form-item>
      <a-form-item>
        <a-button html-type="submit" :loading="submitting" type="primary" @click="handleSubmit">
          提交
        </a-button>
      </a-form-item>
    </template>
  </a-comment>
</template>

<style scoped>
:deep(.ant-comment-content-detail) {
  text-align: left;
}
</style>