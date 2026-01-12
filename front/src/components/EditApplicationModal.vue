<script setup>
import { watch, ref } from 'vue';
import { useApplicationStore } from '@/stores/application';
import { useRoute, useRouter } from 'vue-router';

const store = useApplicationStore();
const router = useRouter();
const route = useRoute();
const typeLabel = {
  ox: 'O / X',
  reason: '구체적 사유',
  start: '시작일',
  end: '종료일'
};

const props = defineProps({
  modelValue: Boolean,
  editData: Object
});

const editData = {};
let data = null;

const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      data = props.editData ?? null;
      const origin = data.originAnswer;
      const modify = data.answer;

      Object.keys(origin).forEach((oKey) => {
        const before = origin[oKey];
        const after = modify[oKey];
        const question = before.question;
        console.log(before);
        console.log(after);
        Object.keys(before).forEach((key) => {
          if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
            if (!editData[question]) {
              editData[question] = {};
            }
            editData[question][key] = { before: before[key], after: after[key] };
          }
        });
      });
      console.log(editData);
    }
  }
);

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
};

const save = async () => {
  await store.updateApplication(data);
  close();
  router.push({ path: `/application/view/${route.params.application_no}` });
};
</script>

<template>
  <Dialog header="지원신청서 수정" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '60vw' }" :modal="true">
    <div class="card flex flex-col gap-4">
      <table class="text-center">
        <thead>
          <tr class="border-collapse border-b border-t border-gray-400">
            <th class="border-collapse border-r border-gray-400">번호</th>
            <th>수정내용</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(data, key, idx) of editData" :key="key" class="border-collapse border-b border-gray-900">
            <td class="text-lg w-20 border-collapse border-r border-gray-400">{{ idx + 1 }}</td>
            <td class="">
              <div class="m-2 truncate">{{ key }}</div>
              <div class="m-2">
                <table class="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr>
                      <td></td>
                      <th class="border-collapse border border-gray-400">변경 전</th>
                      <th class="border-collapse border border-gray-400">변경 후</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(ans, type) of data" :key="type">
                      <td class="text-base border-collapse border border-gray-400 w-15">{{ typeLabel[type] }}</td>
                      <td class="border-collapse border border-gray-400 w-40">{{ formatDate(ans.before) }}</td>
                      <td class="border-collapse border border-gray-400 w-40">{{ formatDate(ans.after) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <template #footer>
      <Button label="저장" @click="save" />
      <Button label="취소" @click="close" />
    </template>
  </Dialog>
</template>
