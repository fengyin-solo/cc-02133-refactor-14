<template>
  <div class="about-page">
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1 class="page-title">关于我们</h1>
        <p class="page-subtitle">专注智慧物流，赋能企业数字化转型</p>
      </div>
    </section>

    <!-- 公司简介 / 发展历程 / 企业文化 / 核心团队：
         统一经过 useAboutContent 读取、归一化与排序后渲染 -->
    <AboutSectionShell
      v-for="section in sections"
      :key="section.key"
      :title="section.title"
      :subtitle="section.subtitle"
      :theme="section.theme"
      :show-title="section.showTitle"
    >
      <component :is="sectionComponents[section.key]" :data="section.data" />
    </AboutSectionShell>
  </div>
</template>

<script setup>
import { useAboutContent } from '@/composables/useAboutContent'
import AboutSectionShell from '@/components/about/AboutSectionShell.vue'
import AboutCompany from '@/components/about/AboutCompany.vue'
import AboutHistory from '@/components/about/AboutHistory.vue'
import AboutCulture from '@/components/about/AboutCulture.vue'
import AboutTeam from '@/components/about/AboutTeam.vue'
import { SECTION_KEYS } from '@/data/about'

const { sections } = useAboutContent()

const sectionComponents = {
  [SECTION_KEYS.COMPANY]: AboutCompany,
  [SECTION_KEYS.HISTORY]: AboutHistory,
  [SECTION_KEYS.CULTURE]: AboutCulture,
  [SECTION_KEYS.TEAM]: AboutTeam
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.page-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: $spacing-xxl 0;
  text-align: center;
  color: #fff;
}

.page-title {
  font-size: $font-size-xxxl;
  font-weight: 700;
  margin-bottom: $spacing-sm;
}

.page-subtitle {
  font-size: $font-size-lg;
  opacity: 0.75;
}

@media (max-width: $breakpoint-md) {
  .page-title {
    font-size: $font-size-xxl;
  }
}
</style>
