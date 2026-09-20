<template>
  <section class="section" :class="themeClass">
    <div class="container">
      <SectionTitle
        v-if="showTitle"
        :title="title"
        :subtitle="subtitle"
      />
      <slot />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import SectionTitle from '@/components/SectionTitle.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  // light / gray / dark，沿用全局既有底色类
  theme: {
    type: String,
    default: 'light'
  },
  // 公司简介区块的标题嵌在自身排版内，不由外壳统一渲染
  showTitle: {
    type: Boolean,
    default: true
  }
})

const themeClass = computed(() => `section-${props.theme}`)
</script>
