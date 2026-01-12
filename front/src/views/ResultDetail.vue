<!-- 지원결과서 조회창 -->
<script setup>
import { useResultStore } from '@/stores/result';
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const user = JSON.parse(localStorage.getItem('users')).user[0];
const store = useResultStore();
const route = useRoute();
const isApprovedRoute = computed(() => route.name === 'result');
const isPendingRoute = computed(() => route.name === 'pendingResult');
const isRejectRoute = computed(() => route.name === 'rejectResult');
const resultList = ref([]);
const pendingResult = computed(() => resultList.value.filter((v) => v.status === 0));
const approvedResult = computed(() => resultList.value.filter((v) => v.status === 1));
const rejectedResult = computed(() => resultList.value.filter((v) => v.status === 2));
const visibleResultList = computed(() => {
  if (route.path.includes('/pendingResult')) {
    return pendingResult.value;
  }
  if (route.path.includes('/rejectResult')) {
    return rejectedResult.value;
  }
  return approvedResult.value;
});
const application_no = route.params.application_no;

onBeforeMount(async () => {
  resultList.value = await store.fetchResultList(application_no);
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

// 반려
const rejectingMap = ref({});
const rejectReasonMap = ref({});

const startReject = (resultNo) => {
  rejectingMap.value[resultNo] = true;
  rejectReasonMap.value[resultNo] = '';
};

const cancelReject = (resultNo) => {
  rejectingMap.value[resultNo] = false;
  rejectReasonMap.value[resultNo] = '';
};

const confirmReject = async (resultNo) => {
  const data = {
    result_no: resultNo,
    reason: rejectReasonMap.value[resultNo],
    status: 2
  };
  await store.updateResultStatus(data);
  resultList.value = await store.fetchResultList(application_no);
  cancelReject(resultNo);
};

// 승인
const approve = async (resultNo) => {
  const data = {
    result_no: resultNo,
    reason: null,
    status: 1
  };
  await store.updateResultStatus(data);
  resultList.value = await store.fetchResultList(application_no);
};
</script>

<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <div v-if="visibleResultList.length > 0" class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-for="(data, index) in visibleResultList" :key="data.result_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold mb-6 items-center flex gap-4 justify-center">
          <Button v-if="isApprovedRoute" label="승인" class="status" />
          <Button v-if="isPendingRoute" label="대기" severity="warn" class="status" />
          <Button v-if="isRejectRoute" label="반려" severity="danger" class="status" />
          <span>지원결과서</span>
        </div>

        <!-- 목표, 시작/종료일 -->
        <div class="flex flex-wrap gap-6 mb-4 font-semibold">
          <div class="flex flex-col gap-2 flex-1">
            <label>목표</label>
            <div class="p-2 border rounded bg-gray-50">{{ data.title ?? '-' }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>시작일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(data.start) }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>종료일</label>
            <div class="p-2 border rounded bg-gray-50">{{ formatDate(data.end) }}</div>
          </div>

          <div class="flex flex-col gap-2">
            <label>{{ isApprovedRoute ? '승인' : isPendingRoute ? '승인요청' : '반려' }}날짜</label>
            <div v-if="isPendingRoute" class="p-2 border rounded bg-gray-50 font-bold">
              {{ formatDate(data.result_date) ?? '-' }}
            </div>
            <div v-else-if="isRejectRoute" class="p-2 border rounded bg-gray-50 text-red-500 font-bold">
              {{ formatDate(data.reject_date) ?? '-' }}
            </div>
            <div v-else-if="isApprovedRoute" class="p-2 border rounded bg-gray-50 text-blue-500 font-bold">
              {{ formatDate(data.approve_date) ?? '-' }}
            </div>
          </div>
        </div>

        <!-- 결과내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>결과내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ data.content ?? '-' }}</div>
        </div>

        <div v-if="isRejectRoute" class="flex flex-col gap-2 mb-4 font-semibold">
          <label>반려사유</label>
          <div class="p-2 border rounded bg-gray-50">{{ data.reject ?? '-' }}</div>
        </div>

        <div v-if="isPendingRoute && user.type == 2" class="flex justify-center gap-3 mt-6">
          <Button @click="approve(data.result_no)">승인</Button>
          <Button v-if="!rejectingMap[data.result_no]" severity="danger" @click="startReject(data.result_no)">반려</Button>
          <Button v-else severity="secondary" @click="cancelReject(data.result_no)">취소</Button>
        </div>
        <div v-if="rejectingMap[data.result_no]" class="mt-4 p-4 flex flex-col gap-3">
          <Textarea v-model="rejectReasonMap[data.result_no]" rows="4" placeholder="반려 사유를 입력하세요" auto-resize />
          <div class="flex justify-center">
            <Button severity="danger" @click="confirmReject(data.result_no)">반려 확정</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="card text-center">
      <div v-if="route.name == 'result'">승인된 지원결과서가 없습니다.</div>
      <div v-else-if="route.name == 'pendingResult'">승인 대기 중인 지원결과서가 없습니다.</div>
      <div v-else-if="route.name == 'rejectResult'">반련된 지원결과서가 없습니다.</div>
    </div>
  </div>
</template>

<style>
.status {
  cursor: default !important;
  pointer-events: none;
}
.status:hover {
  background-color: inherit !important;
  color: inherit !important;
  border-color: inherit !important;
}
</style>
