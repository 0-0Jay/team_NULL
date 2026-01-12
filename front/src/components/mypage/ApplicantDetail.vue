<!-- /component/mypage/ApplicantDetail.vue -->
<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import router from '@/router';

const route = useRoute();
const userStore = useUsersStore();
const toast = useToast();

const applicantDetail = computed(() => userStore.applicantDetail);
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

const isStaff = computed(() => {
  const type = Number(user?.type);
  return type === 1;
});

const visible = ref(false);
const formData = ref({
  name: '',
  gender: '',
  birth: '',
  zipcode: '',
  address: '',
  address_detail: '',
  disability: '',
  nok_name: '',
  nok_phone: '',
  nok_email: ''
});

const errors = ref({
  name: '',
  birth: '',
  gender: '',
  zipcode: '',
  address: '',
  disability: '',
  nok_name: '',
  nok_phone: '',
  nok_email: ''
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

  // 2. 담당자일 때만 보호자 필수 검증
  if (isStaff.value) {
    if (!formData.value.nok_name?.trim()) {
      errors.value.nok_name = '보호자 이름을 입력해주세요';
      isValid = false;
    }
    if (!formData.value.nok_phone?.trim()) {
      errors.value.nok_phone = '보호자 연락처를 입력해주세요';
      isValid = false;
    }
    if (!formData.value.nok_email?.trim()) {
      errors.value.nok_email = '보호자 이메일을 입력해주세요';
      isValid = false;
    }
  }

  return isValid;
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
    disability: detail.disability,
    nok_name: detail.nok_name,
    nok_phone: detail.nok_phone,
    nok_email: detail.nok_email
  };
  console.log('상세정보: ', detail);
});

// 수정 함수
async function handleUpdate() {
  if (!validateForm()) return;

  // 날짜 포맷
  const d = formData.value.birth;
  const birth = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');

  // payload(서버 전송 객체) 생성
  const payload = {
    a_no: route.params.a_no,
    name: formData.value.name,
    birth,
    gender: formData.value.gender === '남' ? 0 : 1,
    zipcode: formData.value.zipcode,
    address: formData.value.address,
    address_detail: formData.value.address_detail,
    disability: formData.value.disability,
    nok_name: formData.value.nok_name,
    nok_phone: formData.value.nok_phone,
    nok_email: formData.value.nok_email
  };

  try {
    await userStore.modifyApplicant(payload);
    await userStore.fetchApplicantDetail(route.params.a_no);

    toast.add({
      severity: 'success',
      summary: '수정 완료',
      detail: '수정되었습니다.',
      life: 3000,
      closable: false
    });
  } catch (err) {
    console.error(err);

    toast.add({
      severity: 'error',
      summary: '수정 실패',
      detail: '수정에 실패했습니다.',
      life: 3000,
      closable: false
    });
  }
}

// 삭제 함수
function openDelConfirm() {
  visible.value = true;
}
async function delApplicant() {
  if (!route.params.a_no) return;
  visible.value = false;

  try {
    await userStore.deleteApplicant(route.params.a_no);
    await userStore.fetchApplicant(user.user_no);
    router.replace({ name: 'myPageApplicantEmpty' });

    toast.add({
      severity: 'success',
      summary: '삭제 완료',
      detail: '삭제되었습니다.',
      life: 3000,
      closable: false
    });
  } catch (err) {
    console.error(err);

    toast.add({
      severity: 'error',
      summary: '삭제 실패',
      detail: '삭제에 실패했습니다.',
      life: 3000,
      closable: false
    });
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
  <div class="card flex flex-col gap-4 h-full">
    <Toast />

    <div v-if="applicantDetail">
      <div class="font-semibold text-xl pb-2">{{ applicantDetail.name }} 정보</div>
      <table class="w-full border-collapse">
        <tbody>
          <tr class="border-t-4 border-b border-gray-300">
            <th class="text-left py-2 px-2 w-1/4 border-r">이름</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.name" />
              <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
            </td>
          </tr>

          <tr class="border-b">
            <th class="text-left py-2 px-2 border-r">생년월일</th>
            <td class="py-2 px-2">
              <DatePicker v-model="formData.birth" showIcon fluid iconDisplay="input" inputId="icondisplay" />
              <small v-if="errors.birth" class="text-red-500">{{ errors.birth }}</small>
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
              <small v-if="errors.gender" class="text-red-500">{{ errors.gender }}</small>
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
              <small v-if="errors.zipcode" class="text-red-500">{{ errors.zipcode }}</small>

              <InputText id="address" type="text" placeholder="도로명주소" class="w-full" v-model="formData.address" disabled />
              <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>

              <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="formData.address_detail" />
            </td>
          </tr>

          <tr class="border-b">
            <th class="text-left py-2 px-2 border-r">장애유형</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.disability" />
              <small v-if="errors.disability" class="text-red-500">{{ errors.disability }}</small>
            </td>
          </tr>

          <tr v-if="isStaff" class="border-b">
            <th class="text-left py-2 px-2 border-r">보호자</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.nok_name" disabled />
              <small v-if="errors.nok_name" class="text-red-500">{{ errors.nok_name }}</small>
            </td>
          </tr>

          <tr v-if="isStaff" class="border-b">
            <th class="text-left py-2 px-2 border-r">보호자 연락처</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.nok_phone" disabled />
              <small v-if="errors.nok_phone" class="text-red-500">{{ errors.nok_phone }}</small>
            </td>
          </tr>

          <tr v-if="isStaff" class="border-b">
            <th class="text-left py-2 px-2 border-r">보호자 이메일</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.nok_email" disabled />
              <small v-if="errors.nok_email" class="text-red-500">{{ errors.nok_email }}</small>
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
    </div>

    <div v-else>Loading...</div>

    <ConfirmDialog v-model:visible="visible" @confirm="delApplicant"> 정말로 삭제하시겠습니까? </ConfirmDialog>
  </div>
</template>
