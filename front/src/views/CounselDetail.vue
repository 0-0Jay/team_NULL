<!-- 상담내역 조회창 -->

<script setup>
import { useCounselStore } from '@/stores/counsel';
import { onBeforeMount, computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const store = useCounselStore();
const router = useRouter();

const filtercounsel = computed(() => store.counselList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

// onBeforeMount(() => {
//   store.fetchCounselList(application_no, 0); // 작성된 상담내역 조회
// });

onBeforeMount(() => {
  store.fetchCounselList(1, 0); // (application_no, save) 일단은 하드코딩 테스트함
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

<!--------------------------------------------------------------------------->
<template>
  <!--상단 지원신청서, 계획서, 결과서 상담내역, 결과서 선택창-->
  <!--상단 지원신청서, 계획서, 결과서 상담내역, 결과서 선택창-->
  <Tabs value="0">
    <!-- 상위 탭 -->
    <TabList>
      <Tab value="0">지원신청서</Tab>
      <Tab value="1">지원계획서</Tab>
      <Tab value="2">지원결과서</Tab>
      <Tab value="3">상담내역</Tab>
      <Tab value="4">캘린더</Tab>
    </TabList>

    <TabPanels>
      <!-- 지원신청서 -->
      <TabPanel value="0"> 지원신청서 화면 출력돼야함(신청서 화면 구축되면 링크 걸어야 함) </TabPanel>

      <!-- 지원계획서 -->
      <TabPanel value="1">
        <!-- 지원계획서 세부 탭 -->
        <Tabs value="1-0">
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
        <Tabs value="2-0">
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
        <Tabs value="3-0">
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
    <div class="font-bold text-2xl text-center mb-4">상담내역 조회</div>
    <DataTable :value="filtercounsel" :sortOrder="1" :rowHover="true" showGridlines>
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

      <Column field="applicationNo" header="신청서 번호" headerClass="center-header" sortable style="width: 200px">
        <template #body="{ data }">
          {{ data.application_no ?? '-' }}
        </template>
      </Column>
      <!--정렬의 기준이 됨-->

      <Column header="상담내역 제목" headerClass="center-header" bodyClass="center-body" style="width: 200px">
        <template #body="{ data }">
          {{ data.title ?? '-' }}
        </template>
      </Column>

      <Column header="상담날짜" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ formatDate(data.counsel_date) }}
        </template>
      </Column>

      <Column header="상담내용" headerClass="center-header" bodyClass="center-body" style="width: 130px">
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
