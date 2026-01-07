import { defineStore } from 'pinia';
import axios from 'axios';

export const useApplicationStore = defineStore('application', {
  // state
  state: () => ({
    appList: [],
    manager: [],
    planStat: [],
    resultStat: [],
    counselStat: [],
    applicant: {}
  }),
  // getters
  // actions
  actions: {
    // 지원신청내역 담당자 불러오기
    async fetchApplication() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/applicationList', { user });

        console.log(response.data.planList);

        this.appList = response.data.appList || [];
        this.manager = response.data.managerList || [];
        this.planStat = response.data.planList || [];
        this.resultStat = response.data.resultList || [];
        this.counselStat = response.data.counselList || [];
      } catch (err) {
        console.log(err);
      }
    },
    async fetchApplicant() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/findApplicant', { user });

        console.log(response.data);

        this.applicant = response.data || {};
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
