import { defineStore } from 'pinia';
import { useUsersStore } from '@/stores/users';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  actions: {
    syncFromUsersStore() {
      const saved = localStorage.getItem('users');
      if (!saved) {
        this.user = null;
        return;
      }

      const parsed = JSON.parse(saved);
      this.user = parsed.user?.[0] ?? null;

      // 로그인 성공 시 딱 한 번만 전체 데이터 로드
      const usersStore = useUsersStore();
      usersStore.fetchMyInfo();
      usersStore.fetchApplicant();
    },

    clear() {
      this.user = null;
    }
  }
});
