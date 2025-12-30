<script setup>
import { useCentersStore } from '@/stores/centers';
import { FilterMatchMode } from '@primevue/core/api';
import { onBeforeMount, ref } from 'vue';

const store = useCentersStore();

// 페이지네이션
const page = ref(1);
const rows = ref(13);

// checkbox
const selectedRows = ref([]);

// 검색
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

onBeforeMount(() => {
  store.fetchCenter();
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

// 번호
const rowNumber = (index) => {
  return (page.value - 1) * rows.value + index + 1;
};

// 페이지 변경
const onPageChange = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  selectedRows.value = [];
};
</script>

<template>
  <div class="flex gap-6 p-6 pt-25 h-screen overflow-hidden">
    <!-- 검색 -->
    <aside class="w-[260px] bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200">
      <h3 class="font-bold mb-4 text-gray-700">검색</h3>

      <IconField iconPosition="left">
        <InputIcon class="pi pi-search text-gray-400" />
        <InputText v-model="filters.global.value" class="w-full" placeholder="기관명 검색" />
      </IconField>
    </aside>

    <!-- 메인 -->
    <section class="flex-1 bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">기관 정보</h2>

        <div class="flex gap-2">
          <Button label="기관 등록" icon="pi pi-building" />
          <Button label="선택 삭제" icon="pi pi-trash" severity="danger" :disabled="selectedRows.length === 0" />
        </div>
      </div>

      <div class="flex-1 overflow-auto rounded-lg border border-gray-200">
        <DataTable
          :value="store.centers"
          v-model:selection="selectedRows"
          v-model:filters="filters"
          :globalFilterFields="['name']"
          dataKey="c_no"
          sortField="name"
          :sortOrder="1"
          :paginator="true"
          :rows="rows"
          :rowHover="true"
          showGridlines
          tableLayout="fixed"
          @page="onPageChange"
          :selectionPageOnly="true"
        >
          <template #empty>
            <div class="text-center py-6 text-gray-400">데이터 없음</div>
          </template>

          <Column selectionMode="multiple" headerStyle="width:48px" />

          <Column header="번호" headerClass="table-header" bodyClass="table-body" style="width: 80px">
            <template #body="{ index }">
              {{ rowNumber(index) }}
            </template>
          </Column>

          <Column field="name" header="기관명" headerClass="table-header" sortable style="width: 200px" />

          <Column header="주소" headerClass="table-header" style="width: 300px">
            <template #body="{ data }">
              {{ data.address ?? '-' }}
            </template>
          </Column>

          <Column header="대표 번호" headerClass="table-header" bodyClass="table-body" style="width: 140px">
            <template #body="{ data }">
              {{ data.phone ?? '-' }}
            </template>
          </Column>

          <Column header="이메일" headerClass="table-header" bodyClass="table-body" style="width: 200px">
            <template #body="{ data }">
              {{ data.email ?? '-' }}
            </template>
          </Column>

          <Column header="등록일" headerClass="table-header" bodyClass="table-body" style="width: 130px">
            <template #body="{ data }">
              {{ formatDate(data.created_date) }}
            </template>
          </Column>

          <Column header="운영종료일" headerClass="table-header" bodyClass="table-body" style="width: 130px">
            <template #body="{ data }">
              {{ formatDate(data.closed_date) }}
            </template>
          </Column>

          <Column header="운영여부" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">
              <Tag :value="data.manage === 1 ? '운영' : '종료'" :severity="data.manage === 1 ? 'info' : 'secondary'" rounded class="status-tag" />
            </template>
          </Column>

          <Column header="수정" headerClass="table-header" bodyClass="table-body" style="width: 80px">
            <template #body="{ data }">
              <i class="pi pi-pen-to-square edit-icon" @click="console.log('edit:', data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>
  </div>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f3f4f6;
}

:deep(.table-header .p-datatable-column-header-content) {
  justify-content: center;
}

:deep(.table-body) {
  text-align: center;
  color: #374151;
}

:deep(.status-tag) {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
}

.edit-icon {
  cursor: pointer;
  font-size: 1.1rem;
  color: #6b7280;
  transition: color 0.2s;
}

.edit-icon:hover {
  color: #10b981;
}
</style>
