<script setup>
import { useUsersStore } from '@/stores/users';
import { onBeforeMount, computed, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const store = useUsersStore();
const toast = useToast();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

// pagination
const page = ref(1);
const rows = ref(13);

// checkbox
const selectedRows = ref([]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const globalFilterFields = ['name'];

// radio
const radioValue = ref(-1); // -1 전체, 1 승인, 0 대기

// confirm
const visible = ref(false);
const pendingStatus = ref(null);
const confirmMsg = ref('');

onBeforeMount(() => {
  store.fetchGeneralUsersByManager(user.user_no);
});

// radio 필터
const filteredUsers = computed(() => {
  if (radioValue.value === -1) return store.generalUsers;
  return store.generalUsers.filter((row) => row.status === radioValue.value);
});

// 페이지 변경
const onPageChange = (e) => {
  page.value = e.page + 1;
  rows.value = e.rows;
  selectedRows.value = [];
};

// 날짜 포맷
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// 승인 / 비활성
const changeStatus = async (status) => {
  const userNos = selectedRows.value.map((row) => row.user_no);
  if (userNos.length === 0) return;

  const result = await store.modifyStatus(userNos, status);

  if (result.status === 'success') {
    toast.add({
      severity: 'success',
      summary: '처리 완료',
      detail: status === 1 ? '승인되었습니다.' : '비활성화되었습니다.',
      life: 2000
    });
    await store.fetchGeneralUsersByManager(user.user_no);
    selectedRows.value = [];
  } else {
    toast.add({
      severity: 'error',
      summary: '처리 실패',
      detail: result.message || '요청 실패',
      life: 2500
    });
  }
};

// confirm
const openConfirm = (status) => {
  if (selectedRows.value.length === 0) return;

  if (status === 1) {
    const hasApproved = selectedRows.value.some((row) => row.status === 1);
    if (hasApproved) {
      toast.add({
        severity: 'error',
        summary: '승인 실패',
        detail: '이미 승인된 회원이 포함되어 있습니다.',
        life: 2000
      });
      selectedRows.value = [];
      return;
    }
  }

  pendingStatus.value = status;
  confirmMsg.value = status === 1 ? '선택한 회원을 사용 승인하시겠습니까?' : '선택한 회원을 비활성화하시겠습니까?';

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

  <div class="flex gap-6 p-6 pt-25 h-screen overflow-hidden">
    <!-- 검색 + radio -->
    <aside class="w-[260px] px-6 pt-15 pb-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 class="font-bold mb-4">검색</h3>

      <!-- 이름 검색 -->
      <IconField iconPosition="left" class="mb-6">
        <InputIcon class="pi pi-search" />
        <InputText class="w-full" type="text" v-model="filters.global.value" placeholder="이름으로 검색" />
      </IconField>

      <!-- radio -->
      <div class="font-semibold text-lg mb-2">사용승인</div>
      <div class="flex flex-row gap-3">
        <div class="flex items-center">
          <RadioButton :value="-1" v-model="radioValue" />
          <label class="ml-2">전체</label>
        </div>
        <div class="flex items-center">
          <RadioButton :value="1" v-model="radioValue" />
          <label class="ml-2">승인</label>
        </div>
        <div class="flex items-center">
          <RadioButton :value="0" v-model="radioValue" />
          <label class="ml-2">대기</label>
        </div>
      </div>
    </aside>

    <!-- 메인 -->
    <section class="flex-1 bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">일반 회원 정보</h2>

        <div class="flex gap-2">
          <Button label="사용 승인" severity="info" raised :disabled="selectedRows.length === 0" @click="openConfirm(1)" />
          <Button label="비활성화" severity="danger" raised :disabled="selectedRows.length === 0" @click="openConfirm(2)" />
        </div>
      </div>

      <div class="flex-1 overflow-auto rounded-lg border border-gray-200">
        <DataTable
          :value="filteredUsers"
          v-model:selection="selectedRows"
          dataKey="user_no"
          :paginator="true"
          :rows="rows"
          v-model:filters="filters"
          :globalFilterFields="globalFilterFields"
          showGridlines
          @page="onPageChange"
          :selectionPageOnly="true"
        >
          <template #empty>
            <div class="text-center py-6 text-gray-400">데이터 없음</div>
          </template>

          <Column selectionMode="multiple" headerStyle="width:48px" />
          <Column header="이름" field="name" headerClass="table-header" bodyClass="table-body" />
          <Column header="아이디" field="id" headerClass="table-header" bodyClass="table-body" />
          <Column header="연락처" field="phone" headerClass="table-header" bodyClass="table-body" />
          <Column header="이메일" field="email" headerClass="table-header" bodyClass="table-body" />

          <Column header="가입일" headerClass="table-header" bodyClass="table-body">
            <template #body="{ data }">
              {{ formatDate(data.created_date) }}
            </template>
          </Column>

          <Column header="회원 상태" headerClass="table-header" bodyClass="table-body">
            <template #body="{ data }">
              <Tag :value="data.status === 1 ? '승인' : '대기'" :severity="data.status === 1 ? 'info' : 'secondary'" rounded class="status-tag" />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm">
    {{ confirmMsg }}
  </ConfirmDialog>
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
</style>
