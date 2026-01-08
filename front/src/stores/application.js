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
    application: []
  }),
  // getters
  // actions
  actions: {
    // 지원신청내역 담당자 불러오기
    async fetchApplication() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/applicationList', { user });

        this.appList = response.data.appList || [];
        this.manager = response.data.managerList || [];
        this.planStat = response.data.planList || [];
        this.resultStat = response.data.resultList || [];
        this.counselStat = response.data.counselList || [];
      } catch (err) {
        console.log(err);
      }
    },

    // 지원신청서 작성 // 미완
    async submitApplication(data) {
      try {
        const response = await axios.post('/api/applications', data);
        this.application = data.answers;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원신청서 조회
    async fetchApplicationDetail(application_no) {
      try {
        const response = await axios.get(`/api/applications/${application_no}`);
        this.application = response.data;
        return this.application;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원신청서 수정
    async updateApplication(data) {
      try {
        const response = await axios.put('/api/applications', data);
        this.application = data;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원자 목록 불러오기
    async fetchApplicant() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/findApplicant', { user });

        // console.log(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
