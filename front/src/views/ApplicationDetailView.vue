<script setup>
import ApplicationTabs from '@/components/ApplicationTabs.vue';
import { useToast } from 'primevue/usetoast';
import { useApplicationStore } from '@/stores/application';
import { useUsersStore } from '@/stores/users';
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';

const aStore = useApplicationStore();
const uStore = useUsersStore();
const route = useRoute();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];
const toast = useToast();

const applicant = ref([]);
const selectedApplicant = ref({ name: '', disability: '', gender: '', birth: '' });
const selectedApplicantValue = ref(null);
const applicantFilteredValue = ref([]);

const manager = ref([]);
const selectedManagerValue = ref(null);
const managerFilteredValue = ref([]);

onMounted(async () => {
  applicant.value = await aStore.fetchApplicant();
  manager.value = await uStore.fetchStaff();
  // console.log('fetchStaff result:', res);
});

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

const applicationNo = Number(route.params.application_no);
const applicantInfo = computed(() => {
  if (!aStore.appList.length) return null;
  return aStore.appList.find((a) => a.application_no === applicationNo) ?? null;
});

// 지원자(조회)
watch(
  applicantInfo,
  (val) => {
    if (!val) return;
    selectedApplicant.value = { name: val.ap_name, disability: val.disability, gender: val.gender, birth: val.birth };
  },
  { immediate: true }
);

// 지원자 선택
watch(selectedApplicantValue, (val) => {
  if (!val) return;
  selectedApplicant.value = { ...val };
  aStore.setSelectedApplicant(val);
});

// 지원자(작성)
watch(selectedApplicantValue, (val) => {
  if (!val) return;
  selectedApplicant.value = { ...val };
});

// 이벤트 함수
// 지원자 선택
const searchApplicant = (event) => {
  if (!event.query.trim().length) {
    applicantFilteredValue.value = [...applicant.value];
    console.log(applicant.value);
  } else {
    applicantFilteredValue.value = applicant.value.filter((a) => {
      return a.name.toLowerCase().startsWith(event.query.toLowerCase());
    });
  }
};

// 담당자 선택
const searchManager = (event) => {
  if (!event.query.trim().length) {
    managerFilteredValue.value = [...manager.value];
    // console.log(manager.value);
  } else {
    managerFilteredValue.value = manager.value.filter((a) => {
      return a.name.toLowerCase().startsWith(event.query.toLowerCase());
    });
  }
};

// 담당자 지정
const assignManager = async () => {
  console.log(selectedManagerValue.value);

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

  const m_user_no = selectedManagerValue.value.user_no;
  const result = await aStore.insertManager(applicationNo, m_user_no);

  if (result.status === 'success') {
    toast.add({
      severity: 'success',
      summary: '지정 완료',
      detail: '담당자가 지정되었습니다.',
      closable: false,
      life: 2000
    });
    await aStore.fetchApplication();
    selectedManagerValue.value = null;
  } else {
    toast.add({
      severity: 'error',
      summary: '지정 실패',
      detail: result.message || '담당자 지정 실패',
      closable: false,
      life: 2500
    });
  }
};
</script>
<template>
  <div class="grid pt-20 h-screen m-4 gap-4">
    <div class="card rounded-lg p-4">
      <div class="font-semibold text-xl">지원자 정보</div>
      <hr />
      <table class="text-center w-full table-fixed -ml-4">
        <colgroup>
          <col style="width: 10%" />
          <col style="width: 40%" />
          <col style="width: 10%" />
          <col style="width: 40%" />
        </colgroup>
        <tbody>
          <tr>
            <td class="py-4"><label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">지원자명</label></td>
            <!-- 입장 경로에 따라 선택할 수 있는 것과 없는 것 구분 -->
            <td class="pr-4">
              <AutoComplete
                v-if="$route.path === '/application/write'"
                id="name"
                class="w-full"
                v-model="selectedApplicantValue"
                :suggestions="applicantFilteredValue"
                optionLabel="name"
                placeholder="지원자명"
                dropdown
                display="chip"
                completeOnFocus
                @complete="searchApplicant($event)"
              />
              <InputText v-else id="name" type="text" placeholder="이름" :disabled="true" class="w-full" v-model="selectedApplicant.name" />
            </td>
            <td><label for="disability" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">장애유형</label></td>
            <td><InputText id="disability" type="text" placeholder="장애유형" :disabled="true" class="w-full" v-model="selectedApplicant.disability" /></td>
          </tr>
          <tr>
            <td><label for="gender" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">성별</label></td>
            <td class="pr-4"><InputText id="gender" type="text" placeholder="성별" :disabled="true" class="w-full" :modelValue="selectedApplicant.gender === 0 ? '남성' : selectedApplicant.gender === 1 ? '여성' : '-'" /></td>
            <td><label for="birth" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">생년월일</label></td>
            <td><InputText id="birth" type="text" placeholder="생년월일" :disabled="true" class="w-full" :modelValue="formatDate(selectedApplicant.birth)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 담당자 지정 -> 권한에 따라 그냥 담당자만 뜨거나, 담당자 지정 버튼이 뜨게 -->
    <Toast />
    <div v-if="user.type === 2 && $route.name === 'view'" class="card m-4 rounded-lg p-4 flex gap-4">
      <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium ml-2">담당자</label>
      <AutoComplete id="name" class="" v-model="selectedManagerValue" :suggestions="managerFilteredValue" optionLabel="name" placeholder="담당자명" dropdown display="chip" completeOnFocus @complete="searchManager($event)" />
      <Button label="담당자 지정" @click="assignManager" />
    </div>

    <div v-if="$route.path !== '/application/write'" class="md:flex-row flex gap-4">
      <ApplicationTabs class="md:w-1/5 flex h-175" />
      <div class="md:w-4/5 flex h-full overflow-auto">
        <router-view class="flex-1" />
      </div>
    </div>
    <div v-else class="h-full">
      <router-view class="flex-1" />
    </div>
  </div>
</template>
