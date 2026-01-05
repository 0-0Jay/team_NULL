<!-- components/mypage/MyPageInfo.vue -->
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import MyInfoEditModal from './EditMyInfoModal.vue';
const userStore = useUsersStore();
const myInfo = computed(() => userStore.myInfo);
const editOpen = ref(false);

onMounted(() => {
  userStore.fetchMyInfo();
});

function open() {
  editOpen.value = true;
}

// 나의 정보 수정 함수
const updateMyInfo = async (formData) => {
  // 입력값 유효성 검증
  if (!formData.name?.trim() || !formData.phone || !formData.email?.trim() || formData.zipcode == null || !formData.address?.trim()) {
    alert('필수 항목을 입력해주세요');
    return;
  }
  // API 호출
  try {
    await userStore.modifyMyInfo(formData);
    await userStore.fetchMyInfo();
    alert('수정되었습니다.');
  } catch (err) {
    console.error(err);
    alert('수정 실패');
  }
};

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
  <div class="h-full flex flex-col max-h-[calc(100vh-80px)]">
    <div class="card flex flex-col gap-4 flex-1">
      <!-- 데이터 있을 때 -->
      <div v-if="myInfo" class="flex flex-col gap-4 flex-1">
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
          <span class="value">{{ myInfo.address }} {{ myInfo.address_detail }}</span>
        </div>
        <hr />
        <div class="info-row">
          <span class="label">가입일</span>
          <span class="value">{{ formatDate(myInfo.created_date) }}</span>
        </div>
        <div class="flex justify-center w-full mt-auto">
          <Button severity="success" class="mt-8 w-100 h-12" label="나의 정보 수정" @click="open" />
        </div>
      </div>

      <!-- 데이터 없을 때 -->
      <div v-else class="text-gray-400">회원 정보를 불러오는 중입니다...</div>
    </div>
    <!-- 수정 모달 -->
    <MyInfoEditModal :modalValue="editOpen" :myInfo="myInfo" @update:modalValue="editOpen = $event" @save="updateMyInfo"></MyInfoEditModal>
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
