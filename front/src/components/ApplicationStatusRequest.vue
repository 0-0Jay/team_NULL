<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';

const route = useRoute();
const props = defineProps({
  applicationNo: Number,
  applicantInfo: Object,
  assignedManager: Object,
  user: Object
});

// console.log(props.applicantInfo);

const emit = defineEmits(['requested']);

const store = useApplicationStore();
const toast = useToast();

const selectedStatus = ref(null);

const statusOptions = [
  { label: '계획', value: 1 },
  { label: '중점', value: 2 },
  { label: '긴급', value: 3 }
];

// 요청 조건
const canRequest = computed(() => {
  // console.log(props.assignedManager);
  return props.user.type === 1 && props.assignedManager && props.assignedManager.user_no === props.user.user_no && !props.applicantInfo?.approve_date && !props.applicantInfo?.request_date && route.name === 'view';
});

// 요청 버튼 클릭
const requestStage = async () => {
  if (!selectedStatus.value) return;

  try {
    await store.requestApplicationStatus(props.applicationNo, selectedStatus.value, props.user);
    toast.add({
      severity: 'success',
      summary: '요청 완료',
      detail: '대기단계 승인 요청이 완료되었습니다.',
      closable: false,
      life: 2000
    });

    emit('requested'); // 갱신 요청
  } catch (err) {
    console.error(err);
    toast.add({
      severity: 'error',
      summary: '요청 실패',
      detail: '대기단계 요청을 실패하였습니다.',
      closable: false,
      life: 2500
    });
  }
};
</script>

<template>
  <Toast />
  <div v-if="canRequest" class="card p-4 flex items-center gap-3">
    <span class="font-medium">대기단계</span>
    <SelectButton v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value" size="large" />
    <Button label="승인요청" :disabled="!selectedStatus" @click="requestStage" />
  </div>

  <p v-else-if="user.type === 1 && applicantInfo?.request_date && !applicantInfo?.approve_date" style="margin: 0; font-weight: bold" class="text-gray-500">승인 요청 중인 신청서입니다.</p>
</template>
