<!-- /views/MyPage.vue -->
<script setup>
import MyPageInfo from '@/components/mypage/MyPageInfo.vue';
import StaffMyPageInfo from '@/components/mypage/StaffMyPageInfo.vue';
import ApplicantList from '@/components/mypage/ApplicantList.vue';
import ManagerMypageCenter from '@/components/mypage/ManagerMypageCenter.vue';
import StaffApplicantList from '@/components/mypage/StaffApplicantList.vue';
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];
const HEADER_HEIGHT = '3.75rem';
</script>
<template>
  <div class="md:flex-row flex gap-4 pt-12" :style="{ height: `calc(100vh - ${HEADER_HEIGHT})` }">
    <!-- type에 따라 컴포넌트 선택 -->
    <MyPageInfo v-if="user.type === 0" class="md:w-1/5 h-full flex" />
    <StaffMyPageInfo v-else class="md:w-1/5 h-full flex" />
    <ApplicantList v-if="user.type === 0" class="md:w-1/5 h-full flex" />
    <StaffApplicantList v-if="user.type === 1" class="md:w-1/5 h-full flex" />
    <div v-if="user.type === 0 || user.type === 1" class="md:w-3/5 flex h-full flex">
      <router-view class="flex-1" />
    </div>
    <ManagerMypageCenter v-if="user.type === 2" class="md:w-4/5 h-full flex" />
  </div>
</template>
