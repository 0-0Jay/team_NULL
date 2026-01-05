<!-- /component/mypage/ApplicantList.vue -->

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import 'primeicons/primeicons.css';
const router = useRouter();
const userStore = useUsersStore();
const applicant = computed(() => userStore.applicant);
const total = computed(() => applicant.value.length);

onMounted(() => {
  userStore.fetchApplicant();
});

function selectedApplicant(a_no) {
  router.push(`/myPage/${a_no}`);
}

function createApplicant() {
  router.push(`/myPage/new`);
}
</script>
<template>
  <div class="card flex flex-col gap-4 flex">
    <!-- 데이터 있을 때 -->
    <div v-if="applicant.length" class="flex flex-col gap-4 flex-1">
      <div class="font-semibold text-xl text-black">지원자 목록</div>
      <div class="text-lg text-right mb-3">총 {{ total }}명</div>
      <ul>
        <li v-for="app in applicant" :key="app.a_no" class="text-lg cursor-pointer" @click="selectedApplicant(app.a_no)">
          <div class="flex justify-between items-center">
            <span>{{ app.name }}</span
            ><span class="pi pi-arrow-circle-right" style="font-size: 1.5rem"></span>
          </div>
          <hr />
        </li>
      </ul>
      <div class="flex justify-center w-full mt-auto">
        <Button class="mt-8 w-100 h-12" severity="info" label="지원자 등록" @click="createApplicant()"></Button>
      </div>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="text-gray-400">지원자 목록을 불러오는 중입니다...</div>
  </div>
</template>
