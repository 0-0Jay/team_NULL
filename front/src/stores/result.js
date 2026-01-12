import { defineStore } from 'pinia';
import axios from 'axios';

export const useResultStore = defineStore('result', {
  //저장소를 만들고 다른화면에서 사용하도록 내보냄
  // state
  state: () => ({
    resultList: [],
    resultDetail: null
  }),
  //getters
  //actions

  actions: {
    // 지원결과서 목록 조회
    async fetchResultList(applicationNo) {
      try {
        const result = await axios.get(`/api/result/${applicationNo}`);
        this.resultList = result.data;
        return this.resultList;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원결과서 입력
    async createResult(data) {
      try {
        const result = await axios.post(`/api/result`, data);
        return result.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원결과서 승인, 반려
    async updateResultStatus(data) {
      try {
        const result = await axios.put('/api/result', data);
        return result.data;
      } catch (err) {
        console.log(err);
      }
    }
  }
});
