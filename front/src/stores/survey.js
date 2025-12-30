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
    async fetchSurvey() {
      try {
        const response = await axios.get('/api/survey');
        this.survey = response.data;
        return this.survey;
      } catch (err) {
        console.log(err);
      }
    },

    async updateSurvey(data) {
      try {
        const response = await axios.post('/api/survey', data);
        this.survey = null;
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
