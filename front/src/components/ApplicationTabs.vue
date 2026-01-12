<script setup>
import AppMenuItem from '@/layout/AppMenuItem.vue';
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const applicationNo = route.params.application_no;
const user = JSON.parse(localStorage.getItem('users')).user[0];

const rawModel = [
  {
    label: '지원신청서',
    items: [{ label: '지원신청서 조회', icon: 'pi pi-fw pi-pen-to-square', to: `/application/view/${applicationNo}` }]
  },
  {
    label: '상담내역', // 연결완료
    items: [
      { label: '상담내역 조회', icon: 'pi pi-fw pi-book', to: `/application/counselDetail/${applicationNo}`, type: 'counsel' },
      { label: '상담내역 작성', icon: 'pi pi-fw pi-pen-to-square', to: `/application/counselInsert/${applicationNo}`, type: 'write' }
    ]
  },
  {
    label: '지원계획서', // 연결완료
    items: [
      { label: '지원계획서 조회', icon: 'pi pi-fw pi-fw pi-book', to: `/application/planDetail/${applicationNo}` },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: `/application/pendingPlanDetail/${applicationNo}` },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: `/application/rejectPlanDetail/${applicationNo}` },
      { label: '지원계획서 작성', icon: 'pi pi-fw pi-pen-to-square', to: `/application/planInsert/${applicationNo}`, type: 'write' }
    ]
  },
  {
    label: '지원결과서', // 연결완료
    items: [
      { label: '지원결과서 조회', icon: 'pi pi-fw pi-fw pi-book', to: `/application/result/${applicationNo}` },
      { label: '승인대기 조회', icon: 'pi pi-fw pi-spinner-dotted', to: `/application/pendingResult/${applicationNo}` },
      { label: '반려내역 조회', icon: 'pi pi-fw pi-times-circle', to: `/application/rejectResult/${applicationNo}` },
      { label: '지원결과서 작성', icon: 'pi pi-fw pi-pen-to-square', to: `/application/resultInsert/${applicationNo}`, type: 'write' }
    ]
  }
];

const model = computed(() => {
  return rawModel
    .map((group) => {
      const items = group.items.filter((item) => {
        if (item.type === 'write' && user.type !== 1) {
          return false;
        }
        // 상담내역 조회: user.type === 0(일반회원) 이면 숨김
        if (item.type === 'counsel' && user.type === 0) {
          return false;
        }
        return true;
      });

      return { ...group, items };
    })
    .filter((group) => group.items.length > 0);
});
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
