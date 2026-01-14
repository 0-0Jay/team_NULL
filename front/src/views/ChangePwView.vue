<script setup>
import AlertModal from '@/components/AlertModal.vue';
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useUsersStore } from '@/stores/users';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useUsersStore();
const router = useRouter();

const pw = ref('');
const pwchk = ref('');
const userNo = store.user.user_no;
const display = ref(false);
const alertContent = ref('');

const openAlert = (content) => {
  alertContent.value = content;
  display.value = true;
};

const changePw = async () => {
  const pw_regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,20}$/;
  if (!pw.value) {
    openAlert('새 비밀번호를 입력해주세요!');
  } else if (!pwchk.value) {
    openAlert('비밀번호 확인을 입력해주세요!');
  } else if (!pw_regex.test(pw.value)) {
    openAlert('비밀번호는 영문 + 숫자 + 특수문자 조합의 8 ~ 20자로 작성해주세요!');
  }
  const result = await store.changePw({ user_no: userNo, pw: pw.value });
  if (result.status == 'success') {
    openAlert('비밀번호가 변경되었습니다!');
  }
  return;
};
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden bg-cover bg-center bg-no-repeat" style="background-image: url('/login_background.png')">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">비밀번호 재설정</div>
            <span class="text-muted-color font-medium">발달장애인 지원 프로그램</span>
          </div>

          <div>
            <label for="pw" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">비밀번호</label>
            <InputText id="pw" type="password" placeholder="비밀번호" class="w-full md:w-[30rem] mb-4" v-model="pw" />

            <label for="pwchk" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">비밀번호 재입력</label>
            <InputText id="pwchk" type="password" placeholder="비밀번호 재입력" class="w-full md:w-[30rem] mb-4" v-model="pwchk" />

            <div class="grid mt-2 mb-8">
              <Button label="비밀번호 재설정" class="w-full" @click="changePw"></Button>
            </div>
            <div class="flex items-center justify-center">
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" @click="router.push({ name: 'Login' })">처음으로</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <AlertModal v-model="display" :content="alertContent" />
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
