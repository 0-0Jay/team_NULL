<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const props = defineProps({
  applicationNo: Number,
  applicantInfo: Object,
  assignedManager: Object,
  user: Object
});

const emit = defineEmits(['processed']);

const store = useApplicationStore();
const toast = useToast();

const showReject = ref(false);
const reject = ref('');

const errorMessage = ref('');
const showApproveConfirm = ref(false);
const showRejectConfirm = ref(false);

// 요청 조건
const canApprove = computed(() => {
  return props.user.type === 2 && props.applicantInfo?.request_date && !props.applicantInfo?.approve_date;
});

// 승인
const approveStatus = async () => {
  try {
    await store.approveApplicationStatus(props.applicationNo, 'approve', null);
    toast.add({
      severity: 'success',
      summary: '승인 완료',
      detail: '대기단계가 승인되었습니다.',
      closable: false,
      life: 2000
    });
    showApproveConfirm.value = false;
    emit('processed');
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '승인 실패',
      detail: '대기단계 승인을 실패하였습니다.',
      closable: false,
      life: 2500
    });
  }
};

// 반려
const rejectStatus = async () => {
  try {
    await store.approveApplicationStatus(props.applicationNo, 'reject', reject.value);
    toast.add({
      severity: 'success',
      summary: '반려 처리',
      detail: '대기단계 신청이 반려되었습니다.',
      closable: false,
      life: 2000
    });
    reject.value = '';
    showReject.value = false;
    showRejectConfirm.value = false;
    emit('processed');
  } catch (err) {
    console.log(err);
    toast.add({
      severity: 'error',
      summary: '반려 실패',
      detail: '대기단계 신청 반려를 실패하였습니다.',
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
</script>

<template>
  <Toast />
  <div v-if="canApprove" class="card p-4 flex flex-col gap-4">
    <div class="font-semibold text-gray-700">대기단계 승인 요청</div>

    <div class="flex gap-3">
      <Button label="승인" severity="success" icon="pi pi-check" @click="showApproveConfirm = true" />
      <Button label="반려" severity="danger" icon="pi pi-times" outlined @click="showReject = true" />
    </div>

    <!-- 반려 사유 입력 -->
    <div v-if="showReject" class="flex flex-col gap-2">
      <Textarea v-model="reject" rows="3" autoResize placeholder="반려 사유를 입력해주세요." />
      <div v-if="errorMessage" class="text-red-500 mt-2">
        {{ errorMessage }}
      </div>
      <div class="flex gap-2">
        <Button label="반려 확정" severity="danger" size="small" @click="openRejectConfirm" />
        <Button label="취소" severity="secondary" size="small" outlined @click="showReject = false" />
      </div>
    </div>

    <ConfirmDialog v-model:visible="showApproveConfirm" confirmLabel="승인" @confirm="approveStatus"> 해당 대기단계 요청을 승인하시겠습니까? </ConfirmDialog>
    <ConfirmDialog v-model:visible="showRejectConfirm" confirmLabel="반려" @confirm="rejectStatus">
      반려 처리 후에는 되돌릴 수 없습니다.<br />
      정말 반려하시겠습니까?
    </ConfirmDialog>
  </div>
</template>
