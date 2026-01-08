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
    application: [],
    applicant: null
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

    // 지원신청서 작성
    async submitApplication(data) {
      try {
        const response = await axios.post('/api/applications', data);
        this.application = data.answer;
        return response.data;
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
    },

    // 담당자 지정
    async insertManager(applicationNo, mUserNo) {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post(`/api/applications/${applicationNo}/manager`, {
          mUserNo,
          user
        });

        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 지원자 선택
    setSelectedApplicant(applicant) {
      this.applicant = applicant;
    },
    
    // 대기단계 요청(담당자)
    async requestApplicationStatus(applicationNo, status, user) {
      try {
        const response = await axios.patch(`/api/applications/${applicationNo}/status`, {
          status,
          user
        });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
