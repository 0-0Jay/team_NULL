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
  section: '',
  content: '',
  update: '0' // 0이면 오탈자 수정, 1이면 버전 업
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

const emit = defineEmits(['update:modelValue', 'save', 'saveAll']);

const close = () => {
  emit('update:modelValue', false);
};

const save = () => {
  if (props.mode == 'row' && form.type == 0) return;
  if (props.mode == 'all') {
    emit('saveAll', { content: form.content, update: form.update });
  } else if (props.mode == 'section') {
    emit('save', { section: form.section });
  } else {
    emit('save', { ...form, oldKey: props.detail?.oldKey, section: props.detail?.section });
  }
  close();
};

const check = (bit) => {
  form.type ^= bit;
};
</script>

<template>
  <Dialog
    :header="mode == 'row' ? '질문 추가/수정' : mode == 'detail' ? '소분류 추가/수정' : mode == 'section' ? '대분류 추가/수정' : '전체 저장'"
    :visible="modelValue"
    @update:visible="emit('update:modelValue', $event)"
    :breakpoints="{ '960px': '75vw' }"
    :style="{ width: '30vw' }"
    :modal="true"
  >
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
      <p v-if="form.type == 0" style="color: red">반드시 하나 이상의 답변 유형을 선택해야 합니다!</p>
    </div>
    <div v-else-if="mode == 'detail'" class="card flex flex-col gap-4">
      <div>
        <label class="font-semibold mb-2 block">소분류</label>
        <InputText v-model="form.detail" class="w-full" />
      </div>
      <div>
        <label class="font-semibold mb-2 block">설명</label>
        <Textarea v-model="form.info" class="w-full h-30" />
      </div>
    </div>
    <div v-else-if="mode == 'section'" class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="question">대분류</label>
        <InputText id="question" v-model="form.section" />
      </div>
    </div>
    <div v-else-if="mode == 'all'" class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="content">수정 사유</label>
        <Textarea v-model="form.content" class="w-full h-30" />
      </div>
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex items-center">
          <RadioButton id="option1" name="option" value="0" v-model="form.update" />
          <label for="option1" class="leading-none ml-2">현재 버전 수정</label>
        </div>
        <div class="flex items-center">
          <RadioButton id="option2" name="option" value="1" v-model="form.update" />
          <label for="option2" class="leading-none ml-2">새 버전 생성</label>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="저장" @click="save" />
      <Button label="취소" @click="close" />
    </template>
  </Dialog>
</template>
