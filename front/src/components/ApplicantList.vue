<script setup></script>
<template>
  <div class="card flex flex-col gap-4">
    <!-- 데이터 있을 때 -->
    <div v-if="myInfo">
      <div class="font-semibold text-xl text-black mb-5">보호자 {{ myInfo.name }}님 반갑습니다.</div>
      <div class="info-row">
        <span class="label">아이디</span>
        <span class="value">{{ myInfo.id }}</span>
      </div>
      <hr />
      <div class="info-row">
        <span class="label">연락처</span>
        <span class="value">{{ myInfo.phone ?? '-' }}</span>
      </div>
      <hr />
      <div class="info-row">
        <span class="label">이메일</span>
        <span class="value">{{ myInfo.email }}</span>
      </div>
      <hr />
      <div class="info-row">
        <span class="label">주소</span>
        <span class="value">{{ myInfo.address }}</span>
      </div>
      <hr />
      <div class="info-row">
        <span class="label">가입일</span>
        <span class="value">{{ formatDate(myInfo.created_date) }}</span>
      </div>
      <Button class="mt-8" label="나의 정보 수정"></Button>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="text-gray-400">지원자 목록를 불러오는 중입니다...</div>
  </div>
</template>
