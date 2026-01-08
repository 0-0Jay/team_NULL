<script setup>
import { useApplicationStore } from '@/stores/application';
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const sStore = useSurveyStore();
const aStore = useApplicationStore();
const data = ref({});
const activeTab = ref('');
const answers = ref({});
const tmp = ref({});
const applicationNo = route.params.application_no;

onMounted(async () => {
  const result = await sStore.fetchSurvey(applicationNo);
  data.value = result.data;
  Object.values(data.value).forEach((section) => {
    Object.values(section.details).forEach((detail) => {
      Object.entries(detail.questions).forEach(([key, value]) => {
        if (!answers.value[key]) {
          answers.value[key] = {
            ox: null,
            reason: '',
            start: null,
            end: null
          };
        }
      });
    });
  });
  tmp.value = await aStore.fetchApplicationDetail(applicationNo);
  Object.values(tmp.value).forEach((answer) => {
    answers.value[answer.q_no].ox = answer.OX;
    answers.value[answer.q_no].reason = answer.reason;
    answers.value[answer.q_no].start = new Date(answer.start);
    answers.value[answer.q_no].end = new Date(answer.end);
  });
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

// 수정
const edit = () => {
  router.push({ path: `/application/write/${route.params.application_no}` });
  // 수정 페이지로 넘겨야됨. 수정페이지는 작성페이지와 동일하되, store에 기존 application 데이터가 있으면 수정으로
};
</script>

<template>
  <div class="card h-175">
    <div class="flex justify-between">
      <div class="font-semibold text-xl mb-4">지원신청서 조회</div>
      <Button label="수정" @click="edit" />
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
                    <Textarea v-model="answers[slotProps.data.q_no].reason" placeholder="구체적 사유를 입력해주세요." :autoResize="true" rows="2" cols="75" readonly />
                  </div>
                  <div v-if="(slotProps.data.type & 2) != 0" class="flex gap-2 items-center">
                    <div class="font-semibold w-20">필요 시기</div>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="answers[slotProps.data.q_no].start" readonly></DatePicker>
                    <span> ~ </span>
                    <DatePicker :showIcon="true" :showButtonBar="true" v-model="answers[slotProps.data.q_no].end" readonly></DatePicker>
                  </div>
                </div>
              </template>
            </Column>
            <Column>
              <template #body="slotProps">
                <div v-if="(slotProps.data.type & 1) != 0" class="flex items-center gap-4">
                  <div class="flex items-center gap-1">
                    <Checkbox :binary="true" :modelValue="answers[slotProps.data.q_no].ox === 'O'" readonly />
                    <label>O</label>
                  </div>

                  <div class="flex items-center gap-1">
                    <Checkbox :binary="true" :modelValue="answers[slotProps.data.q_no].ox === 'X'" readonly />
                    <label>X</label>
                  </div>
                </div>
              </template>
            </Column>
          </DataTable>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>
