<script setup>
import { watch } from 'vue';
import { useApplicationStore } from '@/stores/application';
import { useRoute, useRouter } from 'vue-router';

const store = useApplicationStore();
const router = useRouter();
const route = useRoute();

const props = defineProps({
  modelValue: Boolean,
  editData: Object
});

let data = {};

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      data = props.editData ?? null;
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
  <Dialog header="지원신청서 수정" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true">
    <div class="card flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label for="content">수정 내역</label>
        <div>수정자 : {{ data.whoEdit }}</div>
        <div>
          수정전<br />
          {{ data.originAnswer }}
        </div>
        <hr />
        <div>
          수정후<br />
          {{ data.answer }}
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="저장" @click="save" />
      <Button label="취소" @click="close" />
    </template>
  </Dialog>
</template>
