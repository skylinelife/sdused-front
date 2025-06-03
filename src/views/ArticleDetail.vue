<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { userInfoStore } from '@/stores/user.ts';
import { message } from 'ant-design-vue';
import { articleDetail } from '../api/user.ts';


// 模拟文章数据（你可以替换为从 API 获取的数据）
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
      const res = await articleUnliked(articleId);
    }catch(err){
      alert('取消点赞失败');
      console.error(err);
    }
  }
}
</script>

<template>
  <div class="article-detail-container">
    <a-card v-if="article" class="article-card">
      <h1 class="article-title">{{ article.title }}</h1>
      <div class="article-meta">
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
        <p v-for="(line, index) in article.content.split('\\n')" :key="index">{{ line }}</p>
      </div>
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
}
</style>
