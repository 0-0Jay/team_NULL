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
  <div class="pt-3 w-full h-[calc(100vh-260px)] overflow-hidden">
    <div class="w-full h-full bg-white rounded-xl shadow-md border border-gray-200 p-5 flex flex-col gap-6">
      <Toast />

      <!-- 제목 -->
      <div class="flex justify-center items-center gap-3 border-b pb-3">
        <h2 class="text-2xl font-bold text-gray-800">1:1 문의 상세</h2>
        <span class="px-3 py-1 font-semibold rounded-full" :class="statusBadge.class">
          {{ statusBadge.label }}
        </span>
      </div>

      <!-- 스크롤 -->
      <div class="flex-1 overflow-auto flex flex-col gap-6 pr-1">
        <div class="grid grid-cols-2 gap-6">
          <div class="flex flex-col gap-1">
            <label>작성자</label>
            <InputText :modelValue="inquiry?.writer_name" readonly class="bg-gray-50" />
          </div>

          <div class="flex flex-col gap-1">
            <label>작성일</label>
            <InputText :modelValue="formatDate(inquiry?.inquiry_date)" readonly class="bg-gray-50" />
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label>지원자</label>
          <InputText :modelValue="applicantName" readonly class="bg-gray-50" />
        </div>

        <div class="flex flex-col gap-1">
          <label>문의 유형</label>

          <Dropdown v-if="editMode" v-model="editInquiry.type" :options="inquiryTypes" optionLabel="label" optionValue="value" placeholder="문의 유형 선택" class="w-full" />

          <InputText v-else :modelValue="inquiryTypeLabel" readonly class="bg-gray-50" />
          <small v-if="errors.inquiryType" class="error">
            {{ errors.inquiryType }}
          </small>
        </div>

        <div class="flex flex-col gap-1">
          <label>제목</label>
          <InputText v-if="editMode" v-model="editInquiry.title" />
          <InputText v-else :modelValue="inquiry?.title" readonly class="bg-gray-50" />
          <small v-if="errors.inquiryTitle" class="error">{{ errors.inquiryTitle }}</small>
        </div>

        <div class="flex flex-col gap-1">
          <label>내용</label>
          <Textarea v-if="editMode" v-model="editInquiry.content" rows="6" />
          <Textarea v-else :modelValue="inquiry?.content" rows="6" readonly class="bg-gray-50" />
          <small v-if="errors.inquiryContent" class="error">{{ errors.inquiryContent }}</small>
        </div>

        <div v-if="canEditInquiry" class="flex justify-end gap-3 pt-4">
          <Button v-if="!editMode" label="문의 수정" @click="editMode = true" />
          <Button v-else label="수정 완료" @click="openInquiryEdit" />
          <Button v-if="editMode" label="취소" severity="secondary" @click="editMode = false" />
        </div>

        <!-- 답변 영역 -->
        <!-- 미답변 -->
        <div v-if="canAnswer && inquiry?.status === 0" class="border rounded-lg p-6 flex flex-col gap-3">
          <h3 class="font-semibold">답변 작성</h3>
          <Textarea v-model="answerContent" rows="4" />
          <small v-if="errors.answerContent" class="error">{{ errors.answerContent }}</small>
          <div class="flex justify-end">
            <Button label="저장" @click="openAnswer" />
          </div>
        </div>

        <!-- 답변 완료 -->
        <div v-if="inquiry?.status === 1" class="border rounded-lg p-6 flex flex-col gap-3">
          <h3 class="font-semibold">답변 내용</h3>

          <Textarea v-if="answerEditMode" v-model="answerContent" rows="4" />
          <Textarea v-else :modelValue="inquiry?.answer_content" rows="4" readonly />

          <small v-if="errors.answerContent" class="error">{{ errors.answerContent }}</small>

          <div class="flex justify-end gap-3">
            <Button v-if="!answerEditMode" label="답변 수정" @click="answerEditMode = true" />
            <Button v-else label="수정 완료" @click="openAnswer" />
            <Button v-if="answerEditMode" label="취소" severity="secondary" @click="answerEditMode = false" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <ConfirmDialog v-model:visible="visible" @confirm="handleConfirm">
    {{ confirmType === 'inquiry' ? '문의를 수정하시겠습니까?' : inquiry?.status === 0 ? '답변을 등록하시겠습니까?' : '답변을 수정하시겠습니까?' }}
  </ConfirmDialog>
</template>

<style scoped>
:deep(input[readonly]),
:deep(textarea[readonly]) {
  background-color: #f9fafb;
  color: #1f2937;
  opacity: 1 !important;
}

.error {
  margin-top: 4px;
  font-size: 12px;
  color: #ef4444;
}
</style>
