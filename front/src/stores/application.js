import { defineStore } from 'pinia';
import axios from 'axios';

export const useApplicationStore = defineStore('application', {
  // state
  state: () => ({
    appList: [],
    manager: [],
    planStat: [],
    resultStat: []
  }),
  // getters
  // actions
  actions: {
    // 지원신청내역 담당자 불러오기
    async fetchApplication() {
      try {
        const response = await axios.get('/api/applicationList');
        // console.log(response.data.managerList);

        this.appList = response.data.appList || [];
        this.manager = response.data.managerList || [];
        this.planStat = response.data.planList || [];
        this.resultStat = response.data.resultList || [];
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
