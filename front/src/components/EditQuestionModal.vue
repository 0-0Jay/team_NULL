<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  mode: String,
  section: Object,
  detail: Object,
  row: Object
});

const form = reactive({
  question: '',
  type: 0,
  detail: '',
  info: '',
  section: ''
});

watch(
  () => props.modelValue,
  (open) => {
    if (!open) return;
    if (props.mode == 'section') {
      form.section = props.section.key;
    } else if (props.mode == 'detail') {
      form.detail = props.detail.detail;
      form.info = props.detail.info;
    } else {
      form.question = props.row.question;
      form.type = props.row.type;
    }
  }
);

const emit = defineEmits(['update:modelValue', 'save']);

const close = () => {
  emit('update:modelValue', false);
};

const save = () => {
  emit('save', { ...form });
  close();
};

const check = (bit) => {
  form.type ^= bit;
};
</script>

<template>
  <Dialog :header="mode == 'row' ? '질문 수정' : mode == 'detail' ? '중분류 수정' : '대분류 수정'" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
    <div v-if="mode == 'row'" class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="question">질문</label>
        <Textarea id="question" v-model="form.question" class="h-50 resize-none"></Textarea>
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex items-center">
          <Checkbox id="reason" name="option" :model-value="(form.type & 4) != 0" @change="check(4)" binary />
          <label for="reason" class="ml-2">구체적 사유</label>
        </div>
        <div class="flex items-center">
          <Checkbox id="date" name="option" :model-value="(form.type & 2) != 0" @change="check(2)" binary />
          <label for="date" class="ml-2">필요시기</label>
        </div>
        <div class="flex items-center">
          <Checkbox id="ox" name="option" :model-value="(form.type & 1) != 0" @change="check(1)" binary />
          <label for="ox" class="ml-2">O/X</label>
        </div>
      </div>
    </div>
    <div v-else-if="mode == 'detail'" class="card flex flex-col gap-4">
      <div>
        <label class="font-semibold mb-2 block">중분류</label>
        <InputText v-model="form.detail" class="w-full" />
      </div>

      <div>
        <label class="font-semibold mb-2 block">설명</label>
        <Textarea v-model="form.info" class="w-full h-30" />
      </div>
    </div>
    <div v-else class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="question">대분류 수정</label>
        <InputText id="question" v-model="form.section" />
      </div>
    </div>
    <template #footer>
      <Button label="취소" @click="close" />
      <Button label="저장" @click="save" />
    </template>
  </Dialog>
</template>
