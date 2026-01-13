<!-- /component/mypage/ApplicantCreate.vue -->
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';
import router from '@/router';

const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];
const route = useRoute();
const userStore = useUsersStore();
const toast = useToast();

const formData = ref({
  name: '',
  gender: '',
  birth: '',
  zipcode: '',
  address: '',
  address_detail: '',
  disability: ''
});

const errors = ref({
  name: '',
  birth: '',
  gender: '',
  zipcode: '',
  address: '',
  disability: ''
});

// 주소 검색
const display = ref(false);
const openAddress = () => (display.value = true);
const closeAddress = () => (display.value = false);

const addressSearched = (data) => {
  formData.value.zipcode = data.zonecode;
  formData.value.address = data.roadAddress;
  closeAddress();
};

// 입력값 검증
function validateForm() {
  let isValid = true;

  Object.keys(errors.value).forEach((k) => (errors.value[k] = ''));

  if (!formData.value.name?.trim()) {
    errors.value.name = '이름을 입력해주세요';
    isValid = false;
  }
  if (!formData.value.birth) {
    errors.value.birth = '생년월일을 선택해주세요';
    isValid = false;
  }
  if (!formData.value.gender) {
    errors.value.gender = '성별을 선택해주세요';
    isValid = false;
  }
  if (!formData.value.zipcode) {
    errors.value.zipcode = '주소를 검색해주세요';
    isValid = false;
  }
  if (!formData.value.address?.trim()) {
    errors.value.address = '주소를 입력해주세요';
    isValid = false;
  }
  if (!formData.value.disability?.trim()) {
    errors.value.disability = '장애유형을 입력해주세요';
    isValid = false;
  }

  return isValid;
}

// 등록
async function handleCreate() {
  if (!validateForm()) return;

  const d = formData.value.birth;
  const birth = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

  const payload = {
    name: formData.value.name,
    birth,
    gender: formData.value.gender === '남' ? 0 : 1,
    zipcode: formData.value.zipcode,
    address: formData.value.address,
    address_detail: formData.value.address_detail,
    disability: formData.value.disability
  };

  try {
    const res = await userStore.addApplicant(user.user_no, payload);

    if (res.status === 'success') {
      await userStore.fetchApplicant(user.user_no);

      toast.add({
        severity: 'success',
        summary: '등록 완료',
        detail: '지원자가 등록되었습니다.',
        life: 3000,
        closable: false
      });

      router.push(`/mypage/${res.a_no}`);
    } else {
      toast.add({
        severity: 'error',
        summary: '등록 실패',
        detail: '등록에 실패했습니다.',
        life: 3000,
        closable: false
      });
    }
  } catch (e) {
    console.error(e);
    toast.add({
      severity: 'error',
      summary: '서버 오류',
      detail: '잠시 후 다시 시도해주세요.',
      life: 3000,
      closable: false
    });
  }
}

// 날짜 표시
const formatDate = (v) => {
  const d = new Date(v);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

const today = computed(() => formatDate(new Date()));
</script>

<template>
  <div class="card h-full flex flex-col">
    <Toast />
    <div class="font-semibold text-xl pb-2">지원자 등록</div>

    <table class="w-full border-collapse">
      <tbody>
        <!-- 이름 -->
        <tr class="border-t-4 border-b">
          <th class="text-left px-2 py-2 border-r w-1/4">이름</th>
          <td class="px-2 py-2">
            <InputText class="w-full" v-model="formData.name" />
            <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
          </td>
        </tr>

        <!-- 생년월일 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">생년월일</th>
          <td class="px-2 py-2">
            <DatePicker v-model="formData.birth" showIcon fluid />
            <small v-if="errors.birth" class="text-red-500">{{ errors.birth }}</small>
          </td>
        </tr>

        <!-- 성별 -->
        <tr class="border-b">
          <th class="text-left px-2 py-3 border-r">성별</th>
          <td class="px-4 py-4">
            <div class="flex gap-6">
              <label class="flex gap-2">
                <RadioButton v-model="formData.gender" value="남" />
                <span>남</span>
              </label>
              <label class="flex gap-2">
                <RadioButton v-model="formData.gender" value="여" />
                <span>여</span>
              </label>
            </div>
            <small v-if="errors.gender" class="text-red-500">{{ errors.gender }}</small>
          </td>
        </tr>

        <!-- 주소 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">주소</th>
          <td class="px-2 py-2 flex flex-col gap-2">
            <div class="flex gap-2">
              <InputText v-model="formData.zipcode" disabled />
              <Dialog v-model:visible="display" header="주소검색" modal style="width: 30vw">
                <VueDaumPostcode @complete="addressSearched" />
              </Dialog>
              <Button label="우편번호 검색" @click="openAddress" />
            </div>
            <small v-if="errors.zipcode" class="text-red-500">{{ errors.zipcode }}</small>

            <InputText v-model="formData.address" disabled />
            <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>

            <InputText v-model="formData.address_detail" placeholder="상세주소" />
          </td>
        </tr>

        <!-- 장애유형 -->
        <tr class="border-b">
          <th class="text-left px-2 py-2 border-r">장애유형</th>
          <td class="px-2 py-2">
            <InputText class="w-full" v-model="formData.disability" />
            <small v-if="errors.disability" class="text-red-500">
              {{ errors.disability }}
            </small>
          </td>
        </tr>

        <!-- 등록일 -->
        <tr class="border-b">
          <th class="text-left px-2 py-4 border-r">등록일</th>
          <td class="px-4 py-3">{{ today }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end mt-4">
      <Button label="등록" @click="handleCreate" />
    </div>
  </div>
</template>
