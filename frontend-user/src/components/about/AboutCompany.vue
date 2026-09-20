<template>
  <div class="about-intro">
    <div class="intro-content">
      <SectionTitle title="公司简介" />
      <p
        v-for="(paragraph, index) in data.paragraphs"
        :key="index"
        class="intro-text"
      >
        {{ paragraph }}
      </p>
      <div class="intro-stats">
        <div
          v-for="stat in data.stats"
          :key="stat.label"
          class="stat-item"
        >
          <span class="value">{{ stat.value }}</span>
          <span class="label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
    <div class="intro-image">
      <div class="image-placeholder">
        <el-icon :size="80">
          <component :is="data.image.icon" />
        </el-icon>
        <span>{{ data.image.text }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import SectionTitle from '@/components/SectionTitle.vue'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.about-intro {
  display: flex;
  gap: $spacing-xxl;
  align-items: center;
}

.intro-content {
  flex: 1;
}

.intro-text {
  font-size: $font-size-base;
  color: $text-regular;
  line-height: $line-height-loose;
  margin-bottom: $spacing-md;
}

.intro-stats {
  display: flex;
  gap: $spacing-xl;
  margin-top: $spacing-xl;
}

.intro-stats .stat-item {
  text-align: center;

  .value {
    display: block;
    font-size: 36px;
    font-weight: 700;
    color: $primary-color;
  }

  .label {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

.intro-image {
  flex: 0 0 400px;
}

.image-placeholder {
  width: 100%;
  height: 300px;
  background: linear-gradient(135deg, rgba($primary-color, 0.1), rgba($primary-light, 0.1));
  border-radius: $radius-lg;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $spacing-md;
  color: $primary-color;

  span {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

@media (max-width: $breakpoint-lg) {
  .about-intro {
    flex-direction: column;
  }

  .intro-image {
    flex: none;
    width: 100%;
  }
}

@media (max-width: $breakpoint-md) {
  .intro-stats {
    flex-wrap: wrap;
  }
}
</style>
