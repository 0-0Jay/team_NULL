import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore('users', {
  // state
  state: () => ({
    user: {},
    manager: [],
    staff: []
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
      this.user = undefined;
      localStorage.removeItem('user');
    },

    // 아이디 찾기
    async findId(data) {
      try {
        const response = await axios.post(`/api/findId`, data);
        this.user = response.data[0];
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 비밀번호 찾기
    async findPw(data) {
      try {
        const response = await axios.post(`/api/findPw`, data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 인증코드 수신
    async sendCode(email) {
      try {
        const response = await axios.post(`/api/sendCode`, email);
        return response;
      } catch (Err) {}
    },

    // 기관 관리자 불러오기
    async fetchManager() {
      try {
        const response = await axios.get(`/api/usersManager`);
        this.manager = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 회원상태(사용승인 및 비활성화)
    async modifyStatus(userNos, status) {
      try {
        const response = await axios.put(`/api/users/status`, { userNos, status });
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 기관 관리자 페이지 - 기관 담당자 불러오기
    async fetchStaff() {
      try {
        const response = await axios.get(`/api/usersStaff`);
        this.staff = response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 기관 관리자 페이지 - 기관 담당자 정보 수정
    async modifyStaff(userNo, info) {
      try {
        const response = await axios.put(`/api/usersStaff/${userNo}`, info);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
  },
  persist: true
});
