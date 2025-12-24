import { defineStore } from 'pinia';
import axios from 'axios';

export const useCentersStore = defineStore('centers', {
  // state
  state: () => ({
    centers: []
  }),
  // getters
  // actions
  actions: {
    // 기관 목록
    async fetchCenter() {
      try {
        const response = await axios.get('/api/centers');
        this.centers = response.data;
      } catch (err) {
        console.log(err);
      }
    }
  }
});
