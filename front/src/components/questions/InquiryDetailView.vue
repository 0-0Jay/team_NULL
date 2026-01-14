<script setup>
import { onBeforeMount, computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useInquiryStore } from '@/stores/inquiry';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const route = useRoute();
const store = useInquiryStore();
const toast = useToast();

const user = JSON.parse(localStorage.getItem('users'))?.user[0];
const inquiryNo = Number(route.params.inquiry_no);

// confirm dialog
const visible = ref(false);
const confirmType = ref(''); // inquiry | answer

// 문의 수정
const editMode = ref(false);
const editInquiry = ref({
  aNo: null,
  type: null,
  title: '',
  content: ''
});

// 답변
const answerContent = ref('');
const answerEditMode = ref(false);

// 인라인 에러
const errors = ref({
  inquiryTitle: '',
  inquiryContent: '',
  answerContent: '',
  inquiryType: ''
});

onBeforeMount(async () => {
  await Promise.all([store.fetchInquiryDetail(inquiryNo), store.fetchApplicant()]);

  if (store.inquiryDetail) {
    editInquiry.value = {
      aNo: store.inquiryDetail.a_no,
      type: store.inquiryDetail.type,
      title: store.inquiryDetail.title,
      content: store.inquiryDetail.content
    };
  }

  if (store.inquiryDetail?.status === 1) {
    answerContent.value = store.inquiryDetail.answer_content;
  }
});

const inquiry = computed(() => store.inquiryDetail);

// 권한
const isGuardian = user.type === 0;
const isStaff = user.type === 1 || user.type === 2;

// 문의 수정 가능
const canEditInquiry = computed(() => {
  return isGuardian && inquiry.value?.status === 0;
});

// 답변 가능
const canAnswer = computed(() => {
  return isStaff;
});

// 문의 유형
const inquiryTypes = [
  { label: '지원/신청 문의', value: 0 },
  { label: '시스템/기술 문의', value: 1 },
  { label: '서류/자료 문의', value: 2 },
  { label: '개인정보/권한 문의', value: 3 },
  { label: '불편/의견 사항', value: 4 },
  { label: '기타 문의', value: 5 }
];

const inquiryTypeLabel = computed(() => {
  const found = inquiryTypes.find((v) => v.value === inquiry.value?.type);
  return found?.label ?? '-';
});

// 지원자 이름
const applicantName = computed(() => {
  if (!inquiry.value?.a_no) return '-';
  if (!Array.isArray(store.applicant)) return '-';

  const applicant = store.applicant.find((a) => Number(a.a_no) === Number(inquiry.value.a_no));

  return applicant?.name ?? '-';
});

// 상태 뱃지
const statusBadge = computed(() => {
  return inquiry.value?.status === 1 ? { label: '답변 완료', class: 'bg-green-100 text-green-700' } : { label: '미답변', class: 'bg-yellow-100 text-yellow-700' };
});

// 날짜 포맷
const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

/* =========================
   이벤트
========================= */

// 문의 수정
const openInquiryEdit = () => {
  errors.value.inquiryTitle = '';
  errors.value.inquiryContent = '';
  errors.value.inquiryType = '';

  let valid = true;
  if (editInquiry.value.type === null) {
    errors.value.inquiryType = '문의 유형을 선택하세요.';
    valid = false;
  }

  if (!editInquiry.value.title.trim()) {
    errors.value.inquiryTitle = '제목을 입력하세요.';
    valid = false;
  }

  if (!editInquiry.value.content.trim()) {
    errors.value.inquiryContent = '내용을 입력하세요.';
    valid = false;
  }

  if (!valid) return;

  confirmType.value = 'inquiry';
  visible.value = true;
};

// 답변 작성 / 수정
const openAnswer = () => {
  errors.value.answerContent = '';

  if (!answerContent.value.trim()) {
    errors.value.answerContent = '답변 내용을 입력하세요.';
    return;
  }

  confirmType.value = 'answer';
  visible.value = true;
};

const handleConfirm = async () => {
  visible.value = false;

  try {
    // 문의 수정
    if (confirmType.value === 'inquiry') {
      await store.updateInquiry(inquiryNo, {
        userNo: user.user_no,
        aNo: editInquiry.value.aNo,
        userType: user.type,
        type: editInquiry.value.type,
        title: editInquiry.value.title,
        content: editInquiry.value.content
      });

      toast.add({
        severity: 'success',
        summary: '수정 완료',
        detail: '문의가 수정되었습니다.',
        closable: false,
        life: 3000
      });

      editMode.value = false;
      await store.fetchInquiryDetail(inquiryNo);
    }

    // 답변 등록 / 수정
    if (confirmType.value === 'answer') {
      if (inquiry.value.status === 0) {
        await store.addInquiryAnswer(inquiryNo, answerContent.value);
        toast.add({
          severity: 'success',
          summary: '등록 완료',
          detail: '답변이 등록되었습니다.',
          closable: false,
          life: 3000
        });
      } else {
        await store.updateInquiryAnswer(inquiryNo, answerContent.value);
        toast.add({
          severity: 'success',
          summary: '수정 완료',
          detail: '답변이 수정되었습니다.',
          closable: false,
          life: 3000
        });
      }

      answerEditMode.value = false;
      await store.fetchInquiryDetail(inquiryNo);
    }
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: '실패',
      detail: '처리 중 오류가 발생했습니다.',
      closable: false,
      life: 3000
    });
  }
};
</script>

<template>
  <div class="inquiry-detail">
    <Toast />

    <!-- 제목 -->
    <div class="detail-header">
      <h3 class="form-title">1:1 문의 상세</h3>
      <span class="px-3 py-1 font-semibold rounded-full" :class="statusBadge.class">
        {{ statusBadge.label }}
      </span>
    </div>

    <!-- 본문 -->
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="form-group">
        <label class="form-label">작성자</label>
        <InputText :modelValue="inquiry?.writer_name" readonly class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">작성일</label>
        <InputText :modelValue="formatDate(inquiry?.inquiry_date)" readonly class="form-input" />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="form-group">
        <label class="form-label">지원자</label>
        <InputText :modelValue="applicantName" readonly class="form-input" />
      </div>

      <div class="form-group">
        <label class="form-label">문의 유형</label>

        <Dropdown v-if="editMode" v-model="editInquiry.type" :options="inquiryTypes" optionLabel="label" optionValue="value" placeholder="문의 유형 선택" class="w-full" />

        <InputText v-else :modelValue="inquiryTypeLabel" readonly class="form-input" />
        <small v-if="errors.inquiryType" class="error">
          {{ errors.inquiryType }}
        </small>
      </div>
    </div>

    <div class="form-group mb-6">
      <label class="form-label">제목</label>
      <InputText v-if="editMode" v-model="editInquiry.title" class="form-input" />
      <InputText v-else :modelValue="inquiry?.title" readonly class="form-input" />
      <small v-if="errors.inquiryTitle" class="error">{{ errors.inquiryTitle }}</small>
    </div>

    <div class="form-group">
      <label class="form-label">내용</label>
      <Textarea v-if="editMode" v-model="editInquiry.content" rows="5" class="form-textarea" />
      <Textarea v-else :modelValue="inquiry?.content" rows="5" readonly class="form-textarea" />
      <small v-if="errors.inquiryContent" class="error">{{ errors.inquiryContent }}</small>
    </div>

    <div v-if="canEditInquiry" class="button-group">
      <Button v-if="!editMode" label="문의 수정" @click="editMode = true" class="btn-submit" />
      <Button v-else label="수정 완료" @click="openInquiryEdit" class="btn-submit" />
      <Button v-if="editMode" label="취소" severity="secondary" outlined @click="editMode = false" class="btn-cancel" />
      <RouterLink v-if="!editMode" :to="{ name: 'inquiry' }">
        <Button label="목록" severity="secondary" outlined class="btn-cancel" />
      </RouterLink>
    </div>

    <!-- 답변 영역 -->
    <!-- 미답변 -->
    <div v-if="canAnswer && inquiry?.status === 0" class="answer-section">
      <h4 class="answer-title">답변 작성</h4>
      <Textarea v-model="answerContent" rows="6" class="form-textarea" />
      <small v-if="errors.answerContent" class="error">{{ errors.answerContent }}</small>
      <div class="button-group">
        <Button label="저장" @click="openAnswer" class="btn-submit" />
      </div>
    </div>

    <!-- 답변 완료 -->
    <div v-if="inquiry?.status === 1" class="answer-section">
      <h4 class="answer-title">답변</h4>

      <Textarea v-if="answerEditMode" v-model="answerContent" rows="4" class="form-textarea" />
      <Textarea v-else :modelValue="inquiry?.answer_content" rows="4" readonly class="form-textarea" />

      <small v-if="errors.answerContent" class="error">{{ errors.answerContent }}</small>

      <div v-if="user?.type === 1 || user?.type === 2" class="button-group">
        <Button v-if="!answerEditMode" label="답변 수정" @click="answerEditMode = true" class="btn-submit" />
        <Button v-else label="수정 완료" @click="openAnswer" class="btn-submit" />
        <Button v-if="answerEditMode" label="취소" severity="secondary" outlined @click="answerEditMode = false" class="btn-cancel" />
      </div>
    </div>
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm">
    {{ confirmType === 'inquiry' ? '문의를 수정하시겠습니까?' : inquiry?.status === 0 ? '답변을 등록하시겠습니까?' : '답변을 수정하시겠습니까?' }}
  </ConfirmDialog>
</template>

<style scoped>
.inquiry-detail {
  max-width: 100%;
}

.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
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

.form-input[readonly],
.form-textarea[readonly] {
  background-color: #f9fafb;
  color: #1f2937;
  opacity: 1 !important;
}

.form-textarea {
  resize: vertical;
}

.error {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}

.answer-section {
  padding-top: 20px;
  border-top: 2px solid #f3f4f6;
  margin-top: 15px;
}

.answer-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-top: 15px;
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
