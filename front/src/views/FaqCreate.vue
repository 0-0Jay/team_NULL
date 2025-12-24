<script setup>
import { ref } from 'vue';
import axios from 'axios';

const displayConfirmation = ref(false);

function openConfirmation() {
  displayConfirmation.value = true;
}
function closeConfirmation() {
  displayConfirmation.value = false;
}

const title = ref('');
const content = ref('');
const name = ref('1');

function addFaq() {
  // 1. 입력값 유효성 체크
  if (!title.value.trim() || !content.value.trim()) {
    alert('제목과 내용을 입력하세요');
    return;
  }
  // 2. 파라미터 정리
  const param = { title: title.value, content: content.value, user_no: name.value };
  // 3. 서버 요청
  axios.post('/api/questions', param).then((response) => {
    console.log(response.data);
    alert('등록되었습니다.');

    // 4. 성공시 dialog 닫기
    closeConfirmation();

    // 5. 목록 이동
  });
}
</script>
<template>
  <Tabs value="0">
    <TabList>
      <Tab value="0">FAQ</Tab>
      <Tab value="1">1:1문의내역</Tab>
      <Tab value="2">1:1문의하기</Tab>
    </TabList>
  </Tabs>
  <div class="card">
    <div class="card flex flex-col gap-4">
      <div class="font-bold text-2xl text-center">새 FAQ 등록</div>
      <div class="flex flex-col grow basis-0 gap-2">
        <label for="name">작성자</label>
        <InputText v-model="name" id="name" type="text" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="title">제목</label>
        <InputText v-model="title" placeholder="FAQ 질문을 입력하세요." id="title" type="text" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="content">내용</label>
        <Textarea v-model="content" placeholder="답변 내용을 입력하세요." :autoResize="true" rows="3" cols="30" />
      </div>
      <div class="flex flex-wrap gap-2 justify-center">
        <Button label="등록" style="width: auto" @click="openConfirmation" />
        <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
          <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>Are you sure you want to proceed?</span>
          </div>
          <template #footer>
            <Button label="Yes" icon="pi pi-check" @click="addFaq" severity="danger" outlined autofocus />
            <Button label="No" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
          </template>
        </Dialog>
        <Button label="목록" severity="danger" />
      </div>
    </div>
  </div>
</template>
