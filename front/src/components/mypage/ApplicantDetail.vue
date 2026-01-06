<!-- /component/mypage/ApplicantDetail.vue -->
<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router';

const route = useRoute();
const userStore = useUsersStore();
const applicantDetail = computed(() => userStore.applicantDetail);
const aNo = ref(null);
const visible = ref(false);
const formData = ref({
  name: '',
  gender: '',
  birth: '',
  zipcode: '',
  address: '',
  address_detail: '',
  type: ''
});
const addressSearched = (data) => {
  formData.value.zipcode = data.zonecode;
  formData.value.address = data.roadAddress;
  closeAddress();
};
const display = ref(false);
function openAddress() {
  display.value = true;
}
function closeAddress() {
  display.value = false;
}

watch(
  () => route.params.a_no,
  (a_no) => {
    if (!a_no) return;
    userStore.fetchApplicantDetail(a_no);
  },
  { immediate: true }
);

watch(applicantDetail, (detail) => {
  if (!detail) return;
  formData.value = {
    name: detail.name,
    gender: detail.gender === 0 ? '남' : '여',
    birth: new Date(detail.birth),
    zipcode: detail.zipcode,
    address: detail.address,
    address_detail: detail.address_detail,
    disability: detail.disability
  };
});

// 수정 함수
async function handleUpdate() {
  // 1. 입력값 유효성 검증
  if (!formData.value.name?.trim() || !formData.value.birth || formData.value.gender === undefined || formData.value.zipcode == null || !formData.value.address?.trim() || !formData.value.disability?.trim()) {
    alert('필수 항목을 입력해주세요');
    return;
  }
  // 2. 날짜 포맷
  const d = formData.value.birth;
  const birth = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

  // 3. payload(서버 전송 객체) 생성
  const payload = {
    a_no: route.params.a_no,
    name: formData.value.name,
    birth,
    gender: formData.value.gender === '남' ? 0 : 1,
    zipcode: formData.value.zipcode,
    address: formData.value.address,
    address_detail: formData.value.address_detail,
    disability: formData.value.disability
  };
  // 4. API 호출
  try {
    await userStore.modifyApplicant(payload);
    await userStore.fetchApplicantDetail(route.params.a_no);
    alert('수정되었습니다.');
  } catch (err) {
    console.error(err);
    alert('수정 실패');
  }
}

// 삭제 함수
function openDelConfirm() {
  visible.value = true;
}
async function delApplicant() {
  if (!route.params.a_no) return;
  visible.value = false;
  // API 호출
  try {
    await userStore.deleteApplicant(route.params.a_no);
    await userStore.fetchApplicant();
    router.push(`/myPage`);
    alert('삭제되었습니다.');
  } catch (err) {
    console.error(err);
    alert('삭제 실패');
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
  <div class="card flex flex-col gap-4 max-h-[calc(100vh-120px)] p-4">
    <div class="font-semibold text-xl">{{ applicantDetail.name }} 정보</div>
    <table class="w-full border-collapse">
      <tbody>
        <tr class="border-t-4 border-b border-gray-300">
          <th class="text-left py-2 px-2 w-1/4 border-r">이름</th>
          <td class="py-2 px-2">
            <InputText type="text" class="w-full" v-model="formData.name" />
          </td>
        </tr>

        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">생년월일</th>
          <td class="py-2 px-2">
            <DatePicker v-model="formData.birth" showIcon fluid iconDisplay="input" inputId="icondisplay" />
          </td>
        </tr>

        <tr class="border-b">
          <th class="text-left py-4 px-2 border-r">성별</th>
          <td class="px-4 py-2">
            <div class="flex gap-6 items-center h-full">
              <label class="flex items-center gap-2">
                <RadioButton v-model="formData.gender" inputId="male" value="남" />
                <span>남</span>
              </label>
              <label class="flex items-center gap-2">
                <RadioButton v-model="formData.gender" inputId="female" value="여" />
                <span>여</span>
              </label>
            </div>
          </td>
        </tr>

        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">주소</th>
          <td class="py-2 px-2 flex flex-col gap-2">
            <div class="flex gap-2">
              <InputText id="zipcode" type="text" placeholder="우편번호" v-model="formData.zipcode" disabled />
              <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                <VueDaumPostcode @complete="addressSearched" />
              </Dialog>
              <Button label="우편번호 검색" @click="openAddress" />
            </div>
            <InputText id="address" type="text" placeholder="도로명주소" class="w-full" v-model="formData.address" disabled />
            <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="formData.address_detail" />
          </td>
        </tr>

        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">장애유형</th>
          <td class="py-2 px-2">
            <InputText type="text" class="w-full" v-model="formData.disability" />
          </td>
        </tr>

        <tr class="border-b">
          <th class="text-left py-4 px-2 border-r">등록일</th>
          <td class="py-2 px-4">{{ formatDate(applicantDetail.created_date) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex gap-2 justify-end mt-4">
      <Button label="수정" @click="handleUpdate" />
      <Button label="삭제" severity="danger" @click="openDelConfirm" />
    </div>

    <ConfirmDialog v-model:visible="visible" @confirm="delApplicant"> 정말로 삭제하시겠습니까? </ConfirmDialog>
  </div>
</template>
