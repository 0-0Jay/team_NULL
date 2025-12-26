import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore('users', {
  // state
  state: () => ({
    user: {},
    manager: []
  }),
  // getters
  // actions
  actions: {
    // 회원가입
    async signUp(formData) {
      try {
        const response = await axios.post('/api/signUp', formData);
        this.user = response.data;
        return this.user;
      } catch (err) {
        console.log(err);
      }
    },
    // 아이디 중복 확인
    async idCheck(id) {
      try {
        const response = await axios.post('/api/idCheck', id);
        return response;
      } catch (err) {
        console.log(err);
      }
    },

    // 이메일 중복 확인
    async emailCheck(email) {
      try {
        const response = await axios.post('/api/emailCheck', email);
        return response;
      } catch (err) {
        console.log(err);
      }
    },

    // 기관번호 가져오기
    async fetchCenter() {
      try {
        const response = await axios.get(`/api/userCenter/${13}`);
        return response.data[0];
      } catch (err) {
        console.log(err);
      }
    },

    // 로그인
    async login(data) {
      try {
        const response = await axios.post(`/api/login`, data);
        this.user = response.data;
        return this.user;
      } catch (err) {
        console.log(err);
      }
    },

    // 로그아웃
    async logout() {
      this.user = null;
    },

    async findId(data) {
      try {
        const response = await axios.post(`/api/findId`, data);
        console.log(response.data[0]);
        return response.data[0];
      } catch (err) {
        console.log(err);
      }
    },

    // 기관 관리자 불러오기
    async fetchManager() {
      try {
        const response = await axios.get('/api/usersManager');
        this.manager = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 회원상태(사용승인 및 비활성화)
    async modifyStatus(userNos, status) {
      try {
        const response = await axios.put('/api/users/status', { userNos, status });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
