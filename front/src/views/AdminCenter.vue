<script setup>
import { useCentersStore } from '@/stores/centers';
import { onBeforeMount, reactive, ref } from 'vue';
// import { useRouter } from 'vue-router';
// const router = useRouter();
const store = useCentersStore();

onBeforeMount(() => {
  store.fetchCenter();
});

const formatDate = (v) => {
  if (!v) return '-';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
};
</script>

<template>
  <div class="flex gap-4 p-4" style="min-height: 80vh">
    <!-- 검색 -->
    <aside class="w-[260px] p-4 rounded">
      <h3 class="font-bold mb-3">검색</h3>
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search" />
        <InputText class="w-full" type="text" placeholder="기관명 입력" />
      </IconField>

      <Button type="button" class="w-full mt-3" label="검색" />
    </aside>

    <div class="border-l-2 border-gray-300 mx-4"></div>

    <section class="flex-1 p-4 rounded">
      <div class="flex justify-between items-center mb-3">
        <h2 class="text-xl font-bold">기관 정보</h2>
        <div>
          <Button label="기관 등록" icon="pi pi-building" class="mr-5" />
          <Button label="선택 삭제" icon="pi pi-trash" severity="danger" />
        </div>
      </div>
      <DataTable :value="store.centers" :paginator="true" :rows="10" dataKey="id" :rowHover="true" showGridlines scrollable scrollHeight="500px">
        <template #empty><div class="text-center">데이터 없음</div></template>
        <template #loading> Loading 중... </template>

        <Column selectionMode="multiple" headerStyle="width: 3rem" />

        <Column header="번호" style="width: 4rem; text-align: center">
          <template #body="{ index }">
            {{ index + 1 }}
          </template>
        </Column>

        <Column field="name" header="기관명" />

        <Column field="address" header="주소" />

        <Column field="phone" header="대표 번호" />

        <Column field="email" header="이메일" />

        <Column header="등록일">
          <template #body="{ data }">
            {{ formatDate(data.created_date) }}
          </template>
        </Column>

        <Column header="운영종료일">
          <template #body="{ data }">
            {{ formatDate(data.closed_date) }}
          </template>
        </Column>

        <Column field="manage" header="운영여부" />

        <Column header="수정" style="width: 5rem; text-align: center">
          <template #body="{ data }">
            <i class="pi pi-pen-to-square edit-icon" @click="console.log('edit:', data)" />
          </template>
        </Column>
      </DataTable>
    </section>
  </div>
</template>

<style scoped>
.edit-icon {
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
}

.edit-icon:hover {
  color: #48c787;
}
</style>
