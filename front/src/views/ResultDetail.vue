<!-- 지원결과서 조회창 -->
<script setup>
import { useResultStore } from '@/stores/result';
import { onBeforeMount, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const user = JSON.parse(localStorage.getItem('users')).user[0];
const store = useResultStore();
const route = useRoute();
const toast = useToast();
const isApprovedRoute = computed(() => route.name === 'result');
const isPendingRoute = computed(() => route.name === 'pendingResult');
const isRejectRoute = computed(() => route.name === 'rejectResult');
const resultList = ref([]);
const application_no = route.params.application_no;

// confirm dialog
const showApproveConfirm = ref(false);
const showRejectConfirm = ref(false);
const pendingResultNo = ref(null);
const rejectingResultNo = ref(null);

// 반려 상태
const rejectingMap = ref({});
const rejectReasonMap = ref({});

const pendingResult = computed(() => resultList.value.filter((v) => v.status === 0));
const approvedResult = computed(() => resultList.value.filter((v) => v.status === 1));
const rejectedResult = computed(() => resultList.value.filter((v) => v.status === 2));

const visibleResultList = computed(() => {
  if (route.path.includes('/pendingResult')) return pendingResult.value;
  if (route.path.includes('/rejectResult')) return rejectedResult.value;
  return approvedResult.value;
});

onBeforeMount(async () => {
  resultList.value = await store.fetchResultList(application_no);
});

// 날짜 포맷
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

// ================= 승인 =================
const openApproveConfirm = (resultNo) => {
  pendingResultNo.value = resultNo;
  showApproveConfirm.value = true;
};

const approve = async () => {
  try {
    await store.updateResultStatus({
      result_no: pendingResultNo.value,
      reason: null,
      status: 1
    });

    toast.add({
      severity: 'success',
      summary: '승인 완료',
      detail: '지원결과서가 승인되었습니다.',
      life: 2000
    });

    showApproveConfirm.value = false;
    resultList.value = await store.fetchResultList(application_no);
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '승인 실패',
      detail: '승인 처리 중 오류가 발생했습니다.',
      life: 2500
    });
  }
};

// ================= 반려 =================
const startReject = (resultNo) => {
  rejectingMap.value[resultNo] = true;
  rejectReasonMap.value[resultNo] = '';
};

const cancelReject = (resultNo) => {
  rejectingMap.value[resultNo] = false;
  rejectReasonMap.value[resultNo] = '';
};

const openRejectConfirm = (resultNo) => {
  if (!rejectReasonMap.value[resultNo]?.trim()) {
    toast.add({
      severity: 'warn',
      summary: '입력 필요',
      detail: '반려 사유를 입력해주세요.',
      life: 2000
    });
    return;
  }

  rejectingResultNo.value = resultNo;
  showRejectConfirm.value = true;
};

const confirmReject = async () => {
  try {
    await store.updateResultStatus({
      result_no: rejectingResultNo.value,
      reason: rejectReasonMap.value[rejectingResultNo.value],
      status: 2
    });

    toast.add({
      severity: 'success',
      summary: '반려 완료',
      detail: '지원결과서가 반려되었습니다.',
      life: 2000
    });

    cancelReject(rejectingResultNo.value);
    showRejectConfirm.value = false;
    resultList.value = await store.fetchResultList(application_no);
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '반려 실패',
      detail: '반려 처리 중 오류가 발생했습니다.',
      life: 2500
    });
  }
};
</script>

<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <Toast />

    <div v-if="visibleResultList.length > 0" class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-for="(data, index) in visibleResultList" :key="data.result_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold mb-6 items-center flex gap-4 justify-center">
          <Button v-if="isApprovedRoute" label="승인" class="status" />
          <Button v-if="isPendingRoute" label="대기" severity="warn" class="status" />
          <Button v-if="isRejectRoute" label="반려" severity="danger" class="status" />
          <span>지원결과서</span>
        </div>

        <!-- 작성자 -->
        <div class="flex flex-col gap-1 mb-6">
          <span class="text-sm text-gray-500">작성자</span>
          <span class="font-semibold text-lg">{{ data.result_author ?? '-' }}</span>
        </div>

        <!-- 목표 / 기간 -->
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
            <label>{{ isApprovedRoute ? '승인' : isPendingRoute ? '승인요청' : '반려' }} 날짜</label>
            <div v-if="isApprovedRoute" class="p-2 border rounded bg-gray-50 text-blue-500">{{ formatDate(data.approve_date) }}</div>
            <div v-else-if="isPendingRoute" class="p-2 border rounded bg-gray-50">{{ formatDate(data.result_date) }}</div>
            <div v-else-if="isRejectRoute" class="p-2 border rounded bg-gray-50 text-red-500">{{ formatDate(data.reject_date) }}</div>
          </div>
        </div>

        <!-- 결과내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>결과내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ data.content ?? '-' }}</div>
        </div>

        <!-- 반려 사유 -->
        <div v-if="isRejectRoute" class="flex flex-col gap-2 mb-4 font-semibold">
          <label>반려사유</label>
          <div class="p-2 border rounded bg-gray-50">{{ data.reject ?? '-' }}</div>
        </div>

        <!-- 승인 / 반려 -->
        <div v-if="isPendingRoute && user.type == 2" class="flex justify-center gap-3 mt-6">
          <Button label="승인" @click="openApproveConfirm(data.result_no)" />
          <Button v-if="!rejectingMap[data.result_no]" severity="danger" @click="startReject(data.result_no)">반려</Button>
          <Button v-else severity="secondary" @click="cancelReject(data.result_no)">취소</Button>
        </div>

        <!-- 반려 입력 -->
        <div v-if="rejectingMap[data.result_no]" class="mt-4 p-4 flex flex-col gap-3">
          <Textarea v-model="rejectReasonMap[data.result_no]" rows="4" autoResize placeholder="반려 사유를 입력하세요" />
          <div class="flex justify-center">
            <Button severity="danger" @click="openRejectConfirm(data.result_no)">반려 확정</Button>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="card text-center">
      <div v-if="route.name == 'result'">승인된 지원결과서가 없습니다.</div>
      <div v-else-if="route.name == 'pendingResult'">승인 대기 중인 지원결과서가 없습니다.</div>
      <div v-else-if="route.name == 'rejectResult'">반려된 지원결과서가 없습니다.</div>
    </div>

    <ConfirmDialog v-model:visible="showApproveConfirm" confirmLabel="승인" @confirm="approve"> 해당 지원결과서를 승인하시겠습니까? </ConfirmDialog>
    <ConfirmDialog v-model:visible="showRejectConfirm" confirmLabel="반려" @confirm="confirmReject">
      반려 처리 후에는 되돌릴 수 없습니다.<br />
      정말 반려하시겠습니까?
    </ConfirmDialog>
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
