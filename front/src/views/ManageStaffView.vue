<!-- 비밀번호 유효성 검사 관련 주석 풀고 메시지 추가하기 -->
<script setup>
import { useUsersStore } from '@/stores/users';
import { useCentersStore } from '@/stores/centers';
import { onBeforeMount, computed, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import StaffModal from '@/components/StaffModal.vue';

const store = useUsersStore();
const centerStore = useCentersStore();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];
const toast = useToast();

// 페이지네이션
const page = ref(1);
const rows = ref(13);

// checkbox
const selectedRows = ref([]);

// 검색 + 드롭다운(사이드 바)
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const dropdownValue = ref(null);
const dropdownValues = [
  { name: '담당자명', code: 'CM' },
  { name: '아이디', code: 'ID' }
];
const radioValue = ref(-1);
const globalFilterFields = ref([]);

// 검색 + 자동완성(담당자 수정할 때 기관명 검색)
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);

// Confirm
const visible = ref(false);
const pendingStatus = ref(null); // 1: 승인, 2: 비활성
const ConfirmMsg = ref('');

onBeforeMount(() => {
  store.fetchStaff();
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

// 라디오 필터
const filterStaff = computed(() => {
  // 전체
  if (radioValue.value === -1) return store.staff;
  // 승인 / 대기
  return store.staff.filter((row) => row.status === radioValue.value);
});

// 회원 상태 변경(사용승인, 비활성화)
const changeStatus = async (status) => {
  const userNos = selectedRows.value.map((row) => row.user_no);
  if (userNos.length === 0) return;

  try {
    const result = await store.modifyStatus(userNos, status);

    if (result.status === 'success') {
      toast.add({
        severity: 'success',
        summary: '처리 완료',
        detail: status === 1 ? '승인되었습니다.' : '비활성화되었습니다.',
        closable: false,
        life: 2000
      });
      await store.fetchStaff();
      selectedRows.value = [];
    } else {
      toast.add({
        severity: 'error',
        summary: '처리 실패',
        detail: result.message || '요청을 처리할 수 없습니다.',
        closable: false,
        life: 2500
      });
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

  if (status === 2) {
    const hasApplicant = selectedRows.value.some((row) => row.applicant_count > 0);

    if (hasApplicant) {
      toast.add({
        severity: 'error',
        summary: '비활성화 불가',
        detail: '지원자가 있는 담당자는 비활성화할 수 없습니다.',
        closable: false,
        life: 2000
      });
      return;
    }
  }

  pendingStatus.value = status;
  ConfirmMsg.value = status === 1 ? '선택한 회원을 사용 승인하시겠습니까?' : `선택한 담당자를 비활성화하시겠습니까?`;

  visible.value = true;
};

const handleConfirm = async () => {
  visible.value = false;

  if (!pendingStatus.value) return;

  await changeStatus(pendingStatus.value);
  pendingStatus.value = null;
};

// 기관 검색(자동완성)
const searchCenter = async (e) => {
  const name = e.query;

  // 전체 목록
  if (!name) {
    autoFilteredValue.value = await centerStore.searchCenter('');
    return;
  }
  autoFilteredValue.value = await centerStore.searchCenter(name);
};

// 등록 모달 열기
const display = ref(false);
const modalMode = ref('add'); // 'add' | 'edit'
const openAddModal = () => {
  modalMode.value = 'add';
  selectedUser.value = null;
  display.value = true;
};

// 수정 모달 열기
const selectedUser = ref(null); // 수정용 데이터
const openEditModal = (data) => {
  modalMode.value = 'edit';
  selectedUser.value = data;
  display.value = true;
};
</script>

<template>
  <Toast />
  <div class="flex gap-6 p-6 pt-25 h-screen overflow-hidden">
    <!-- 검색 -->
    <SearchTable
      v-model:filters="filters"
      v-model:dropdownValue="dropdownValue"
      v-model:radioValue="radioValue"
      :dropdownValues="dropdownValues"
      :useRadio="true"
      @update:filterFields="globalFilterFields = $event"
      class="bg-white rounded-xl shadow-sm border border-gray-200"
    />

    <!-- 메인 -->
    <section class="flex-1 bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">
          <template v-if="user.type !== 3">{{ user.c_name }} 담당자 정보</template>
          <template v-else>기관 담당자 정보</template>
        </h2>

        <div class="flex gap-2">
          <Button v-if="user.type === 3" label="기관 담당자 등록" raised icon="pi pi-user" @click="openAddModal" />
          <Button label="사용 승인" severity="info" raised :disabled="selectedRows.length === 0" @click="openConfirm(1)" />
          <Button label="비활성화" severity="danger" raised :disabled="selectedRows.length === 0" @click="openConfirm(2)" />
        </div>
      </div>

      <div class="flex-1 overflow-auto rounded-lg border border-gray-200">
        <DataTable
          :value="filterStaff"
          v-model:selection="selectedRows"
          dataKey="user_no"
          :paginator="true"
          :rows="rows"
          :rowHover="true"
          v-model:filters="filters"
          :globalFilterFields="globalFilterFields"
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
            <template #body="{ index }">{{ rowNum(index) }}</template>
          </Column>

          <Column field="name" header="담당자명" headerClass="table-header" bodyClass="table-body" style="width: 120px" />

          <Column header="아이디" headerClass="table-header" bodyClass="table-body" style="width: 180px">
            <template #body="{ data }">{{ data.id }}</template>
          </Column>

          <Column v-if="user.type === 3" header="기관명" headerClass="table-header" bodyClass="table-body" style="width: 180px">
            <template #body="{ data }">{{ data.center_name }}</template>
          </Column>

          <Column header="연락처" headerClass="table-header" bodyClass="table-body" style="width: 130px">
            <template #body="{ data }">{{ data.phone || '-' }}</template>
          </Column>

          <Column header="이메일" headerClass="table-header" bodyClass="table-body" style="width: 260px">
            <template #body="{ data }">{{ data.email ?? '-' }}</template>
          </Column>

          <Column v-if="user.type === 2" header="지원자수" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">{{ data.applicant_count ?? 0 }}명</template>
          </Column>

          <Column header="가입일" headerClass="table-header" bodyClass="table-body" style="width: 120px">
            <template #body="{ data }">{{ formatDate(data.created_date) }}</template>
          </Column>

          <Column header="회원 상태" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">
              <Tag :value="data.status === 1 ? '승인' : '대기'" :severity="data.status === 1 ? 'info' : 'secondary'" rounded class="status-tag" />
            </template>
          </Column>

          <Column header="수정" headerClass="table-header" bodyClass="table-body" style="width: 80px">
            <template #body="{ data }">
              <i class="pi pi-pen-to-square edit-icon" @click="openEditModal(data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>
    <StaffModal v-model="display" :mode="modalMode" :userData="selectedUser" />
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm">
    {{ ConfirmMsg }}
  </ConfirmDialog>
</template>

<style scoped>
:deep(.p-datatable-thead > tr > th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}
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
