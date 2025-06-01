<script setup lang="ts">
import {reactive, h, ref, watch, computed } from 'vue';
import {getAllUsersInfo, getArticleList} from '@/api/manager.ts';
import { usePagination } from 'vue-request';
import type { TablePaginationConfig, SorterResult, FilterValue, TableCurrentDataSource } from 'ant-design-vue/es/table/interface';
import {Space, Modal, type FormInstance} from 'ant-design-vue';
import {userInfoStore} from "@/stores/user.ts";

const viewModalVisible = ref(false);
const deleteModalVisible = ref(false);
const selectedRecord = ref<any | null>(null);

const handleView = (record: any) => {
  selectedRecord.value = record;
  viewModalVisible.value = true;
};

const handleDelete = (record: any) => {
  selectedRecord.value = record;
  deleteModalVisible.value = true;
};


const columns=[
  {
    title: 'id',
    dataIndex: 'article_id',
    width: 'auto',
  },
  {
    title:'文章名称',
    dataIndex:'article_name',
    width:'auto',
  },
  {
    title:'发布日期',
    dataIndex:'publish_date',
    width:'auto',
  },
  {
    title:'作者',
    dataIndex:'user_name',
    width:'auto',
  },
  {
    title:'操作',
    dataIndex:'operation',
    width:'auto',
    customRender: ({ record }: { record: any }) => {
      return h(Space, null, [
        h('a', { onClick: () => handleView(record) }, '查看'),
        h('a', { onClick: () => handleDelete(record) }, '删除'),
      ]);
    },
  }
]

const {
  data: rawDataFromPagination,
  run,
  loading,
  current,
  pageSize,
  total,
} = usePagination(getArticleList, {
  formatResult: (res: any) => {
    console.log("formatResult - API response (res):", res);
    if (res && Array.isArray(res.articles)) {
      console.log("formatResult - Returning res.articles:", res.articles);
      return res.articles;
    }
    console.warn("formatResult - res.articles is not an array or res is invalid. Returning empty array.");
    return [];
  },
  pagination: {
    currentKey: 'pageNow',
    pageSizeKey: 'pageSize',
    totalKey: 'total',
  },
});

watch(rawDataFromPagination, (newData) => {
  console.log('rawDataFromPagination (from usePagination) updated:', newData);
});

const tableDataSource = computed(() => {
  if (rawDataFromPagination.value && Array.isArray(rawDataFromPagination.value.articles)) {
    console.log("tableDataSource - Returning rawDataFromPagination.value.articles:", rawDataFromPagination.value.articles);
    return rawDataFromPagination.value.articles;
  }
  // console.warn("tableDataSource: rawDataFromPagination.value.articles is NOT an array or rawDataFromPagination.value is invalid. Current rawDataFromPagination.value:", rawDataFromPagination.value, ". Returning empty array.");
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
        title="文章管理"
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
  <a-modal
      v-model:visible="viewModalVisible"
      title="查看文章详细信息"
      :ok-button-props="{ style: { display: 'none' } }"
      cancel-text="关闭"
      width="600px"
  >

  </a-modal>
</template>

<style scoped>
.table {
  margin: 16px;
}
</style>