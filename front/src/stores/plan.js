import { defineStore } from 'pinia';
import axios from 'axios';

export const usePlanStore = defineStore('plan', {
  //저장소를 만들고 다른화면에서 사용하도록 내보냄
  // state
  state: () => ({
    planList: [],
    planDetail: null
  }),
  //getters
  //actions

  actions: {
    // 지원계획서 목록 조회
    async fetchPlanList(application_no, status) {
      try {
        const res = await axios.get(`/api/plan/${application_no}`, {
          params: { status }
        });
        this.planList = res.data;
      } catch (err) {
        console.error('승인된 지원계획서 조회 실패', err);
      }
    },

    // 지원계획서 입력
    async createPlan(data) {
      try {
        const res = await axios.post(`/api/plan`, data);
        this.planList.push(res.data); //목록에 추가
        return res.data;
      } catch (err) {
        throw err;
      }
    },

    //반려된 지원계획서 조회
    async fetchRejectPlanList(application_no) {
      try {
        const res = await axios.get(`/api/plan/reject/${application_no}`);
        this.planList = res.data;
      } catch (err) {
        console.error('반려된 지원계획서 조회 실패', err);
      }
    },

    //대기중인 지원계획서 조회
    async fetchPendingPlanDetail(application_no) {
      try {
        const res = await axios.get(`/api/plan/pending/${application_no}`);
        this.planList = Array.isArray(res.data) ? res.data : [res.data]; //이부분 안넣으면 작동안됨
      } catch (err) {
        console.error('지원계획서 조회 실패', err);
      }
    },

     //(관리자용) 지원계획서 조회
    async fetchAdminPendingPlanDetail(application_no) {
      try {
        const res = await axios.get(`/api/plan/admin/pending/${application_no}`);
        this.planList = res.data;
      } catch (err) {
        console.error('관리자용 지원계획서 조회 실패', err);
      }
    },
  }
});
