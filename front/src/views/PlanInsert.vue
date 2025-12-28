<!-- 지원계획서 입력 창입니다 (12.28기준 작성중) -->

<script setup>
//11.28 작업
import { ref } from 'vue';
import { useRouter } from 'vue-router';  // 
import axios from 'axios';

const router = useRouter(); 

const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');
const plan_author = ref('');

const displayConfirmation = ref(false);
const openConfirmation = () => (displayConfirmation.value = true);
const closeConfirmation = () => (displayConfirmation.value = false);

const submitPlan = async () => { // 여기 수정 해야함
  console.log(title.value, content.value, plan_author.value);
  const data = {
    title: title.value,
    content: content.value,
    author: plan_author.value,

  };

  await axios.post('/api/plan', data);
};

try {
    const res = await axios.post('/api/plan', formData);
    console.log('저장 성공', res.data);

    router.push(`/plan/detail/${res.data.application_no}`); //작성후 세부 목록으로 이동?
  } catch (err) {
    console.error('저장실패', err);
  };

</script>

<template>
  <!--상단 지원신청서, 계획서, 결과서 상담내역, 결과서 선택창-->

  <!---------------------------------------------------------->
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
  <div class="flex mt-8">
    <div class="card flex flex-col gap-4 w-full">
      <!----------------------------------------------->
      <div class="card">
        <div class="card flex flex-col gap-4">
          <div class="font-bold text-2xl text-center">지원계획서 작성</div>
          <div class="flex flex-col grow basis-0 gap-2">
            <label for="name">작성자</label>
            <InputText v-model="plan_author" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
          </div> <!--데이터 를 작성해서 넘길려고 v-model 사용함 -->

          <div class="flex flex-col gap-2">
            <label for="title">목표</label>
            <InputText v-model="title" placeholder="지원계획 목표를 입력하세요." id="title" type="text" />
          </div>

          <div class="flex gap-8 items-start">
            <!--시작일-->
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-xl">지원시작일</div>
              <DatePicker :showIcon="true" :showButtonBar="true" v-model="startDate"></DatePicker>
            </div>

            <!--종료일-->
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-xl">지원종료일</div>
              <DatePicker :showIcon="true" :showButtonBar="true" v-model="endDate"></DatePicker>
            </div>
          </div>

          <!--지원내용 작성란-->
          <div class="flex flex-col gap-2">
            <label for="content">지원내용</label>
            <Textarea v-model="content" placeholder="결과에 맞는 구체적인 지원 내용을 적어주세요." :autoResize="true" rows="3" cols="30" />
          </div>

          <!--첨부파일 삽입-->
          <label for="file">첨부파일</label>
          <input type="file" @change="onFilechange" />

          <!--등록, 목록 버튼-->
          <div class="flex flex-wrap gap-2 justify-center">
            <Button label="등록" style="width: auto" @click="openConfirmation" />
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
