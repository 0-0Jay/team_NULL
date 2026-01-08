<script setup>
import ApplicationTabs from '@/components/ApplicationTabs.vue';
import ApplicationStageRequest from '@/components/ApplicationStatusRequest.vue';
import ApplicationAssignManager from '@/components/ApplicationAssignManager.vue';
import { useApplicationStore } from '@/stores/application';
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';

const aStore = useApplicationStore();
const route = useRoute();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

const applicant = ref([]);
const selectedApplicant = ref({ name: '', disability: '', gender: '', birth: '' });
const selectedApplicantValue = ref(null);
const applicantFilteredValue = ref([]);

onMounted(async () => {
  applicant.value = await aStore.fetchApplicant();
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

// 지원자(조회)
const applicationNo = Number(route.params.application_no);
const applicantInfo = computed(() => {
  if (!aStore.appList.length) return null;
  return aStore.appList.find((a) => a.application_no === applicationNo) ?? null;
});

//console.log(applicantInfo);
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
</script>
<template>
  <div class="grid pt-20 h-screen m-4 gap-4">
    <div class="card rounded-lg p-4">
      <div class="font-semibold text-xl">지원자 정보</div>
      <!-- 담당자 표시 -->
      <span v-if="applicantInfo?.m_name" class="text-sm text-gray-500">
        (담당자: <span class="text-green-600 font-medium">{{ applicantInfo.m_name }}</span
        >)
      </span>
      <hr />
      <div class="grid grid-cols-5 gap-4 mt-4">
        <div class="col-span-1">
          <div class="text-sm text-gray-500 mb-1">지원자명</div>
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

          <InputText v-else :disabled="true" class="w-full" v-model="selectedApplicant.name" />
        </div>

        <div class="col-span-1">
          <div class="text-sm text-gray-500 mb-1">성별</div>
          <InputText :disabled="true" class="w-full" :modelValue="selectedApplicant.gender === 0 ? '남성' : selectedApplicant.gender === 1 ? '여성' : '-'" />
        </div>

        <div class="col-span-1">
          <div class="text-sm text-gray-500 mb-1">생년월일</div>
          <InputText :disabled="true" class="w-full" :modelValue="formatDate(selectedApplicant.birth)" />
        </div>

        <div class="col-span-2">
          <div class="text-sm text-gray-500 mb-1">장애유형</div>
          <InputText :disabled="true" class="w-full" v-model="selectedApplicant.disability" />
        </div>
      </div>

      <div v-if="$route.name === 'view'" class="mt-6 pt-4 border-t border-gray-200">
        <div class="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <i class="pi pi-user" />
          <span>담당자 정보</span>
        </div>
        <!-- 담당자 지정 -> 권한에 따라 그냥 담당자만 뜨거나, 담당자 지정 버튼이 뜨게 -->
        <ApplicationAssignManager v-if="user.type === 2 && $route.name === 'view'" :applicationNo="applicationNo" :user="user" @assigned="aStore.fetchApplication()" />
      </div>
    </div>

    <!-- 대기단계 지정 -> 자식 컴포넌트 만듦 -->
    <ApplicationStageRequest :applicationNo="applicationNo" :applicantInfo="applicantInfo" :user="user" @requested="aStore.fetchApplication()" />

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
