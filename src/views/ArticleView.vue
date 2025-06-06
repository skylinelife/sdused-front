<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { userInfoStore } from '@/stores/user.ts';
import { message } from 'ant-design-vue';
import { articleDetail, articleLike, articleUnlike,articleUpdate, articleDelete} from '../api/user.ts';
import Comment from "@/components/Comment.vue";


const isEditing = ref(false); // 是否处于编辑状态
const editedTitle = ref('');
const editedContent = ref('');

const router = useRouter();
const route = useRoute();
const articleId = route.params.id as string;
const store = userInfoStore();
const liked = ref(false);


const article = ref({
  title:'',
  author: '',
  content: '',
  likes: 0,
  publishDate: '',
});

const deleteArticle = async () => {
  const confirmed = window.confirm('确定要删除这篇文章吗？删除后无法恢复。');
  if (!confirmed) return;

  try {
    const res=await articleDelete(articleId);
    message.success('文章已删除');
    router.push('/'); // ✅ 删除后跳转首页或文章列表
  } catch (err) {
    console.error(err);
    message.error('删除失败');
  }
};

const Article = async()=>{
  try{
    const res=await articleDetail(articleId);
    article.value={
      title: res.article_name,
      author: res.user_name,
      content: res.article_content,
      likes: res.useful_num,
      publishDate: res.publish_date,
    }
    console.log(article);
    // 初始化编辑用字段
    editedTitle.value = article.value.title;
    editedContent.value = article.value.content;
  }catch(err){
    alert('文章加载失败');
    console.error(err);
  }
};

// 如果未登录，跳转到登录页面
onMounted(() => {
  if (!store.isLogin) {
    alert('请先登录。');
    router.push('/login');
  }
  else{
    Article();
  }
});



const toggleLike = async () => {
  liked.value = !liked.value;
  article.value.likes += liked.value ? 1 : -1;
  message.success(liked.value ? '已点赞' : '已取消点赞');
  if(liked.value){
    try {
      const res = await articleLike(articleId);
    }catch(err){
      alert('点赞失败');
      console.error(err);
    }
  }
  else{
    try{
      const res = await articleUnlike(articleId);
    }catch(err){
      alert('取消点赞失败');
      console.error(err);
    }
  }
}
const cancelEdit = () => {
  isEditing.value = false;
  editedTitle.value = article.value.title;
  editedContent.value = article.value.content;
};

const submitEdit = async () => {
  if (!editedTitle.value.trim() || !editedContent.value.trim()) {
    message.warning('标题或内容不能为空');
    return;
  }
  const data={
    article_id: articleId,
    article_name: editedTitle.value,
    article_content: editedContent.value,
  }
  try {
    await articleUpdate(data);
    article.value.title = editedTitle.value;
    article.value.content = editedContent.value;
    isEditing.value = false;
    message.success('文章更新成功');
  } catch (err) {
    message.error('更新失败');
    console.error(err);
  }
};


</script>

<template>
  <div class="article-detail-container">
    <a-card v-if="article" class="article-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h1 class="article-title" v-if="!isEditing">{{ article.title }}</h1>
        <a-input v-if="isEditing" v-model:value="editedTitle" class="article-title" />

        <div v-if="store.userInfo.user_name === article.author && !isEditing">
          <a-button type="primary" @click="isEditing = true">修改文章</a-button>
          <a-button type="default" danger style="margin-left: 8px;" @click="deleteArticle">删除文章</a-button>
        </div>

      </div>

      <div class="article-meta" v-if="!isEditing">
        <span>作者：{{ article.author }}</span>
        <span class="like" @click="toggleLike">
      <a-button type="link">
        <template #icon>
          <span :style="{ color: liked ? '#f5222d' : '#aaa' }">❤️</span>
        </template>
        {{ article.likes }}
      </a-button>
    </span>
      </div>

      <div class="article-content">
        <template v-if="!isEditing">
          <p v-for="(line, index) in article.content.split('\\n')" :key="index">{{ line }}</p>
        </template>
        <template v-else>
          <a-textarea v-model:value="editedContent" :auto-size="{ minRows: 6 }" />
          <div style="margin-top: 16px; text-align: right;">
            <a-button type="default" @click="cancelEdit">取消</a-button>
            <a-button type="primary" style="margin-left: 8px;" @click="submitEdit">提交修改</a-button>
          </div>
        </template>
      </div>

      <!-- 评论组件只有在非编辑状态下显示 -->
      <Comment v-if="!isEditing" :article-id="articleId" />
    </a-card>

    <a-empty v-else description="正在加载文章..." />
  </div>
</template>


<style scoped>
.article-detail-container {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
  background-color: #f0f2f5;
  min-height: 100vh;
}

.article-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 16px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  color: #888;
}

.article-content {
  font-size: 16px;
  line-height: 1.8;
  white-space: pre-wrap;
  text-align: left;
  while-space: normal;
  word-wrap: break-word;
}
.article-content p{
  margin-bottom:1em;
}
</style>
