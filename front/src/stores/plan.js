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
    // 지원계획서 입력
    async fetchPlan(data) {
      try {
        const res = await axios.post(`/api/plan`, data);
        this.planList.push(res.data); //목록에 추가
        return this.plan;
      } catch (err) {
        throw err;
      }
    },

    //지원계획서 상세 정보 (1건)  -  수정예정 application_no => plan_no
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
