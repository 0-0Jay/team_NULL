<!-- 승인 대기중인 지원계획서 조회란 -->
<script setup>
import { usePlanStore } from '@/stores/plan'; // pinia작업을 위함
import { onBeforeMount, computed, ref } from 'vue';
import { useRoute } from 'vue-router'; //페이지 이동을 위함
import Button from 'primevue/button';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const store = usePlanStore(); //pinia작업 위함
const usersStore = useUsersStore();
const route = useRoute();
const toast = useToast();

const application_no = Number(route.params.application_no);
const filterPlan = computed(() => store.planList); // 화면에 보여질 테이터

const reject = ref('');
const showReject = ref(false);
const selectedPlanNo = ref(null); // plan_no 저장용
const errorMessage = ref('');

const showApproveConfirm = ref(false);
const showRejectConfirm = ref(false);
const pendingPlanNo = ref(null);

//승인대기중인 계획서만 화면에 보임
onBeforeMount(() => {
  if (!application_no) {
    console.error('application_no 없음:', route.params.application_no);
    return;
  }
  store.fetchPendingPlanDetail(application_no, 0); // 0 = 대기
});

//승인 기능
const approvePlan = async (plan_no) => {
  try {
    await store.updatePlanStatus(plan_no, 1);
    toast.add({
      severity: 'success',
      summary: '승인 완료',
      detail: '지원계획서가 승인되었습니다.',
      closable: false,
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
      closable: false,
      life: 2500
    });
  }
};

const openApprove = (planNo) => {
  pendingPlanNo.value = planNo;
  showApproveConfirm.value = true;
};

const openReject = (planNo) => {
  showReject.value = true;
  selectedPlanNo.value = planNo;
};

const closeReject = () => {
  showReject.value = false;
  selectedPlanNo.value = null;
  reject.value = '';
  errorMessage.value = '';
};

//반려 기능
const rejectPlan = async () => {
  try {
    await store.updatePlanStatus(selectedPlanNo.value, 2, reject.value);
    toast.add({
      severity: 'success',
      summary: '반려 완료',
      detail: '지원계획서가 반려되었습니다.',
      closable: false,
      life: 2000
    });
    showRejectConfirm.value = false;
    closeReject();
    await store.fetchPendingPlanDetail(application_no, 0);
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '반려 실패',
      detail: '반려 처리 중 오류가 발생했습니다.',
      closable: false,
      life: 2500
    });
  }
};

const openRejectConfirm = () => {
  errorMessage.value = '';

  if (!reject.value.trim()) {
    errorMessage.value = '반려 사유를 입력해주세요.';
    return;
  }

  showRejectConfirm.value = true;
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
</script>

<template>
  <div class="flex flex-col w-full h-175 gap-6">
    <Toast />
    <div class="flex-1 overflow-auto rounded-lg flex flex-col gap-6">
      <div v-if="filterPlan.length === 0" class="text-center py-6 text-gray-400 text-xl font-bold">데이터 없음</div>

      <div v-for="(plan, index) in filterPlan" :key="plan.plan_no" class="card flex flex-col w-full p-6 shadow-md">
        <!-- 카드 헤더 -->
        <div class="text-2xl font-bold text-center mb-6">승인대기중인 지원계획서 {{ index + 1 }}</div>

        <!-- 작성자 -->
        <div class="flex flex-col gap-1 mb-6">
          <span class="text-sm text-gray-500">작성자</span>
          <span class="font-semibold text-lg">{{ plan.plan_author ?? '-' }}</span>
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

        <!-- 승인, 반려 버튼 (기관 관리자) -->
        <div v-if="usersStore.isAdmin" class="flex flex-wrap gap-2 justify-center mt-5">
          <Button label="승인" severity="info" @click="openApprove(plan.plan_no)" />
          <Button label="반려" severity="danger" @click="openReject(plan.plan_no)" />
        </div>
        <div v-if="showReject && selectedPlanNo === plan.plan_no" class="card p-4 mt-4 flex flex-col gap-2">
          <Textarea v-model="reject" rows="3" autoResize placeholder="반려 사유를 입력해주세요." />
          <div v-if="errorMessage" class="text-red-500 mt-2">
            {{ errorMessage }}
          </div>
          <div class="flex gap-2 justify-end">
            <Button label="반려 확정" severity="danger" size="small" @click="openRejectConfirm" />
            <Button label="취소" severity="secondary" size="small" outlined @click="closeReject" />
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
