<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const visible = ref(false);
const faqs = ref([]);
const faqNo = ref(null);
const delFaqNo = ref(null);
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

onMounted(async () => {
  try {
    const { data } = await axios.get('/api/questions');
    faqs.value = data;
    faqNo.value = null;
  } catch (e) {
    console.error(e);
  }
});

function openDelConfirm(faqNo) {
  delFaqNo.value = faqNo;
  visible.value = true;
}

async function delFaq() {
  if (!delFaqNo.value) return;

  visible.value = false;
  await axios.delete(`/api/questions/${delFaqNo.value}`);

  alert('삭제되었습니다.');
  faqs.value = faqs.value.filter((faq) => faq.faq_no !== delFaqNo.value);
  delFaqNo.value = null;
}
</script>

<template>
  <div class="faq-list">
    <div class="faq-header">
      <h3 class="faq-title">자주 묻는 질문</h3>
      <RouterLink v-if="user.type === 1 || user.type === 2" :to="{ name: 'faq-create' }">
        <Button label="+ FAQ 등록" class="btn-create" />
      </RouterLink>
    </div>

    <Accordion :value="faqNo" class="faq-accordion">
      <AccordionPanel v-for="faq in faqs" :key="faq.faq_no" :value="faq.faq_no">
        <AccordionHeader>{{ faq.title }}</AccordionHeader>
        <AccordionContent>
          <p class="faq-content-text">{{ faq.content }}</p>

          <div class="faq-admin-actions" v-if="user.type === 1 || user.type === 2">
            <RouterLink :to="{ name: 'faq-update', params: { faq_no: faq.faq_no } }">
              <Button label="수정" class="btn-action" />
            </RouterLink>
            <Button label="삭제" severity="danger" @click="openDelConfirm(faq.faq_no)" class="btn-action" />
          </div>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <ConfirmDialog v-model:visible="visible" @confirm="delFaq"> 정말로 삭제하시겠습니까? </ConfirmDialog>
  </div>
</template>

<style scoped>
.faq-list {
  max-width: 100%;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.faq-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-create {
  min-width: 140px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 15px;
}

.faq-accordion {
  margin-bottom: 24px;
}

:deep(.p-accordion) {
  border: none;
  border-radius: 0;
  background: transparent;
}

:deep(.p-accordionpanel) {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 20px;
  background: #ffffff;
  overflow: hidden;
}

:deep(.p-accordionpanel:last-child) {
  margin-bottom: 0;
}

:deep(.p-accordionheader) {
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  transition: all 0.2s ease;
  background: #f9fafb;
  border: none;
}

:deep(.p-accordionheader:hover) {
  background-color: #f3f4f6;
}

:deep(.p-accordioncontent) {
  padding: 24px 24px 10px 24px;
  font-size: 15px;
  line-height: 1.7;
  color: #374151;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.faq-content-text {
  margin: 0 0 20px 0;
  white-space: pre-wrap;
}

.faq-admin-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn-action {
  min-width: 80px;
  padding: 5px 20px;
  font-weight: 600;
  font-size: 14px;
}
</style>
