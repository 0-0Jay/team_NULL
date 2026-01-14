<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';

const user = JSON.parse(localStorage.getItem('users')).user;
const blindId = user.id.slice(0, 4) + '*'.repeat(user.id.length - 4);
</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden bg-cover bg-center bg-no-repeat" style="background-image: url('/login_background.png')">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, color-mix(in srgb, var(--primary-color), transparent 60%) 10%, var(--surface-ground) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20 flex flex-col items-center" style="border-radius: 53px">
          <h1 class="text-surface-900 dark:text-surface-0 font-bold text-3xl lg:text-5xl mb-2">아이디 찾기</h1>
          <div class="text-surface-600 dark:text-surface-200 mb-8">찾으시는 아이디는 다음과 같습니다.</div>
          <div class="w-full flex items-center py-8 mb-8">
            <span class="flex justify-center items-center border-2 border-primary text-primary rounded-border" style="height: 3.5rem; width: 3.5rem">
              <i class="pi pi-fw pi-user text-2xl!"></i>
            </span>
            <span class="ml-6 flex flex-col">
              <span class="text-surface-900 dark:text-surface-0 lg:text-xl font-medium mb-2 block">{{ user.name }}님의 아이디</span>
              <span class="text-surface-600 dark:text-surface-200 lg:text-xl font-medium">{{ blindId }}</span>
            </span>
          </div>
          <Button as="router-link" label="처음으로" to="/" />
        </div>
      </div>
    </div>
  </div>
</template>
