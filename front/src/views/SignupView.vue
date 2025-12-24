<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';

const id = ref('');
const name = ref('');
const pw = ref('');
const pwchk = ref('');
const email = ref('');
const phone = ref('');

const zipcode = ref('');
const address = ref('');
const address_detail = ref('');

const center = ref('');
const center_sido = ref('');
const center_sigungu = ref('');

const sido = ref([
  { label: '대구광역시', value: '대구광역시' },
  { label: '서울특별시', value: '서울특별시' },
  { label: '경상북도', value: '경상북도' }
]);

const sigungu = ref([
  { label: '구미시', value: '구미시' },
  { label: '칠곡군', value: '칠곡군' }
]);

const center_list = ref([
  { label: '행복복지센터', value: '행복복지센터' },
  { label: '불행복지센터', value: '불행복지센터' }
]);

const display = ref(false);
function open() {
  display.value = true;
}

function close() {
  display.value = false;
}

const signup = async () => {};

const addressSearched = (data) => {
  zipcode.value = data.zonecode;
  address.value = data.roadAddress;
  close();
};
</script>

<template>
  <FloatingConfigurator />
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[90vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-15 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">회원가입</div>
          </div>

          <div>
            <label for="id" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">아이디</label>
            <div class="flex gap-2 mb-4">
              <InputText id="id" type="text" placeholder="ID" class="w-full md:w-[24rem]" v-model="id" />
              <Button label="중복확인"></Button>
            </div>

            <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">이름</label>
            <InputText id="name" type="text" placeholder="이름" class="w-full md:w-[30rem] mb-4" v-model="name" />

            <label for="pw" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">비밀번호</label>
            <Password id="pw" v-model="pw" placeholder="비밀번호" :toggleMask="true" class="w-full md:w-[30rem] mb-4" fluid :feedback="false"></Password>

            <label for="pwchk" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">비밀번호 찾기</label>
            <Password id="pwchk" v-model="pwchk" placeholder="비밀번호 확인" :toggleMask="true" class="w-full md:w-[30rem] mb-4" fluid :feedback="false"></Password>

            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">이메일</label>
            <div class="flex gap-2 mb-4">
              <InputText id="email" type="email" placeholder="이메일" class="w-full md:w-[24rem]" v-model="email" />
              <Button label="중복확인" class="pl-2"></Button>
            </div>

            <label for="phone" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">연락처</label>
            <InputText id="phone" type="text" placeholder="연락처" class="w-full md:w-[30rem] mb-4" v-model="phone" />

            <label for="zipcode" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">주소</label>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <InputText id="zipcode" type="text" placeholder="우편번호" class="w-full md:w-[15rem]" v-model="zipcode" disabled />
                <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                  <VueDaumPostcode @complete="addressSearched" />
                </Dialog>
                <Button label="Show" style="width: auto" @click="open"></Button>
              </div>
              <InputText id="address" type="text" placeholder="도로명주소" class="w-full md:w-[30rem]" v-model="address" disabled />
              <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full md:w-[30rem] mb-4" v-model="address_detail" />
            </div>

            <label for="center" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">기관</label>
            <div class="flex gap-x-2">
              <Select id="sido" placeholder="광역시/도" class="w-full md:w-[14.75rem] mb-2" v-model="center_sido" :options="sido" optionLabel="label"></Select>
              <Select id="sigungu" placeholder="시/군/구" class="w-full md:w-[14.75rem] mb-2" v-model="center_sigungu" :options="sigungu" optionLabel="label"></Select>
            </div>
            <Select id="center" type="text" placeholder="기관명" class="w-full md:w-[30rem] mb-2" v-model="center" :options="center_list" optionLabel="label"></Select>

            <div class="grid mt-2 mb-8 gap-y-4">
              <Button label="회원가입" class="w-full" as="router-link" to="/" v-on:click="signup"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
