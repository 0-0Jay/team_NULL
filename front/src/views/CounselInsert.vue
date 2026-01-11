<!-- 상담내역 작성-->

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCounselStore } from '@/stores/counsel';
import { ref } from 'vue';


const route = useRoute();
const router = useRouter();
const store = useCounselStore();

const user = JSON.parse(localStorage.getItem('users')).user[0];
const applicationNo = route.params.application_no;

const title = ref('');
const content = ref('');
const counselDate = ref(null);
const counselAuthor = ref('');

const submitCounsel = async () => {
  const data = {
    application_no: applicationNo,
    title: title.value,
    content: content.value,
    save: 1,
    counsel_date: counselDate.value,
    counsel_author: user.u_name
  };

  const res = await store.createCounsel(data);

  if (res.status === 'success') {
    router.push({
      name: 'counselDetail',
      params: { application_no: applicationNo }
    });
  }
};


</script>

<template>
  <div class="flex">
    <div class="card flex flex-col w-full h-175">
      <!----------------------------------------------->
      <div class="text-2xl font-bold text-center">상담내역 작성</div>

      <!-------------------------------------------------------------------------------------------->
      <div class="flex flex-wrap gap-6 font-semibold">
        <!-- 작성자 -->
        <div class="flex flex-col gap-2 flex-1 pt-2">
          <label for="name">작성자</label>
          <InputText v-model="counselAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
        </div>

        <!-- 상담일 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <div class="font-semibold text-xl">상담일</div>
          <DatePicker :showIcon="true" :showButtonBar="true" v-model="counselDate" />
        </div>
      </div>

      <!-- 상담 제목 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="title">제목</label>
        <InputText v-model="title" placeholder="상담 제목을 입력하세요." id="title" type="text" />
      </div>

      <!-- 상담내용 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="content">상담내용</label>
        <Textarea v-model="content" placeholder="구체적인 상담 내용을 적어주세요." :autoResize="true" rows="9" cols="30" />
      </div>
      
      <!-- 등록, 목록 버튼 -->
      <div class="flex flex-wrap gap-2 justify-center">
        <Button label="등록" style="width: auto" @click="submitCounsel" />
      </div>

      <div v-if="route.name == 'counsel'" >
        작성된 상담내역이 없습니다".
      </div>

    </div>
  </div>
</template>

