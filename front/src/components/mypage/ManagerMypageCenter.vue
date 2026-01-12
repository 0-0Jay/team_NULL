<!-- /component/mypage/ManagerMypageCenter.vue -->
<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useUsersStore } from '@/stores/users';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute();
const userStore = useUsersStore();
const toast = useToast();
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

// 스토어 연결
const centerInfo = computed(() => userStore.centerInfo);
const staffList = computed(() => userStore.staffList);

// 객체 생성
const formData = ref({
  name: '',
  zipcode: '',
  address: '',
  address_detail: '',
  phone: '',
  staff_count: ''
});

const errors = ref({
  name: '',
  zipcode: '',
  address: '',
  phone: ''
});

// 데이터 요청
onMounted(() => {
  if (!user?.user_no) return;
  userStore.fetchCenterInfo(user.user_no);
});

// 스토어 데이터 반영
watch(centerInfo, (info) => {
  if (!info) return;

  formData.value = {
    name: info.name,
    zipcode: info.zipcode,
    address: info.address,
    address_detail: info.address_detail,
    phone: info.phone,
    staff_count: info.staff_count
  };

  Object.keys(errors.value).forEach((k) => (errors.value[k] = ''));
});

// 수정 함수
async function handleUpdate() {
  Object.keys(errors.value).forEach((k) => (errors.value[k] = ''));
  let valid = true;

  if (!formData.value.name?.trim()) {
    errors.value.name = '기관명을 입력해주세요';
    valid = false;
  }
  if (!formData.value.zipcode) {
    errors.value.zipcode = '주소를 검색해주세요';
    valid = false;
  }
  if (!formData.value.address?.trim()) {
    errors.value.address = '주소를 입력해주세요';
    valid = false;
  }
  if (!formData.value.phone?.trim()) {
    errors.value.phone = '전화번호를 입력해주세요';
    valid = false;
  }

  if (!valid) return;

  const payload = {
    user_no: user.user_no,
    name: formData.value.name,
    zipcode: formData.value.zipcode,
    address: formData.value.address,
    address_detail: formData.value.address_detail,
    phone: formData.value.phone
  };

  try {
    await userStore.modifyCenterInfo(payload);
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
      detail: '수정 실패',
      life: 3000,
      closable: false
    });
  }
}

// 주소 검색창
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

// 담당자 목록 Dialog
const staffdisplay = ref(false);
function openStaff() {
  staffdisplay.value = true;
}
function closeStaff() {
  staffdisplay.value = false;
}
function openStaffDialog() {
  userStore.fetchStaffList(user.user_no);
  openStaff();
}
</script>

<template>
  <div class="card flex flex-col gap-4 h-full">
    <Toast />

    <div v-if="centerInfo">
      <div class="font-semibold text-xl pb-2">기관 정보</div>
      <table class="w-full border-collapse">
        <tbody>
          <tr class="border-t-4 border-b border-gray-300">
            <th class="text-left py-2 px-2 w-1/4 border-r">기관명</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.name" />
              <small v-if="errors.name" class="text-red-500">{{ errors.name }}</small>
            </td>
          </tr>

          <tr class="border-b">
            <th class="text-left py-2 px-2 border-r">주소</th>
            <td class="py-2 px-2 flex flex-col gap-2">
              <div class="flex gap-2">
                <InputText type="text" placeholder="우편번호" v-model="formData.zipcode" disabled />
                <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                  <VueDaumPostcode @complete="addressSearched" />
                </Dialog>
                <Button label="우편번호 검색" @click="openAddress" />
              </div>
              <small v-if="errors.zipcode" class="text-red-500">{{ errors.zipcode }}</small>

              <InputText type="text" placeholder="도로명주소" class="w-full" v-model="formData.address" disabled />
              <small v-if="errors.address" class="text-red-500">{{ errors.address }}</small>

              <InputText type="text" placeholder="상세주소" class="w-full" v-model="formData.address_detail" />
            </td>
          </tr>

          <tr class="border-b">
            <th class="text-left py-2 px-2 border-r">전화번호</th>
            <td class="py-2 px-2">
              <InputText type="text" class="w-full" v-model="formData.phone" />
              <small v-if="errors.phone" class="text-red-500">{{ errors.phone }}</small>
            </td>
          </tr>

          <tr class="border-b">
            <th class="text-left py-4 px-2 border-r">기관 담당자</th>
            <td class="py-2 px-4 flex gap-6 text-center items-center">
              <div>{{ formData.staff_count }} 명</div>
              <div><Button label="보기" severity="help" class="h-8" @click="openStaffDialog" /></div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex gap-2 justify-end mt-4">
        <Button label="수정" @click="handleUpdate" />
      </div>
    </div>

    <div v-else>Loading...</div>

    <Dialog header="기관 담당자" class="text-center" v-model:visible="staffdisplay" :style="{ width: '20vw' }" :modal="true">
      <DataTable :value="staffList" tableStyle="min-width: 15rem">
        <Column field="name" header="담당자명"></Column>
        <Column field="phone" header="연락처"></Column>
      </DataTable>
      <template #footer>
        <Button label="확인" class="mt-8 w-100 h-12" @click="closeStaff" />
      </template>
    </Dialog>
  </div>
</template>
