<!-- /views/MyPage.vue -->
<script setup>
import MyPageInfo from '@/components/MyPageInfo.vue';
import ApplicantList from '@/components/ApplicantList.vue';
import ApplicantDetail from '@/components/ApplicantDetail.vue';
</script>
<template>
  <div class="md:flex-row flex gap-4 pt-15 h-screen">
    <MyPageInfo class="md:w-1/5" />
    <ApplicantList class="md:w-1/5" />
    <ApplicantDetail class="md:w-3/5" />
  </div>
</template>
