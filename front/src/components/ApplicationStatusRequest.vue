<script setup>
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';

const props = defineProps({
  applicationNo: Number,
  applicantInfo: Object,
  user: Object
});

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
  return props.user.type === 1 && !props.applicantInfo?.approve_date && !props.applicantInfo?.request_date;
});

// 요청 버튼 클릭
const requestStage = async () => {
  if (!selectedStatus.value) return;

  const result = await store.requestApplicationStatus(props.applicationNo, selectedStatus.value, props.user);

  if (result.status === 'success') {
    toast.add({
      severity: 'success',
      summary: '요청 완료',
      detail: '대기단계 승인 요청이 완료되었습니다.',
      life: 2000
    });

    emit('requested'); // 갱신 요청
  } else {
    toast.add({
      severity: 'error',
      summary: '요청 실패',
      detail: result.message || '대기단계 요청 실패',
      life: 2500
    });
  }
};
</script>

<template>
  <div v-if="canRequest" class="card p-4 flex items-center gap-3">
    <span class="font-medium">대기단계</span>
    <SelectButton v-model="selectedStatus" :options="statusOptions" optionLabel="label" optionValue="value" size="large" />
    <Button label="승인요청" :disabled="!selectedStatus" @click="requestStage" />
  </div>
</template>
