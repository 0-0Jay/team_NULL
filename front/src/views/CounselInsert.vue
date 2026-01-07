<!-- 상담내역 작성-->

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';

const title = ref('');
const content = ref('');
const counselDate = ref(null);
const counselAuthor = ref('');

const displayConfirmation = ref(false);

const Upload = (event) => {
  // event.files 에서 선택된 파일 확인 가능
  console.log('파일 업로드 이벤트 발생', event);
};

const submitCounsel = async () => {
  //axios 작업하기
  if (!counselAuthor.value) {
    alert('작성자를 입력해주세요.');
    return;
  }

  //넘길 값들
  const data = {
    application_no: 1,
    title: title.value,
    content: content.value,
    save: 0,
    counsel_date: counselDate.value,
    counsel_author: counselAuthor.value
  };

  // await store.목록창(data);  // 추후에 사용할 예정 - 작성하고 나면 목록으로 이동됨
  // router.push({ name: '목록창 이름'});

  console.log(data);
  try {
    await axios.post('/api/counsel', data);
    alert('저장 됨');
  } catch (e) {
    console.error(e);
    alert('저장 안됨');
  }
};
</script>

<template>
  <div class="flex">
    <div class="card flex flex-col w-full">
      <!----------------------------------------------->
      <div class="text-2xl font-bold text-center">상담내역 작성</div>

      <!-------------------------------------------------------------------------------------------->
      <div class="flex flex-wrap gap-6 font-semibold">
        <!-- 작성자 -->
        <div class="flex flex-col gap-2 flex-1 pt-2">
          <label for="name">작성자</label>
          <InputText v-model="counselAuthor" id="name" type="text" placeholder="작성하신는 분의 성함을 입력하세요." />
        </div>

        <!-- 상담일 -->
        <div class="flex flex-col gap-2 mb-4 font-semibold">
          <div class="font-semibold text-xl">상담일</div>
          <DatePicker :showIcon="true" :showButtonBar="true" v-model="counselDate" />
        </div>
      </div>

      <!-- 상담 제목 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="title">제목</label>
        <InputText v-model="title" placeholder="상담 제목을 입력하세요." id="title" type="text" />
      </div>

      <!-- 상담내용 -->
      <div class="flex flex-col gap-2 mb-6 font-semibold">
        <label for="content">상담내용</label>
        <Textarea v-model="content" placeholder="구체적인 상담 내용을 적어주세요." :autoResize="true" rows="9" cols="30" />
      </div>

      <!-- 첨부파일 -->
      <div class="col-span-full lg:col-span-6 mb-2.5">
        <div class="font-semibold text-xl mb-4">첨부파일</div>
        <Toast />
        <FileUpload name="demo[]" @uploader="Upload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload chooseLabel="파일 선택" uploadLabel="업로드" cancelLabel="취소" />
      </div>

      <!-- 등록, 목록 버튼 -->
      <div class="flex flex-wrap gap-2 justify-center">
        <Button label="등록" style="width: auto" @click="submitCounsel" />

        <Dialog header="Confirmation" v-model:visible="displayConfirmation" :style="{ width: '350px' }" :modal="true">
          <div class="flex items-center justify-center">
            <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem" />
            <span>Are you sure you want to proceed?</span>
          </div>
          <template #footer>
            <Button label="Yes" icon="pi pi-check" @click="submit" severity="danger" outlined autofocus />
            <Button label="No" icon="pi pi-times" @click="closeConfirmation" text severity="secondary" />
          </template>
        </Dialog>

        <Button label="목록" severity="danger" />
      </div>
    </div>
  </div>
</template>
