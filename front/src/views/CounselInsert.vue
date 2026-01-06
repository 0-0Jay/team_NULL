<!-- 상담내역 작성-->

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const title = ref('');
const content = ref('');
const counselDate = ref(null);
const counselAuthor = ref('');

const submitCounsel = async () => {
  //axios 작업하기
  if (!counselAuthor.value) {
    alert('작성자를 입력해주세요.');
    return;
  }

  //넘길 값들
  const data = {
    application_no: 1,
    title: title.value,
    content: content.value,
    save: 0,
    counsel_date: counselDate.value,
    counsel_author: counselAuthor.value
  };

  // await store.목록창(data);  // 추후에 사용할 예정 - 작성하고 나면 목록으로 이동됨
  // router.push({ name: '목록창 이름'});

  console.log(data);
  try {
    await axios.post('/api/counsel', data);
    alert('저장 됨');
  } catch (e) {
    console.error(e);
    alert('저장 안됨');
  }
};
</script>

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
  <div class="flex mt-8">
    <div class="card flex flex-col gap-4 w-full">
      <!----------------------------------------------->
      <div class="card">
        <div class="card flex flex-col gap-4">
          <div class="font-bold text-2xl text-center">상담내역 작성</div>
          <div class="flex flex-col grow basis-0 gap-2">
            <label for="name">작성자</label>
            <InputText v-model="counselAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
          </div>
          <!--데이터 를 작성해서 넘길려고 v-model 사용함 -->

          <div class="flex flex-col gap-2">
            <label for="title">제목</label>
            <InputText v-model="title" placeholder="상담 제목을 입력하세요." id="title" type="text" />
          </div>

          <div class="flex gap-8 items-start">
            <!--시작일-->
            <div class="flex flex-col gap-2">
              <div class="font-semibold text-xl">상담일</div>
              <DatePicker :showIcon="true" :showButtonBar="true" v-model="counselDate"></DatePicker>
            </div>
          </div>

          <!--지원내용 작성란-->
          <div class="flex flex-col gap-2">
            <label for="content">상담내용</label>
            <Textarea v-model="content" placeholder="구체적인 상담 내용을 적어주세요." :autoResize="true" rows="3" cols="30" />
          </div>

          <!--첨부파일 삽입-->
          <label for="file">첨부파일</label>
          <!-- <input type="file" @change="onFilechange" /> -->

          <!--등록, 목록 버튼-->
          <div class="flex flex-wrap gap-2 justify-center">
            <Button label="등록" style="width: auto" @click="submitCounsel" />
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
