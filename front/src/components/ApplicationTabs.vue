<script setup>
import AppMenuItem from '@/layout/AppMenuItem.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const applicationNo = route.params.application_no;

const model = ref([
  {
    label: '지원신청서',
    items: [{ label: '지원신청서 조회', icon: 'pi pi-fw pi-pen-to-square', to: `/application/view/${applicationNo}` }]
  },
  {
    label: '상담내역', // 연결완료
    items: [
      { label: '상담내역 조회', icon: 'pi pi-fw pi-book', to: `/application/counselDetail/${1}` },
      { label: '상담내역 작성', icon: 'pi pi-fw pi-pen-to-square', to: '/application/counselinsert' }
    ]
  },
  {
    label: '지원계획서', // 연결완료
    items: [
      { label: '지원계획서 조회', icon: 'pi pi-fw pi-fw pi-book', to: `/application/planDetail/${11}` },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: `/application/pendingPlanDetail/${14}` },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: `/application/rejectPlanDetail/${15}` },
      { label: '지원계획서 작성', icon: 'pi pi-fw pi-pen-to-square', to: '/application/planInsert' }
    ]
  },
  {
    label: '지원결과서', // 연결완료
    items: [
      { label: '지원결과서 조회', icon: 'pi pi-fw pi-fw pi-book', to: `/application/resultDetail/${10}` },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: `/application/pendingResultDetail/${10}` },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: `/application/rejectResultDetail/${10}` },
      { label: '지원결과서 작성', icon: 'pi pi-fw pi-pen-to-square', to: '/application/resultInsert' }
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
