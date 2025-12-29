<script setup>
  import { ref } from 'vue';
import { KakaoMap, KakaoMapMarker } from 'vue3-kakao-maps';

//라이브러리 사용 방법을 반드시 참고하여 주시기 바랍니다.
const map = ref();
const markerList = ref([]);
const cur_loc = ref(true);
const care_loc = ref();
const public_loc = ref();
const medic_loc = ref();
const amen_loc =ref();

const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert('브라우저에서 위치를 지원하지 않습니다');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      const currentLatLng = new kakao.maps.LatLng(lat, lng);
      // 지도 중심 이동
      map.value.setCenter(currentLatLng);
      // 주변 병원 검색
      searchNearby(currentLatLng);
    },
    () => {
      alert('위치 권한을 허용해주세요');
    }
  );
};

const onLoadKakaoMap = (mapRef) => {
  map.value = mapRef;
  // 장소 검색 객체를 생성합니다
  getCurrentLocation(); // 최초 1회

};

const searchNearby = (latlng) => {
  const ps = new kakao.maps.services.Places();

  markerList.value = []; // 기존 마커 제거

  ps.keywordSearch(
    '의원',
    placesSearchCB,
    {
      location: latlng,
      radius: 3000 // ⭐ 3km (필요에 따라 조절)
    }
  );
};

// 키워드 검색 완료 시 호출되는 콜백함수 입니다
const placesSearchCB = (data, status) => {
  if (status === kakao.maps.services.Status.OK) {
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
    // LatLngBounds 객체에 좌표를 추가합니다
    const bounds = new kakao.maps.LatLngBounds();
    for (let marker of data) {
      const markerItem = {
        lat: marker.y,
        lng: marker.x,
        infoWindow: {
          content: marker.place_name,
          visible: false
        }
      };
      markerList.value.push(markerItem);
      bounds.extend(new kakao.maps.LatLng(Number(marker.y), Number(marker.x)));
    }
    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.value?.setBounds(bounds);
  }
};

//마커 클릭 시 인포윈도우의 visible 값을 반전시킵니다
const onClickMapMarker = (markerItem) => {
  if (markerItem.infoWindow?.visible !== null && markerItem.infoWindow?.visible !== undefined) {
    markerItem.infoWindow.visible = !markerItem.infoWindow.visible;
  } else {
    markerItem.infoWindow.visible = true;
  }
};

const showCurrentMarker = (latlng) => {
  markerList.value.push({
    lat: latlng.getLat(),
    lng: latlng.getLng(),
    infoWindow: {
      content: '현재 위치',
      visible: true
    }
  });
};

const listboxValues = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);
const listboxValue = ref(null);
</script>


<template>
  <div class="pt-16">
    <Fluid>
        <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/3">
                <div class="card flex flex-col gap-4">
                  <div class="font-semibold text-xl">복지지도</div>
                    <ToggleButton v-model="cur_loc" onLabel="현위치" offLabel="현위치" :style="{ width: '100%' }" />
                    <ToggleButton v-model="care_loc" onLabel="보육/교육시설" offLabel="보육/교육시설" :style="{ width: '100%' }" />
                    <ToggleButton v-model="public_loc" onLabel="공공기관" offLabel="공공기관" :style="{ width: '100%' }" />
                    <ToggleButton v-model="medic_loc" onLabel="의료기관" offLabel="의료기관" :style="{ width: '100%' }" />
                    <ToggleButton v-model="amen_loc" onLabel="편의시설" offLabel="편의시설" :style="{ width: '100%' }" />
                </div>
                <div>
                  <Listbox v-model="listboxValue" :options="listboxValues" optionLabel="name" :filter="true" />
                </div>
            </div>
            <div class="md:w-2/3">
                <div class="card flex flex-col gap-4">
                    <KakaoMap :lat="35.8691048" :lng="128.5933317" :width="1200" :height="800" @onLoadKakaoMap="onLoadKakaoMap">
                      <KakaoMapMarker
                        v-for="(marker, index) in markerList"
                        :key="marker.key === undefined ? index : marker.key"
                        :lat="marker.lat"
                        :lng="marker.lng"
                        :infoWindow="marker.infoWindow"
                        :clickable="true"
                        @onClickKakaoMapMarker="onClickMapMarker(marker)"
                      />
                    </KakaoMap>
                </div>
            </div>
        </div>
    </Fluid>
  </div>
</template>

<style></style>
