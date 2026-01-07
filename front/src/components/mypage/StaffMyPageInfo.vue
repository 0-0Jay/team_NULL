<!-- components/mypage/StaffMyPageInfo.vue -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useUsersStore } from '@/stores/users';
import MyInfoEditModal from './EditMyInfoModal.vue';
import 'primeicons/primeicons.css';

const userStore = useUsersStore();
const myInfo = computed(() => userStore.myInfo);
const editOpen = ref(false);
const display = ref(false);
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

console.log(myInfo);

onMounted(() => {
  if (!user) return;
  userStore.fetchMyInfo(user.user_no);
});

function open() {
  editOpen.value = true;
}

function openCenter() {
  display.value = true;
}

function closeCenter() {
  display.value = false;
}

// 나의 정보 수정 함수
const updateMyInfo = async (formData) => {
  // 입력값 유효성 검증
  if (!formData.name?.trim() || !formData.phone || !formData.email?.trim()) {
    alert('필수 항목을 입력해주세요');
    return false;
  }
  // API 호출
  try {
    await userStore.modifyMyInfo(user.user_no, formData);
    await userStore.fetchMyInfo(user.user_no);
    alert('수정되었습니다.');
    return true;
  } catch (err) {
    console.error(err);
    alert('수정 실패');
    return false;
  }
};

const handleSave = async (formData) => {
  const success = await updateMyInfo(formData);

  if (success) {
    editOpen.value = false;
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
  <div class="card h-full flex flex-col">
    <!-- 데이터 있을 때 -->
    <div v-if="myInfo" class="flex flex-col gap-4 flex-1">
      <div class="text-xl mb-5 text-gray-500">
        기관담당자 <br /><span class="text-2xl font-bold text-black">{{ myInfo.name }} 님</span>
      </div>
      <table class="w-full border-collapse">
        <tbody>
          <tr>
            <td class="text-left">기관</td>
          </tr>
          <tr>
            <td class="flex items-center text-left text-lg py-2 font-medium border-b border-gray-300">
              <span class="mr-2">{{ myInfo.center_name }}</span
              ><span class="pi pi-exclamation-circle" style="color: gray" @click="openCenter"></span>
            </td>
          </tr>
          <tr>
            <td class="text-left pt-4">아이디</td>
          </tr>
          <tr>
            <td class="text-left text-lg py-2 font-medium border-b border-gray-300">{{ myInfo.id }}</td>
          </tr>
          <tr>
            <td class="text-left pt-4">연락처</td>
          </tr>
          <tr>
            <td class="text-left text-lg py-2 font-medium border-b border-gray-300">{{ myInfo.phone }}</td>
          </tr>
          <tr>
            <td class="text-left pt-4">이메일</td>
          </tr>
          <tr>
            <td class="text-left text-lg py-2 font-medium border-b border-gray-300">{{ myInfo.email }}</td>
          </tr>
          <tr>
            <td class="text-left pt-4">가입일</td>
          </tr>
          <tr>
            <td class="text-left text-lg py-2 font-medium">{{ formatDate(myInfo.created_date) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-center w-full mt-auto">
        <Button severity="success" class="mt-8 w-100 h-12" label="나의 정보 수정" @click="open" />
      </div>
    </div>

    <!-- 데이터 없을 때 -->
    <div v-else class="text-gray-400">회원 정보를 불러오는 중입니다...</div>

    <!-- 수정 모달 -->
    <MyInfoEditModal v-if="myInfo" :modalValue="editOpen" :myInfo="myInfo" :userType="myInfo.type" @update:modalValue="editOpen = $event" @save="handleSave"></MyInfoEditModal>
    <Dialog header="기관정보" class="text-center" v-model:visible="display" :style="{ width: '20vw' }" :modal="true">
      <p class="text-2xl font-bold">{{ myInfo.center_name }}</p>
      <p class="text-lg">{{ myInfo.center_address }}<br />{{ myInfo.center_phone }}</p>
      <template #footer>
        <Button label="확인" class="mt-8 w-100 h-12" @click="closeCenter" />
      </template>
    </Dialog>
  </div>
</template>
<style scoped>
.card {
  margin-top: 38px;
}
:deep(.info-row) {
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
