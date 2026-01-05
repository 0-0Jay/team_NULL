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
    },

    // 기관 검색 (자동완성용)
    async searchCenter(name) {
      try {
        if (!name || name.length < 2) {
          return [];
        }
        const response = await axios.get('/api/searchCenter', {
          params: { name }
        });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 기관 주소
    async centerAddress() {
      try {
        const response = await axios.get(`/api/address`);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 기관 등록
    async addCenter(data) {
      try {
        const response = await axios.post('/api/centers', data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  }
});
