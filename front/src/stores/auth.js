import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null
  }),

  actions: {
    loadFromStorage() {
      const saved = localStorage.getItem('users');
      if (!saved) {
        this.user = null;
        return;
      }
      const parsed = JSON.parse(saved);
      this.user = parsed.user?.[0] ?? null;
    }
  }
});
