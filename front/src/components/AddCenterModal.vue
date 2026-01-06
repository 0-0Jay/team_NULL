<script setup>
import { ref } from 'vue';
import { useCentersStore } from '@/stores/centers';
import { useRouter } from 'vue-router';

const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean
});
const store = useCentersStore();
const router = useRouter();

const centerName = ref('');
const postcode = ref('');
const fullAddress = ref('');
const addressDetail = ref('');
const phone = ref('');
const email = ref('');
const operation = ref('1');
const display = ref(false);

const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
const date = formatDate(Date());

const open = () => {
  display.value = true;
};

const close = () => {
  display.value = false;
};

const addressSearched = (data) => {
  postcode.value = data.zonecode;
  fullAddress.value = data.roadAddress;
  close();
};

const addCenter = async () => {
  const data = {
    centerName: centerName.value,
    postcode: postcode.value,
    fullAddress: fullAddress.value,
    addressDetail: addressDetail.value,
    email: email.value,
    phone: phone.value,
    operation: operation.value
  };
  const result = await store.addCenter(data);
  emit('update:modelValue', false);
  await store.fetchCenter();
};
</script>

<template>
  <Dialog header="기관 등록" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
    <table class="w-full border-collapse">
      <tbody>
        <tr class="border-t border-b">
          <th class="text-left py-2 px-2 w-1/4 border-r">기관명</th>
          <td class="py-2 px-2"><InputText v-model="centerName" id="name" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">주소</th>
          <td class="grid py-2 px-2 gap-2">
            <!-- 우편번호 + 버튼 묶음 -->
            <div class="flex gap-2">
              <InputText id="postcode" type="text" placeholder="우편번호" v-model="postcode" disabled />
              <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                <VueDaumPostcode @complete="addressSearched" />
              </Dialog>
              <Button label="우편번호 검색" @click="open"></Button>
            </div>
            <!-- 주소 -->
            <InputText id="address" type="text" placeholder="도로명주소" class="w-full" v-model="fullAddress" disabled />
            <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full" v-model="addressDetail" />
          </td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">대표번호</th>
          <td class="py-2 px-2"><InputText v-model="phone" id="phone" type="text" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">이메일</th>
          <td class="py-2 px-2"><InputText v-model="email" id="email" type="email" class="w-full" /></td>
        </tr>
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">운영여부</th>
          <td class="py-2 px-2 flex justify-between items-center">
            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex items-center">
                <RadioButton id="option1" name="option" value="0" v-model="operation" />
                <label for="option1" class="leading-none ml-2">종료</label>
              </div>
              <div class="flex items-center">
                <RadioButton id="option2" name="option" value="1" v-model="operation" />
                <label for="option2" class="leading-none ml-2">운영</label>
              </div>
            </div>
            <span>현재 날짜 : {{ formatDate(Date()) }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <template #footer>
      <div class="flex justify-center w-full">
        <Button label="저장" severity="warn" class="w-30" @click="addCenter" />
      </div>
    </template>
  </Dialog>
</template>
