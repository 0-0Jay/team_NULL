<script setup>
import { useUsersStore } from '@/stores/users';
import { useCentersStore } from '@/stores/centers';
import { ref, watch, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

const store = useUsersStore();
const centerStore = useCentersStore();
const toast = useToast();
const user = JSON.parse(localStorage.getItem('users'))?.user[0];

// 검색 + 자동완성(담당자 수정할 때 기관명 검색)
const selectedAutoValue = ref(null);
const autoFilteredValue = ref([]);

// 기관 검색(자동완성)
const searchCenter = async (e) => {
  const name = e.query;

  // 전체 목록
  if (!name) {
    autoFilteredValue.value = await centerStore.searchCenter('');
    return;
  }
  autoFilteredValue.value = await centerStore.searchCenter(name);
};

const loadAllCenters = async () => {
  autoFilteredValue.value = await centerStore.searchCenter('');
};

const selectCenter = (e) => {
  selectedAutoValue.value = e.value;
  editUser.value.c_no = e.value.c_no;
};

// Props & Emits
const emit = defineEmits(['update:modelValue']);
const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'edit' // 'add' | 'edit'
  },
  userData: {
    type: Object,
    default: null
  }
});

// Form state
const editUser = ref({});
const msg = ref({
  id: false,
  name: false,
  centerName: false,
  // phone: false,
  email: false,
  pwConfirm: false
});

const idMsg = computed(() => msg.value.id && !editUser.value.id?.trim());
const nameMsg = computed(() => msg.value.name && editUser.value.name === '');
const centerNameMsg = computed(() => msg.value.centerName && !selectedAutoValue.value);
// const phoneMsg = computed(() => msg.value.phone && editUser.value.phone === '');
const emailMsg = computed(() => msg.value.email && editUser.value.email === '');
const pwConfirmMsg = computed(() => msg.value.pwConfirm && !editUser.value.password?.trim());
const pwMismatch = computed(() => {
  // 비밀번호 입력했을 때 확인용
  if (!editUser.value.password || !editUser.value.pwConfirm) return false;
  return editUser.value.password !== editUser.value.pwConfirm;
});

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) return;

    if (props.mode === 'edit' && props.userData) {
      editUser.value = {
        user_no: props.userData.user_no,
        id: props.userData.id,
        name: props.userData.user_name,
        phone: props.userData.phone,
        email: props.userData.email,
        password: '',
        pwConfirm: '',
        c_no: props.userData.c_no
      };

      // 기관 자동완성 초기값도 여기서
      if (props.userData.c_no && props.userData.center_name) {
        selectedAutoValue.value = {
          c_no: props.userData.c_no,
          name: props.userData.center_name
        };
      }
    } else {
      // 등록 모드 초기화
      editUser.value = {
        id: '',
        name: '',
        phone: '',
        email: '',
        password: '',
        pwConfirm: '',
        c_no: null
      };
      selectedAutoValue.value = null;
    }

    // 에러 메시지 초기화
    msg.value = {
      id: false,
      name: false,
      centerName: false,
      // phone: false,
      email: false,
      pwConfirm: false
    };
  }
);

const submitEdit = async () => {
  // 시스템 관리자: 선택값이 있으면 selectedAutoValue, 없으면 editUser.c_no
  const cNoValue = selectedAutoValue?.value?.c_no ?? editUser.value.c_no;

  // 1. 필수값 체크
  msg.value.id = props.mode === 'add' && !editUser.value.id?.trim();
  msg.value.name = !editUser.value.name?.trim();
  // msg.value.phone = !editUser.value.phone?.trim();
  msg.value.email = !editUser.value.email?.trim();
  msg.value.pwConfirm = props.mode === 'add' && !editUser.value.password?.trim();
  msg.value.centerName = !selectedAutoValue.value;

  // 2. 필수값 하나라도 누락이면 return
  if (msg.value.id || msg.value.name || msg.value.email || msg.value.centerName || msg.value.pwConfirm) return;

  // 3. 비밀번호 불일치 체크 (등록/수정 공통)
  if ((props.mode === 'add' || editUser.value.password) && editUser.value.password !== editUser.value.pwConfirm) {
    msg.value.pwConfirm = true; // 인라인 에러
    return;
  }

  // 4. 전송용 info 객체
  const info = {
    name: editUser.value.name,
    phone: editUser.value.phone,
    email: editUser.value.email,
    c_no: cNoValue
  };

  if (props.mode === 'add') {
    info.id = editUser.value.id;
    info.password = editUser.value.password;
  } else {
    if (editUser.value.password) info.password = editUser.value.password;
  }

  try {
    let result;
    if (props.mode === 'add') {
      result = await store.addManagerByAdmin(info);
    } else {
      result = await store.modifyStaff(editUser.value.user_no, info);
    }

    if (result?.status === 'success') {
      toast.add({
        severity: 'success',
        summary: props.mode === 'add' ? '등록 완료' : '수정 완료',
        detail: props.mode === 'add' ? '기관 관리자가 등록되었습니다.' : '정보가 수정되었습니다.',
        life: 2000
      });

      await store.fetchManager();
      emit('update:modelValue', false);
    } else {
      toast.add({ severity: 'error', summary: '실패', detail: result.message || '오류가 발생했습니다.', life: 2000 });
    }
  } catch (e) {
    console.error('에러', e);
  }
};
</script>
<template>
  <Dialog :header="props.mode === 'add' ? '기관 관리자 등록' : '기관 관리자 수정'" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :style="{ width: '450px' }" :modal="true">
    <table class="w-full border-collapse">
      <tbody>
        <!-- 아이디 -->
        <tr class="border-t border-b">
          <th class="text-left py-2 px-2 w-1/4 border-r">아이디</th>
          <td class="py-2 px-2">
            <InputText v-model="editUser.id" type="text" class="w-full" :disabled="props.mode === 'edit'" placeholder="아이디 입력" @input="msg.id = false" />
            <small v-if="idMsg" class="text-red-500"> 아이디를 입력해주세요. </small>
          </td>
        </tr>

        <!-- 관리자명 -->
        <tr class="border-t border-b">
          <th class="text-left py-2 px-2 w-1/4 border-r">관리자명</th>
          <td class="py-2 px-2">
            <InputText v-model="editUser.name" @input="msg.name = true" :invalid="nameMsg" type="text" class="w-full" />
            <small v-if="nameMsg" class="text-red-500"> 관리자명을 입력해주세요. </small>
          </td>
        </tr>

        <!-- 기관명 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">기관명</th>
          <td class="py-2 px-2">
            <IconField iconPosition="left">
              <InputIcon class="pi pi-search" />
              <AutoComplete
                v-model="selectedAutoValue"
                :suggestions="autoFilteredValue"
                optionLabel="name"
                placeholder="기관명 검색"
                complete-on-focus
                @focus="loadAllCenters"
                dropdown
                @complete="searchCenter"
                forceSelection
                fluid
                @item-select="msg.centerName = false"
              />
            </IconField>
            <small v-if="centerNameMsg" class="text-red-500"> 기관을 선택해주세요. </small>
          </td>
        </tr>

        <!-- 연락처 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">연락처</th>
          <td class="py-2 px-2">
            <InputText v-model="editUser.phone" class="w-full" />
            <!-- <small v-if="phoneMsg" class="text-red-500"> 연락처를 입력해주세요. </small> -->
          </td>
        </tr>

        <!-- 이메일 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">이메일</th>
          <td class="py-2 px-2">
            <InputText v-model="editUser.email" class="w-full" />
            <small v-if="emailMsg" class="text-red-500"> 이메일을 입력해주세요. </small>
          </td>
        </tr>

        <!-- 비밀번호 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">비밀번호</th>
          <td class="py-2 px-2">
            <InputText type="password" v-model="editUser.password" class="w-full mb-2" @input="msg.pwConfirm = false" />
            <small v-if="pwConfirmMsg && props.mode === 'add'" class="text-red-500"> 비밀번호를 입력해주세요. </small>
            <InputText type="password" v-model="editUser.pwConfirm" class="w-full" />
            <small v-if="pwMismatch" class="text-red-500"> 비밀번호가 일치하지 않습니다. </small>
          </td>
        </tr>
      </tbody>
    </table>

    <template #footer>
      <div class="flex justify-center w-full">
        <Button :label="props.mode === 'add' ? '저장' : '수정'" severity="warn" class="w-30" @click="submitEdit" />
      </div>
    </template>
  </Dialog>
</template>
