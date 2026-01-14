<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { onMounted, ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useCentersStore } from '@/stores/centers';
import { useRouter } from 'vue-router';
import AlertModal from '@/components/AlertModal.vue';

const store = useUsersStore();
const cstore = useCentersStore();
const router = useRouter();

const id = ref('');
const idchk = ref(false);
const name = ref('');
const pw = ref('');
const pwchk = ref('');
const email = ref('');
const emailchk = ref(false);
const phone = ref('');
const type = ref('0');
const displayAlert = ref(false);
const alertContent = ref('');

const zipcode = ref('');
const address = ref('');
const address_detail = ref('');

const center = ref();
const center_sido = ref('');
const center_sigungu = ref('');

const userTypes = ref([
  { name: '일반회원', value: '0' },
  { name: '기관담당자', value: '1' },
  { name: '기관관리자', value: '2' }
]);

let list = {};
let sido = ref([]);
let sigungu = ref([]);
let center_list = ref([]);

onMounted(async () => {
  const result = await cstore.centerAddress();
  list = result.reduce((acc, cur) => {
    const { sido, sigungu, name, c_no } = cur;
    if (!acc[sido]) {
      acc[sido] = [];
    }
    const sigunguKey = sigungu ?? '';
    if (!acc[sido][sigunguKey]) {
      acc[sido][sigunguKey] = [];
    }

    acc[sido][sigunguKey].push({ label: name, value: c_no });

    return acc;
  }, {});
  sido.value = Object.keys(list).map((sido) => ({
    label: sido,
    value: sido
  }));
});

const changeSido = () => {
  console.log(list[center_sido.value]);
  sigungu.value = Object.keys(list[center_sido.value]).map((sigungu) => ({
    label: sigungu,
    value: sigungu
  }));
};

const changeSigungu = () => {
  center_list.value = list?.[center_sido.value]?.[center_sigungu.value] ?? [];
};

const display = ref(false);
const open = () => {
  display.value = true;
};

const close = () => {
  display.value = false;
};

const openAlert = (content) => {
  alertContent.value = content;
  displayAlert.value = true;
};

const validateSignup = () => {
  if (!type.value) return '회원 유형을 선택해 주세요!';
  if (!id.value) return '아이디를 입력해주세요!';
  if (!idchk.value) return '아이디 중복 확인을 통과해주세요!';
  const id_regex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  if (!id_regex.test(id.value)) return '아이디는 영문 + 숫자 조합의 8 ~ 20자로 작성해주세요!';
  if (!pw.value) return '비밀번호를 입력해주세요!';
  if (pw.value !== pwchk.value) return '비밀번호가 일치하지 않습니다!';
  const pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/;
  if (!pw_regex.test(pw.value)) return '비밀번호는 영문 + 숫자 + 특수문자 조합의 8 ~ 20자로 작성해주세요!';
  if (!email.value) return '이메일을 입력해주세요!';
  if (!emailchk.value) return '이메일 중복 확인을 통과해주세요!';
  if (!zipcode.value) return '주소를 입력해주세요!';
  if (!center.value) return '기관을 선택해주세요!';
  return null;
};

const signup = async () => {
  const error = validateSignup();
  if (error) {
    openAlert(error);
    return;
  }
  const formData = {
    id: id.value,
    name: name.value,
    pw: pw.value,
    email: email.value,
    phone: phone.value,
    zipcode: zipcode.value,
    address: address.value,
    address_detail: address_detail.value,
    center: center.value,
    type: type.value
  };
  await store.signUp(formData);
  router.push({ name: 'LoginNA' });
};

const addressSearched = (data) => {
  zipcode.value = data.zonecode;
  address.value = data.roadAddress;
  close();
};

const idCheck = async () => {
  if (!id.value) {
    openAlert('아이디를 입력해주세요!');
    idchk.value = false;
    return;
  }
  const result = await store.idCheck({ id: id.value });
  if (result.data.length == 0) {
    idchk.value = true;
  } else {
    idchk.value = false;
  }
};

const emailCheck = async () => {
  if (!email.value) {
    openAlert('이메일을 입력해주세요!');
    emailchk.value = false;
    return;
  }
  const result = await store.emailCheck({ email: email.value });
  if (result.data.length == 0) {
    emailchk.value = true;
  } else {
    emailchk.value = false;
  }
};
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden bg-cover bg-center bg-no-repeat" style="background-image: url('/login_background.png')">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-15 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">회원가입</div>
          </div>
          <div class="text-center mb-4">
            <SelectButton v-model="type" :options="userTypes" optionLabel="name" optionValue="value" />
          </div>

          <div>
            <label for="id" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">아이디</label>
            <div class="flex gap-2">
              <InputText id="id" type="text" placeholder="영문 + 숫자 조합. 8 ~ 20자" class="w-full md:w-[24rem]" v-model="id" />
              <Button label="중복확인" @click="idCheck"></Button>
            </div>
            <p v-if="idchk" style="color: blue">사용가능한 아이디 입니다.</p>
            <p v-else style="color: rgba(255, 0, 0, 0.7)">아이디를 입력하지 않았거나 이미 존재하는 아이디입니다.</p>

            <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">이름</label>
            <InputText id="name" type="text" placeholder="이름" class="w-full md:w-[30rem] mb-4" v-model="name" />

            <label for="pw" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">비밀번호</label>
            <Password id="pw" v-model="pw" placeholder="영문 + 숫자 + 특수문자 조합. 8 ~ 20자" :toggleMask="true" class="w-full md:w-[30rem] mb-4" fluid :feedback="false"></Password>

            <label for="pwchk" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">비밀번호 확인</label>
            <Password id="pwchk" v-model="pwchk" placeholder="비밀번호 확인" :toggleMask="true" class="w-full md:w-[30rem]" fluid :feedback="false"></Password>
            <p v-if="!pw || !pwchk" style="color: rgba(255, 0, 0, 0.7)">비밀번호와 비밀번호 확인을 모두 입력해주세요</p>
            <p v-else-if="pw !== pwchk" style="color: rgba(255, 0, 0, 0.7)">비밀번호가 일치하지 않습니다.</p>
            <p v-else style="color: blue">비밀번호가 일치합니다.</p>

            <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">이메일</label>
            <div class="flex gap-2">
              <InputText id="email" type="email" placeholder="이메일" class="w-full md:w-[24rem]" v-model="email" />
              <Button label="중복확인" class="pl-2" @click="emailCheck"></Button>
            </div>
            <p v-if="emailchk" style="color: blue">사용가능한 이메일 입니다.</p>
            <p v-else style="color: rgba(255, 0, 0, 0.7)">이메일을 입력하지 않았거나 이미 존재하는 이메일입니다.</p>

            <label for="phone" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">연락처</label>
            <InputText id="phone" type="text" placeholder="연락처" class="w-full md:w-[30rem] mb-4" v-model="phone" />

            <label for="zipcode" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">주소</label>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <InputText id="zipcode" type="text" placeholder="우편번호" class="w-full md:w-[15rem]" v-model="zipcode" disabled />
                <Dialog header="주소검색" v-model:visible="display" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
                  <VueDaumPostcode @complete="addressSearched" />
                </Dialog>
                <Button label="주소검색" style="width: auto" @click="open"></Button>
              </div>
              <InputText id="address" type="text" placeholder="도로명주소" class="w-full md:w-[30rem]" v-model="address" disabled />
              <InputText id="addressdetail" type="text" placeholder="상세주소" class="w-full md:w-[30rem] mb-4" v-model="address_detail" />
            </div>

            <label for="center" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">기관</label>
            <div class="flex gap-x-2">
              <Select id="sido" placeholder="광역시/도" class="w-full md:w-[14.75rem] mb-2" v-model="center_sido" :options="sido" optionLabel="label" optionValue="value" @change="changeSido"></Select>
              <Select id="sigungu" placeholder="시/군/구" class="w-full md:w-[14.75rem] mb-2" v-model="center_sigungu" :options="sigungu" optionLabel="label" optionValue="value" @change="changeSigungu"></Select>
            </div>
            <Select id="center" type="text" placeholder="기관명" class="w-full md:w-[30rem] mb-2" v-model="center" :options="center_list" optionLabel="label" optionValue="value"></Select>

            <div class="flex mt-2 mb-8 gap-4">
              <Button label="회원가입" class="w-full" @click="signup"></Button>
              <Button label="처음으로" class="w-full" as="router-link" to="/"></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AlertModal v-model="displayAlert" :content="alertContent" />
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
