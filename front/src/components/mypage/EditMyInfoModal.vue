<!-- /component/mypage/EditMyInfoModal.vue -->
<script setup>
import { reactive, watch, ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router';
const userStore = useUsersStore();
const visible = ref(false);

const props = defineProps({
  modalValue: Boolean,
  myInfo: { type: Object, default: () => ({}) }
});

const emit = defineEmits(['update:modalValue', 'save']);

const formData = reactive({
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

    formData.name = info.name ?? '';
    formData.phone = info.phone ?? '';
    formData.email = info.email ?? '';
    formData.zipcode = info.zipcode ?? '';
    formData.address = info.address ?? '';
    formData.address_detail = info.address_detail ?? '';
  }
);

const close = () => emit('update:modalValue', false);

const save = () => {
  emit('save', { ...formData });
  close();
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

// 회원 탈퇴 함수
function openWithdrawConfirm() {
  visible.value = true;
}
async function withdrawUser() {
  const result = await userStore.withdrawUser();
  if (result.status === 'success') {
    alert('탈퇴 되었습니다.');
    router.push('/');
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
          <td class="py-2 px-2"><InputText v-model="formData.name" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">아이디</th>
          <td class="py-2 px-2"><InputText v-model="myInfo.id" type="text" class="w-full" disabled /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">연락처</th>
          <td class="py-2 px-2"><InputText v-model="formData.phone" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">이메일</th>
          <td class="py-2 px-2"><InputText v-model="formData.email" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">주소</th>
          <td class="py-2 px-2">
            <!-- 우편번호 + 버튼 묶음 -->
            <div class="flex gap-2 mb-2">
              <InputText id="zipcode" type="text" placeholder="우편번호" v-model="formData.zipcode" disabled />
              <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                <VueDaumPostcode @complete="addressSearched" />
              </Dialog>
              <Button label="우편번호 검색" @click="openAddress"></Button>
            </div>
            <!-- 주소 -->
            <InputText id="address" type="text" placeholder="도로명주소" class="w-full mb-2" v-model="formData.address" disabled />
            <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="formData.address_detail" />
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">가입일</th>
          <td class="py-2 px-2 flex justify-between items-center">
            <span>{{ formatDate(myInfo.created_date) }}</span>
            <Button label="회원탈퇴" severity="secondary" @click="openWithdrawConfirm" />
          </td>
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
