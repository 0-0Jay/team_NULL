<!-- 지원계획서 조회창-->
<script setup>
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함

const store = usePlanStore(); //pinia작업 위함
const route = useRoute(); // 현재 경로 확인용
// const application_no = router.params.application_no; // 신청서 번호를 url에서 가져옴 - 일단은 하드코딩해서 주석처리 해놓음

const filterplan = computed(() => store.planList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

onBeforeMount(() => {
  const application_no = Number(route.params.application_no);

  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  store.fetchPlanList(Number(route.params.application_no), 1); //승인된 계획서만 화면에 출력
});

//날짜 포멧 - 유민님 파일에서 따옴
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
</script>

<!--------------------------------------------------------------------------->
<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <div class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-for="(plan, index) in filterplan" :key="plan.application_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold text-center">승인된 지원계획서 {{ index + 1 }}</div>

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

          <div class="flex flex-col gap-2">
            <label>승인된 날짜</label>
            <div class="p-2 border rounded bg-gray-50 text-blue-500 font-bold">
              {{ formatDate(plan.approve_date) ?? '-' }}
            </div>
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
      </div>
    </div>
  </div>
</template>
