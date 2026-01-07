<!-- 지원계획서 입력 창입니다 -->

<script setup>
import { ref, computed, watch } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import axios from 'axios';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue'; //입력 메세지 뜨게 하기 위함

const store = usePlanStore(); //pinia작업 위함
const router = useRouter(); // 페이지 이동용
const route = useRoute(); // 현재 경로 확인용
const displayConfirmation = ref(false);
const application_no = Number(route.params.application_no);

const planAuthor = ref('');
const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');

//목록으로 이동
const goToPendingPlanDetail = () => {
  router.push({
    name: 'pendingplanDetail',
    params: {
      application_no: application_no
    }
  });
};

const Upload = (event) => {
  // event.files 에서 선택된 파일 확인 가능
  console.log('파일 업로드 이벤트 발생', event);
};

const submitPlan = async () => {
  //axios 작업하기
  if (!planAuthor.value) {
    alert('작성자를 입력해주세요.');
    return;
  }
  //넘길 값들
  const data = {
    title: title.value,
    content: content.value,
    plan_author: planAuthor.value,
    status: 0, // 승인대기로 먼저 가야함 /0대기/1승인/2반려
    application_no: 14, //지원신청서 14번으로 테스트 중
    // application_no: Number(application_no),
    start: startDate.value,
    end: endDate.value
  };

  try {
    //axios try catch로 감싸야 오류를 확인할 수 있음
    await axios.post('/api/plan', data); //api주소 맞음
    alert('승인 신청되었습니다');
  } catch (e) {
    console.error(e);
    alert('승인 신청에 실패하였습니다');
  }
};
</script>

<!--------------------------------------------------------------------------->
<template>
  <div class="flex">
    <div class="card flex flex-col w-full">
      <!----------------------------------------------->
      <div class="text-2xl font-bold text-center">지원계획서 작성</div>

      <!-------------------------------------------------------------------------------------------->
      <!-- 작성자 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="name">작성자</label>
        <InputText v-model="planAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
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
        <Textarea v-model="content" placeholder="결과에 맞는 구체적인 지원 내용을 적어주세요." :autoResize="true" rows="9" cols="30" />
      </div>

      <!-- 첨부파일 -->
      <div class="col-span-full lg:col-span-6 mb-2.5">
        <div class="font-semibold text-xl mt-3">첨부파일</div>
        <Toast />
        <FileUpload name="demo[]" @uploader="Upload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload chooseLabel="파일 선택" uploadLabel="업로드" cancelLabel="취소" />

        <!-- 등록, 목록 버튼 -->
        <div class="flex flex-wrap gap-2 justify-center mt-5">
          <Button label="승인신청" style="width: auto" @click="submitPlan" />
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
          <Button label="목록" severity="danger" icon="pi pi-list" @click="goToPendingPlanDetail" />
        </div>
      </div>
    </div>
  </div>
</template>
