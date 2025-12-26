<script setup>
import { useCentersStore } from '@/stores/centers';
import { KeyFilter } from 'primevue';
import { onBeforeMount, computed, ref, watch } from 'vue';

const store = useCentersStore();

// 페이지네이션
const page = ref(1);
const rows = ref(10);

// selection 관련
const selectedRows = ref([]);

// 검색
const inputCenter = ref('');
const searchCenter = ref('');
const searchError = ref('');

onBeforeMount(() => {
  store.fetchCenter();
});

// 날짜 포맷 함수
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

// 페이지 변경 이벤트
const onPageChange = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  selectedRows.value = [];
};

// 검색 이벤트
const onSearch = () => {
  searchError.value = '';

  if (!inputCenter.value.trim()) {
    searchError.value = '기관명을 입력해주세요.';
    return;
  }

  searchCenter.value = inputCenter.value.trim();
  page.value = 1;
  selectedRows.value = [];
};

// 검색 초기화
watch(inputCenter, (keyword) => {
  searchError.value = ''; // 검색어 입력 시 에러 제거

  if (!keyword.trim()) {
    searchCenter.value = '';
    page.value = 1;
    selectedRows.value = [];
  }
});

// 필터링된 데이터
const filterCenter = computed(() => {
  if (!searchCenter.value) return store.centers;
  return store.centers.filter((center) => center.name?.includes(searchCenter.value));
});
</script>

<template>
  <div class="flex gap-4 p-4" style="min-height: 80vh">
    <!-- 검색 -->
    <aside class="w-[260px] p-4 rounded">
      <h3 class="font-bold mb-3">검색</h3>
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText class="w-full" type="text" v-model="inputCenter" placeholder="기관명 입력" @keyup.enter="onSearch" />
      </IconField>

      <Button type="button" class="w-full mt-3 mb-3" label="검색" @click="onSearch" />
      <p v-if="searchError" class="text-red-500 text-center">
        {{ searchError }}
      </p>
    </aside>

    <div class="border-l-2 border-gray-300 mx-4"></div>

    <section class="flex-1 p-4 rounded flex flex-col">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">기관 정보</h2>
        <div>
          <Button label="기관 등록" icon="pi pi-building" class="mr-5" />
          <Button label="선택 삭제" icon="pi pi-trash" severity="danger" :disabled="selectedRows.length == 0" />
        </div>
      </div>

      <DataTable :value="filterCenter" v-model:selection="selectedRows" dataKey="c_no" sortField="name" :sortOrder="1" :paginator="true" :rows="rows" :rowHover="true" showGridlines @page="onPageChange" :selectionPageOnly="true" tableLayout="fixed">
        <template #empty>
          <div class="text-center">데이터 없음</div>
        </template>

        <Column selectionMode="multiple" headerStyle="width:48px" />

        <Column header="번호" headerClass="center-header" bodyClass="center-body" style="width: 80px">
          <template #body="{ index }">
            {{ rowNumber(index) }}
          </template>
        </Column>

        <Column field="name" header="기관명" headerClass="center-header" sortable style="width: 200px" />

        <Column header="주소" headerClass="center-header" style="width: 300px">
          <template #body="{ data }">
            {{ data.address ?? '-' }}
          </template>
        </Column>
        <Column header="대표 번호" headerClass="center-header" bodyClass="center-body" style="width: 140px">
          <template #body="{ data }">
            {{ data.phone ?? '-' }}
          </template>
        </Column>

        <Column header="이메일" headerClass="center-header" bodyClass="center-body" style="width: 200px">
          <template #body="{ data }">
            {{ data.email ?? '-' }}
          </template>
        </Column>

        <Column header="등록일" headerClass="center-header" bodyClass="center-body" style="width: 130px">
          <template #body="{ data }">
            {{ formatDate(data.created_date) }}
          </template>
        </Column>

        <Column header="운영종료일" headerClass="center-header" bodyClass="center-body" style="width: 130px">
          <template #body="{ data }">
            {{ formatDate(data.closed_date) }}
          </template>
        </Column>

        <Column header="운영여부" headerClass="center-header" bodyClass="center-body" style="width: 100px">
          <template #body="{ data }">
            <Tag :value="data.manage == 1 ? '운영' : '종료'" :severity="data.manage == 1 ? 'info' : 'secondary'" rounded class="status-tag" />
          </template>
        </Column>

        <Column header="수정" headerClass="center-header" bodyClass="center-body" style="width: 80px">
          <template #body="{ data }">
            <i class="pi pi-pen-to-square edit-icon" @click="console.log('edit:', data)" />
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
:deep(.center-header .p-datatable-column-header-content) {
  justify-content: center;
}

:deep(.center-body) {
  text-align: center;
}

:deep(.status-tag) {
  font-size: 0.85rem;
  padding: 0.4rem 0.75rem;
}

.edit-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
}

.edit-icon:hover {
  color: #48c787;
}
</style>
