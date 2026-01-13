<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  modelValue: Boolean,
  content: String
});

const emit = defineEmits(['update:modelValue']);

const close = () => {
  emit('update:modelValue', false);
  if (props.content == '비밀번호가 변경되었습니다!') {
    router.replace({ path: '/' });
  }
};
</script>
<template>
  <Dialog :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :breakpoints="{ '960px': '75vw' }" :style="{ width: '30vw' }" :modal="true" :closable="false">
    <p class="leading-normal m-0 text-xl">{{ content }}</p>
    <template #footer>
      <Button label="확인" @click="close" />
    </template>
  </Dialog>
</template>
