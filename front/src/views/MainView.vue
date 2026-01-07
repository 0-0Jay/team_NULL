<script setup>
import { useApplicationStore } from '@/stores/application';
import { onBeforeMount, ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

const store = useApplicationStore();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];
const router = useRouter();

// 페이지네이션
const page = ref(1);
const rows = ref(13);

// 페이지 이동 함수
const goPage = (name, params = {}) => {
  router.push({ name, params });
};

// 상세 검색
const initSearchFields = {
  startDate: null,
  endDate: null,

  apName: '',
  mName: '', // 담당자
  gName: '', // 보호자
  cName: '', // 기관

  stage: '전체', // 전체 or 검토중 or 계획 or 중점 or 긴급

  progress: {
    review: false, // 검토
    approve: false, // 승인
    reject: false, // 반려
    result: false // 결과
  }
};

const searchFields = ref({ ...initSearchFields });

const resetSearch = () => {
  searchFields.value = {
    ...initSearchFields,
    progress: { ...initSearchFields.progress }
  };
};

watch(
  searchFields,
  () => {
    page.value = 1;
  },
  { deep: true }
);

onBeforeMount(() => {
  store.fetchApplication();
});

const filteredData = computed(() => {
  const f = searchFields.value;

  return columnData.value.filter((row) => {
    // 작성일
    const createdTime = new Date(row.created_date).getTime();
    const start = f.startDate?.getTime();
    const end = f.endDate?.getTime();

    if (start && end && (createdTime < start || createdTime > end)) {
      return false;
    }

    // console.log(row);
    if (f.apName && !row.ap_name?.includes(f.apName)) return false;
    if (f.mName && !row.manager_name?.includes(f.mName)) return false;
    if (f.gName && !row.g_name?.includes(f.gName)) return false;
    if (f.cName && !row.c_name?.includes(f.cName)) return false;

    if (f.stage !== '전체' && row.status !== f.stage) return false;

    const p = f.progress;
    if (p.review && row.review_count === 0) return false;
    if (p.approve && row.approve_count === 0) return false;
    if (p.reject && row.reject_count === 0) return false;
    if (p.result && row.result_count === 0) return false;

    return true;
  });
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
};

// 신청내역 관련
const getStatus = (row) => {
  if (!row.approve_date) return '검토중';

  switch (row.status) {
    case 1:
      return '계획';
    case 2:
      return '중점';
    case 3:
      return '긴급';
    default:
      return '-';
  }
};

const toNumber = (v) => Number(v) || 0;

const columnData = computed(() => {
  const managers = new Map(store.manager.map((m) => [m.application_no, m.m_name]));
  const plans = new Map(store.planStat.map((p) => [p.application_no, p]));
  const results = new Map(store.resultStat.map((r) => [r.application_no, r]));
  const counsels = new Map(store.counselStat.map((c) => [c.application_no, c.counsel_count]));

  return store.appList.map((row) => {
    const plan = plans.get(row.application_no) || {};
    const result = results.get(row.application_no) || {};
    const counselCount = counsels.get(row.application_no) || 0;

    // application 승인
    let appReview = 0;
    let appApprove = 0;

    if (row.approve_date) {
      appApprove = 1;
    } else {
      appReview = 1;
    }

    return {
      ...row,
      status: getStatus(row),
      manager_name: managers.get(row.application_no) || '미지정',
      review_count: toNumber(appReview) + toNumber(plan.review_count) + toNumber(result.review_count),
      approve_count: toNumber(appApprove) + toNumber(plan.approve_count) + toNumber(result.approve_count),
      reject_count: toNumber(plan.reject_count) + toNumber(result.reject_count),
      result_count: toNumber(result.result_count),
      plan_count: toNumber(plan.plan_count),
      counsel_count: toNumber(counselCount)
    };
  });
});
</script>

<template>
  <div class="flex gap-6 p-6 pt-25 h-screen overflow-hidden">
    <!-- 검색 -->
    <aside class="w-[260px] bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200 overflow-y-auto">
      <div class="flex items-start justify-between mb-3">
        <h3 class="font-bold text-gray-700">상세 검색</h3>
        <Button label="초기화" class="mt-2" icon="pi pi-refresh" size="small" severity="secondary" outlined @click="resetSearch" />
      </div>

      <div class="mb-4">
        <p class="text-gray-500 mb-1">작성일</p>
        <DatePicker v-model="searchFields.startDate" dateFormat="yy.mm.dd" placeholder="시작일" class="mb-2" />
        <DatePicker v-model="searchFields.endDate" dateFormat="yy.mm.dd" placeholder="종료일" />
      </div>

      <div class="mb-3">
        <p class="text-gray-500 mb-1">지원자명</p>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search text-gray-400" />
          <InputText v-model="searchFields.apName" class="w-full" />
        </IconField>
      </div>

      <div class="mb-3">
        <p class="text-gray-500 mb-1">담당자명</p>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search text-gray-400" />
          <InputText v-model="searchFields.mName" class="w-full" />
        </IconField>
      </div>

      <div v-if="user.type !== 0" class="mb-3">
        <p class="text-gray-500 mb-1">보호자명</p>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search text-gray-400" />
          <InputText v-model="searchFields.gName" class="w-full" />
        </IconField>
      </div>

      <div v-if="user.type === 3" class="mb-4">
        <p class="text-gray-500 mb-1">기관명</p>
        <IconField iconPosition="left">
          <InputIcon class="pi pi-search text-gray-400" />
          <InputText v-model="searchFields.cName" class="w-full" />
        </IconField>
      </div>

      <div class="mb-4">
        <p class="text-gray-500 mb-2">대기단계</p>
        <div class="flex flex-wrap gap-4">
          <Button v-for="s in ['전체', '검토중', '계획', '중점', '긴급']" :key="s" size="small" :severity="searchFields.stage === s ? 'success' : 'secondary'" @click="searchFields.stage = s">
            {{ s }}
          </Button>
        </div>
      </div>

      <div>
        <p class="text-gray-500 mb-2">계획 / 결과 진행</p>
        <div class="flex flex-wrap gap-x-2 gap-y-2">
          <label class="flex items-center gap-1">
            <Checkbox v-model="searchFields.progress.review" binary />
            <span>검토</span>
          </label>
          <label class="flex items-center gap-1">
            <Checkbox v-model="searchFields.progress.approve" binary />
            <span>승인</span>
          </label>
          <label class="flex items-center gap-1">
            <Checkbox v-model="searchFields.progress.reject" binary />
            <span>반려</span>
          </label>
          <label class="flex items-center gap-1">
            <Checkbox v-model="searchFields.progress.result" binary />
            <span>결과</span>
          </label>
        </div>
      </div>
    </aside>

    <!-- 메인 -->
    <section class="flex-1 bg-white px-6 pt-15 pb-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
      <div class="flex justify-between items-center mb-5">
        <h2 class="text-xl font-bold text-gray-800">지원신청내역</h2>

        <Button v-if="user.type === 0 || user.type === 1" label="지원 신청" icon="pi pi-clipboard" severity="info" as="router-link" to="/application/write" />
      </div>

      <div class="flex-1 overflow-auto rounded-lg border border-gray-200">
        <DataTable :value="filteredData" :paginator="true" :rows="rows" :rowHover="true" showGridlines tableLayout="fixed" @page="onPageChange">
          <template #empty>
            <div class="text-center py-6 text-gray-400">데이터 없음</div>
          </template>

          <Column header="번호" headerClass="table-header" bodyClass="table-body" style="width: 60px; min-width: 60px; max-width: 60px">
            <template #body="{ index }">
              {{ rowNumber(index) }}
            </template>
          </Column>

          <Column header="지원자명" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }">
              {{ data.ap_name }}
            </template>
          </Column>

          <Column v-if="user.type != 0" header="보호자명" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }">
              {{ data.g_name }}
            </template>
          </Column>

          <Column header="지원신청일" headerClass="table-header" bodyClass="table-body" style="width: 100px; min-width: 100px; max-width: 100px">
            <template #body="{ data }">
              {{ formatDate(data.created_date) }}
            </template>
          </Column>

          <Column header="지원신청서" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 90px; max-width: 90px">
            <template #body="{ data }"><Button size="small" label="보기" /></template>
          </Column>

          <Column header="담당자" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }">
              {{ data.manager_name }}
            </template>
          </Column>

          <Column v-if="user.type === 3" header="기관" headerClass="table-header" bodyClass="table-body" style="width: 120px; min-width: 120px; max-width: 120px">
            <template #body="{ data }">
              {{ data.c_name || '-' }}
            </template>
          </Column>

          <Column header="대기단계" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }">
              <Tag
                :value="data.status"
                :severity="
                  {
                    검토중: 'secondary',
                    계획: 'info',
                    중점: 'warning',
                    긴급: 'danger'
                  }[data.status]
                "
                rounded
              />
            </template>
          </Column>

          <Column header="계획/결과 진행" headerClass="table-header" bodyClass="table-body" style="width: 100px; min-width: 100px; max-width: 140px">
            <template #body="{ data }">
              <div class="leading-tight">
                <ul class="grid gap-2">
                  <li>
                    검토 <span class="ml-4">{{ data.review_count }}</span>
                  </li>
                  <li>
                    승인 <span class="text-green-600 ml-4">{{ data.approve_count }}</span>
                  </li>
                  <li>
                    반려 <span class="text-red-500 ml-4">{{ data.reject_count }}</span>
                  </li>
                  <li>
                    결과 <span class="text-blue-600 ml-4">{{ data.result_count }}</span>
                  </li>
                </ul>
              </div>
            </template>
          </Column>
          <Column v-if="user.type != 0" header="상담내역" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }"><Button size="small" label="보기" :disabled="user.type === 0 || data.counsel_count === 0" @click="goPage('counselDetail', { application_no: data.application_no })" /></template>
          </Column>
          <Column header="지원계획" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }"><Button size="small" label="보기" :disabled="data.plan_count === 0" @click="goPage('planDetail', { application_no: data.application_no })" /></template>
            <!-- data.counsel_count === 0 || -->
          </Column>

          <Column header="지원결과" headerClass="table-header" bodyClass="table-body" style="width: 80px; min-width: 80px; max-width: 80px">
            <template #body="{ data }"><Button size="small" label="보기" :disabled="data.result_count === 0" @click="goPage('resultDetail', { plan_no: data.plan_no })" /></template>
            <!-- data.counsel_count === 0 || data.plan_count === 0 ||  -->
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
