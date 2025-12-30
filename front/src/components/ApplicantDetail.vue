<!-- /component/ApplicantDetail.vue -->
<script setup>
import { ref } from 'vue';
import RadioButton from 'primevue/radiobutton';
import DatePicker from 'primevue/datepicker';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const visible = ref(false);

const name = ref('홍길순');
const icondisplay = ref();
const gender = ref('');
const zipcode = ref('');
const address = ref('');
const address_detail = ref('');
const type = ref('장애유형');

const formData = {
  name: name.value,
  gender: gender.value,
  zipcode: zipcode.value,
  address: address.value,
  address_detail: address_detail.value
};
const addressSearched = (data) => {
  zipcode.value = data.zonecode;
  address.value = data.roadAddress;
  close();
};
const display = ref(false);
function open() {
  display.value = true;
}
function close() {
  display.value = false;
}

function openDelConfirm(faqNo) {
  delFaqNo.value = faqNo;
  visible.value = true;
}
function delFaq() {
  if (!delFaqNo.value) return;

  visible.value = false;

  axios.delete(`/api/questions/${delFaqNo.value}`).then(() => {
    alert('삭제되었습니다.');
    faqs.value = faqs.value.filter((faq) => faq.faq_no !== delFaqNo.value);
    delFaqNo.value = null;
  });
}
</script>
<template>
  <div class="card flex flex-col gap-4">
    <div class="font-semibold text-xl">홍길순 정보</div>
    <hr />
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="name" class="col-span-2">이름</label>
      <div class="col-span-10">
        <InputText id="name3" type="text" class="w-full" v-model="name" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="icondisplay" class="col-span-2">생년월일</label>
      <div class="flex-auto col-span-10">
        <DatePicker v-model="icondisplay" showIcon fluid iconDisplay="input" inputId="icondisplay" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="gender" class="col-span-2">성별</label>
      <div class="col-span-10 flex gap-6">
        <label class="flex items-center gap-2">
          <RadioButton v-model="gender" inputId="male" value="남" />
          <span>남</span>
        </label>
        <label class="flex items-center gap-2">
          <RadioButton v-model="gender" inputId="female" value="여" />
          <span>여</span>
        </label>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="address" class="col-span-2">주소</label>
      <!-- 오른쪽 전체 영역 -->
      <div class="col-span-10 flex flex-col gap-2">
        <!-- 우편번호 + 버튼 묶음 -->
        <div class="flex gap-2">
          <InputText id="zipcode" type="text" placeholder="우편번호" class="w-[15rem]" v-model="zipcode" disabled />
          <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
            <VueDaumPostcode @complete="addressSearched" />
          </Dialog>
          <Button label="우편번호 검색" @click="open"></Button>
        </div>
        <!-- 주소 -->
        <InputText id="address" type="text" placeholder="도로명주소" class="w-full" v-model="address" disabled />
        <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="address_detail" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="type" class="col-span-2">장애유형</label>
      <div class="col-span-10">
        <InputText id="type" type="text" class="w-full" v-model="type" />
      </div>
    </div>
    <div class="grid grid-cols-12 gap-2 items-center">
      <label for="name3" class="col-span-2">등록일</label>
      <div class="col-span-10">2000.00.00</div>
    </div>
    <div class="flex gap-2 justify-end">
      <Button label="수정" />
      <Button label="삭제" severity="danger" @click="openDelConfirm(faq.faq_no)" />
    </div>
    <ConfirmDialog v-model:visible="visible" @confirm="delFaq()"> 정말로 삭제하시겠습니까? </ConfirmDialog>
  </div>
</template>
