<!--승인 대기중인 지원결과서 조회란-->

<script setup>
import { useResultStore } from '@/stores/result'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'; //페이지 이동을 위함

const store = useResultStore();
const router = useRouter();
const route = useRoute();

const filterresult = computed(() => store.resultList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

//승인대기중인 결과서만 화면에 송출
onBeforeMount(() => {
  const plan_no = Number(route.params.plan_no);

  if (!plan_no) {
    console.error('plan_no 없음:', route.params.plan_no);
    return;
  }
  store.fetchPendingResultDetail(Number(route.params.plan_no), 0); // 0 대기/ 1승인 /2반려
});

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
</script>

<template>
  <div class="flex flex-col gap-6 p-40">
    <div v-for="(result, index) in filterresult" :key="result.plan_no" class="card flex flex-col w-full p-6 shadow-md">
      <!-- 카드 헤더 -->
      <div class="text-2xl font-bold text-center mb-6">승인대기중인 지원결과서 {{ index + 1 }}</div>

      <!-- 신청서 번호 -->
      <div class="flex flex-col gap-2 mb-4 font-semibold">
        <label>신청서 번호</label>
        <div class="p-2 border rounded bg-gray-50">{{ result.result_no ?? '-' }}</div>
      </div>

      <!-- 목표, 시작/종료일 -->
      <div class="flex flex-wrap gap-6 mb-4 font-semibold">
        <div class="flex flex-col gap-2 flex-1">
          <label>목표</label>
          <div class="p-2 border rounded bg-gray-50">{{ result.title ?? '-' }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <label>지원시작일</label>
          <div class="p-2 border rounded bg-gray-50">{{ formatDate(result.start) }}</div>
        </div>

        <div class="flex flex-col gap-2">
          <label>지원종료일</label>
          <div class="p-2 border rounded bg-gray-50">{{ formatDate(result.end) }}</div>
        </div>

        <!-- 지원내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>지원내용</label>
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
