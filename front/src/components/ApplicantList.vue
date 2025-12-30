<script setup>
import { computed, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
import 'primeicons/primeicons.css';
const userStore = useUsersStore();
const applicant = computed(() => userStore.applicant);
const total = computed(() => applicant.value.length);

onMounted(() => {
  userStore.fetchApplicant();
});

function selectedApplicant(app) {
  const ANo = app.a_no;
  userStore.setSelectedApplicantNo(ANo);
}
</script>
<template>
  <div class="card flex flex-col gap-4">
    <!-- 데이터 있을 때 -->
    <div v-if="applicant.length">
      <div class="font-semibold text-xl text-black">지원자 목록</div>
      <div class="text-lg text-right mb-3">총 {{ total }}명</div>
      <ul>
        <li v-for="app in applicant" :key="app.a_no" class="text-lg" @click="selectedApplicant(app)">
          <div class="flex justify-between items-center">
            <span>{{ app.name }}</span
            ><span class="pi pi-arrow-circle-right" style="font-size: 1.5rem"></span>
          </div>
          <hr />
        </li>
      </ul>

      <Button class="mt-8" label="지원자 등록"></Button>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="text-gray-400">지원자 목록를 불러오는 중입니다...</div>
  </div>
</template>
