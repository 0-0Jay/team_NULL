<script setup>
import EditApplicationModal from '@/components/EditApplicationModal.vue';
import { useApplicationStore } from '@/stores/application';
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch, reactive, toRaw, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const sStore = useSurveyStore();
const aStore = useApplicationStore();
const route = useRoute();
const router = useRouter();
const data = ref({});
const activeTab = ref('');
const answers = ref({});
const answersOrigin = ref({});
const display = ref(false);
const user = JSON.parse(localStorage.getItem('users'))?.user[0];
const applicant = computed(() => aStore.applicant);

const editData = reactive({
  whoEdit: user.u_name,
  originAnswer: null,
  answer: null
});

const addData = reactive({
  user_type: user.type,
  user_no: user.user_no,
  version_id: null,
  a_no: '',
  answer: null
});

onMounted(async () => {
  if (!route.params.application_no) {
    aStore.applicant = { a_no: '' };
  }
  const result = await sStore.fetchSurvey(route.params.application_no);
  data.value = result.data;
  // 답변 저장소 초기화
  addData.version_id = result.version_id;
  Object.values(data.value).forEach((section) => {
    Object.values(section.details).forEach((detail) => {
      Object.entries(detail.questions).forEach(([key, value]) => {
        if (!answers.value[key]) {
          answers.value[key] = {
            answer_no: '',
            question: value.question,
            ox: null,
            reason: '',
            start: null,
            end: null
          };
        }
      });
    });
  });
  if (route.params.application_no) {
    const tmp = ref(aStore.application);
    Object.values(tmp.value).forEach((answer) => {
      answers.value[answer.q_no].answer_no = answer.answer_no;
      answers.value[answer.q_no].ox = answer.OX;
      answers.value[answer.q_no].reason = answer.reason;
      answers.value[answer.q_no].start = new Date(answer.start);
      answers.value[answer.q_no].end = new Date(answer.end);
    });
    answersOrigin.value = structuredClone(toRaw(answers.value));
  }
});

// 조사지 로드 => 첫 번 째 탭으로 이동
watch(
  () => data.value,
  (val) => {
    const keys = Object.keys(val);
    activeTab.value = keys[0];
  },
  { immediate: true }
);

// 조사지 문항 로드
const makeTableRows = (secValue) => {
  const rows = [];
  Object.values(secValue.details).forEach((detailValue) => {
    const { d_no, detail, info, questions } = detailValue;
    Object.entries(questions).forEach(([key, value], idx) => {
      rows.push({
        d_no,
        detail,
        info: info !== 'null' ? info : '',
        q_no: key,
        no: idx + 1,
        question: value.question,
        type: value.type
      });
    });
  });

  return rows;
};

// 제출
const submit = async () => {
  if (route.params.application_no) {
    editData.originAnswer = answersOrigin.value;
    editData.answer = answers.value;
    display.value = true;
  } else {
    if (!applicant.value.a_no) {
      alert('지원자를 선택해주세요!');
      return;
    }
    addData.a_no = applicant.value.a_no;
    addData.answer = answers.value;
    const result = await aStore.submitApplication(addData);
    router.push({ path: `/application/view/${result.applicationNo}` });
  }
};
</script>

<template>
  <div class="card h-175">
    <div class="flex justify-between">
      <div class="font-semibold text-xl mb-4">지원신청서 작성</div>
      <Button label="작성 완료" @click="submit" />
    </div>
    <Tabs :value="activeTab">
      <TabList>
        <Tab v-for="(value, key) in data" :value="key">{{ value.section }}</Tab>
      </TabList>
      <TabPanels>
        <TabPanel v-for="(sec_value, key) in data" :value="key">
          <DataTable :value="makeTableRows(sec_value)" rowGroupMode="subheader" groupRowsBy="detail" sortMode="single" sortField="detail" :sortOrder="1" scrollable scrollHeight="445px" tableStyle="min-width: 50rem">
            <template #groupheader="slotProps">
              <div class="flex items-center gap-2">
                <span class="font-bold text-md text-xl">{{ slotProps.data.detail }}</span>
                <span class="ml-8">{{ slotProps.data.info }}</span>
              </div>
            </template>
            <Column field="detail"></Column>
            <Column field="no" style="width: 80px" />
            <Column field="question">
              <template #body="slotProps">
                <div class="grid gap-4">
                  <div>
                    {{ slotProps.data.question }}
                  </div>
                  <div v-if="(slotProps.data.type & 4) != 0" class="flex gap-2 items-start">
                    <div class="font-semibold w-20">구체적 사유</div>
                    <Textarea v-model="answers[slotProps.data.q_no].reason" placeholder="구체적 사유를 입력해주세요." :autoResize="true" rows="2" cols="75" />
                  </div>
                  <div v-if="(slotProps.data.type & 2) != 0" class="flex gap-2 items-center">
                    <div class="font-semibold w-20">필요 시기</div>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="answers[slotProps.data.q_no].start"></DatePicker>
                    <span> ~ </span>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="answers[slotProps.data.q_no].end"></DatePicker>
                  </div>
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div v-if="(slotProps.data.type & 1) != 0" class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <Checkbox :binary="true" :modelValue="answers[slotProps.data.q_no].ox === 'O'" @click.prevent="answers[slotProps.data.q_no].ox = 'O'" />
                    <label>O</label>
                  </div>

                  <div class="flex items-center gap-1">
                    <Checkbox :binary="true" :modelValue="answers[slotProps.data.q_no].ox === 'X'" @click.prevent="answers[slotProps.data.q_no].ox = 'X'" />
                    <label>X</label>
                  </div>
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
    <EditApplicationModal v-model="display" :editData="editData" />
  </div>
</template>
