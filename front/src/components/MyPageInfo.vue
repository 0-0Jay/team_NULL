<!-- components/MyPageInfo.vue -->
<script setup>
import { computed, onMounted } from 'vue';
import { useUsersStore } from '@/stores/users';
const userStore = useUsersStore();
const myInfo = computed(() => userStore.myInfo);

onMounted(() => {
  userStore.fetchMyInfo();
});

// 날짜 포맷 함수
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
</script>
<template>
  <div class="card flex flex-col gap-4">
    <!-- 데이터 있을 때 -->
    <div v-if="myInfo">
      <div class="font-semibold text-xl text-black">보호자 {{ myInfo.name }}님 반갑습니다.</div>
      <div class="info-row">
        <span class="label">아이디</span>
        <span class="value">{{ myInfo.id }}</span>
      </div>
      <div class="info-row">
        <span class="label">연락처</span>
        <span class="value">{{ myInfo.phone }}</span>
      </div>
      <div class="info-row">
        <span class="label">이메일</span>
        <span class="value">{{ myInfo.email }}</span>
      </div>
      <div class="info-row">
        <span class="label">주소</span>
        <span class="value">{{ myInfo.address }}</span>
      </div>
      <div class="info-row">
        <span class="label">가입일</span>
        <span class="value">{{ formatDate(myInfo.created_date) }}</span>
      </div>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="text-gray-400">회원 정보를 불러오는 중입니다...</div>
  </div>
</template>
<style>
.card {
  margin-top: 38px;
}
.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.label {
  font-size: 0.9rem;
  color: #888;
}
.value {
  font-size: 1rem;
  font-weight: 500;
}
</style>
