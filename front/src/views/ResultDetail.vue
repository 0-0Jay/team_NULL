<!-- 지원결과서 조회창 -->

<script setup>
import { useResultStore } from '@/stores/result'; // pinia작업을 위함
import { onBeforeMount, computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함

const store = useResultStore(); //pinia작업 위함
const router = useRouter();
const route = useRoute();

// 상위 TAB 클릭하면 클릭 된 것 유지하기 위함
const activeTab = ref('0');

watch(
  () => route.path,
  (newPath) => {
    if (newPath?.startsWith('/plan')) activeTab.value = '1';
    else if (newPath?.startsWith('/result')) activeTab.value = '2';
    else if (newPath?.startsWith('/counsel')) activeTab.value = '3';
    else if (newPath?.startsWith('/calendar')) activeTab.value = '4';
    else activeTab.value = '0';
  },
  { immediate: true }
);

// 지원 계획서 하위 TAB
const planSubTab = ref('1-0');
watch(
  () => route.path,
  (path) => {
    path = path || '';
    if (path.includes('insert')) planSubTab.value = '1-3';
    else if (path.includes('reject')) planSubTab.value = '1-2';
    else if (path.includes('pending')) planSubTab.value = '1-1';
    else planSubTab.value = '1-0';
  },
  { immediate: true }
);

// 지원 결과서 하위 TAB
const resultSubTab = ref('2-0');
watch(
  () => route.path,
  (path) => {
    path = path || '';
    if (path.includes('insert')) resultSubTab.value = '2-3';
    else if (path.includes('reject')) resultSubTab.value = '2-2';
    else if (path.includes('pending')) resultSubTab.value = '2-1';
    else resultSubTab.value = '2-0';
  },
  { immediate: true }
);

// 상담내역 하위 TAB
const counselSubTab = ref('3-0');
watch(
  () => route.path,
  (path) => {
    path = path || '';
    counselSubTab.value = path.includes('insert') ? '3-1' : '3-0';
  },
  { immediate: true }
);

const filterresult = computed(() => store.resultList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

// onBeforeMount(() => {
//   store.fetchResultList(plan_no, 1); //승인된 결과서
// });

onBeforeMount(() => {
  store.fetchResultList(11, 0); //승인된 계획서 - 일단은 하드코딩으로 테스트 함
});

//날짜 포멧 - 유민님 파일에서 따옴
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
</script>

<template>
  <!--상단 지원신청서, 계획서, 결과서 상담내역, 결과서 선택창-->
  <Tabs v-model:value="activeTab">
    <!--하드 코딩 안하려고 작성함-->
    <!-- 상위 탭 -->
    <TabList>
      <!-- <Tab value="0"><RouterLink to="/apply">지원신청서</RouterLink></Tab> -->
      <Tab value="1"><RouterLink to="/plandetail">지원계획서</RouterLink></Tab>
      <Tab value="2"><RouterLink to="/resultdetail">지원결과서</RouterLink></Tab>
      <Tab value="3"><RouterLink to="/counseldetail">상담내역</RouterLink></Tab>
      <!-- <Tab value="4"><RouterLink to="/calendar">캘린더</RouterLink></Tab> -->
    </TabList>

    <TabPanels>
      <!-- 지원신청서 -->
      <TabPanel value="0"> 지원신청서 화면 출력돼야함(신청서 화면 구축되면 링크 걸어야 함) </TabPanel>

      <!-- 지원계획서 -->
      <TabPanel value="1">
        <!-- 지원계획서 세부 탭 -->
        <Tabs v-model:value="planSubTab">
          <TabList>
            <Tab value="1-0"><RouterLink to="/plandetail">지원계획서 조회(확인)</RouterLink></Tab>
            <Tab value="1-1">승인대기 조회(작업해야함)</Tab>
            <Tab value="1-2">반려내역 조회(작업해야함)</Tab>
            <Tab value="1-3"><RouterLink to="planinsert">지원계획서 작성(확인)</RouterLink></Tab>
          </TabList>
        </Tabs>
      </TabPanel>

      <!--지원결과서-->
      <TabPanel value="2">
        <!-- 지원결과서 세부 탭 -->
        <Tabs v-model:value="resultSubTab">
          <TabList>
            <Tab value="2-0"><RouterLink to="/resultdetail">지원결과서 조회(확인)</RouterLink></Tab>
            <Tab value="2-1">승인대기 조회(작업해야함)</Tab>
            <Tab value="2-2">반려내역 조회(작업해야함)</Tab>
            <Tab value="2-3"><RouterLink to="/resultinsert">지원결과서 작성(확인)</RouterLink></Tab>
          </TabList>
        </Tabs>
      </TabPanel>

      <!--상담내역-->
      <TabPanel value="3">
        <!-- 상담내역 세부 탭 -->
        <Tabs v-model:value="counselSubTab">
          <TabList>
            <Tab value="3-0"><RouterLink to="/counseldetail">상담내역 조회(확인)</RouterLink></Tab>
            <Tab value="3-1"><RouterLink to="/counselinsert">상담내역 작성(확인)</RouterLink></Tab>
          </TabList>
        </Tabs>
      </TabPanel>

      <!--캘린더-->
      <TabPanel value="4"> 캘린더 화면 출력돼야함 (캘린더 화면 구축되면 링크 걸어야 함)</TabPanel>
    </TabPanels>
  </Tabs>

  <!----------------------------------------------------------->
  <div class="card flex flex-col">
    <div class="font-bold text-2xl text-center mb-4">지원결과서 조회</div>
    <DataTable :value="filterresult" :sortOrder="1" :rowHover="true" showGridlines>
      <template #empty>
        <div class="text-center">데이터 없음</div>
      </template>

      <Column selectionMode="multiple" headerStyle="width:48px" />
      <!--삭제 때문에 행 선택 체크박스 필요함-->

      <Column header="번호" headerClass="center-header" bodyClass="center-body" style="width: 80px">
        <template #body="{ index }">
          {{ rowNumber(index) }}
        </template>
      </Column>

      <Column field="planNo" header="계획서 번호" headerClass="center-header" sortable style="width: 200px">
        <template #body="{ data }">
          {{ data.plan_no ?? '-' }}
        </template>
      </Column>
      <!--정렬의 기준이 됨-->

      <Column header="목표" headerClass="center-header" bodyClass="center-body" style="width: 200px">
        <template #body="{ data }">
          {{ data.title ?? '-' }}
        </template>
      </Column>

      <Column header="시작날짜" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ formatDate(data.start) }}
        </template>
      </Column>

      <Column header="종료날짜" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ formatDate(data.end) }}
        </template>
      </Column>

      <Column header="결과내용" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ data.content ?? '-' }}
        </template>
      </Column>

      <Column header="첨부파일" headerClass="center-header" bodyClass="center-body" style="width: 100px"> </Column>
    </DataTable>
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
