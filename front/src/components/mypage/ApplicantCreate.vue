<!-- /component/mypage/ApplicantCreate.vue -->
<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';
import router from '@/router';

const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];
const route = useRoute();
const userStore = useUsersStore();
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

// 등록 함수
async function handleCreate() {
  // 1. 입력값 검증
  if (!formData.value.name?.trim() || !formData.value.birth || formData.value.gender === undefined || formData.value.zipcode == null || !formData.value.address?.trim() || !formData.value.disability?.trim()) {
    alert('필수 항목을 입력해주세요');
    return;
  }
  // 2. 날짜 포맷
  const d = formData.value.birth;
  const birth = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

  // 3. payload(서버 전송 객체) 생성
  const payload = {
    name: formData.value.name,
    birth,
    gender: formData.value.gender === '남' ? 0 : 1,
    zipcode: formData.value.zipcode,
    address: formData.value.address,
    address_detail: formData.value.address_detail,
    disability: formData.value.disability
  };

  console.log('payload being sent:', {
    user_no: user.user_no,
    ...payload
  });

  try {
    // 4. API 호출
    const res = await userStore.addApplicant(user.user_no, payload);
    if (res.status === 'success') {
      await userStore.fetchApplicant(user.user_no);
      alert('등록되었습니다.');
      router.push(`/mypage/${res.a_no}`);
    } else {
      alert('등록 실패');
    }
  } catch (e) {
    console.error(e);
    alert('서버 오류');
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

const today = computed(() => formatDate(new Date()));
</script>
<template>
  <div class="card h-full flex flex-col">
    <div class="font-semibold text-xl pb-2">지원자 등록</div>

    <table class="w-full border-collapse">
      <tbody>
        <!-- 이름 -->
        <tr class="border-t-4 border-b">
          <th class="text-left px-2 py-2 border-r w-1/4">이름</th>
          <td class="px-2 py-2">
            <InputText type="text" class="w-full" v-model="formData.name" />
          </td>
        </tr>

        <!-- 생년월일 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">생년월일</th>
          <td class="px-2 py-2">
            <DatePicker v-model="formData.birth" showIcon fluid iconDisplay="input" inputId="icondisplay" />
          </td>
        </tr>

        <!-- 성별 -->
        <tr class="border-b">
          <th class="text-left px-2 py-3 border-r">성별</th>
          <td class="px-4 py-4">
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

        <!-- 주소 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">주소</th>
          <td class="px-2 py-2 flex flex-col gap-2">
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

        <!-- 장애유형 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">장애유형</th>
          <td class="px-2 py-2">
            <InputText type="text" class="w-full" v-model="formData.disability" />
          </td>
        </tr>

        <!-- 등록일 -->
        <tr class="border-b">
          <th class="text-left px-2 py-4 border-r">등록일</th>
          <td class="px-4 py-3">{{ today }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 버튼 -->
    <div class="flex gap-2 justify-end mt-4">
      <Button label="등록" @click="handleCreate" />
    </div>
  </div>
</template>
