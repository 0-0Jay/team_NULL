<script setup></script>

<template>
  <div class="pt-16">
    <Splitter style="height: 300px" class="mb-8">
      <SplitterPanel :size="30" :minSize="10">
        <div className="h-full flex items-center justify-center">정보입력창</div>
      </SplitterPanel>
      <SplitterPanel :size="70">
        <Splitter layout="vertical">
          <SplitterPanel :size="15">
            <div className="h-full flex items-center justify-center">복 지 지 도</div>
          </SplitterPanel>
          <SplitterPanel :size="50">
            <div className="h-full flex items-center justify-center">지도뜨는창</div>
          </SplitterPanel>
        </Splitter>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style></style>
