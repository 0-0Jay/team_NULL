<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { useUsersStore } from '@/stores/users';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const store = useUsersStore();
const router = useRouter();

const savedId = localStorage.getItem('id');
const id = ref(savedId ? savedId : '');
const password = ref('');
const saveId = ref(savedId ? true : false);

const login = async () => {
  if (!id.value) {
    alert('아이디를 입력해주세요!');
    return;
  } else if (!password.value) {
    alert('비밀번호를 입력해주세요!');
    return;
  }
  const data = {
    id: id.value,
    pw: password.value
  };
  const result = await store.login(data);
  if (result.length == 0) {
    alert('아이디 또는 비밀번호가 틀렸습니다.');
    return;
  }
  if (saveId.value) {
    localStorage.setItem('id', id.value);
  } else {
    localStorage.removeItem('id');
  }
  if (result[0].status == 0) {
    router.push({ name: 'LoginNA' });
  } else {
    router.push({ name: 'test' });
  }
};
</script>

<template>
  <FloatingConfigurator />
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">발달장애인 지원 프로그램</div>
            <span class="text-muted-color font-medium">환영합니다! 로그인 후 사용하실 수 있습니다!</span>
          </div>

          <div>
            <label for="id" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">아이디</label>
            <InputText id="id" type="text" placeholder="ID" class="w-full md:w-[30rem] mb-8" v-model="id" />

            <label for="pw" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">비밀번호</label>
            <Password id="pw" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

            <div class="flex items-center justify-between mt-2 mb-8">
              <div class="flex items-center gap-4">
                <div>
                  <Checkbox v-model="saveId" id="rememberme1" binary class="mr-2"></Checkbox>
                  <label for="rememberme1">아이디 저장</label>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center mt-2 mb-8 gap-8">
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" @click="router.push({ path: '/find/id' })">아이디 찾기</span>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary" @click="router.push({ path: '/find/pw' })">비밀번호 찾기</span>
            </div>
            <div class="grid mt-2 mb-8 gap-y-4">
              <Button label="로그인" class="w-full" @click="login"></Button>
              <Button label="회원가입" class="w-full" as="router-link" to="/signup"></Button>
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
