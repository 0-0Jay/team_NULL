<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import router from '@/router';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const visible = ref(false);
let faqs = ref([]);
const faqNo = ref(null);
const delFaqNo = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('/api/questions');
    faqs.value = response.data;
    if (faqs.value.length > 0) {
      faqNo.value = faqs.value[0].faq_no;
    }
  } catch (e) {
    console.error(e);
  }
});

function openDelConfirm(faqNo) {
  delFaqNo.value = faqNo;
  visible.value = true;
}
function delFaq() {
  if (!delFaqNo.value) return;

  visible.value = false;

  axios.delete(`/api/questions/${delFaqNo.value}`).then(() => {
    alert('삭제되었습니다.');
    faqs.value = faqs.value.filter((faq) => faq.faq_no !== delFaqNo.value);
    delFaqNo.value = null;
  });
}
</script>
<template>
  <Tabs value="0">
    <TabList>
      <RouterLink :to="{ name: 'faq' }"><Tab value="0">FAQ</Tab></RouterLink>
      <Tab value="1">1:1문의내역</Tab>
      <Tab value="2">1:1문의하기</Tab>
    </TabList>
  </Tabs>
  <div class="card">
    <div class="faq-header">
      <div class="font-semibold text-3xl mb-4">FAQ</div>
      <RouterLink :to="{ name: 'faq-create' }"><Button label="+ FAQ 등록" /></RouterLink>
    </div>
    <Accordion :value="faqNo">
      <AccordionPanel v-for="faq in faqs" :value="faq.faq_no" v-bind:key="faq.faq_no">
        <AccordionHeader>{{ faq.title }}</AccordionHeader>
        <AccordionContent>
          <p>{{ faq.content }}</p>
          <div class="faq-admin-actions">
            <div class="flex flex-wrap gap-2">
              <RouterLink :to="{ name: 'faq-update', params: { faq_no: faq.faq_no } }"><Button label="수정" /></RouterLink>
              <Button label="삭제" severity="danger" @click="openDelConfirm(faq.faq_no)" />
            </div>
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
    <ConfirmDialog v-model:visible="visible" @confirm="delFaq()"> 정말로 삭제하시겠습니까? </ConfirmDialog>
  </div>
</template>
<style scoped>
.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
:deep(.p-accordionheader) {
  padding-left: 10px;
  font-size: large;
}
:deep(.p-accordioncontent-content) {
  background-color: rgba(209, 212, 212, 0.253);
  padding-top: 20px;
}
.faq-admin-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
