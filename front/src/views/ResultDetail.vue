<!-- 지원결과서 조회창 -->

<script setup>
import { useResultStore } from '@/stores/result'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함

const store = useResultStore(); //pinia작업 위함
const router = useRouter();
const route = useRoute();

const filterresult = computed(() => store.resultList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

// onBeforeMount(() => {
//   store.fetchResultList(plan_no, 1); //승인된 결과서
// });

// onBeforeMount(() => {
//   store.fetchResultList(11, 0); //승인된 계획서 - 일단은 하드코딩으로 테스트 함
// });

onBeforeMount(() => {
  const application_no = Number(route.params.application_no);

  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  store.fetchResultList(Number(route.params.application_no), 1); //승인된 결과서만 화면에 출력
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

<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <div class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <!--#####-->
      <div v-for="(result, index) in filterresult" :key="result.result_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold text-center mb-6">승인된 지원결과서 {{ index + 1 }}</div>

        <!-- 결과서 번호 -->
        <div class="flex flex-col gap-2 mb- font-semibold">
          <label>결과서 번호</label>
          <div class="p-2 border rounded bg-gray-50">{{ result.result_no ?? '-' }}</div>
        </div>

        <!-- 목표, 시작/종료일 -->
        <div class="flex flex-wrap gap-6 mb-4 font-semibold">
          <div class="flex flex-col gap-2 flex-1">
            <label>목표</label>
            <div class="p-2 border rounded bg-gray-50">{{ result.result_title ?? '-' }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>시작일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(result.start) }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>종료일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(result.end) }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>승인된 날짜</label>
            <div class="p-2 border rounded bg-gray-50 text-blue-500 font-bold">
              {{ formatDate(result.approve_date) ?? '-' }}
            </div>
          </div>
        </div>

        <!-- 결과내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>결과내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ result.content ?? '-' }}</div>
        </div>

        <!-- 첨부파일 -->
        <div class="flex flex-col gap-2 font-semibold">
          <label>첨부파일</label>
          <div class="p-2 border rounded bg-gray-50">
            {{ result.fileName ?? '첨부파일 없음' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
