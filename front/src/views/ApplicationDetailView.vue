<script setup>
import ApplicationTabs from '@/components/ApplicationTabs.vue';
import { useApplicationStore } from '@/stores/application';
import { useRoute } from 'vue-router';
import { ref, computed, watch, onMounted } from 'vue';
  import { useUsersStore } from '@/stores/users';

const aStore = useApplicationStore();
const route = useRoute();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

const applicant = ref([]);
const selectedApplicantValue = ref(null);
const applicantFilteredValue = ref([]);
const disability = ref('');
const gender = ref('');
const birth = ref('');
const uStore = useUsersStore();
const name = ref('');

onMounted(async () => {
  if (user.type == 0) {
    // 일반회원
    applicant.value = await uStore.fetchApplicant();
  } else if (user.type == 1) {
    // 담당자
    applicant.value = await uStore.fetchCenterApplicant();
  }
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

const appNo = Number(route.params.application_no);
const applicantInfo = computed(() => {
  if (!store.appList.length) return null;
  return store.appList.find((a) => a.application_no === appNo) ?? null;
});

watch(
  applicantInfo,
  (val) => {
    if (!val) return;
    name.value = val.ap_name;
    gender.value = val.gender;
    birth.value = val.birth;
    disability.value = val.disability;
  },
  { immediate: true }
);

const searchApplicant = (event) => {
  setTimeout(() => {
    if (!event.query.trim().length) {
      applicantFilteredValue.value = [...applicant.value];
    } else {
      applicantFilteredValue.value = applicant.value.filter((a) => {
        return a.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
};
</script>
<template>
  <div class="pt-20 h-screen">
    <div class="card m-4 rounded-lg p-4">
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
              <!-- <AutoComplete id="name" class="w-full" v-model="selectedApplicantValue" :suggestions="applicantFilteredValue" optionLabel="name" placeholder="지원자명" dropdown multiple display="chip" @complete="searchApplicant($event)" /> -->
              <InputText id="name" type="text" placeholder="이름" :disabled="true" class="w-full" v-model="name" />
            </td>
            <td><label for="disability" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">장애유형</label></td>
            <td><InputText id="disability" type="text" placeholder="장애유형" :disabled="true" class="w-full" v-model="disability" /></td>
          </tr>
          <tr>
            <td><label for="gender" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">성별</label></td>
            <td class="pr-4"><InputText id="gender" type="text" placeholder="성별" :disabled="true" class="w-full" :modelValue="gender === 0 ? '남성' : gender === 1 ? '여성' : '-'" /></td>
            <td><label for="birth" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">생년월일</label></td>
            <td><InputText id="birth" type="text" placeholder="생년월일" :disabled="true" class="w-full" :modelValue="formatDate(birth)" /></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 담당자 지정 -> 권한에 따라 그냥 담당자만 뜨거나, 담당자 지정 버튼이 뜨게 -->
    <div v-if="user.type === 2" class="card m-4 rounded-lg p-4 flex gap-4">
      <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium ml-2">담당자</label>
      <AutoComplete id="name" class="" v-model="selectedApplicantValue" :suggestions="applicantFilteredValue" optionLabel="name" placeholder="담당자명" dropdown multiple display="chip" @complete="searchApplicant($event)" />
      <Button label="담당자 지정" />
    </div>

    <div v-if="$route.path !== '/application/write'" class="md:flex-row flex gap-4 m-4">
      <ApplicationTabs class="md:w-1/5 flex h-full" />
      <div class="md:w-4/5 flex h-full">
        <router-view class="flex-1" />
      </div>
    </div>
    <div v-else>
      <router-view class="flex-1" />
    </div>
  </div>
</template>
