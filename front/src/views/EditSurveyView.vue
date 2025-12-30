<script setup>
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch } from 'vue';
import EditQuestionModal from '@/components/EditQuestionModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';

const store = useSurveyStore();
const data = ref({});
const activeTab = ref('');
const display = ref(false);
const editMode = ref('');
const sectionData = ref({});
const detailData = ref({});
const rowData = ref({});
const openConfirm = ref(false);
const delConfirm = ref(false);

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

const makeTableRows = (secValue) => {
  const rows = [];

  Object.entries(secValue).forEach(([detailKey, items]) => {
    if (!Array.isArray(items)) return;
    const [detail, info] = detailKey.split('*');
    items.forEach((item, idx) => {
      rows.push({
        detail: detail,
        info: info != 'null' ? info : '',
        no: idx + 1,
        question: item.question,
        type: item.type,
        _origin: item
      });
    });
  });

  return rows;
};

const openSectionEditor = (section) => {
  editMode.value = 'section';
  if (section) {
    sectionData.value = { key: section };
  } else {
    sectionData.value = { key: '' };
  }
  display.value = true;
};

const openDetailEditor = (detail) => {
  editMode.value = 'detail';
  if (detail) {
    detailData.value = {
      oldKey: `${detail.detail}*${detail.info || 'null'}`,
      detail: detail.detail,
      info: detail.info,
      section: activeTab.value
    };
  } else {
    detailData.value = {
      oldKey: '',
      detail: '',
      info: '',
      section: activeTab.value
    };
  }
  display.value = true;
};

const openRowEditor = (row, mode) => {
  editMode.value = 'row';
  if (mode == 0) {
    rowData.value = row._origin;
  } else {
    detailData.value = {
      detail: row.detail,
      info: row.info,
      section: activeTab.value
    };
    rowData.value = {
      question: '',
      type: 0
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
    if (!rowData.value?.question) {
      data.value[activeTab.value][`${detailData.value.detail}*${detailData.value.info}`].push({
        question: payload.question,
        type: payload.type
      });
    } else {
      rowData.value.question = payload.question;
      rowData.value.type = payload.type;
    }
  } else if (editMode.value == 'detail') {
    const { oldKey, detail, info, section } = payload;
    const newKey = `${detail}*${info || 'null'}`;
    if (!oldKey) {
      data.value[section][newKey] = [{ question: '임시 문항입니다. 수정해서 사용하세요. 모든 문항을 삭제하면 자동으로 소분류가 삭제됩니다.', type: 0 }];
    } else {
      if (oldKey == newKey) return;
      const sectionData = data.value[section];
      sectionData[newKey] = sectionData[oldKey];
      delete sectionData[oldKey];
    }
  } else {
    const oldKey = sectionData.value.key;
    const newKey = payload.section;
    if (!oldKey) {
      if (data.value[newKey]) return;
      data.value[newKey] = {};
      activeTab.value = newKey;
    } else {
      if (oldKey == newKey) return;
      data.value[newKey] = data.value[oldKey];
      delete data.value[oldKey];
      activeTab.value = newKey;
    }
  }
};

const saveAll = async (reason) => {
  const updateData = {};
  updateData['content'] = reason.content;
  const user = JSON.parse(localStorage.getItem('users'));
  updateData['author'] = user.user[0].user_no;
  console.log(data);
  // await store.updateSurvey(updateData);
};

const deleteRow = (row) => {
  const list = data.value[activeTab.value][`${row.detail}*${row.info || 'null'}`];
  const idx = list.findIndex((item) => item.question == row.question && item.type == row.type);
  list.splice(idx, 1);
};

const deleteDetail = (detail) => {
  delete data.value[activeTab.value][`${detail.detail}*${detail.info || 'null'}`];
};

const deleteSection = (section) => {
  delete data.value[section];
  if (activeTab.value == section) {
    const keys = Object.keys(data.value);
    activeTab.value = keys.length ? keys[0] : '';
  }
};

const openDelComfirm = (action) => {
  delConfirm.value = action;
  openConfirm.value = true;
};

const onConfirm = () => {
  if (delConfirm.value) {
    delConfirm.value();
  }
  openConfirm.value = false;
  delConfirm.value = null;
};
</script>

<template>
  <div class="pt-16">
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
          <Tab v-for="(value, key) in data" :value="key" @click="() => (activeTab = key)">
            {{ key }}
            <i class="pi pi-fw pi-pen-to-square ml-2" @click.stop="openSectionEditor(key)" />
            <i class="pi pi-fw pi-times cursor-pointer ml-2" @click.stop="deleteSection(key)" />
          </Tab>
          <Button class="m-3" @click="openSectionEditor()" text plain>대분류 추가</Button>
        </TabList>
        <TabPanels>
          <TabPanel v-for="(sec_value, key) in data" :value="key">
            <DataTable :value="makeTableRows(sec_value)" rowGroupMode="subheader" groupRowsBy="detail" sortMode="single" sortField="detail" :sortOrder="1" scrollable scrollHeight="800px" tableStyle="min-width: 50rem">
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
      <EditQuestionModal v-model="display" :mode="editMode" :section="sectionData" :detail="detailData" :row="rowData" @save="handleSave" @save-all="saveAll" />
    </div>
  </div>
</template>
