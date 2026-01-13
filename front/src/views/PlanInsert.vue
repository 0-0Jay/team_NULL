<!-- 지원계획서 입력 창입니다 -->
<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import { useToast } from 'primevue/usetoast';
// import ConfirmDialog from '@/components/ConfirmDialog.vue'; //입력 메세지 뜨게 하기 위함

const store = usePlanStore(); //pinia작업 위함
const router = useRouter(); // 페이지 이동용
const route = useRoute(); // 현재 경로 확인용
const toast = useToast();

// 로컬호스트에서 회원 정보 가져오기
const user = JSON.parse(localStorage.getItem('users')).user[0];
// 지원신청서 번호 가져오기
const applicationNo = route.params.application_no;

const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');

const errorMessage = ref('');

const submitPlan = async () => {
  errorMessage.value = '';

  if (!title.value.trim()) {
    errorMessage.value = '목표를 입력해주세요.';
    return;
  }
  if (!content.value.trim()) {
    errorMessage.value = '내용을 입력해주세요.';
    return;
  }
  if (!startDate.value) {
    errorMessage.value = '지원시작일을 선택해주세요.';
    return;
  }
  if (!endDate.value) {
    errorMessage.value = '지원종료일을 선택해주세요.';
    return;
  }
  if (new Date(startDate.value) > new Date(endDate.value)) {
    errorMessage.value = '지원종료일은 시작일 이후여야 합니다.';
    return;
  }

  //전송할 데이터
  const data = {
    title: title.value,
    content: content.value,
    plan_author: user.u_name,
    author_no: user.user_no,
    application_no: applicationNo,
    start: startDate.value,
    end: endDate.value
  };

  if (!applicationNo) {
    toast.add({
      severity: 'warn',
      summary: '신청서 여부',
      detail: '신청서가 존재하지 않습니다.',
      closable: false,
      life: 2000
    });
    return;
  }

  try {
    await store.createPlan(data);
    toast.add({
      severity: 'success',
      summary: '승인 신청 완료',
      detail: '승인 신청이 완료되었습니다.',
      closable: false,
      life: 2000
    });

    router.push(`/application/pendingPlanDetail/${applicationNo}`);
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '승인 신청 실패',
      detail: '승인 신청을 실패하였습니다.',
      closable: false,
      life: 2000
    });
    console.error(err);
  }
};
</script>

<template>
  <div class="flex">
    <div class="card flex flex-col w-full h-175">
      <div class="text-2xl font-bold text-center mb-10">지원계획서 작성</div>

      <!-- 작성자 -->
      <div class="flex flex-col gap-1 mb-6">
        <span class="text-sm text-gray-500">작성자</span>
        <span class="font-semibold text-lg">{{ user.u_name }}</span>
      </div>

      <!-- 목표 -->
      <div class="flex flex-wrap gap-6 mb-6 font-semibold">
        <div class="flex flex-col gap-2 flex-1 pt-2">
          <label for="title">목표</label>
          <InputText v-model="title" placeholder="지원계획의 목표를 입력하세요." id="title" type="text" />
        </div>

        <!-- 시작/종료일 -->
        <div class="flex flex-col gap-2">
          <div class="font-semibold text-xl">지원시작일</div>
          <DatePicker :showIcon="true" :showButtonBar="true" v-model="startDate" />
        </div>

        <div class="flex flex-col gap-2">
          <div class="font-semibold text-xl">지원종료일</div>
          <DatePicker :showIcon="true" :showButtonBar="true" v-model="endDate" />
        </div>
      </div>

      <!-- 내용 -->
      <div class="flex flex-col gap-2 font-semibold">
        <label for="content">내용</label>
        <Textarea v-model="content" placeholder="지원 계획에 대한 구체적인 내용을 적어주세요." :autoResize="true" rows="9" cols="30" />
      </div>

      <!-- 첨부파일
      <div class="col-span-full lg:col-span-6 mb-2.5">
        <div class="font-semibold text-xl mt-3">첨부파일</div>
        <Toast />
        <FileUpload name="demo[]" @uploader="Upload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload chooseLabel="파일 선택" uploadLabel="업로드" cancelLabel="취소" /> -->

      <div v-if="errorMessage" class="text-red-500 text-center mt-2">
        {{ errorMessage }}
      </div>

      <!-- 승인 신청 버튼 -->
      <div class="flex flex-wrap gap-2 justify-center mt-5">
        <Button label="승인신청" style="width: auto" @click="submitPlan" />
      </div>
    </div>
  </div>
</template>
