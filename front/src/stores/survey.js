import { defineStore } from 'pinia';
import axios from 'axios';

export const useSurveyStore = defineStore('survey', {
  // state
  state: () => ({
    survey: {}
  }),
  // getters
  // actions
  actions: {
    // 조사지 불러오기
    async fetchSurvey(applicationNo = null) {
      try {
        if (applicationNo == null) {
          const response = await axios.get('/api/survey');
          this.survey = response.data;
        } else {
          const response = await axios.get(`/api/survey/${applicationNo}`);
          this.survey = response.data;
        }
        return this.survey;
      } catch (err) {
        console.log(err);
      }
    },

    // 조사지 업데이트(버전 업)
    async insertSurvey(data) {
      try {
        const response = await axios.post('/api/survey', data);
        this.survey = null;
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 조사지 업데이트(세부 수정)
    async updateSurvey(data) {
      try {
        const response = await axios.put('/api/survey', data);
        this.survey = null;
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
