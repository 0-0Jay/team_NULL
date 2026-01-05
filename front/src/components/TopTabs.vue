<!-- 지원계획서/신청서 관련 탭 부분입니다 -->

<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const activeTab = ref('1'); //초기값이 지원계획서 탭임

watch(
  () => route.path,
  (Path) => {
    if (Path?.startsWith('/plan')) activeTab.value = '1';
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
</template>
