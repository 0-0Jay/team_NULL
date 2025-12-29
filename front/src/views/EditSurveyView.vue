<script setup>
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch } from 'vue';
import EditQuestionModal from '@/components/EditQuestionModal.vue';

const store = useSurveyStore();
const data = ref({});
const activeTab = ref('');
const display = ref(false);
const editMode = ref('');
const sectionData = ref({});
const detailData = ref({});
const rowData = ref({});

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
    const [detail, info] = detailKey.split(',');
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
  sectionData.value = { key: section };
  display.value = true;
};

const openDetailEditor = (detail) => {
  editMode.value = 'detail';
  detailData.value = {
    oldKey: `${detail.detail},${detail.info}` || 'null',
    detail: detail.detail,
    info: detail.info,
    section: activeTab.value
  };
  display.value = true;
};

const openRowEditor = (row) => {
  editMode.value = 'row';
  rowData.value = row._origin;
  display.value = true;
};

const handleSave = (payload) => {
  if (editMode.value == 'row') {
    rowData.value.question = payload.question;
    rowData.value.type = payload.type;
  } else if (editMode.value == 'detail') {
    const { oldKey, detail, info, section } = payload;
    const newKey = `${detail},${info}` || 'null';
    if (oldKey == newKey) return;
    const sectionData = data.value[section];
    sectionData[newKey] = sectionData[oldKey];
    delete sectionData[oldKey];
  } else {
    const oldKey = sectionData.value.key;
    const newKey = payload.section;
    data.value[newKey] = data.value[oldKey];
    delete data.value[oldKey];
    activeTab.value = newKey;
  }
};
</script>

<template>
  <div class="pt-16">
    <div class="card m-4">
      <div class="flex justify-between">
        <div class="font-semibold text-xl mb-4">조사지 수정</div>
        <div class="flex gap-4">
          <Button label="전체 저장" />
          <Button label="취소" severity="danger" as="router-link" to="/survey" />
        </div>
      </div>
      <Tabs :value="activeTab">
        <TabList>
          <Tab v-for="(value, key) in data" :value="key">
            {{ key }}
            <i class="pi pi-fw pi-pen-to-square" @click.stop="openSectionEditor(key)" />
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="(sec_value, key) in data" :value="key">
            <DataTable :value="makeTableRows(sec_value)" rowGroupMode="subheader" groupRowsBy="detail" sortMode="single" sortField="detail" :sortOrder="1" scrollable scrollHeight="800px" tableStyle="min-width: 50rem">
              <template #groupheader="slotProps">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-md text-xl">{{ slotProps.data.detail }}</span>
                  <span class="ml-8">{{ slotProps.data.info }}</span>
                  <i class="pi pi-fw pi-pen-to-square cursor-pointer" @click="openDetailEditor(slotProps.data)" />
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
                  <i class="pi pi-fw pi-pen-to-square cursor-pointer" @click="openRowEditor(slotProps.data)" />
                </template>
              </Column>
            </DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <EditQuestionModal v-model="display" :mode="editMode" :section="sectionData" :detail="detailData" :row="rowData" @save="handleSave" />
    </div>
  </div>
</template>
