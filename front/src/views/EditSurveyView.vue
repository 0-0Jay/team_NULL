<script setup>
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch, computed } from 'vue';
import EditQuestionModal from '@/components/EditQuestionModal.vue';
import { useRouter } from 'vue-router';

const store = useSurveyStore();
const data = ref({});
const activeTab = ref('');
const display = ref(false);
const editMode = ref('');
const sectionData = ref({});
const detailData = ref({});
const rowData = ref({});
const router = useRouter();
const isDelete = ref(false);
const changeStructure = computed(() => hasStructuralChange(data.value) || isDelete.value);

onMounted(async () => {
  data.value = await store.fetchSurvey();
});

watch(
  () => data.value,
  (val) => {
    const keys = Object.keys(val);
    activeTab.value = keys[0];
  },
  { immediate: true }
);

const makeTableRows = (secValue, sec_no) => {
  const rows = [];
  Object.entries(secValue.details).forEach(([d_no, detailValue]) => {
    const { detail, info, questions } = detailValue;
    Object.entries(questions).forEach(([q_no, questionValue], idx) => {
      rows.push({
        sec_no,
        d_no,
        q_no,
        detail,
        info: info != 'null' ? info : '',
        no: idx + 1,
        question: questionValue.question,
        type: questionValue.type
      });
    });
  });
  return rows;
};

const openSectionEditor = (sec_no, sectionValue) => {
  editMode.value = 'section';
  if (sectionValue) {
    sectionData.value = {
      sec_no: sec_no,
      section: sectionValue.section
    };
  } else {
    sectionData.value = {
      sec_no: null,
      section: ''
    };
  }
  display.value = true;
};

const openDetailEditor = (detailValue) => {
  editMode.value = 'detail';
  if (detailValue) {
    detailData.value = {
      sec_no: activeTab.value, // 이제 sec_no
      d_no: detailValue.d_no,
      detail: detailValue.detail,
      info: detailValue.info
    };
  } else {
    detailData.value = {
      sec_no: activeTab.value,
      d_no: null,
      detail: '',
      info: ''
    };
  }
  display.value = true;
};

const openRowEditor = (row, mode) => {
  editMode.value = 'row';
  if (mode === 0) {
    rowData.value = {
      q_no: row.q_no,
      question: row.question,
      type: row.type
    };
    detailData.value = {
      sec_no: row.sec_no,
      d_no: row.d_no
    };
  } else {
    rowData.value = {
      q_no: null,
      question: '',
      type: 0
    };
    detailData.value = {
      sec_no: row.sec_no,
      d_no: row.d_no
    };
  }
  display.value = true;
};

const openSaveAll = () => {
  editMode.value = 'all';
  display.value = true;
};

const handleSave = (payload) => {
  if (editMode.value == 'row') {
    const { sec_no, d_no } = detailData.value;
    const questions = data.value[sec_no].details[d_no].questions;
    if (!rowData.value?.q_no) {
      const tempKey = `temp_${Date.now()}`;
      questions[tempKey] = {
        question: payload.question,
        type: payload.type
      };
    } else {
      const q_no = rowData.value.q_no;
      questions[q_no].question = payload.question;
      questions[q_no].type = payload.type;
    }
  } else if (editMode.value == 'detail') {
    const { sec_no, d_no, detail, info } = payload;
    if (!d_no) {
      const tempKey = `temp_${Date.now()}`;
      data.value[sec_no].details[tempKey] = {
        detail,
        info,
        questions: {
          [`temp_${Date.now()}`]: {
            question: '임시 문항입니다. 수정해서 사용하세요. 모든 문항을 삭제하면 자동으로 소분류가 삭제됩니다.',
            type: 0
          }
        }
      };
    } else {
      const target = data.value[sec_no].details[d_no];
      target.detail = detail;
      target.info = info;
    }
  } else {
    const { sec_no, section } = payload;
    if (!sec_no) {
      const tempKey = `temp_${Date.now()}`;
      data.value[tempKey] = {
        section,
        details: {}
      };
      activeTab.value = tempKey;
    } else {
      data.value[sec_no].section = section;
    }
  }
};

const saveAll = async (reason) => {
  const updateData = {};
  updateData['survey'] = data.value;
  if (reason.update == '1') {
    updateData['content'] = reason.content;
    const user = JSON.parse(localStorage.getItem('users'));
    updateData['author'] = user.user[0].user_no;
    await store.insertSurvey(updateData);
  } else {
    await store.updateSurvey(updateData);
  }
  router.push({ name: 'survey' });
};

const deleteRow = (row) => {
  const { sec_no, d_no, q_no } = row;
  const questions = data.value[sec_no].details[d_no].questions;
  if (questions[q_no]) {
    delete questions[q_no];
    isDelete.value = true;
  }
};

const deleteDetail = (detail) => {
  const { sec_no, d_no } = detail;
  delete data.value[sec_no].details[d_no];
  isDelete.value = true;
};

const deleteSection = (sec_no) => {
  delete data.value[sec_no];
  isDelete.value = true;
  if (activeTab.value == sec_no) {
    const keys = Object.keys(data.value).filter((k) => k != sec_no);
    activeTab.value = keys.length ? keys[0] : '';
  }
};

const hasStructuralChange = (survey) => {
  const secKeys = Object.keys(survey);
  for (const secKey of secKeys) {
    const sec = survey[secKey];
    if (String(secKey).startsWith('temp_')) return true;
    const detKeys = Object.keys(sec.details);
    for (const detKey of detKeys) {
      const det = sec.details[detKey];
      if (String(detKey).startsWith('temp_')) return true;
      const qKeys = Object.keys(det.questions);
      for (const qKey of qKeys) {
        const q = det.questions[qKey];
        if (String(qKey).startsWith('temp_')) return true;
      }
    }
  }
  return false;
};
</script>

<template>
  <div class="pt-20">
    <div class="card m-4">
      <div class="flex justify-between">
        <div class="font-semibold text-xl mb-4">조사지 수정</div>
        <div class="flex gap-4">
          <Button label="전체 저장" @click="openSaveAll()" />
          <Button label="취소" severity="danger" as="router-link" to="/survey" />
        </div>
      </div>
      <Tabs :value="activeTab">
        <TabList>
          <Tab v-for="(secValue, sec_no) in data" :value="sec_no" @click="() => (activeTab = sec_no)">
            {{ secValue.section }}
            <i class="pi pi-fw pi-pen-to-square ml-2" @click.stop="openSectionEditor(sec_no, secValue)" />
            <i class="pi pi-fw pi-times cursor-pointer ml-2" @click.stop="deleteSection(sec_no)" />
          </Tab>
          <Button class="m-3" @click="openSectionEditor()" text plain>대분류 추가</Button>
        </TabList>
        <TabPanels>
          <TabPanel v-for="(secValue, sec_no) in data" :value="sec_no">
            <DataTable :value="makeTableRows(secValue, sec_no)" rowGroupMode="subheader" groupRowsBy="detail" sortMode="single" sortField="detail" :sortOrder="1" scrollable scrollHeight="800px" tableStyle="min-width: 50rem">
              <template #groupheader="slotProps">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-md text-xl">{{ slotProps.data.detail }}</span>
                  <span class="ml-8">{{ slotProps.data.info }}</span>
                  <i class="pi pi-fw pi-pen-to-square cursor-pointer" @click="openDetailEditor(slotProps.data)" />
                  <i class="pi pi-fw pi-times cursor-pointer" @click="deleteDetail(slotProps.data)" />
                </div>
              </template>
              <Column field="detail"></Column>
              <Column field="no" style="width: 80px" />
              <Column field="question">
                <template #body="slotProps">
                  <div class="pb-4">
                    {{ slotProps.data.question }}
                  </div>
                  <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex items-center">
                      <Checkbox id="reason" name="option" :model-value="(slotProps.data.type & 4) != 0" binary readonly />
                      <label for="reason" class="ml-2">구체적 사유</label>
                    </div>
                    <div class="flex items-center">
                      <Checkbox id="date" name="option" :model-value="(slotProps.data.type & 2) != 0" binary readonly />
                      <label for="date" class="ml-2">필요시기</label>
                    </div>
                    <div class="flex items-center">
                      <Checkbox id="ox" name="option" :model-value="(slotProps.data.type & 1) != 0" binary readonly />
                      <label for="ox" class="ml-2">O/X</label>
                    </div>
                  </div>
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <div class="flex gap-4">
                    <i class="pi pi-fw pi-pen-to-square cursor-pointer" @click="openRowEditor(slotProps.data, 0)" />
                    <i class="pi pi-fw pi-times cursor-pointer" @click="deleteRow(slotProps.data)" />
                  </div>
                </template>
              </Column>
              <template #groupfooter="slotProps">
                <div class="flex justify-end">
                  <span class="font-bold cursor-pointer" @click="openRowEditor(slotProps.data, 1)">질문 추가</span>
                </div>
              </template>
              <div class="flex justify-end">
                <span class="font-bold cursor-pointer" @click="openDetailEditor()">소분류 추가</span>
              </div>
            </DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <EditQuestionModal v-model="display" :mode="editMode" :section="sectionData" :detail="detailData" :row="rowData" :has-structure="changeStructure" @save="handleSave" @save-all="saveAll" />
    </div>
  </div>
</template>
