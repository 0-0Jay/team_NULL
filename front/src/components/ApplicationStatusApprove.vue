<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';

const props = defineProps({
  applicationNo: Number,
  applicantInfo: Object,
  assignedManager: Object,
  user: Object
});

// console.log(props.applicantInfo);

const emit = defineEmits(['processed']);

const store = useApplicationStore();
const toast = useToast();

const showReject = ref(false);
const reject = ref('');

const errorMessage = ref('');

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
  errorMessage.value = '';

  if (!reject.value.trim()) {
    errorMessage.value = '반려 사유를 입력해주세요.';
    return;
  }

  await store.approveApplicationStatus(props.applicationNo, 'reject', reject.value);

  try {
    toast.add({
      severity: 'success',
      summary: '반려 처리',
      detail: '대기단계 신청이 반려되었습니다.',
      closable: false,
      life: 2000
    });
    reject.value = '';
    showReject.value = false;
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
</script>

<template>
  <Toast />
  <div v-if="canApprove" class="card p-4 flex flex-col gap-4">
    <div class="font-semibold text-gray-700">대기단계 승인 요청</div>

    <div class="flex gap-3">
      <Button label="승인" severity="success" icon="pi pi-check" @click="approveStatus" />
      <Button label="반려" severity="danger" icon="pi pi-times" outlined @click="showReject = true" />
    </div>

    <!-- 반려 사유 입력 -->
    <div v-if="showReject" class="flex flex-col gap-2">
      <Textarea v-model="reject" rows="3" autoResize placeholder="반려 사유를 입력해주세요." />
      <div v-if="errorMessage" class="text-red-500 mt-2">
        {{ errorMessage }}
      </div>
      <div class="flex gap-2">
        <Button label="반려 확정" severity="danger" size="small" @click="rejectStatus" />
        <Button label="취소" severity="secondary" size="small" outlined @click="showReject = false" />
      </div>
    </div>
  </div>
</template>
