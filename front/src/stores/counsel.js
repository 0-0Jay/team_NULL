import { defineStore } from 'pinia';
import axios from 'axios';

export const useCounselStore = defineStore('counsel', {
  // state
  state: () => ({
    counselList: [],
    counselDetail: null
  }),
  //getters
  //actions

  actions: {
    // 상담내역 목록 조회
    async fetchCounselList(application_no) {
      try {
        const res = await axios.get(`/api/counsel/${application_no}`, {
        });
        this.counselList = res.data; //목록 조회 - 이게 vue파일에 const filtercounsel = computed(() => store.counselList); 이랑 연결되어야 함
      } catch (err) {
        console.error(err);
      }
    },

    // 상담내역 입력
    async createCounsel(data) {
      try {
        const res = await axios.post(`/api/counsel`, data);
        this.counselList.push(res.data); //목록에 추가
        return res.data;
      } catch (err) {
        throw err;
      }
    }
  }
});
