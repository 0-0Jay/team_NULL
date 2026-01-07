<!-- /views/MyPage.vue -->
<script setup>
import MyPageInfo from '@/components/mypage/MyPageInfo.vue';
import StaffMyPageInfo from '@/components/mypage/StaffMyPageInfo.vue';
import ApplicantList from '@/components/mypage/ApplicantList.vue';
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];
</script>
<template>
  <div class="md:flex-row flex gap-4 pt-15 h-screen">
    <!-- type에 따라 컴포넌트 선택 -->
    <MyPageInfo v-if="user.type === 0" class="md:w-1/5" />
    <StaffMyPageInfo v-else class="md:w-1/5" />
    <ApplicantList class="md:w-1/5" />
    <div class="md:w-3/5 flex h-full">
      <router-view class="flex-1" />
    </div>
  </div>
</template>
