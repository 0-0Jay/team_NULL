<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useUsersStore } from '@/stores/users';
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const store = useUsersStore();
const router = useRouter();
const route = useRoute();
const type = route.params.type;

const name = ref('');
const id = ref('');
const email = ref('');
const usercode = ref('');
const realcode = ref('');
const codespace = ref(false);

const sendCode = async () => {
  codespace.value = true;
  const result = await store.sendCode({email : email.value});
  realcode.value = result.data.code;
};

const findId = async () => {
  if (realcode.value != usercode.value) {
    alert('인증번호가 일치하지 않습니다!');
    return;
  }
  const result = await store.findId();
};

const changePw = async () => {
    console.log(realcode);
  if (realcode.value != usercode.value) {
    alert('인증번호가 일치하지 않습니다!');
    return;
  }
  router.push({ name: 'changePw' })
}
</script>

<template>
  <FloatingConfigurator />
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div v-if="type == 'id'" class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">아이디 찾기</div>
            <div v-else-if="type == 'pw'" class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">비밀번호 찾기</div>
            <span class="text-muted-color font-medium">발달장애인 지원 프로그램</span>
          </div>

          <div>
            <div v-if="type == 'id'">
              <label for="name" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">이름</label>
              <InputText id="name" type="text" placeholder="이름" class="w-full md:w-[30rem] mb-4" v-model="name" />
            </div>
            <div v-else-if="type == 'pw'">
              <label for="id" class="block text-surface-900 dark:text-surface-0 text-xl font-medium">아이디</label>
              <InputText id="id" type="text" placeholder="아이디" class="w-full md:w-[30rem] mb-4" v-model="name" />
            </div>

            <label for="email" class="block text-surface-900 dark:text-surface-0 font-medium text-xl">이메일</label>
            <InputText id="email" type="email" placeholder="이메일" class="w-full md:w-[30rem] mb-4" v-model="email" />

            <div class="grid mt-2 mb-8">
              <InputText v-if="codespace" id="code" type="text" placeholder="인증번호 입력" class="w-full md:w-[30rem] mb-4" v-model="usercode" />
              <Button v-if="!codespace" label="인증번호 전송" class="w-full mb-8" @click="sendCode"></Button>
              <Button v-else label="인증번호 재전송" class="w-full mb-8" @click="sendCode"></Button>
              <Button v-if="type == 'id'" label="아이디 찾기" class="w-full" @click="findId"></Button>
              <Button v-if="type == 'pw'" label="비밀번호 재설정" class="w-full" @click="changePw"></Button>
            </div>
            <div class="flex items-center justify-center">
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" @click="router.push({ name: 'Login' })">처음으로</span>
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
