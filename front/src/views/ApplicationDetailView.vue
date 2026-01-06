<script setup>
import ApplicationTabs from '@/components/ApplicationTabs.vue';
import { ref, onMounted } from 'vue';

const applicant = ref([]);
const selectedApplicantValue = ref(null);
const applicantFilteredValue = ref([]);
const disability = ref('');
const gender = ref('');
const birth = ref('');

onMounted(() => {
  // applicant로 값 가져오는 로직 여기에 입력 데이터는 [{name: '', ...}, ...] 형식
});

function searchApplicant(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      applicantFilteredValue.value = [...applicant.value];
    } else {
      applicantFilteredValue.value = applicant.value.filter((a) => {
        return a.name.toLowerCase().startsWith(event.query.toLowerCase());
      });
    }
  }, 250);
}
</script>
<template>
  <div class="card m-4">
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
            <AutoComplete id="name" class="w-full" v-model="selectedApplicantValue" :suggestions="applicantFilteredValue" optionLabel="name" placeholder="지원자명" dropdown multiple display="chip" @complete="searchApplicant($event)" />
          </td>
          <td><label for="disability" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">장애유형</label></td>
          <td><InputText id="disability" type="text" placeholder="장애유형" :disabled="true" class="w-full" v-model="disability" /></td>
        </tr>
        <tr>
          <td><label for="gender" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">성별</label></td>
          <td class="pr-4"><InputText id="gender" type="text" placeholder="성별" :disabled="true" class="w-full" v-model="gender" /></td>
          <td><label for="birth" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">생년월일</label></td>
          <td><InputText id="birth" type="text" placeholder="생년월일" :disabled="true" class="w-full" v-model="birth" /></td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- 담당자 지정 -> 권한에 따라 그냥 담당자만 뜨거나, 담당자 지정 버튼이 뜨게 -->
  <div class="card flex m-4 gap-4">
    <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium ml-2">담당자</label>
    <AutoComplete id="name" class="" v-model="selectedApplicantValue" :suggestions="applicantFilteredValue" optionLabel="name" placeholder="담당자명" dropdown multiple display="chip" @complete="searchApplicant($event)" />
    <Button label="담당자 지정" />
  </div>

  <div class="md:flex-row flex gap-4 m-4 h-screen">
    <ApplicationTabs class="md:w-1/4 flex h-full" />
    <div class="md:w-3/4 flex h-full">
      <router-view class="flex-1" />
    </div>
  </div>
</template>
