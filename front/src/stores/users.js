import { defineStore } from 'pinia';
import axios from 'axios';

export const useUsersStore = defineStore('users', {
  // state
  state: () => ({
    user: {},
    manager: [],
    myInfo: null,
    staff: [],
    applicant: [],
    applicantDetail: null,
    centerInfo: null,
    staffList: [],
    generalUsers: []
  }),
  // getters
  //곽현우 작성함 - 관리자 화면 분기용
  getters: {
    isAdmin: (state) => state.user?.[0]?.type === 2,
    isManager: (state) => state.user?.[0]?.type === 1,
    isUser: (state) => state.user?.[0]?.type === 0
  },

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
    async fetchCenter(userNo) {
      try {
        const response = await axios.get(`/api/userCenter/${userNo}`);
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
      localStorage.removeItem('users');
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
        this.user = response.data[0];
        return response.data;
      } catch (err) {
        console.log(err);
      }
    },

    // 비밀번호 재설정
    async changePw(data) {
      try {
        const response = await axios.put(`/api/findPw`, data);
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
      } catch (err) {
        console.log(err);
      }
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

    // 시스템 관리자 페이지 - 기관 담당자 목록 불러오기
    async fetchStaff() {
      try {
        const user = JSON.parse(localStorage.getItem('users'))?.user[0];
        const response = await axios.post(`/api/usersStaff`, { user });

        // 서버에서 받아온 배열 정렬 (최신 등록자 위)
        this.staff = response.data.sort((a, b) => b.user_no - a.user_no);

        return this.staff;
        // console.log(this.staff);
      } catch (err) {
        console.log(err);
      }
    },

    // 시스템 관리자 페이지 - 기관 담당자 정보 수정
    async modifyStaff(userNo, info) {
      try {
        const response = await axios.put(`/api/usersStaff/${userNo}`, info);
        return response.data;
      } catch (err) {
        console.log(err);
        return { status: 'error', message: err?.response?.data?.message || err.message || 'Unknown error' };
      }
    },

    // 마이페이지 - 일반회원 정보 불러오기
    async fetchMyInfo(userNo) {
      if (!userNo) return;

      const { data } = await axios.get(`/api/users/${userNo}`);
      console.log('회원 정보: ', data);
      this.myInfo = data[0];
    },

    // 마이페이지 - 회원탈퇴
    async withdrawUser(userNo) {
      if (!userNo) {
        return { status: 'error', message: 'unauthorized' };
      }
      try {
        const payload = { user_no: userNo };
        const { data } = await axios.put(`/api/users`, payload);

        if (data.status === 'success') {
          this.user = null;
          await this.logout();
        }
        return data;
      } catch (err) {
        console.log(err);
        return { status: 'error', message: '서버 에러 발생' };
      }
    },

    // 일반회원 마이페이지 - 나의 정보 수정
    async modifyMyInfo(userNo, formData) {
      if (!userNo) return;
      try {
        const payload = { ...formData };
        await axios.put(`/api/users/${userNo}`, payload);
      } catch (err) {
        console.log(err);
        throw err;
      }
    },

    // 마이페이지 - 지원자 목록 불러오기
    async fetchApplicant(userNo) {
      if (!userNo) return;
      try {
        const { data } = await axios.get(`/api/users/${userNo}/applicant`);

        // 최신 지원자가 위로 오도록 정렬
        this.applicant = data.sort((a, b) => b.a_no - a.a_no);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // 마이페이지 - 선택된 지원자 상세정보 불러오기
    async fetchApplicantDetail(a_no) {
      const { data } = await axios.get(`/api/users/applicant/${a_no}`);
      this.applicantDetail = data[0];
    },
    // 마이페이지 - 지원자 상세정보 수정
    async modifyApplicant(payload) {
      const { a_no, ...body } = payload;
      const { data } = await axios.put(`/api/users/applicant/${a_no}`, body);
      return data;
    },
    // 마이페이지 - 지원자 삭제
    async deleteApplicant(a_no) {
      try {
        const res = await axios.delete(`/api/users/applicant/${a_no}`);
        if (res.data.status === 'success') {
          this.applicant = this.applicant.filter((app) => app.a_no !== a_no);
        }
        return res.data;
      } catch (e) {
        return { status: 'error' };
      }
    },
    // 마이페이지 - 지원자 등록
    async addApplicant(userNo, payload) {
      if (!userNo) {
        return { status: 'error', message: 'unauthorized' };
      }
      try {
        const body = {
          user_no: userNo,
          ...payload
        };

        const { data } = await axios.post(`/api/users/applicant/new`, body);
        return data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // 기관관리자 마이페이지 - 기관 정보 + 담당자수
    async fetchCenterInfo(user_no) {
      try {
        const res = await axios.get(`/api/users/${user_no}/center`);
        this.centerInfo = res.data;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },

    // 기관관리자 마이페이지 - 소속 담당자 목록
    async fetchStaffList(user_no) {
      try {
        const res = await axios.get(`/api/users/${user_no}/center/staff`);
        this.staffList = res.data;
      } catch (err) {
        console.error('fetchStaffList 실패', err);
        this.staffList = [];
        throw err;
      }
    },

    // 기관관리자 마이페이지 - 기관정보 수정
    async modifyCenterInfo(payload) {
      const { user_no, ...body } = payload;
      const { data } = await axios.put(`/api/users/${user_no}/center`, body);
      return data;
    },

    // 기관소속 모든 지원자 불러오기
    async fetchCenterApplicant(userNo) {
      try {
        const data = await axios.get(`/api/center/applicant/${userNo}`);
      } catch (err) {
        console.log(err);
      }
    },

    // 시스템 관리자 페이지 - 기관 담당자 등록
    async addStaffByAdmin(info) {
      try {
        const { data } = await axios.post('/api/users/staff/new', info);
        return data;
      } catch (err) {
        console.error(err);
        return { status: 'error', message: err.message };
      }
    },

    // 시스템 관리자 페이지 - 기관 관리자 등록
    async addManagerByAdmin(info) {
      try {
        const { data } = await axios.post('/api/users/manager/new', info);
        return data;
      } catch (err) {
        console.error(err);
        return { status: 'error', message: err.message };
      }
    },
    // 기관관리자 - 같은 센터 일반회원 목록 조회
    async fetchGeneralUsersByManager(userNo) {
      if (!userNo) {
        this.generalUsers = [];
        return [];
      }

      try {
        const response = await axios.get(`/api/users/${userNo}/center/general`);
        this.generalUsers = response.data;
      } catch (err) {
        console.log(err);
        this.generalUsers = [];
        return [];
      }
    }
  },
  persist: true
});
