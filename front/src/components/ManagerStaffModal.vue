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
  name: false,
  centerName: false,
  phone: false,
  email: false,
  pwConfirm: false
});

const nameMsg = computed(() => msg.value.name && editUser.value.name === '');
// const centerNameMsg = computed(() => user.type === 3 && !editUser.value.c_no);
const phoneMsg = computed(() => msg.value.phone && editUser.value.phone === '');
const emailMsg = computed(() => msg.value.email && editUser.value.email === '');
const pwMismatch = computed(() => {
  if (!msg.value.pwConfirm) return false;
  if (!editUser.value.password) return false;
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
        name: props.userData.name,
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
      name: false,
      centerName: false,
      phone: false,
      email: false,
      pwConfirm: false
    };
  }
);

const submitEdit = async () => {
// 필수값 검증
  msg.value.id = props.mode === 'add' && !editUser.value.id?.trim();
  msg.value.name = !editUser.value.name?.trim();
  msg.value.phone = !editUser.value.phone?.trim();
  msg.value.email = !editUser.value.email?.trim();
  msg.value.centerName = props.mode === 'add' && !selectedAutoValue.value;
  msg.value.pwConfirm = props.mode === 'add' && !editUser.value.password?.trim();

  if (props.mode === 'add' && editUser.value.password !== editUser.value.pwConfirm) return;

  if (
    msg.value.id ||
    msg.value.name ||
    msg.value.phone ||
    msg.value.email ||
    msg.value.centerName ||
    msg.value.pwConfirm
  ) {
    return;
  }

  const info = {
    name: editUser.value.name,
    phone: editUser.value.phone,
    email: editUser.value.email,
    c_no: selectedAutoValue.value?.c_no,
  };

  if (props.mode === 'add') {
    info.id = editUser.value.id;
    info.password = editUser.value.password;
  } else {
    if (editUser.value.password) info.password = editUser.value.password;
  }

  // // 비밀번호 입력한 경우만
  // if (editUser.value.password) {
  //   info.password = editUser.value.password;
  // }

  // // 기관 변경한 경우만
  // if (selectedAutoValue.value) {
  //   info.c_no = selectedAutoValue.value.c_no;
  // }

  try {
    let result;
    if (props.mode === 'add') {
      result = await store.addStaffByAdmin(info);
      console.log('addStaffByAdmin 결과', result);
    } else {
      result = await store.modifyStaff(editUser.value.user_no, info);
    }

    if (result?.status === 'success') {
      toast.add({
        severity: 'success',
        summary: props.mode === 'add' ? '등록 완료' : '수정 완료',
        detail: props.mode === 'add' ? '기관 담당자가 등록되었습니다.' : '정보가 수정되었습니다.',
        life: 2000,
      });

      await store.fetchStaff();
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
  <Dialog :header="props.mode === 'add' ? '기관 담당자 등록' : '기관 담당자 수정'" :visible="modelValue" @update:visible="emit('update:modelValue', $event)" :style="{ width: '450px' }" :modal="true">
      <table class="w-full border-collapse">
      <tbody>
        <!-- 아이디 -->
        <tr class="border-t border-b">
          <th class="text-left py-2 px-2 w-1/4 border-r">아이디</th>
          <td class="py-2 px-2">
            <InputText
              v-model="editUser.id"
              type="text"
              class="w-full"
              :disabled="props.mode === 'edit'"
              placeholder="아이디 입력"
            />
          </td>
        </tr>

        <!-- 담당자명 -->
        <tr class="border-t border-b">
           <th class="text-left py-2 px-2 w-1/4 border-r">담당자명</th>
          <td class="py-2 px-2"><InputText v-model="editUser.name" @input="msg.name = true" :invalid="nameMsg" type="text" class="w-full" />
          <small v-if="nameMsg" class="text-red-500"> 담당자명을 입력해주세요. </small></td>
        </tr>
        
        <!-- 기관명 -->
        <tr v-if="user.type === 3" class="border-b">
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
                  @item-select="selectCenter"
                  forceSelection
                  fluid
                />
              </IconField>
          </td>
        </tr>

       <!-- 연락처 -->
      <tr class="border-b">
        <th class="text-left py-2 px-2 border-r">연락처</th>
        <td class="py-2 px-2">
          <InputText v-model="editUser.phone" class="w-full" />
        </td>
      </tr>

        <!-- 이메일 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">이메일</th>
          <td class="py-2 px-2">
            <InputText v-model="editUser.email" class="w-full" />
          </td>
        </tr>

        <!-- 비밀번호 -->
        <tr class="border-b">
          <th class="text-left py-2 px-2 border-r">비밀번호</th>
          <td class="py-2 px-2">
            <InputText type="password" v-model="editUser.password" class="w-full mb-2" />
            <InputText type="password" v-model="editUser.pwConfirm" class="w-full" />
            <small v-if="pwMismatch" class="text-red-500">
              비밀번호가 일치하지 않습니다.
            </small>
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