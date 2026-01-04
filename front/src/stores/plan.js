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
        console.error(err);
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

    //대기중인 지원계획서 조회
    async fetchPlanDetail(application_no) {
      try {
        const res = await axios.get(`/api/plan/pending/${application_no}`);
        this.planDetail = res.data;
      } catch (err) {
        console.error('지원계획서 조회 실패', err);
      }
    }
  }
});
