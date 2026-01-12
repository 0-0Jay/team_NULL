<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const user = JSON.parse(localStorage.getItem('users'))?.user?.[0];

const currentTab = computed(() => route.name)

const onTabChange = (value) => {
  if (value !== route.name) {
    router.push({ name: value })
  }
}
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <!-- 탭 버튼 -->
      <div class="tab-button-group">
        <Button 
          label="FAQ" 
          :severity="currentTab === 'faq' ? 'primary' : 'secondary'"
          text
          @click="onTabChange('faq')"
          class="tab-button"
        />
        <Button 
        v-if="user.type === 1 || user.type === 2"
          label="FAQ 등록" 
          :severity="currentTab === 'faq-create' ? 'primary' : 'secondary'"
          text
          @click="onTabChange('faq-create')"
          class="tab-button"
        />
        <Button 
          label="1:1 문의 내역" 
          :severity="currentTab === 'inquiry' ? 'primary' : 'secondary'"
          text
          @click="onTabChange('inquiry')"
          class="tab-button"
        />
        <Button 
          v-if="user.type === 0"
          label="1:1 문의하기" 
          :severity="currentTab === 'inquiry-create' ? 'primary' : 'secondary'"
          text
          @click="onTabChange('inquiry-create')"
          class="tab-button"
        />
      </div>
      
      <!-- 컨텐츠 영역 -->
      <div class="content-card">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 85px 20px 20px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.tab-button-group {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 0;
  flex-wrap: wrap;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 12px;
}

.tab-button {
  min-width: 140px;
  font-weight: 600;
  transition: all 0.2s ease;
  font-size: 20px;
  padding: 12px 20px;
}

.content-card {
  background: #ffffff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-top: -2px;
}
</style>