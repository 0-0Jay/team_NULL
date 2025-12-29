<script setup>
import { computed, watch } from 'vue';

const props = defineProps({
  dropdownValues: {
    type: Array,
    required: true
  },
  useRadio: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:filterFields']);

const filters = defineModel('filters');
const dropdownValue = defineModel('dropdownValue');
const radioValue = defineModel('radioValue');

const globalFilterFields = computed(() => {
  if (!dropdownValue.value) return [];

  switch (dropdownValue.value.code) {
    case 'CM':
      return ['name', 'user_name'];
    case 'ID':
      return ['id'];
    case 'CN':
      return ['center_name'];
    default:
      return [];
  }
});

watch(
  globalFilterFields,
  (newVal) => {
    emit('update:filterFields', newVal);
  },
  { immediate: true }
);
</script>

<template>
  <aside class="w-[260px] px-6 pt-13 pb-13 rounded">
    <h3 class="font-bold mb-3">검색</h3>

    <!-- dropdown -->
    <Select v-model="dropdownValue" :options="dropdownValues" optionLabel="name" class="w-full mb-3" placeholder="검색 항목 선택" />

    <!-- radio(필요시) -->
    <template v-if="useRadio">
      <div class="font-semibold text-xl mb-1">사용승인</div>
      <div class="flex flex-col md:flex-row gap-4 mb-3">
        <div class="flex items-center">
          <RadioButton :value="-1" v-model="radioValue" />
          <label class="ml-2">전체</label>
        </div>
        <div class="flex items-center">
          <RadioButton :value="1" v-model="radioValue" />
          <label class="ml-2">승인</label>
        </div>
        <div class="flex items-center">
          <RadioButton :value="0" v-model="radioValue" />
          <label class="ml-2">대기</label>
        </div>
      </div>
    </template>

    <!-- 검색어 -->
    <IconField iconPosition="left">
      <InputIcon class="pi pi-search" />
      <InputText class="w-full" type="text" v-model="filters.global.value" :disabled="!dropdownValue" placeholder="검색어 입력" />
    </IconField>
  </aside>
</template>
