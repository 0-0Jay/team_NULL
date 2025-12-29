<!-- 비밀번호 유효성 검사 관련 주석 풀고 메시지 추가하기 -->
<script setup>
import { useUsersStore } from '@/stores/users';
import { useCentersStore } from '@/stores/centers';
import { onBeforeMount, computed, ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const store = useUsersStore();
const centerStore = useCentersStore();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];
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

// 수정
const editDialog = ref(false);
const editUser = ref({});
const msg = ref({
  name: false,
  centerName: false,
  phone: false,
  email: false,
  pwConfirm: false
});

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

// 라디오
const filterStaff = computed(() => {
  // 전체
  if (radioValue.value === -1) {
    return store.staff;
  }

  // 승인 / 대기
  return store.staff.filter((row) => row.status === radioValue.value);
});

const nameMsg = computed(() => msg.value.name && editUser.value.name === '');
// const centerNameMsg = computed(() => user.type === 3 && !editUser.value.c_no);
const phoneMsg = computed(() => msg.value.phone && editUser.value.phone === '');
const emailMsg = computed(() => msg.value.email && editUser.value.email === '');
const pwMismatch = computed(() => {
  if (!msg.value.pwConfirm) return false;
  if (!editUser.value.password) return false;
  return editUser.value.password !== editUser.value.pwConfirm;
});

// 회원 상태 변경(사용승인, 비활성화)
const changeStatus = async (status) => {
  const userNos = selectedRows.value.map((row) => row.user_no);

  if (userNos.length === 0) return;

  try {
    const result = await store.modifyStatus(userNos, status);

    if (result.status === 'success') {
      await store.fetchStaff(); // 화면 자동 갱신
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

// 수정 버튼 클릭
const openEdit = (data) => {
  editUser.value = { ...data }; // 기존 값 그대로 복사
  console.log('수정 창 : ', editUser.value);

  if (data.c_no && data.center_name) {
    selectedAutoValue.value = {
      c_no: data.c_no,
      name: data.center_name
    };
  } else {
    selectedAutoValue.value = null;
  }

  msg.value = {
    name: false,
    centerName: false,
    phone: false,
    email: false,
    pwConfirm: false
  };
  editDialog.value = true;
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
const selectCenter = (e) => {
  selectedAutoValue.value = e.value;
  editUser.value.c_no = e.value.c_no;
};

const submitEdit = async () => {
  const info = {
    name: editUser.value.name,
    phone: editUser.value.phone,
    email: editUser.value.email
  };

  // 비밀번호 입력한 경우만
  if (editUser.value.password) {
    info.password = editUser.value.password;
  }

  // 기관 변경한 경우만
  if (selectedAutoValue.value) {
    info.c_no = selectedAutoValue.value.c_no;
  }

  try {
    const result = await store.modifyStaff(editUser.value.user_no, info);
    console.log('modifyStaff 결과', result);

    if (result?.status === 'success') {
      toast.add({
        severity: 'success',
        summary: '수정 완료',
        detail: '정보가 수정되었습니다.',
        life: 2000
      });

      await store.fetchStaff();
      editDialog.value = false;
    }
  } catch (e) {
    console.error('수정 중 에러', e);
  }
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
        <h2 class="text-xl font-bold">
          <template v-if="user.type != 3">{{ user.c_name }} 담당자 정보</template>
          <template v-if="user.type === 3">기관 담당자 정보</template>
        </h2>

        <div class="flex items-center">
          <Button v-if="user.type === 3" label="기관 담당자 등록" icon="pi pi-user" class="mr-5" />
          <Button label="사용 승인" class="mr-5" severity="info" :disabled="selectedRows.length == 0" @click="openConfirm(1)" />
          <Button label="비활성화" severity="danger" :disabled="selectedRows.length == 0" @click="openConfirm(2)" />
        </div>
      </div>
      <div class="flex-1 overflow-auto">
        <DataTable
          :value="filterStaff"
          v-model:selection="selectedRows"
          dataKey="user_no"
          sortField="name"
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

          <Column field="name" header="담당자명" headerClass="table-header" bodyClass="table-body" sortable style="width: 120px" />

          <Column header="아이디" headerClass="table-header" bodyClass="table-body" style="width: 180px">
            <template #body="{ data }">
              {{ data.id }}
            </template>
          </Column>

          <Column v-if="user.type === 3" header="기관명" headerClass="table-header" bodyClass="table-body" style="width: 180px">
            <template #body="{ data }">
              {{ data.center_name }}
            </template>
          </Column>

          <Column header="연락처" headerClass="table-header" bodyClass="table-body" style="width: 130px">
            <template #body="{ data }">
              {{ data.phone ?? '-' }}
            </template>
          </Column>

          <Column header="이메일" headerClass="table-header" bodyClass="table-body" style="width: 260px">
            <template #body="{ data }">
              {{ data.email ?? '-' }}
            </template>
          </Column>

          <Column v-if="user.type != 3" header="지원자 수" field="center_name" headerClass="table-header" bodyClass="table-body" style="width: 100px">
            <template #body="{ data }">
              {{ data.applicant_count ?? '-' }}
            </template>
          </Column>

          <Column header="가입일" headerClass="table-header" bodyClass="table-body" style="width: 120px">
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
              <i class="pi pi-pen-to-square edit-icon" @click="openEdit(data)" />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <Dialog v-model:visible="editDialog" :style="{ width: '450px' }" header="담당자 정보 수정" :modal="true">
      <div class="flex flex-col gap-6">
        <div>
          <label class="block font-bold mb-3">아이디</label>
          <div class="p-2 bg-gray-100 rounded text-gray-600">
            {{ editUser.id }}
          </div>
        </div>

        <div>
          <label class="block font-bold mb-3">담당자명</label>
          <InputText v-model.trim="editUser.name" @input="msg.name = true" :invalid="nameMsg" fluid />
          <small v-if="nameMsg" class="text-red-500"> 담당자명을 입력해주세요. </small>
        </div>

        <div v-if="user.type === 3">
          <label class="block font-bold mb-3">기관명</label>
          <IconField iconPosition="left">
            <InputIcon class="pi pi-search" />
            <AutoComplete v-model="selectedAutoValue" :suggestions="autoFilteredValue" optionLabel="name" placeholder="기관명 검색" @complete="searchCenter" @item-select="selectCenter" forceSelection fluid />
          </IconField>
        </div>

        <div>
          <label class="block font-bold mb-3">연락처</label>
          <InputText v-model.trim="editUser.phone" @input="msg.phone = true" :invalid="phoneMsg" fluid />
          <small v-if="phoneMsg" class="text-red-500"> 연락처를 입력해주세요. </small>
        </div>

        <div>
          <label class="block font-bold mb-3">이메일</label>
          <InputText v-model.trim="editUser.email" @input="msg.email = true" :invalid="emailMsg" fluid />
          <small v-if="emailMsg" class="text-red-500"> 이메일을 입력해주세요. </small>
        </div>

        <div>
          <label class="block font-bold mb-3">비밀번호 변경</label>

          <InputText v-model="editUser.password" type="password" placeholder="새 비밀번호 입력" fluid class="mb-2" />

          <InputText v-model="editUser.pwConfirm" type="password" placeholder="비밀번호 재확인" @input="msg.pwConfirm = true" fluid />
          <small v-if="pwMismatch" class="text-red-500"> 비밀번호가 일치하지 않습니다. </small>
        </div>
      </div>

      <template #footer>
        <Button label="취소" icon="pi pi-times" text @click="editDialog = false" />
        <Button label="수정" icon="pi pi-check" @click="submitEdit" />
      </template>
    </Dialog>
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
