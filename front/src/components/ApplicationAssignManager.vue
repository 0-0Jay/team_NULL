<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApplicationStore } from '@/stores/application';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

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

const showAssignConfirm = ref(false);

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
  const mUserNo = selectedManagerValue.value.user_no;

  try {
    await aStore.insertManager(props.applicationNo, mUserNo);
    toast.add({
      severity: 'success',
      summary: '지정 완료',
      detail: '담당자가 지정되었습니다.',
      closable: false,
      life: 2000
    });

    selectedManagerValue.value = null;
    showAssignConfirm.value = false;
    emit('assigned'); // 부모 컴포넌트에게 알림
  } catch (err) {
    console.log(err);
    toast.add({
      severity: 'error',
      summary: '지정 실패',
      detail: result.message || '담당자 지정 실패',
      closable: false,
      life: 2500
    });
  }
};

const openAssignConfirm = () => {
  if (!selectedManagerValue.value) {
    toast.add({
      severity: 'warn',
      summary: '담당자 선택',
      detail: '담당자를 선택해주세요.',
      closable: false,
      life: 2000
    });
    return;
  }

  showAssignConfirm.value = true;
};
</script>

<template>
  <Toast />

  <div class="card rounded-lg p-4 flex gap-4">
    <label class="text-xl font-medium">담당자</label>

    <AutoComplete v-model="selectedManagerValue" :suggestions="managerFilteredValue" optionLabel="name" placeholder="담당자명" dropdown completeOnFocus @complete="searchManager" />

    <Button label="담당자 지정" @click="openAssignConfirm" />
    <ConfirmDialog v-model:visible="showAssignConfirm" confirmLabel="지정" @confirm="assignManager">
      선택한 담당자를<br />
      해당 신청 건의 담당자로 지정하시겠습니까?
    </ConfirmDialog>
  </div>
</template>
