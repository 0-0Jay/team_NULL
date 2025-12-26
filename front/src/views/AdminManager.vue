<script setup>
import { useUsersStore } from '@/stores/users';
import { onBeforeMount, computed, ref, watch } from 'vue';

const store = useUsersStore();

// 페이지네이션
const page = ref(1);
const rows = ref(10);

// selection 관련
const selectedRows = ref([]);

// 검색 + 드롭다운
const inputKeyword = ref('');
const searchKeyword = ref('');
const dropdownValues = ref([
  { name: '관리자명', code: 'CM' },
  { name: '아이디', code: 'ID' },
  { name: '기관명', code: 'CN' }
]);
const dropdownValue = ref(null);
const searchError = ref('');

// 회원 상태
const statusMap = {
  0: { label: '대기', severity: 'secondary' },
  1: { label: '승인', severity: 'info' },
  2: { label: '비활성', severity: 'danger' }
};

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
  // 초기화
  searchError.value = '';

  if (!dropdownValue.value) {
    searchError.value = '검색 항목을 선택해주세요.';
    return;
  }

  if (!inputKeyword.value.trim()) {
    searchError.value = '검색어를 입력해주세요.';
    return;
  }

  searchKeyword.value = inputKeyword.value.trim();
  page.value = 1;
  selectedRows.value = [];
};

// 검색 기준 변경 시 전체 초기화
watch(dropdownValue, () => {
  inputKeyword.value = '';
  searchKeyword.value = '';
  searchError.value = '';
  page.value = 1;
  selectedRows.value = [];
});

// 검색 초기화
watch(inputKeyword, (keyword) => {
  searchError.value = ''; // 검색어 입력 시 에러 제거

  if (!keyword.trim()) {
    searchKeyword.value = '';
    page.value = 1;
    selectedRows.value = [];
  }
});

// 필터링된 데이터(평소에는 전체, 검색을 할 경우 검색된 데이터)
const filterCenter = computed(() => {
  if (!searchKeyword.value || !dropdownValue.value) return store.manager;

  const keyword = searchKeyword.value;

  return store.manager.filter((manager) => {
    switch (dropdownValue.value.code) {
      case 'CM':
        return manager.user_name?.includes(keyword);
      case 'ID':
        return manager.id?.toLowerCase().includes(keyword.toLowerCase());
      case 'CN':
        return manager.center_name?.includes(keyword);
      default:
        return true;
    }
  });
});

// 회원 상태 변경(사용승인, 비활성화)
const changeStatus = async (status) => {
  // console.log(selectedRows);
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
</script>

<template>
  <div class="flex gap-4 p-4" style="min-height: 80vh">
    <!-- 검색 -->
    <aside class="w-[260px] p-4 rounded">
      <h3 class="font-bold mb-3">검색</h3>

      <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="w-full mb-3" placeholder="검색 항목 선택" />
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText class="w-full" type="text" v-model="inputKeyword" placeholder="검색어 입력" @keyup.enter="onSearch" />
      </IconField>

      <Button type="button" class="w-full mt-3 mb-3" label="검색" @click="onSearch" />
      <p v-if="searchError" class="text-red-500 text-center">
        {{ searchError }}
      </p>
    </aside>

    <div class="border-l-2 border-gray-300 mx-4"></div>

    <section class="flex-1 p-4 rounded flex flex-col">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">기관 관리자 정보</h2>
        <div>
          <Button label="기관 관리자 등록" icon="pi pi-user" class="mr-5" />
          <Button label="사용 승인" class="mr-5" severity="info" :disabled="selectedRows.length == 0" @click="changeStatus(1)" />
          <Button label="비활성화" severity="danger" :disabled="selectedRows.length == 0" @click="changeStatus(2)" />
        </div>
      </div>

      <DataTable
        :value="filterCenter"
        v-model:selection="selectedRows"
        dataKey="user_no"
        sortField="center_name"
        :sortOrder="1"
        :paginator="true"
        :rows="rows"
        :rowHover="true"
        showGridlines
        @page="onPageChange"
        :selectionPageOnly="true"
        tableLayout="fixed"
      >
        <template #empty>
          <div class="text-center">데이터 없음</div>
        </template>

        <Column selectionMode="multiple" headerStyle="width:48px" />

        <Column header="번호" headerClass="manager-header" bodyClass="manager-body" style="width: 80px">
          <template #body="{ index }">
            {{ rowNumber(index) }}
          </template>
        </Column>

        <Column field="user_name" header="관리자명" headerClass="manager-header" bodyClass="manager-body" style="width: 100px" />

        <Column header="아이디" headerClass="manager-header" bodyClass="manager-body" style="width: 150px">
          <template #body="{ data }">
            {{ data.id }}
          </template>
        </Column>
        <Column header="기관명" field="center_name" headerClass="manager-header" sortable style="width: 200px">
          <template #body="{ data }">
            {{ data.center_name ?? '-' }}
          </template>
        </Column>

        <Column header="연락처" headerClass="manager-header" bodyClass="manager-body" style="width: 100px">
          <template #body="{ data }">
            {{ data.phone ?? '-' }}
          </template>
        </Column>

        <Column header="이메일" headerClass="manager-header" bodyClass="manager-body" style="width: 200px">
          <template #body="{ data }">
            {{ data.email ?? '-' }}
          </template>
        </Column>

        <Column header="가입일" headerClass="manager-header" bodyClass="manager-body" style="width: 100px">
          <template #body="{ data }">
            {{ formatDate(data.created_date) }}
          </template>
        </Column>

        <Column header="회원 상태" headerClass="manager-header" bodyClass="manager-body" style="width: 80px">
          <template #body="{ data }">
            <Tag :value="statusMap[data.status]?.label ?? '알 수 없음'" :severity="statusMap[data.status]?.severity ?? 'secondary'" rounded class="status-tag" />
          </template>
        </Column>

        <Column header="수정" headerClass="manager-header" bodyClass="manager-body" style="width: 80px">
          <template #body="{ data }">
            <i class="pi pi-pen-to-square edit-icon" @click="console.log('edit:', data)" />
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
:deep(.manager-header .p-datatable-column-header-content) {
  justify-content: center;
}

:deep(.manager-body) {
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
