<!-- /component/mypage/EditMyInfoModal.vue -->
<script setup>
import { reactive, watch, ref, computed } from 'vue';
import { useUsersStore } from '@/stores/users';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router';
const userStore = useUsersStore();
const visible = ref(false);
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0] ?? null;
const userNo = user?.user_no;

const props = defineProps({
  modalValue: Boolean,
  myInfo: { type: Object, default: () => ({}) }
});

const isStaff = computed(() => {
  const type = Number(props.myInfo?.type);
  return type === 1 || type === 2;
});

const emit = defineEmits(['update:modalValue', 'save']);

const formData = reactive({
  center_name: '',
  name: '',
  phone: '',
  email: '',
  zipcode: '',
  address: '',
  address_detail: ''
});

watch(
  () => props.modalValue,
  (open) => {
    if (!open) return;
    const info = props.myInfo ?? {};

    formData.center_name = info.center_name ?? '';
    formData.name = info.name ?? '';
    formData.phone = info.phone ?? '';
    formData.email = info.email ?? '';
    formData.zipcode = info.zipcode ?? '';
    formData.address = info.address ?? '';
    formData.address_detail = info.address_detail ?? '';

    console.log(props.myInfo);
  }
);

const close = () => emit('update:modalValue', false);

const save = () => {
  emit('save', { ...formData });
};

// 우편번호 검색
const display = ref(false);
const addressSearched = (data) => {
  formData.zipcode = data.zonecode;
  formData.address = data.roadAddress;
  closeAddress();
};
function openAddress() {
  display.value = true;
}
function closeAddress() {
  display.value = false;
}

// 비밀번호 변경
const password = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 각 Input별 에러 메시지
const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

async function changePassword() {
  // 1.초기화
  passwordErrors.currentPassword = '';
  passwordErrors.newPassword = '';
  passwordErrors.confirmPassword = '';

  // 2. 빈칸 체크: 각 칸별로 메시지
  if (!password.currentPassword) {
    passwordErrors.currentPassword = '모든 입력란을 채워주세요.';
  }
  if (!password.newPassword) {
    passwordErrors.newPassword = '모든 입력란을 채워주세요.';
  }
  if (!password.confirmPassword) {
    passwordErrors.confirmPassword = '모든 입력란을 채워주세요.';
  }

  // 빈칸이 하나라도 있으면 여기서 리턴
  if (passwordErrors.currentPassword || passwordErrors.newPassword || passwordErrors.confirmPassword) {
    return;
  }

  // 3. 현재 비밀번호 검증
  if (password.currentPassword !== props.myInfo.password) {
    passwordErrors.currentPassword = '현재 비밀번호가 일치하지 않습니다.';
    return;
  }

  // 4. 새 비밀번호 길이 체크
  if (password.newPassword.length < 6) {
    passwordErrors.newPassword = '비밀번호는 6자리 이상이어야 합니다.';
    return;
  }

  // 5. 새 비밀번호 확인
  if (password.newPassword !== password.confirmPassword) {
    passwordErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    return;
  }

  // API 호출
  try {
    if (!userNo) {
      alert('로그인 정보가 없습니다.');
      return;
    }
    const res = await userStore.changePw({
      user_no: userNo,
      pw: password.newPassword
    });

    if (res.status === 'success') {
      alert('비밀번호 변경 완료');
      password.currentPassword = '';
      password.newPassword = '';
      password.confirmPassword = '';
      passwordErrors.currentPassword = '';
      passwordErrors.newPassword = '';
      passwordErrors.confirmPassword = '';
    } else {
      alert(res.message || '비밀번호 변경 실패');
    }
  } catch (err) {
    alert('서버 오류');
  }
}

// 회원 탈퇴 함수
function openWithdrawConfirm() {
  visible.value = true;
}
async function withdrawUser() {
  if (!user) {
    alert('로그인이 필요합니다.');
    return;
  }
  const result = await userStore.withdrawUser(user.user_no);
  if (result.status === 'success') {
    close();
    userStore.logout();
    router.replace('/');
    // 토스트 추가하기
  } else {
    alert(result.message);
  }
}

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
  <Dialog header="나의 정보 수정" :visible="modalValue" @update:visible="emit('update:modalValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
    <table class="w-full border-collapse">
      <tbody>
        <tr class="border-t-4 border-b">
          <th class="text-left py-2 px-2 w-1/4 border-r">이름</th>
          <td class="py-2 px-2" colspan="2"><InputText v-model="formData.name" type="text" class="w-full" /></td>
        </tr>
        <tr v-if="isStaff" class="border-b">
          <th class="text-left py-2 px-2 border-r">기관</th>
          <td class="py-2 px-2" colspan="2"><InputText v-model="myInfo.center_name" type="text" class="w-full" disabled /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">아이디</th>
          <td class="py-2 px-2" colspan="2"><InputText v-model="myInfo.id" type="text" class="w-full" disabled /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">연락처</th>
          <td class="py-2 px-2" colspan="2"><InputText v-model="formData.phone" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">이메일</th>
          <td class="py-2 px-2" colspan="2"><InputText v-model="formData.email" type="text" class="w-full" /></td>
        </tr>
        <tr v-if="!isStaff" class="border-b">
          <th class="text-left py-2 px-2 border-r">주소</th>
          <td class="py-2 px-2" colspan="2">
            <!-- 우편번호 + 버튼 묶음 -->
            <div class="flex gap-2 mb-2">
              <InputText id="modal_zipcode" type="text" placeholder="우편번호" v-model="formData.zipcode" disabled />
              <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                <VueDaumPostcode @complete="addressSearched" />
              </Dialog>
              <Button label="우편번호 검색" @click="openAddress"></Button>
            </div>
            <!-- 주소 -->
            <InputText id="modal_address" type="text" placeholder="도로명주소" class="w-full mb-2" v-model="formData.address" disabled />
            <InputText id="modal_addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="formData.address_detail" />
          </td>
        </tr>
        <!-- 비밀번호 -->
        <tr>
          <th class="py-2 px-2 border-r text-left" rowspan="4">비밀번호</th>
          <td class="pt-2 py-1 px-4 w-1/4">현재 비밀번호</td>
          <td class="pt-2 py-1 px-2 w-3/4">
            <InputText v-model="password.currentPassword" type="password" class="w-full" />
            <!-- 에러 메시지 -->
            <p v-if="passwordErrors.currentPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.currentPassword }}
            </p>
          </td>
        </tr>

        <tr>
          <td class="py-1 px-4">새 비밀번호</td>
          <td class="py-1 px-2">
            <InputText v-model="password.newPassword" type="password" class="w-full" />
            <!-- 에러 메시지 -->
            <p v-if="passwordErrors.newPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.newPassword }}
            </p>
          </td>
        </tr>

        <tr>
          <td class="py-1 px-4">비밀번호 확인</td>
          <td class="py-1 px-2">
            <InputText v-model="password.confirmPassword" type="password" class="w-full" />
            <!-- 에러 메시지 -->
            <p v-if="passwordErrors.confirmPassword" class="text-red-600 text-sm mt-1">
              {{ passwordErrors.confirmPassword }}
            </p>
          </td>
        </tr>

        <tr>
          <td colspan="2" class="py-2 px-2 text-center">
            <Button label="비밀번호 변경" class="w-60" @click="changePassword" />
          </td>
        </tr>
        <tr class="border-b border-t">
          <th class="border-r py-2 px-2 text-left">가입일</th>
          <td class="py-2 px-4">
            {{ formatDate(myInfo.created_date) }}
          </td>
          <td class="py-2 px-2 text-right"><Button label="회원탈퇴" severity="secondary" @click="openWithdrawConfirm" /></td>
        </tr>
      </tbody>
    </table>
    <ConfirmDialog v-model:visible="visible" @confirm="withdrawUser"> 정말로 탈퇴하시겠습니까? </ConfirmDialog>

    <template #footer>
      <div class="flex justify-center w-full">
        <Button label="수정" severity="warn" class="w-30" @click="save" />
      </div>
    </template>
  </Dialog>
</template>
