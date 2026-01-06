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
    // 지원'결과'서 목록 조회
    async fetchResultList(plan_no, status) {
      try {
        const res = await axios.get(`/api/result/${plan_no}`, {
          params: { status }
        });
        this.resultList = res.data;
      } catch (err) {
        console.error(err);
      }
    },

    // 지원결과서 입력
    async createResult(data) {
      try {
        const res = await axios.post(`/api/result`, data);
        this.resultList.push(res.data); //목록에 추가
        return res.data;
      } catch (err) {
        throw err;
      }
    },

    //반려된 지원결과서 조회
    async fetchRejectResultList(plan_no) {
      try {
        const res = await axios.get(`/api/result/reject/${plan_no}`);
        this.resultList = res.data;
      } catch (err) {
        console.error('반려된 지원계획서 조회 실패', err);
      }
    },

    //대기중인 지원결과서 조회
    async fetchPendingResultDetail(plan_no) {
      try {
        const res = await axios.get(`/api/result/pending/${plan_no}`);
        this.resultList = Array.isArray(res.data) ? res.data : [res.data]; //이부분 안넣으면 작동안됨
      } catch (err) {
        console.error('지원결과서 조회 실패', err);
      }
    }
  }
});
