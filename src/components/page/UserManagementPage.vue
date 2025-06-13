<script setup lang="ts">
import {reactive, h, ref, watch, computed } from 'vue';
import {getAllUsersInfo, setUserPassword, updateUserInfo} from '@/api/manager.ts';
import { usePagination } from 'vue-request';
import type { TablePaginationConfig, SorterResult, FilterValue, TableCurrentDataSource } from 'ant-design-vue/es/table/interface';
import {Space, Modal, type FormInstance, message} from 'ant-design-vue';
import {userInfoStore} from "@/stores/user.ts";

const store=userInfoStore();

const viewModalVisible = ref(false);
const editModalVisible = ref(false);
const resetModalVisible = ref(false);
const selectedRecord = ref<any | null>(null);

const editFormRef = ref<FormInstance>();
const editFormData = reactive({
  username: '',
  email: '',
  sex: '',
  icon:'',
});
const editFormRules = {
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  sex: [
    { required: true, message: '请选择性别', trigger: 'change' },
  ],
};

const resetFormData = reactive({
  username:'',
  password:'',
})

const handleView = (record: any) => {
  selectedRecord.value = record;
  viewModalVisible.value = true;
  console.log(record);
};

const handleEdit = (record: any) => {
  selectedRecord.value = record;
  editFormData.username = record.user_name;
  editFormData.icon = record.icon;
  editFormData.email = record.email;
  editFormData.sex = record.sex;
  editModalVisible.value = true;
  editFormRef.value?.clearValidate();
  console.log(editFormData);
};

const handleEditModalOk = async () => {
  try {
    if (!editFormRef.value) return;
    await editFormRef.value.validate(); // 表单校验

    const dataToUpdate: any = {
      user_name: editFormData.username,
      email: editFormData.email,
      sex: editFormData.sex,
      icon: editFormData.icon,
    };

    console.log('表单数据待保存:', dataToUpdate);

    const response = await updateUserInfo(dataToUpdate);
    message.success('用户信息更新成功！');
    editModalVisible.value = false;
    run({ pageNow: current.value, pageSize: pageSize.value });
    
  }catch(err:any){
    console.error("编辑用户失败");
    const errorMessage = err.response?.data?.message || err.message || '编辑用户失败，请重试';
    message.error(errorMessage);
  }
};

const handleEditModalCancel = () => {
  editModalVisible.value = false;
};

const handleReset = (record: any) => {
  selectedRecord.value = record;
  resetFormData.username=record.user_name;
  resetModalVisible.value = true;
  console.log(record);
};

const handleResetOK = async () => {
  try {
    const randomBytes = ref(new Uint8Array(10))
    crypto.getRandomValues(randomBytes.value)
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    for (let i = 0; i < 10; i++) {
      const index = randomBytes.value[i] % charset.length
      resetFormData.password += charset[index]
    }
    console.log(resetFormData.password);
    const data: any = {
      user_name: resetFormData.username,
      password: resetFormData.password,
    }
    const response = await setUserPassword(data);
    message.success('用户信息更新成功！');
    resetModalVisible.value = false;
    run({pageNow: current.value, pageSize: pageSize.value});
  } catch (err: any) {
    console.error("重置密码失败");
    const errorMessage = err.response?.data?.message || err.message || '重置密码失败，请重试';
    message.error(errorMessage);
  }
}

// const getAllUsersInfoForPagination = (paramsFromPagination: { pageNow: number; pageSize: number; [key: string]: any }) => {
//   const adminNameFromStore = 'root';
//
//   console.log('Wrapper: paramsFromPagination received:', paramsFromPagination);
//   console.log('Wrapper: admin_name from store:', adminNameFromStore);
//
//   const finalParams = {
//     ...paramsFromPagination,
//     admin_name: adminNameFromStore,
//   };
//
//   console.log('Wrapper: finalParams for actual API call:', finalParams);
//   return getAllUsersInfo(finalParams);
// };

const columns=[
  // {
  //   title:'id',
  //   dataIndex:'id',
  //   width:'auto',
  // },
  {
    title:'用户名',
    dataIndex:'user_name',
    width:'auto',
  },
  {
    title:'性别',
    dataIndex:'sex',
    width:'auto',
  },
  {
    title:'邮箱',
    dataIndex:'email',
    width:'auto',
  },
  {
    title:'上次活跃时间',
    dataIndex:'user_age',
    width:'auto',
    customRender:(text:any)=>{
      try {
        // console.log(text)
        return new Date(text.text).toLocaleString();
      } catch (e) {
        console.error("Error formatting date:", text, e);
        return text; // 如果转换失败，返回原始文本
      }
    }
  },
  {
    title:'操作',
    key:'operation',
    width:'auto',
    customRender: ({ record }: { record: any }) => {
      return h(Space, null, [
        h('a', { onClick: () => handleView(record) }, '查看'),
        h('a', { onClick: () => handleEdit(record) }, '编辑'),
        h('a', { onClick: () => handleReset(record) }, '重置密码'),
      ]);
    },
  }
];

const {
  data: rawDataFromPagination,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getAllUsersInfo, {
  formatResult: (res:any) => {
    console.log("formatResult in usePagination options received:", res);
    if (res && res.data && Array.isArray(res.data.pageSize)) {
      return res.data.pageSize;
    }
    return [];
  },
  pagination: {
    currentKey: 'pageNow',
    pageSizeKey: 'pageSize',
    totalKey: 'data.total',
  },
});

watch(rawDataFromPagination, (newData) => {
  console.log('rawDataFromPagination (from usePagination) updated:', newData);
});


const tableDataSource = computed(() => {
  if (rawDataFromPagination.value && rawDataFromPagination.value.data && Array.isArray(rawDataFromPagination.value.data.pageSize)) {
    return rawDataFromPagination.value.data.pageSize;
  }
  if (Array.isArray(rawDataFromPagination.value)) {
    return rawDataFromPagination.value;
  }
  return [];
});

watch(tableDataSource, (newArray) => {
  console.log('tableDataSource (computed for table) updated:', newArray);
});


const pagination = computed(() => ({
  total: total?.value || 0,
  current: current.value,
  pageSize: pageSize.value,
  showSizeChanger: true,
  showQuickJumper: true,
}));

console.log(pagination);

const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
) => {
  const sortParams: { sortField?: string; sortOrder?: string } = {};
  if (!Array.isArray(sorter) && sorter.field && sorter.order) {
    sortParams.sortField = String(sorter.field);
    sortParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
  } else if (Array.isArray(sorter) && sorter.length > 0 && sorter[0].field && sorter[0].order) {
    sortParams.sortField = String(sorter[0].field);
    sortParams.sortOrder = sorter[0].order === 'ascend' ? 'asc' : 'desc';
  }
  console.log(newPagination,filters,sortParams)

  run({
    pageNow: newPagination.current??1,
    pageSize: newPagination.pageSize??10,
    ...filters,
    ...sortParams,
  });
};

</script>

<template>
  <div class="header">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="用户管理"
        :back-icon="false"
    />
  </div>
  <div class="table">
    <a-table
        :columns="columns"
        :row-key="(record:any)=>record.id"
        :data-source="tableDataSource"
        :pagination="pagination"
        :loading="loading"
        @change="handleTableChange"
    >
    </a-table>
  </div>

  <!-- 查看用户模态框 -->
  <a-modal
      v-model:visible="viewModalVisible"
      title="查看用户详细信息"
      :ok-button-props="{ style: { display: 'none' } }"
      cancel-text="关闭"
      width="600px"
  >
  <div v-if="selectedRecord" style="padding: 16px 0;">
    <a-descriptions bordered :column="1" size="middle">
<!--      <a-descriptions-item label="ID">-->
<!--        {{ selectedRecord.id }}-->
<!--      </a-descriptions-item>-->
      <a-descriptions-item label="用户名">
        {{ selectedRecord.user_name }}
      </a-descriptions-item>
      <a-descriptions-item label="性别">
        <a-tag :color="selectedRecord.sex === '男' ? 'blue' : 'pink'">
          {{ selectedRecord.sex }}
        </a-tag>
      </a-descriptions-item>
      <a-descriptions-item label="邮箱">
        {{ selectedRecord.email }}
      </a-descriptions-item>
      <a-descriptions-item label="注册时间">
        {{ new Date(selectedRecord.user_age).toLocaleString() }}
      </a-descriptions-item>
      <a-descriptions-item label="文章数量">
        {{ selectedRecord.article_num }}
      </a-descriptions-item>
      <a-descriptions-item label="发布评论数">
        {{ selectedRecord.comment_num }}
      </a-descriptions-item>
      <a-descriptions-item label="被评论数">
        {{ selectedRecord.commented_count}}
      </a-descriptions-item>
      <a-descriptions-item label="用户权限">
        {{selectedRecord.authority=='0'?'用户':'管理员'}}
      </a-descriptions-item>
    </a-descriptions>
  </div>
  <div v-else>
    <p>没有可显示的用户信息。</p>
  </div>
  </a-modal>

  <!-- 编辑用户模态框 -->
  <a-modal
      v-model:visible="editModalVisible"
      :title="'编辑用户 - ' + (selectedRecord?.user_name || '')"
      ok-text="保存"
      cancel-text="取消"
      @ok="handleEditModalOk"
      @cancel="handleEditModalCancel"
  >
    <a-form
        ref="editFormRef"
        :model="editFormData"
        :rules="editFormRules"
        layout="vertical"
    >
      <a-form-item label="用户名">
        <a-input :value="editFormData.username" disabled />
      </a-form-item>
<!--      <a-form-item label="密码">-->
<!--        <a-input :value="editFormData.password"/>-->
<!--      </a-form-item>-->
      <a-form-item label="邮箱" name="email">
        <a-input v-model:value="editFormData.email" />
      </a-form-item>
      <a-form-item label="性别" name="sex">
        <a-radio-group v-model:value="editFormData.sex">
          <a-radio value="男">男</a-radio>
          <a-radio value="女">女</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
      v-model:visible="resetModalVisible"
      title="重置密码"
      ok-text="确认"
      cancel-text="取消"
      @ok="handleResetOK"
  >
    <p v-if="selectedRecord">确定要重置用户 {{ selectedRecord.user_name }} 的密码吗？此操作无法撤销。</p>
  </a-modal>

</template>

<style scoped>
.table {
  margin: 16px;
}
</style>