// stores/faq.js

import { defineStore } from 'pinia';
import axios from 'axios';

export const useFaqStore = defineStore('faq', {
  // state
  state: () => ({
    faqs: []
  }),
  // getters
  // actions
  actions: {
    // faq 목록
    async fetchFaqs() {
      try {
        const response = await axios.get('/api/questions');
        this.faqs = response.data;
      } catch (err) {
        console.log(err);
      }
    }

    // // 게시글 상세
    // async fetchPostDetail(no) {
    //   try {
    //     const response = await axios.get(`/api/boards/${no}`);
    //     this.currentPost = response.data;
    //   } catch (err) {
    //     console.log(err);
    //   }
    // },

    // // 게시글 저장
    // async savePost(postData, no = null) {
    //   let result = {};
    //   if (no) {
    //     result = await axios.put(`/api/boards/${no}`, postData);
    //   } else {
    //     result = await axios.post('/api/boards', postData);
    //   }
    //   this.fetchPostDetail(result.data.boardId);
    //   return result.data.boardId;
    // },

    // // 게시글 삭제
    // async deletePost(no) {
    //   await axios.delete(`/api/boards/${no}`);
    //   this.fetchPost();
    // }
  }
});
