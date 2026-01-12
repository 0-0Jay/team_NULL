<!-- 상담내역 작성-->

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useCounselStore } from '@/stores/counsel';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';

const route = useRoute();
const router = useRouter();
const store = useCounselStore();

const user = JSON.parse(localStorage.getItem('users')).user[0];
const applicationNo = route.params.application_no;
const toast = useToast();
const errorMessage = ref('');

const title = ref('');
const content = ref('');
const counselDate = ref(null);
const counselAuthor = ref('');

const createCounsel = async () => {
  errorMessage.value = '';

  if (!title.value.trim()) {
    errorMessage.value = '제목을 입력해주세요.';
    return;
  }

  if (!content.value.trim()) {
    errorMessage.value = '내용을 입력해주세요.';
    return;
  }
  if (!counselDate.value) {
    errorMessage.value = '상담일을 선택해주세요.';
    return;
  }

  const data = {
    application_no: applicationNo,
    title: title.value,
    content: content.value,
    save: 1,
    counsel_date: counselDate.value,
    counsel_author: user.u_name
  };

  try {
    await store.createCounsel(data);
    toast.add({
      severity: 'success',
      summary: '상담내역 작성 완료',
      detail: '상담 내역이 완료되었습니다.',
      closable: false,
      life: 2000
    });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '상담내역 작성 실패',
      detail: '상담내역 작성을 실패하였습니다.',
      closable: false,
      life: 2000
    });
    console.error(err);
  }
  setTimeout(() => {
    // 작성 성공 알림 뜨고 1초뒤 페이지 변경 해 놓음
    router.push(`/application/counselDetail/${applicationNo}`);
  }, 1000);
};
</script>

<template>
  <div class="flex">
    <div class="card flex flex-col w-full h-175">
      <Toast />
      <div class="text-2xl font-bold text-center">상담내역 작성</div>
      <div class="flex flex-wrap gap-6 font-semibold">
        <!-- 작성자 -->
        <div class="flex flex-col gap-1 mb-6">
          <span class="text-sm text-gray-500">작성자</span>
          <span class="font-semibold text-lg">{{ user.u_name }}</span>
        </div>
      </div>

      <!-- 제목 + 상담일 -->
      <div class="flex gap-6 mb-6 font-semibold items-end">
        <!-- 제목 -->
        <div class="flex flex-col gap-2 flex-1">
          <label for="title">제목</label>
          <InputText v-model="title" placeholder="상담 제목을 입력하세요." id="title" type="text" />
        </div>

        <!-- 상담일 -->
        <div class="flex flex-col gap-2">
          <label>상담일</label>
          <DatePicker :showIcon="true" :showButtonBar="true" v-model="counselDate" />
        </div>
      </div>

      <!-- 상담내용 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="content">상담내용</label>
        <Textarea v-model="content" placeholder="구체적인 상담 내용을 적어주세요." :autoResize="true" rows="9" cols="30" />
      </div>

      <div v-if="errorMessage" class="text-red-500 text-center mt-2">
        {{ errorMessage }}
      </div>

      <!-- 등록, 목록 버튼 -->
      <div class="flex flex-wrap gap-2 justify-center">
        <Button label="등록" style="width: auto" @click="createCounsel" />
      </div>

      <div v-if="route.name == 'counsel'">"작성된 상담내역이 없습니다".</div>
    </div>
  </div>
</template>
