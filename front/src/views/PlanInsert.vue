<script setup>
import { ref } from 'vue';
import axios from 'axios';
import HeaderLayout from '@/layout/HeaderLayout.vue';

const content = ref('')
const title = ref('')




</script>


<template>
<div class="flex mt-8">
            <div class="card flex flex-col gap-4 w-full">
                <div class="insert-plan">지원계획 입력</div>
                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="title">목표</label>
                        <InputText id="title" v-model="title" type="text" placeholder="지원 계획 목표를 입력하세요" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">지원기간</label>
                        <InputText id="lastname2" type="text" />
                    </div>
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="lastname2">~</label>
                        <InputText id="lastname2" type="text" />
                    </div>
                </div>

                <div class="flex flex-wrap">
                    <label for="content">내용</label>
                    <Textarea id="content" v-model="content" rows="4" placeholder="내용을 입력하세요" />
                </div>

                <div class="flex flex-col md:flex-row gap-4">
                    <div class="flex flex-wrap gap-2 w-full">
                        <label for="file">파일 첨부</label>
                        <Select id="file" v-model="dropdownItem" :options="dropdownItems" optionLabel="name" placeholder="Select One" class="w-full"></Select>
                    </div>
                </div>
            </div>
        </div>
</template>

<style scoped>
.insert-plan {
  display: flex;
  align-items: center;
}



</style>