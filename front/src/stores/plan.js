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
    async fetchPlanList(application_no) {
      try {
        const res = await axios.get(`/api/plan/${application_no}`);
        this.planList = res.data;
        return this.planList;
      } catch (err) {
        console.error('승인된 지원계획서 조회 실패', err);
      }
    },

    // 지원계획서 입력
    async createPlan(data) {
      try {
        const res = await axios.post(`/api/plan/`, data);
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
        this.planList = [];
        const res = await axios.get(`/api/plan/pending/${application_no}`, {
          params: { status: 0 } // 0 = 승인대기
        });
        this.planList = Array.isArray(res.data) ? res.data : [res.data];
      } catch (err) {
        console.error('지원계획서 조회 실패', err);
      }
    },

    //(관리자용) 지원계획서 조회 - 지울예정
    async fetchAdminPlanDetail(application_no) {
      try {
        const res = await axios.get(`/api/plan/admin/${application_no}`);
        this.planList = res.data;
      } catch (err) {
        console.error('관리자용 지원계획서 조회 실패', err);
      }
    },

    //승인, 반려 하면 status값 변경하기 위함
    async updatePlanStatus(application_no, status) {
      try {
        const res = await axios.patch('/api/plan/status', { application_no, status });
        return res.data;
      } catch (err) {
        console.error('status 값 변경 실패', err);
      }
    }
  }
});
