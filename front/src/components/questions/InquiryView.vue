<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useInquiryStore } from '@/stores/inquiry';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const router = useRouter();
const store = useInquiryStore();
const toast = useToast();
const visible = ref(false);

const user = JSON.parse(localStorage.getItem('users'))?.user[0];

const applicants = ref([]);
const selectedApplicantValue = ref(null);

onMounted(async () => {
  await store.fetchApplicant(user.user_no);
  applicants.value = store.applicant;
});

const type = ref('');
const title = ref('');
const content = ref('');

// 문의 유형
const inquiryTypes = [
  { label: '지원/신청 문의', value: 0 },
  { label: '시스템/기술 문의', value: 1 },
  { label: '서류/자료 문의', value: 2 },
  { label: '개인정보/권한 문의', value: 3 },
  { label: '불편/의견 사항', value: 4 },
  { label: '기타 문의', value: 5 }
];

// 인라인 에러
const errors = ref({
  applicantNo: '',
  type: '',
  title: '',
  content: ''
});

// 유효성 검사 (Toast ❌)
const validate = () => {
  errors.value = { applicantNo: '', type: '', title: '', content: '' };
  let valid = true;

  if (!selectedApplicantValue.value) {
    errors.value.applicantNo = '지원자를 선택하세요.';
    valid = false;
  }

  if (type.value === '') {
    errors.value.type = '문의 유형을 선택하세요.';
    valid = false;
  }

  if (!title.value.trim()) {
    errors.value.title = '제목을 입력하세요.';
    valid = false;
  }

  if (!content.value.trim()) {
    errors.value.content = '내용을 입력하세요.';
    valid = false;
  }

  return valid;
};

// 등록 버튼 → 유효성 통과 시에만 confirm 열기
const openConfirm = () => {
  if (!validate()) return;
  visible.value = true;
};

const addInquiry = async () => {
  const inquiryInfo = {
    userNo: user.user_no,
    aNo: selectedApplicantValue.value,
    type: type.value,
    title: title.value,
    content: content.value
  };

  try {
    await store.insertInquiry(inquiryInfo);

    toast.add({
      severity: 'success',
      summary: '등록 완료',
      detail: '문의가 등록되었습니다.',
      life: 3000
    });

    router.push({ name: 'inquiry' });
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '등록 실패',
      detail: '문의 등록에 실패했습니다.',
      life: 3000
    });
  }
};

const handleConfirm = () => {
  visible.value = false;
  addInquiry();
};
</script>

<template>
  <div class="faq-form">
    <Toast />

    <h3 class="form-title">1:1 문의 등록</h3>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="form-group">
        <label class="form-label">작성자</label>
        <InputText :modelValue="user?.u_name" readonly class="form-input" />
      </div>
      <div class="form-group">
        <label class="form-label">작성일</label>
        <InputText :modelValue="new Date().toLocaleDateString('ko-KR')" readonly class="form-input" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="form-group">
        <label class="form-label">지원자</label>
        <Dropdown v-model="selectedApplicantValue" :options="applicants" optionLabel="name" optionValue="a_no" placeholder="지원자 선택" class="w-full" />
        <small v-if="errors.applicantNo" class="error">
          {{ errors.applicantNo }}
        </small>
      </div>

      <div class="form-group">
        <label class="form-label">문의 유형</label>
        <Dropdown v-model="type" :options="inquiryTypes" optionLabel="label" optionValue="value" placeholder="문의 유형 선택" class="w-full" />
        <small v-if="errors.type" class="error">
          {{ errors.type }}
        </small>
      </div>
    </div>

    <div class="form-group mb-6">
      <label class="form-label">제목</label>
      <InputText v-model="title" class="form-input" />
      <small v-if="errors.title" class="error">
        {{ errors.title }}
      </small>
    </div>

    <div class="form-group">
      <label class="form-label">내용</label>
      <Textarea v-model="content" rows="12" class="form-textarea" />
      <small v-if="errors.content" class="error">
        {{ errors.content }}
      </small>
    </div>

    <div class="button-group">
      <Button label="등록" @click="openConfirm" class="btn-submit" />
      <Button label="목록" severity="secondary" outlined class="btn-cancel" @click="router.push({ name: 'inquiry' })" />
    </div>
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm"> 문의를 등록하시겠습니까? </ConfirmDialog>
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

.form-input[readonly] {
  background-color: #f9fafb;
  color: #1f2937;
  opacity: 1;
}

.form-textarea {
  min-height: 300px;
  resize: vertical;
}

.error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  /* padding-top: 24px; */
  /* border-top: 1px solid #f3f4f6; */
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
