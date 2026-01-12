<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

const router = useRouter();
const visible = ref(false);

const title = ref('');
const content = ref('');

function addFaq() {
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 입력하세요');
    return;
  }
  const param = { title: title.value, content: content.value, user_no: user.user_no };
  axios.post('/api/questions', param).then((response) => {
    console.log(response.data);
    alert('등록되었습니다.');
    router.push({ name: 'faq' });
  });
}

function handleConfirm() {
  visible.value = false;
  addFaq();
}
</script>

<template>
  <div class="faq-form">
    <h3 class="form-title">FAQ 등록</h3>
    
    <div class="form-group">
      <label for="name" class="form-label">작성자</label>
      <InputText v-model="user.u_name" id="name" type="text" disabled class="form-input" />
    </div>
    
    <div class="form-group">
      <label for="title" class="form-label">제목</label>
      <InputText v-model="title" placeholder="FAQ 질문을 입력하세요." id="title" type="text" class="form-input" />
    </div>
    
    <div class="form-group">
      <label for="content" class="form-label">내용</label>
      <Textarea v-model="content" placeholder="답변 내용을 입력하세요." :autoResize="true" rows="12" cols="30" class="form-textarea" />
    </div>
    
    <div class="button-group">
      <Button label="등록" @click="visible = true" class="btn-submit" />
      <RouterLink :to="{ name: 'faq' }">
        <Button label="목록" severity="secondary" outlined class="btn-cancel" />
      </RouterLink>
    </div>
  </div>
  
  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm()"> 
    FAQ를 등록하시겠습니까? 
  </ConfirmDialog>
</template>

<style scoped>
.faq-form {
  max-width: 100%;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 28px 0;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
}

.form-input,
.form-textarea {
  width: 100%;
  font-size: 15px;
}

.form-input:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-textarea {
  min-height: 300px;
  resize: vertical;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 36px;
  padding-top: 24px;
  border-top: 1px solid #f3f4f6;
  justify-content: center;
}

.btn-submit,
.btn-cancel {
  min-width: 120px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 15px;
}
</style>