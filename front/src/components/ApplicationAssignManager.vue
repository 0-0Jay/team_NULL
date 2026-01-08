<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApplicationStore } from '@/stores/application';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  applicationNo: {
    type: Number,
    required: true
  },
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['assigned']);

const aStore = useApplicationStore();
const uStore = useUsersStore();
const toast = useToast();

const manager = ref([]);
const selectedManagerValue = ref(null);
const managerFilteredValue = ref([]);

onMounted(async () => {
  manager.value = await uStore.fetchStaff();
});

// 담당자 검색
const searchManager = (event) => {
  if (!event.query.trim().length) {
    managerFilteredValue.value = [...manager.value];
  } else {
    managerFilteredValue.value = manager.value.filter((m) => m.name.toLowerCase().startsWith(event.query.toLowerCase()));
  }
};

// 담당자 지정
const assignManager = async () => {
  if (!selectedManagerValue.value) {
    toast.add({
      severity: 'warn',
      summary: '담당자 선택',
      detail: '담당자를 선택해주세요.',
      life: 2000
    });
    return;
  }

  const mUserNo = selectedManagerValue.value.user_no;
  const result = await aStore.insertManager(props.applicationNo, mUserNo);

  if (result.status === 'success') {
    toast.add({
      severity: 'success',
      summary: '지정 완료',
      detail: '담당자가 지정되었습니다.',
      life: 2000
    });

    selectedManagerValue.value = null;
    emit('assigned'); // 부모 컴포넌트에게 알림
  } else {
    toast.add({
      severity: 'error',
      summary: '지정 실패',
      detail: result.message || '담당자 지정 실패',
      life: 2500
    });
  }
};

// 담당자 확인
const assignedManager = computed(() => {
  if (!Array.isArray(aStore.manager)) return null;
  return aStore.manager.find((m) => Number(m.application_no) === Number(props.applicationNo)) ?? null;
});
</script>

<template>
  <Toast />

  <!-- 이미 담당자 있음 -->
  <div v-if="assignedManager" class="flex items-center gap-2 text-sm text-gray-600">
    <i class="pi pi-user text-gray-400" />
    <span>
      담당자 :
      <span class="font-medium text-gray-800">
        {{ assignedManager.m_name }}
      </span>
    </span>
  </div>

  <!-- 담당자 미지정 + 기관 관리자 -->
  <div v-else-if="user.type === 2" class="card rounded-lg p-4 flex gap-4">
    <label class="text-xl font-medium">담당자</label>

    <AutoComplete v-model="selectedManagerValue" :suggestions="managerFilteredValue" optionLabel="name" placeholder="담당자명" dropdown completeOnFocus @complete="searchManager" />

    <Button label="담당자 지정" @click="assignManager" />
  </div>
</template>
