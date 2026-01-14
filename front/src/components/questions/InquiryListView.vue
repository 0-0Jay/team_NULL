<script setup>
import { useInquiryStore } from '@/stores/inquiry';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useInquiryStore();
const router = useRouter();

// 로그인 유저
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

// 페이지네이션
const page = ref(1);
const rows = ref(10);

// 선택 행 (지금은 안 써도 유지)
const selectedRows = ref([]);

// 검색
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// 목록 조회
onBeforeMount(async () => {
  await store.fetchInquiryList(user);
});

// 날짜 포맷
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

// 번호 계산
const rowNumber = (index) => {
  return (page.value - 1) * rows.value + index + 1;
};

// 페이지 변경
const onPageChange = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  selectedRows.value = [];
};

// 상세 이동
const goDetail = (row) => {
  router.push({
    name: 'inquiry-detail',
    params: { inquiry_no: row.inquiry_no }
  });
};
</script>

<template>
  <div class="inquiry-container">
    <!-- 검색 -->
    <aside class="search-sidebar">
      <h3 class="search-title">검색</h3>
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search text-gray-400" />
        <InputText v-model="filters.global.value" class="w-full" placeholder="제목 검색" />
      </IconField>
    </aside>

    <!-- 메인 -->
    <section class="table-card">
      <!-- 제목 -->
      <div class="inquiry-header">
        <h3 class="inquiry-title">1:1 문의 내역</h3>
        <RouterLink v-if="user?.type === 0" :to="{ name: 'inquiry-create' }">
          <Button label="1:1 문의 작성" class="btn-create" />
        </RouterLink>
      </div>
      <DataTable
        :value="Array.isArray(store.inquiryList) ? store.inquiryList : []"
        v-model:selection="selectedRows"
        v-model:filters="filters"
        :globalFilterFields="['title', 'writer_name']"
        dataKey="inquiry_no"
        :paginator="true"
        :rows="rows"
        :rowHover="true"
        showGridlines
        tableLayout="fixed"
        @page="onPageChange"
        :selectionPageOnly="true"
      >
        <template #empty>
          <div class="text-center py-6 text-gray-400">문의 내역이 없습니다.</div>
        </template>

        <!-- 번호 -->
        <Column header="번호" style="width: 80px">
          <template #body="{ index }">
            {{ rowNumber(index) }}
          </template>
        </Column>

        <!-- 제목 -->
        <Column field="title" header="제목" sortable>
          <template #body="{ data }">
            <span class="cursor-pointer hover:text-blue-600 hover:underline" @click="goDetail(data)">
              {{ data.title }}
            </span>
          </template>
        </Column>

        <!-- 작성자 -->
        <Column field="writer_name" header="작성자" style="width: 120px" />

        <!-- 작성일 -->
        <Column header="작성일" style="width: 130px">
          <template #body="{ data }">
            {{ formatDate(data.inquiry_date) }}
          </template>
        </Column>

        <!-- 답변 상태 -->
        <Column header="답변 상태" style="width: 120px">
          <template #body="{ data }">
            <Tag :value="data.status === 0 ? '미답변' : '답변완료'" :severity="data.status === 0 ? 'secondary' : 'success'" rounded class="status-tag" />
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.inquiry-container {
  display: flex;
  gap: 24px;
  padding-top: 12px;
  height: calc(100vh - 260px);
  overflow: hidden;
}

.search-sidebar {
  width: 260px;
  background-color: white;
  padding: 60px 24px 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.search-title {
  font-weight: 700;
  margin-bottom: 16px;
  color: #374151;
}

.inquiry-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  /* margin-bottom: 28px; */
  /* padding-bottom: 16px; */
  /* border-bottom: 2px solid #f3f4f6; */
}

.faq-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-create {
  min-width: 100px;
  padding: 8px 20px;
  font-weight: 600;
  font-size: 15px;
}

.table-card {
  flex: 1;
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.p-datatable) {
  height: 100%;
  display: flex;
  flex-direction: column;
  /* margin-top: 20px; */
}

:deep(.p-datatable-wrapper) {
  flex: 1;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
}

:deep(.status-tag) {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
}

:deep(.p-paginator) {
  margin-top: auto;
  padding-top: 16px;
}
</style>
