<!-- 지원계획서 입력 창입니다 (12.28기준 작성중) -->

<script setup>
//12.30 작업
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRouter } from 'vue-router'; //페이지 이동을 위함

const store = usePlanStore(); //pinia작업 위함
const router = useRouter();
const filterplan = computed(() => usePlanStore.planlist); // 화면에 보여질 테이터
const rowNumber = (index) => index+1;

onBeforeMount(() => {
  store.fetchPlan(); //plan인지 planDetail인지 잘 모르겠음
});



</script>

<!--------------------------------------------------------------------------->
<template>
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
      <TabPanel value="0"> 지원신청서 화면 출력돼야함 </TabPanel>

      <!-- 지원계획서 -->
      <TabPanel value="1">
        <!-- 지원계획서 세부 탭 -->
        <Tabs value="1-0">
          <TabList>
            <Tab value="1-0">지원계획서 조회</Tab>
            <Tab value="1-1">승인대기 조회</Tab>
            <Tab value="1-2">반려내역 조회</Tab>
            <Tab value="1-3">지원계획서 작성</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="1-0"> 지원계획서 조회 화면 출력 돼야함 </TabPanel>
            <TabPanel value="1-1"> 승인대기 화면 출력 돼야함</TabPanel>
            <TabPanel value="1-2"> 반려내역 조회 화면 출력 돼야함 </TabPanel>
            <TabPanel value="1-3"> 지원계획서 작성 화면 출력 돼야함 </TabPanel>
          </TabPanels>
        </Tabs>
      </TabPanel>

      <!--지원결과서-->
      <TabPanel value="2">
        <!-- 지원결과서 세부 탭 -->
        <Tabs value="2-0">
          <TabList>
            <Tab value="2-0">지원결과서 조회</Tab>
            <Tab value="2-1">승인대기 조회</Tab>
            <Tab value="2-2">반려내역 조회</Tab>
            <Tab value="2-3">지원결과서 작성</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="2-0"> 지원결과서 조회 화면 출력 돼야함 </TabPanel>
            <TabPanel value="2-1"> 승인대기 화면 출력 돼야함</TabPanel>
            <TabPanel value="2-2"> 반려내역 조회 화면 출력 돼야함 </TabPanel>
            <TabPanel value="2-3"> 지원결과서 작성 화면 출력 돼야함 </TabPanel>
          </TabPanels>
        </Tabs>
      </TabPanel>

      <!--상담내역-->
      <TabPanel value="3">
        <!-- 상담내역 세부 탭 -->
        <Tabs value="3-0">
          <TabList>
            <Tab value="3-0">상담내역 조회</Tab>
            <Tab value="3-1">상담내역 작성</Tab>
          </TabList>

          <TabPanels>
            <TabPanel value="3-0"> 상담내역 조회 화면 출력 돼야함 </TabPanel>
            <TabPanel value="3-1"> 상담내역 화면 출력 돼야함</TabPanel>
          </TabPanels>
        </Tabs>
      </TabPanel>

      <!--캘린더-->
      <TabPanel value="4"> 캘린더 화면 출력돼야함 </TabPanel>
    </TabPanels>
  </Tabs>

  <!----------------------------------------------------------->
  <div class="card flex flex-col">
    <div class="font-bold text-2xl text-center mb-4">지원계획서 조회</div>
    <DataTable :value="filterplan" :sortOrder="1" :rowHover="true" showGridlines>
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

      <Column field="applicationNo" header="신청서 번호" headerClass="center-header" sortable style="width: 200px" />
      <!--정렬의 기준이 됨-->

      <Column header="목표" headerClass="center-header" bodyClass="center-body" style="width: 200px">
        <template #body="{ data }">
          {{ data.title ?? '-' }}
        </template>
      </Column>

      <Column header="시작날짜" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ data.start_date }}
        </template>
      </Column>

      <Column header="종료날짜" headerClass="center-header" bodyClass="center-body" style="width: 130px">
        <template #body="{ data }">
          {{ data.end_date }}
        </template>
      </Column>

      <Column header="지원내용" headerClass="center-header" bodyClass="center-body" style="width: 130px">
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
