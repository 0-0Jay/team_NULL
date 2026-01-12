<!-- 승인 대기중인 지원계획서 조회란 -->
<script setup>
import { usePlanStore } from '@/stores/plan';
import { onBeforeMount, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import Button from 'primevue/button';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const store = usePlanStore();
const usersStore = useUsersStore();
const route = useRoute();
const toast = useToast();

const application_no = Number(route.params.application_no);
const filterPlan = computed(() => store.planList);

// 승인 / 반려 confirm dialog
const showApproveConfirm = ref(false);
const showRejectConfirm = ref(false);
const pendingPlanNo = ref(null);
const rejectingPlanNo = ref(null);

// 🔽 plan_no별 반려 상태 관리
const rejectOpenMap = ref({});
const rejectReasonMap = ref({});
const errorMessageMap = ref({});

// 승인대기중인 계획서 조회
onBeforeMount(() => {
  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  store.fetchPendingPlanDetail(application_no, 0);
});

// 승인 confirm 열기
const openApprove = (planNo) => {
  pendingPlanNo.value = planNo;
  showApproveConfirm.value = true;
};

// 승인 처리
const approvePlan = async (plan_no) => {
  try {
    await store.updatePlanStatus(plan_no, 1);
    toast.add({
      severity: 'success',
      summary: '승인 완료',
      detail: '지원계획서가 승인되었습니다.',
      life: 2000
    });
    showApproveConfirm.value = false;
    await store.fetchPendingPlanDetail(application_no, 0);
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

// 반려 입력창 열기
const openReject = (planNo) => {
  rejectOpenMap.value[planNo] = true;
  rejectReasonMap.value[planNo] = '';
  errorMessageMap.value[planNo] = '';
};

// 반려 입력창 닫기
const closeReject = (planNo) => {
  rejectOpenMap.value[planNo] = false;
  rejectReasonMap.value[planNo] = '';
  errorMessageMap.value[planNo] = '';
};

// 반려 confirm 열기
const openRejectConfirm = (planNo) => {
  errorMessageMap.value[planNo] = '';

  if (!rejectReasonMap.value[planNo]?.trim()) {
    errorMessageMap.value[planNo] = '반려 사유를 입력해주세요.';
    return;
  }

  rejectingPlanNo.value = planNo;
  showRejectConfirm.value = true;
};

// 반려 처리
const rejectPlan = async () => {
  try {
    await store.updatePlanStatus(rejectingPlanNo.value, 2, rejectReasonMap.value[rejectingPlanNo.value]);

    toast.add({
      severity: 'success',
      summary: '반려 완료',
      detail: '지원계획서가 반려되었습니다.',
      life: 2000
    });

    closeReject(rejectingPlanNo.value);
    showRejectConfirm.value = false;

    await store.fetchPendingPlanDetail(application_no, 0);
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

// 날짜 포맷
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
    <Toast />

    <div class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-if="filterPlan.length === 0" class="text-center py-6 text-gray-400 text-xl font-bold">데이터 없음</div>

      <div v-for="(plan, index) in filterPlan" :key="plan.plan_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold mb-6 items-center flex gap-4 justify-center">
          <Button label="대기" severity="warn" class="status" />
          <span>지원계획서</span>
        </div>

        <!-- 작성자 -->
        <div class="flex flex-col gap-1 mb-6">
          <span class="text-sm text-gray-500">작성자</span>
          <span class="font-semibold text-lg">{{ plan.plan_author ?? '-' }}</span>
        </div>

        <!-- 목표 / 기간 -->
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
            <label>승인날짜</label>
            <div class="p-2 border rounded bg-gray-50 font-bold">
              {{ formatDate(plan.plan_date) ?? '-' }}
            </div>
          </div>
        </div>

        <!-- 지원내용 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <label>지원내용</label>
          <div class="p-2 border rounded bg-gray-50">{{ plan.content ?? '-' }}</div>
        </div>

        <!-- 승인 / 반려 -->
        <div v-if="usersStore.isAdmin" class="flex justify-center gap-3 mt-6">
          <Button label="승인" @click="openApprove(plan.plan_no)" />
          <Button v-if="!rejectOpenMap[plan.plan_no]" label="반려" severity="danger" @click="openReject(plan.plan_no)" />
          <Button v-else label="취소" severity="secondary" @click="closeReject(plan.plan_no)" />
        </div>
        <div v-if="rejectOpenMap[plan.plan_no]" class="mt-4 p-4 flex flex-col gap-3">
          <Textarea v-model="rejectReasonMap[plan.plan_no]" rows="4" autoResize placeholder="반려 사유를 입력하세요" />
          <div v-if="errorMessageMap[plan.plan_no]" class="text-red-500 text-sm">
            {{ errorMessageMap[plan.plan_no] }}
          </div>
          <div class="flex justify-center">
            <Button label="반려 확정" severity="danger" @click="openRejectConfirm(plan.plan_no)" />
          </div>
        </div>
      </div>

      <ConfirmDialog v-model:visible="showApproveConfirm" confirmLabel="승인" @confirm="approvePlan(pendingPlanNo)"> 해당 지원계획서를 승인하시겠습니까? </ConfirmDialog>
      <ConfirmDialog v-model:visible="showRejectConfirm" confirmLabel="반려" @confirm="rejectPlan">
        반려 처리 후에는 되돌릴 수 없습니다.<br />
        정말 반려하시겠습니까?
      </ConfirmDialog>
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
