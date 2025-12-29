<script setup>
import { useUsersStore } from '@/stores/users';
import { onBeforeMount, computed, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

import ConfirmDialog from '@/components/ConfirmDialog.vue';
import SearchTable from '@/components/SearchTable.vue';

const store = useUsersStore();
const toast = useToast();

// 페이지네이션
const page = ref(1);
const rows = ref(10);

// checkbox
const selectedRows = ref([]);

// 검색 + 드롭다운(사이드 바)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dropdownValue = ref(null);
const dropdownValues = [
  { name: '관리자명', code: 'CM' },
  { name: '아이디', code: 'ID' },
  { name: '기관명', code: 'CN' }
];
const radioValue = ref(-1);
const globalFilterFields = ref([]);

// Confirm
const visible = ref(false);
const pendingStatus = ref(null); // 1: 승인, 2: 비활성
const ConfirmMsg = ref('');

onBeforeMount(() => {
  store.fetchManager();
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
const rowNum = (index) => {
  return (page.value - 1) * rows.value + index + 1;
};

// 페이지 변경 이벤트
const onPageChange = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  selectedRows.value = [];
};

// 라디오
const filterManager = computed(() => {
  // 전체
  if (radioValue.value === -1) {
    return store.manager;
  }

  // 승인 / 대기
  return store.manager.filter((row) => row.status === radioValue.value);
});

// 회원 상태 변경(사용승인, 비활성화)
const changeStatus = async (status) => {
  const userNos = selectedRows.value.map((row) => row.user_no);

  if (userNos.length === 0) return;

  try {
    const result = await store.modifyStatus(userNos, status);

    if (result.status === 'success') {
      await store.fetchManager(); // 화면 자동 갱신
      selectedRows.value = [];
    }
  } catch (err) {
    console.error(err);
  }
};

// Confirm
const openConfirm = (status) => {
  if (selectedRows.value.length === 0) return;

  if (status === 1) {
    const hasApproved = selectedRows.value.some((row) => row.status === 1);

    if (hasApproved) {
      toast.add({
        severity: 'error',
        summary: '승인 실패',
        detail: '이미 승인된 회원이 포함되어 있습니다.',
        closable: false,
        life: 2000
      });
      selectedRows.value = [];
      return;
    }
  }

  pendingStatus.value = status;
  ConfirmMsg.value = status === 1 ? '선택한 회원을 사용 승인하시겠습니까?' : '선택한 회원을 비활성화하시겠습니까?';

  visible.value = true;
};

const handleConfirm = async () => {
  visible.value = false;

  if (!pendingStatus.value) return;

  await changeStatus(pendingStatus.value);
  pendingStatus.value = null;
};
</script>

<template>
  <Toast />
  <div class="flex gap-4 p-4 pt-16 h-screen overflow-hidden">
    <!-- 검색 -->
    <SearchTable v-model:filters="filters" v-model:dropdownValue="dropdownValue" v-model:radioValue="radioValue" :dropdownValues="dropdownValues" :useRadio="true" @update:filterFields="globalFilterFields = $event" />

    <div class="border-l-2 border-gray-300 mx-4 my-6 self-stretch"></div>

    <section class="flex-1 px-6 pt-13 pb-13 rounded flex flex-col">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">기관 관리자 정보</h2>
        <div class="flex items-center">
          <Button label="기관 관리자 등록" icon="pi pi-user" class="mr-5" />
          <Button label="사용 승인" class="mr-5" severity="info" :disabled="selectedRows.length == 0" @click="openConfirm(1)" />
          <Button label="비활성화" severity="danger" :disabled="selectedRows.length == 0" @click="openConfirm(2)" />
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <DataTable
          :value="filterManager"
          v-model:selection="selectedRows"
          dataKey="user_no"
          sortField="center_name"
          :sortOrder="1"
          :paginator="true"
          :rows="rows"
          :rowHover="true"
          v-model:filters="filters"
          :globalFilterFields="globalFilterFields"
          showGridlines
          @page="onPageChange"
          :selectionPageOnly="true"
          tableLayout="fixed"
        >
          <template #empty>
            <div class="text-center">데이터 없음</div>
          </template>

          <Column selectionMode="multiple" headerStyle="width:48px" />

          <Column header="번호" headerClass="table-header" bodyClass="table-body" style="width: 80px">
            <template #body="{ index }">
              {{ rowNum(index) }}
            </template>
          </Column>

          <Column field="user_name" header="관리자명" headerClass="table-header" bodyClass="table-body" style="width: 100px" />

          <Column header="아이디" headerClass="table-header" bodyClass="table-body" style="width: 150px">
            <template #body="{ data }">
              {{ data.id }}
            </template>
          </Column>
          <Column header="기관명" field="center_name" headerClass="table-header" sortable style="width: 200px">
            <template #body="{ data }">
              {{ data.center_name ?? '-' }}
            </template>
          </Column>

          <Column header="연락처" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">
              {{ data.phone ?? '-' }}
            </template>
          </Column>

          <Column header="이메일" headerClass="table-header" bodyClass="table-body" style="width: 200px">
            <template #body="{ data }">
              {{ data.email ?? '-' }}
            </template>
          </Column>

          <Column header="가입일" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">
              {{ formatDate(data.created_date) }}
            </template>
          </Column>

          <Column header="회원 상태" headerClass="table-header" bodyClass="table-body" style="width: 80px">
            <template #body="{ data }">
              <Tag :value="data.status === 1 ? '승인' : '대기'" :severity="data.status === 1 ? 'info' : 'secondary'" rounded class="status-tag" />
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

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm">
    {{ ConfirmMsg }}
  </ConfirmDialog>
</template>

<style scoped>
:deep(.table-header .p-datatable-column-header-content) {
  justify-content: center;
}

:deep(.table-body) {
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
