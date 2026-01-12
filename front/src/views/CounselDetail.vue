<!-- 상담내역 조회창 -->

<script setup>
import { useCounselStore } from '@/stores/counsel';
import { onBeforeMount, computed, ref } from 'vue';
import {  useRoute } from 'vue-router';


const user =JSON.parse(localStorage.getItem("users")).user[0];
const store = useCounselStore();
const route = useRoute();
const counselList = ref([]);

const filtercounsel = computed(() => store.counselList); // 화면에 보여질 테이터

onBeforeMount(async() => {
  const application_no = Number(route.params.application_no);

  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  counselList.value = await store.fetchCounselList(Number(route.params.application_no), 1); // 1 = 저장
  console.log(user);
});

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

      <!--  상담내역이 있을 때 -->
      <template v-if="filtercounsel.length > 0">
        <div
          v-for="(counsel, index) in filtercounsel"
          :key="counsel.application_no + '-' + index"
          class="card flex flex-col w-full p-6 shadow-md"
        >
          <!-- 카드 헤더 -->
          <div class="text-2xl font-bold text-center mb-6">
            상담내역 {{ index + 1 }}
          </div>

          <!-- 신청서 번호 -->
          <div class="flex flex-col gap-2 mb-4 font-semibold">
            <label>신청서 번호</label>
            <div class="p-2 border rounded bg-gray-50">
              {{ counsel.application_no ?? '-' }}
            </div>
          </div>

          <!-- 상담내역 제목 -->
          <div class="flex flex-col gap-2 mb-4 font-semibold">
            <label>상담내역 제목</label>
            <div class="p-2 border rounded bg-gray-50">
              {{ counsel.title ?? '-' }}
            </div>
          </div>

          <!-- 상담날짜 -->
          <div class="flex flex-col gap-2 mb-4 font-semibold">
            <label>상담날짜</label>
            <div class="p-2 border rounded bg-gray-50">
              {{ formatDate(counsel.counsel_date) }}
            </div>
          </div>

          <!-- 상담내용 -->
          <div class="flex flex-col gap-2 mb-4 font-semibold">
            <label>상담내용</label>
            <div class="p-2 border rounded bg-gray-50">
              {{ counsel.content ?? '-' }}
            </div>
          </div>
        </div>
      </template>

      <!-- 상담내역이 없을 때 -->
      <div
      <div v-else class="card text-center">        작성된 상담내역이 없습니다.
      </div>

    </div>
  </div>
</template>
