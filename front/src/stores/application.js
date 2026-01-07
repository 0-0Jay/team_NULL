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
    application: {}
  }),
  // getters
  // actions
  actions: {
    // 지원신청내역 담당자 불러오기
    async fetchApplication() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/applicationList', { user });
        // console.log(response.data.managerList);

        this.appList = response.data.appList || [];
        this.manager = response.data.managerList || [];
        this.planStat = response.data.planList || [];
        this.resultStat = response.data.resultList || [];
        this.counselStat = response.data.counselList || [];
      } catch (err) {
        console.log(err);
      }
    },

    // 지원신청서 작성
    async submitApplication(data) {
      try {
        const response = await axios.post('/api/application', data);
        this.application = data.answers;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
