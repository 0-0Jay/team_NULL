<!-- 지원계획서 입력 창입니다 -->

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import axios from 'axios';

const store = usePlanStore(); //pinia작업 위함
const router = useRouter(); // 페이지 이동용
const route = useRoute(); // 현재 경로 확인용

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

const planAuthor = ref('');
const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');

const submitPlan = async () => {
  //axios 작업하기
  if (!planAuthor.value) {
    alert('작성자를 입력해주세요.');
    return;
  }
  console.log(title.value, content.value, planAuthor.value, startDate.value, endDate.value);

  //넘길 값들
  const data = {
    title: title.value,
    content: content.value,
    plan_author: planAuthor.value,
    status: 1,
    application_no: 11, //지원신청서 11번으로 테스트 중임
    start: startDate.value,
    end: endDate.value
  };

  // await store.목록창(data);  // 추후에 사용할 예정 - 작성하고 나면 목록으로 이동됨
  // router.push({ name: '목록창 이름'});

  console.log(data); //pinia 감싸야 함
  try {
    //axios try catch로 감싸야 오류를 확인할 수 있음
    await axios.post('/api/plan', data); //api주소 맞음
    alert('저장 됨');
  } catch (e) {
    console.error(e);
    alert('저장 안됨');
  }
};
</script>

<!--------------------------------------------------------------------------->
<template>
  <!--상단 지원신청서, 계획서, 결과서 상담내역, 결과서 선택창-->

  <!----------------------------------------------------------->
  <div class="flex p-40">
    <div class="card flex flex-col w-full">
      <!----------------------------------------------->
      <div class="card">
        <div class="p-30">
          <div class="card flex flex-col gap-4">
            <div class="text-2xl font-bold text-center mb-8">지원계획서 작성</div>
            <Tabs v-model:value="activeTab">
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
          </div>

          <!-------------------------------------------------------------------------------------------->
          <div class="flex flex-col gap-2 mb-6 font-semibold">
            <label for="name">작성자</label>
            <InputText v-model="planAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
          </div>
          <!--데이터 를 작성해서 넘길려고 v-model 사용함 -->

          <div class="flex gap-6 mb-6 font-semibold">
            <div class="flex flex-col gap-2 flex-1">
              <label for="title">목표</label>
              <InputText v-model="title" placeholder="지원계획 목표를 입력하세요." id="title" type="text" />
            </div>

            <div class="flex gap-8 items-start">
              <!--시작일-->
              <div class="flex flex-col gap-2 pl-150">
                <div class="font-semibold text-xl">지원시작일</div>
                <DatePicker :showIcon="true" :showButtonBar="true" v-model="startDate"></DatePicker>
              </div>

              <!--종료일-->
              <div class="flex flex-col gap-2">
                <div class="font-semibold text-xl">지원종료일</div>
                <DatePicker :showIcon="true" :showButtonBar="true" v-model="endDate"></DatePicker>
              </div>
            </div>
          </div>

          <!--지원내용 작성란-->
          <div class="flex flex-col gap-2 font-semibold">
            <label for="content">지원내용</label>
            <Textarea v-model="content" placeholder="결과에 맞는 구체적인 지원 내용을 적어주세요." :autoResize="true" rows="15" cols="30" />
          </div>

          <!--첨부파일 삽입-->
          <label for="file">첨부파일</label>
          <!-- <input type="file" @change="onFilechange" /> -->

          <!--등록, 목록 버튼-->
          <div class="flex flex-wrap gap-2 justify-center">
            <Button label="승인요청" style="width: auto" @click="submitPlan" />
            <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
              <div class="flex items-center justify-center">
                <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
                <span>Are you sure you want to proceed?</span>
              </div>
              <template #footer>
                <Button label="Yes" icon="pi pi-check" @click="submit" severity="danger" outlined autofocus />
                <Button label="No" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
              </template>
            </Dialog>
            <Button label="목록" severity="danger" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.insert-plan {
  display: flex;
  align-items: center;
}
</style>
