<!-- (작업 덜끝남)기관관리자가 조회하는 지원계획서 승인대기 화면-->

<script setup>
import axios from 'axios';
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함
import Button from 'primevue/button';

const route = useRoute();
const application_no = Number(route.params.application_no);

const store = usePlanStore(); //pinia작업 위함
const filterplan = computed(() => store.planList); // 화면에 보여질 테이터

// onBeforeMount(() => {
//   store.fetchAdminPlanDetail(application_no); //승인된 계획서 - 일단은 하드코딩으로 테스트 함
// });

console.log('현재 경로:', route.path);
console.log('현재 라우트 이름:', route.name);
console.log('URL 파라미터 application_no:', route.params.application_no);

// //승인대기중인 계획서만 화면에 송출
// onBeforeMount(() => {
//   const application_no = Number(route.params.application_no);

//   if (!application_no) {
//     console.error('application_no 없음:', route.params.application_no);
//     return;
//   }
//   store.fetchPendingPlanDetail(Number(route.params.application_no), 0); // 0 대기/ 1승인 /2반려
// });

// pending plan 목록 가져오기
const fetchPendingPlans = async () => {
  try {
    await store.fetchPendingPlanDetail(application_no, 0); // 0 = 대기
  } catch (err) {
    console.error('승인대기 계획서 조회 실패', err);
  }
};

//승인 기능
const approvePlan = async (plan_no) => {
  try {
    await axios.patch(`/api/plan/${plan_no}/status`, { status: 1 }); // 1 = 승인
    alert('승인 완료!');
    // 필요한 경우 상태 갱신
  } catch (err) {
    console.error(err);
    alert('승인 실패');
  }
};

//반려 기능
const rejectPlan = async (plan_no) => {
  try {
    await axios.patch(`/api/plan/${plan_no}/status`, { status: 2 }); // 2 = 반려
    alert('반려 완료!');
  } catch (err) {
    console.error(err);
    alert('반려 실패');
  }
};

//날짜 포멧
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

// 초기 로드
onBeforeMount(() => {
  fetchPendingPlans();
});
</script>

<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <div class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-for="(plan, index) in filterplan" :key="plan.application_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold text-center mb-6">(기관관리자 화면)승인대기중인 지원계획서 {{ index + 1 }}</div>

        <!-- 신청서 번호 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>신청서 번호</label>
          <div class="p-2 border rounded bg-gray-50">{{ plan.application_no ?? '-' }}</div>
        </div>

        <!-- 작성자 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>작성자</label>
          <div class="p-2 border rounded bg-gray-50">{{ plan.plan_author ?? '-' }}</div>
        </div>

        <!-- 목표, 시작/종료일 -->
        <div class="flex flex-wrap gap-6 mb-4 font-semibold">
          <div class="flex flex-col gap-2 flex-1">
            <label>목표</label>
            <div class="p-2 border rounded bg-gray-50">{{ plan.title ?? '-' }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>지원시작일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(plan.start) }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>지원종료일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(plan.end) }}</div>
          </div>
        </div>

        <!-- 지원내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>지원내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ plan.content ?? '-' }}</div>
        </div>

        <!-- 첨부파일 -->
        <div class="flex flex-col gap-2 font-semibold">
          <label>첨부파일</label>
          <div class="p-2 border rounded bg-gray-50">
            {{ plan.fileName ?? '첨부파일 없음' }}
          </div>
        </div>

        <!-- 승인, 반려 버튼 -->
        <div class="flex flex-wrap gap-2 justify-center mt-5">
          <Button label="승인" style="width: auto" severity="info" @click="approvePlan(plan.plan_no)" />
          <Button label="반려" style="width: auto" severity="danger" @click="rejectPlan(plan.plan_no)" />
        </div>
      </div>
    </div>
  </div>
</template>
