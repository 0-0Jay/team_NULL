<script setup>
import { useSurveyStore } from '@/stores/survey';
import { onMounted, ref, watch, reactive, onBeforeMount } from 'vue';

const store = useSurveyStore();
const data = ref({});
const activeTab = ref('');

onMounted(async () => {
  data.value = await store.fetchSurvey();
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

    Object.values(questions).forEach((questionValue, idx) => {
      rows.push({
        d_no,
        q_no: questionValue.q_no,
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
</script>

<template>
  <div class="pt-16">
    <div class="card m-4">
      <div class="flex justify-between">
        <div class="font-semibold text-xl mb-4">조사지 조회</div>
        <Button label="조사지 수정" as="router-link" to="/editSurvey" />
      </div>
      <Tabs :value="activeTab">
        <TabList>
          <Tab v-for="(value, key) in data" :value="key">{{ value.section }}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel v-for="(sec_value, key) in data" :value="key">
            <DataTable :value="makeTableRows(sec_value)" rowGroupMode="subheader" groupRowsBy="detail" sortMode="single" sortField="detail" :sortOrder="1" scrollable scrollHeight="800px" tableStyle="min-width: 50rem">
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
            </DataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  </div>
</template>
