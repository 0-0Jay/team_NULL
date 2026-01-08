<!-- 상담내역 조회창 -->

<script setup>
import { useCounselStore } from '@/stores/counsel';
import { onBeforeMount, computed, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const store = useCounselStore();
const router = useRouter();
const route = useRoute();

const filtercounsel = computed(() => store.counselList); // 화면에 보여질 테이터
const rowNumber = (index) => index + 1;

// onBeforeMount(() => {
//   store.fetchCounselList(application_no, 0); // 작성된 상담내역 조회
// });

// onBeforeMount(() => {
//   store.fetchCounselList(1, 0); // (application_no, save) 일단은 하드코딩 테스트함
// });

onBeforeMount(() => {
  const application_no = Number(route.params.application_no);

  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  store.fetchCounselList(Number(route.params.application_no), 1); //승인된 상담내역만 화면에 출력
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
    <div class="flex-1 overflow-auto rounded-lg border border-gray-200 flex flex-col gap-6 p-4">
      <div v-for="(counsel, index) in filtercounsel" :key="counsel.application_no + '-' + index" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold text-center mb-6">상담내역 {{ index + 1 }}</div>

        <!-- 신청서 번호 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>신청서 번호</label>
          <div class="p-2 border rounded bg-gray-50">{{ counsel.application_no ?? '-' }}</div>
        </div>

        <!-- 상담내역 제목 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>상담내역 제목</label>
          <div class="p-2 border rounded bg-gray-50">{{ counsel.title ?? '-' }}</div>
        </div>

        <!-- 상담날짜 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>상담날짜</label>
          <div class="p-2 border rounded bg-gray-50">{{ formatDate(counsel.counsel_date) }}</div>
        </div>

        <!-- 상담내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>상담내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ counsel.content ?? '-' }}</div>
        </div>

        <!-- 첨부파일 -->
        <div class="flex flex-col gap-2 font-semibold">
          <label>첨부파일</label>
          <div class="p-2 border rounded bg-gray-50">
            {{ counsel.fileName ?? '첨부파일 없음' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
