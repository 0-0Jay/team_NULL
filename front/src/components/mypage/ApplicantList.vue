<!-- /component/mypage/ApplicantList.vue -->

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import 'primeicons/primeicons.css';

const router = useRouter();
const route = useRoute();
const userStore = useUsersStore();

const applicant = computed(() => userStore.applicant);
const total = computed(() => applicant.value.length);

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];
  if (!user?.user_no) return;
  userStore.fetchApplicant(user.user_no);
});

function selectedApplicant(a_no) {
  router.push({ name: 'myPageApplicantDetail', params: { a_no } });
}

function createApplicant() {
  router.push({ name: 'myPageApplicantCreate' });
}
</script>
<template>
  <div class="card flex flex-col gap-4 h-full">
    <!-- 헤더 -->
    <div>
      <div class="font-semibold text-xl text-black">지원자 목록</div>
      <div class="text-lg text-right mb-3">총 {{ total }}명</div>
    </div>
    <!-- 데이터 있을 때, 스크롤 -->
    <div v-if="applicant.length" class="flex-1 overflow-y-auto">
      <ul>
        <li
          v-for="app in applicant"
          :key="app.a_no"
          class="text-lg cursor-pointer pt-2 pr-2"
          :class="{ 'border-l-5 pl-3 pt-2 border-blue-500': route.name === 'myPageApplicantDetail' && Number(route.params.a_no) === app.a_no }"
          @click="selectedApplicant(app.a_no)"
        >
          <div class="flex justify-between items-center">
            <span :class="{ 'font-bold': route.name === 'myPageApplicantDetail' && Number(route.params.a_no) === app.a_no }">{{ app.name }}</span
            ><span class="pi pi-arrow-circle-right" style="font-size: 1.5rem"></span>
          </div>
          <hr />
        </li>
      </ul>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="flex-1 flex items-center justify-center text-gray-400 text-center">지원자 목록이 없습니다.</div>

    <!-- 등록 버튼 -->
    <div class="flex justify-center w-full mt-auto">
      <Button class="mt-8 w-100 h-12" severity="info" label="지원자 등록" @click="createApplicant()"></Button>
    </div>
  </div>
</template>
