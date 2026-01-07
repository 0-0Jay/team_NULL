<script setup>
import AppMenuItem from '@/layout/AppMenuItem.vue';
import { ref } from 'vue';

const model = ref([
  {
    label: '지원신청서',
    items: [{ label: '지원신청서 조회', icon: 'pi pi-fw pi-pen-to-square', to: '' }]
  },
  {
    label: '상담내역',
    items: [
      { label: '상담내역 조회', icon: 'pi pi-fw pi-book', to: '' },
      { label: '상담내역 작성', icon: 'pi pi-fw pi-pen-to-square', to: '' }
    ]
  },
  {
    label: '지원계획서',
    items: [
      { label: '지원계획서 조회', icon: 'pi pi-fw pi-fw pi-book', to: `/plandetail/${11}` },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: '' },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: '' },
      { label: '지원계획서 작성', icon: 'pi pi-fw pi-pen-to-square', to: '/planinsert' }
    ]
  },
  {
    label: '지원결과서',
    items: [
      { label: '지원결과서 조회', icon: 'pi pi-fw pi-fw pi-book', to: '' },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: '' },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: '' },
      { label: '지원결과서 작성', icon: 'pi pi-fw pi-pen-to-square', to: '' }
    ]
  }
]);
</script>

<template>
  <div class="card flex flex-col gap-4">
    <ul class="layout-menu">
      <template v-for="(item, i) in model" :key="item">
        <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
        <li v-if="item.separator" class="menu-separator"></li>
      </template>
    </ul>
  </div>
</template>
