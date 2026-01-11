<!-- 지원결과서 입력 창입니다.-->

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import { useResultStore } from '@/stores/result'; // pinia작업을 위함
import { usePlanStore } from '@/stores/plan';

const pStore = usePlanStore();
const rStore = useResultStore(); //pinia작업 위함
const router = useRouter();
const route = useRoute(); // 현재 경로 확인용

// 로컬호스트에서 회원 정보 가져오기
const user = JSON.parse(localStorage.getItem('users')).user[0];
// 지원신청서 번호 가져오기
const applicationNo = route.params.application_no;

const resultAuthor = ref(user.u_name);
const title = ref('');
const startDate = ref(null);
const endDate = ref(null);
const content = ref('');


const plan = ref([]);
const selectedPlanValue = ref(null);
const planFilteredValue = ref([]);

const submitResult = async () => {
  const data = {
    plan_no: selectedPlanValue.value.plan_no,
    author_no: user.user_no,
    author: user.u_name,
    title: title.value,
    content: content.value,
    startDate: startDate.value,
    endDate: endDate.value
  };
  const result = await rStore.createResult(data);
  if (result.status == 'success') {
    router.push({ path: `/application/pendingResult/${applicationNo}` })
  }
};

onMounted(async () => {
  plan.value = await pStore.fetchPlanList(applicationNo);
});

const searchPlan = (event) => {
  if (!event.query.trim().length) {
    planFilteredValue.value = [...plan.value];
  } else {
    planFilteredValue.value = plan.value.filter((p) => p.name.toLowerCase().startsWith(event.query.toLowerCase()));
  }
};

watch(selectedPlanValue, (val) => {
  startDate.value = new Date(val.start);
  endDate.value = new Date(val.end);
});
</script>

<template>
  <div class="flex w-full">
    <div class="card flex flex-col w-full h-175">
      <div class="text-2xl font-bold text-center">지원결과서 작성</div>
      <!-- 작성자 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="name">작성자</label>
        <InputText v-model="resultAuthor" id="name" type="text" placeholder="작성자" />
      </div>

      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <AutoComplete v-model="selectedPlanValue" :suggestions="planFilteredValue" optionLabel="title" placeholder="지원계획서 선택" dropdown completeOnFocus @complete="searchPlan" />
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

      <div class="col-span-full lg:col-span-6 mb-2.5">
        <!-- <div class="font-semibold text-xl mt-3">첨부파일</div> 
        <FileUpload name="demo[]" @uploader="Upload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload chooseLabel="파일 선택" uploadLabel="업로드" cancelLabel="취소" /> -->

        <div class="flex flex-wrap gap-2 justify-center mt-5">
          <Button label="승인신청" style="width: auto" @click="submitResult" />
        </div>
      </div>
    </div>
    <Toast />
  </div>
</template>
