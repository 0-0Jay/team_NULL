// stores/inquiry.js

import { defineStore } from 'pinia';
import axios from 'axios';

export const useInquiryStore = defineStore('inquiry', {
  // state
  state: () => ({
    inquiryList: [],
    inquiryDetail: null,
    applicant: []
  }),
  // getters
  // actions
  actions: {
    async insertInquiry(inquiryInfo) {
      console.log('보내는 inquiryInfo:', inquiryInfo);
      const response = await axios.post('/api/inquiries', inquiryInfo);
      return response.data;
    },

    async fetchInquiryList() {
      const user = JSON.parse(localStorage.getItem('users'))?.user[0];

      const response = await axios.post('/api/inquiries/list', {
        userNo: user.user_no,
        type: user.type,
        cNo: user.c_no
      });
      // console.log(response.data);
      this.inquiryList = Array.isArray(response.data) ? response.data : [];
    },
    async fetchInquiryDetail(inquiryNo) {
      const user = JSON.parse(localStorage.getItem('users'))?.user[0];

      const response = await axios.post(`/api/inquiries/detail/${inquiryNo}`, {
        userNo: user.user_no,
        type: user.type,
        cNo: user.c_no
      });

      this.inquiryDetail = response.data;
      console.log(this.inquiryDetail);
      return response.data;
    },
    async fetchApplicant() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post('/api/findApplicant', { user });

        // console.log(response.data);
        this.applicant = response.data;
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async updateInquiry(inquiryNo, inquiryInfo) {
      const response = await axios.put(`/api/inquiries/${inquiryNo}`, inquiryInfo);
      return response.data;
    },
    async addInquiryAnswer(inquiryNo, content) {
      const user = JSON.parse(localStorage.getItem('users'))?.user[0];

      const response = await axios.post(`/api/inquiries/${inquiryNo}/answer`, {
        userNo: user.user_no,
        type: user.type,
        content
      });

      return response.data;
    },
    async updateInquiryAnswer(inquiryNo, content) {
      const user = JSON.parse(localStorage.getItem('users'))?.user[0];

      const response = await axios.put(`/api/inquiries/${inquiryNo}/answer`, {
        type: user.type,
        content
      });

      return response.data;
    }
  },
  persist: true
});
