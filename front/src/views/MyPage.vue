<!-- /views/MyPage.vue -->
<script setup>
import MyPageInfo from '@/components/mypage/MyPageInfo.vue';
import ApplicantList from '@/components/mypage/ApplicantList.vue';
import ApplicantDetail from '@/components/mypage/ApplicantDetail.vue';
</script>
<template>
  <div class="md:flex-row flex gap-4 pt-15 h-screen">
    <MyPageInfo class="md:w-1/5" />
    <ApplicantList class="md:w-1/5" />
    <div class="md:w-3/5 flex h-full">
      <router-view class="flex-1" />
    </div>
  </div>
</template>
