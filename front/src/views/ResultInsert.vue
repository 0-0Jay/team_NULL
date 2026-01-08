<!-- 지원결과서 입력 창입니다.-->

<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import { useResultStore } from '@/stores/result'; // pinia작업을 위함
import axios from 'axios';

const store = useResultStore(); //pinia작업 위함
const router = useRouter();
const route = useRoute(); // 현재 경로 확인용

const displayConfirmation = ref(false);
const plan_no = Number(route.params.plan_no);

const Upload = (event) => {
  // event.files 등에서 파일 처리 가능
  console.log('파일 업로드 이벤트', event);
};

// 상위 TAB 클릭하면 클릭 된 것 유지하기 위함
const activeTab = ref('0');

const resultAuthor = ref('');
const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');

//목록 으로 이동
const goToPendingRestulDetail = () => {
  router.push({
    name: 'pendingresultDetail',
    params: {
      plan_no: plan_no
    }
  });
};

const submitResult = async () => {
  //axios 작업하기
  if (!resultAuthor.value) {
    alert('작성자를 입력해주세요.');
    return;
  }

  //넘길 값들
  const data = {
    title: title.value,
    content: content.value,
    result_author: resultAuthor.value,
    status: 0, //대기중 으로 값을 넘김
    plan_no: 10, //지원계획서 10번으로 테스트 중임
    // plan_no: Number(plan_no),
    start: startDate.value,
    end: endDate.value
  };

  console.log(data);
  try {
    await axios.post('/api/result', data);
    alert('승인 신청되었습니다');
  } catch (e) {
    console.error(e);
    alert('승인 신청에 실패하였습니다.');
  }
};
</script>

<template>
  <div class="flex">
    <div class="card flex flex-col w-full h-175">
      <!----------------------------------------------->
      <div class="text-2xl font-bold text-center">지원결과서 작성</div>

      <!-------------------------------------------------------------------------------------------->
      <!-- 작성자 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="name">작성자</label>
        <InputText v-model="resultAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
      </div>

      <!-- 목표 -->
      <div class="flex flex-wrap gap-6 mb-6 font-semibold">
        <div class="flex flex-col gap-2 flex-1 pt-2">
          <label for="title">결과</label>
          <InputText v-model="title" placeholder="지원결과를 입력하세요." id="title" type="text" />
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
          <Button label="승인신청" style="width: auto" @click="submitResult" />
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
          <Button label="목록" severity="danger" @click="goToPendingRestulDetail" />
        </div>
      </div>
    </div>
  </div>
</template>
