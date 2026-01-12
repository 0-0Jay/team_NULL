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
const applicantFilteredValue = ref([]);

onMounted(async () => {
  await store.fetchApplicant(user.user_no);
  applicants.value = store.applicant;
});

const searchApplicant = (event) => {
  if (!event.query.trim().length) {
    applicantFilteredValue.value = [...applicants.value];
  } else {
    applicantFilteredValue.value = applicants.value.filter((a) => a.name && a.name.toLowerCase().startsWith(event.query.toLowerCase()));
  }
};

const type = ref('');
const title = ref('');
const content = ref('');

// 문의 유형
const inquiryTypes = [
  { label: '지원 절차', value: 0 },
  { label: '지원 대상', value: 1 },
  { label: '서류 관련', value: 2 },
  { label: '기타', value: 3 }
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

  if (!selectedApplicantValue.value?.a_no) {
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
    aNo: selectedApplicantValue.value.a_no,
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
  <div class="pt-3 w-full faq-form h-[calc(100vh-260px)] overflow-hidden">
    <div class="w-full h-full bg-white rounded-xl shadow-md border border-gray-200 p-8 flex flex-col gap-6">
      <Toast />

      <h2 class="text-2xl font-bold text-gray-800">1:1 문의 등록</h2>

      <!-- 스크롤 영역 -->
      <div class="flex-1 overflow-auto flex flex-col gap-6 pr-1">
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col">
            <label>작성자</label>
            <InputText :modelValue="user?.u_name" readonly />
          </div>
          <div class="flex flex-col">
            <label>작성일</label>
            <InputText :modelValue="new Date().toLocaleDateString('ko-KR')" readonly />
          </div>
        </div>

        <div class="flex flex-col">
          <label>지원대상</label>
          <AutoComplete v-model="selectedApplicantValue" :suggestions="applicantFilteredValue" optionLabel="name" placeholder="지원자명" dropdown completeOnFocus @complete="searchApplicant" />
          <small v-if="errors.applicantNo" class="error">
            {{ errors.applicantNo }}
          </small>
        </div>

        <div class="flex flex-col">
          <label>문의 유형</label>
          <Dropdown v-model="type" :options="inquiryTypes" optionLabel="label" optionValue="value" placeholder="문의 유형 선택" class="w-full" />
          <small v-if="errors.type" class="error">
            {{ errors.type }}
          </small>
        </div>

        <div class="flex flex-col">
          <label>제목</label>
          <InputText v-model="title" />
          <small v-if="errors.title" class="error">
            {{ errors.title }}
          </small>
        </div>

        <div class="flex flex-col">
          <label>내용</label>
          <Textarea v-model="content" rows="6" />
          <small v-if="errors.content" class="error">
            {{ errors.content }}
          </small>
        </div>
      </div>

      <!-- 하단 버튼 -->
      <div class="flex justify-center pt-6 border-t border-gray-100">
        <Button label="등록" @click="openConfirm" />
      </div>
    </div>
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm"> 문의를 등록하시겠습니까? </ConfirmDialog>
</template>

<style scoped>
.faq-form label {
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 6px;
}

.error {
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}

.faq-form :deep(input),
.faq-form :deep(textarea) {
  width: 100%;
  font-size: 15px;
}

.faq-form :deep(input[readonly]) {
  background-color: #f9fafb;
  color: #1f2937;
  opacity: 1;
}

/* textarea 내부 스크롤 */
.faq-form :deep(textarea) {
  height: 300px;
  max-height: 300px;
  resize: none;
  overflow-y: auto;
}

.faq-form :deep(button) {
  min-width: 120px;
  padding: 12px 28px;
  font-weight: 600;
  font-size: 15px;
}
</style>
