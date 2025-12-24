<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { onMounted, ref } from 'vue';
import { useUsersStore } from '@/stores/users';
import { useRouter } from 'vue-router';

const store = useUsersStore();
const router = useRouter();

const center_name = ref('');
const center_phone = ref('');

onMounted(async () => {
  const result = await store.fetchCenter();
  console.log(result);
  center_name.value = result.name;
  center_phone.value = result.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
});

const logout = async () => {
  await store.logout();
  router.push({ name: 'Login' });
};
</script>

<template>
  <FloatingConfigurator />
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, rgba(247, 149, 48, 0.4) 10%, rgba(247, 149, 48, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
          <div class="gap-4 flex flex-col items-center">
            <div class="flex justify-center items-center border-2 border-orange-500 rounded-full" style="width: 3.2rem; height: 3.2rem">
              <i class="text-orange-500 pi pi-fw pi-lock text-2xl!"></i>
            </div>
            <h1 class="text-surface-900 dark:text-surface-0 font-bold text-4xl lg:text-5xl mb-2">승인 대기중</h1>
            <span class="text-muted-color mb-8">본 서비스는 가입하시는 기관의 관리자가 승인 처리 후 이용하실 수 있습니다.</span>
            <img src="/demo/images/access/asset-access.svg" alt="Access denied" class="mb-8" width="80%" />
            <span class="text-muted-color mb-8">문의사항은 해당 기관으로 연락바랍니다.</span>
            <Message severity="info">{{ center_name }} : {{ center_phone }}</Message>
            <div class="flex col-span-12 mt-8 text-center gap-4">
              <Button label="로그아웃" @click="logout" />
              <Button label="회원탈퇴" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
