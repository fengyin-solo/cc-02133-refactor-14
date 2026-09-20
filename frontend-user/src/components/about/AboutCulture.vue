<template>
  <div class="culture-grid">
    <div
      v-for="culture in data.items"
      :key="culture.title"
      class="culture-card"
    >
      <div class="culture-icon">
        <el-icon :size="36">
          <component :is="culture.icon" />
        </el-icon>
      </div>
      <h3>{{ culture.title }}</h3>
      <p>{{ culture.description }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.culture-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.culture-card {
  background: $bg-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  text-align: center;
  box-shadow: $shadow-md;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-8px);
    box-shadow: $shadow-lg;
  }
}

.culture-icon {
  width: 72px;
  height: 72px;
  background: rgba($primary-color, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-md;
  color: $primary-color;
}

.culture-card h3 {
  font-size: $font-size-lg;
  color: $text-primary;
  margin-bottom: $spacing-sm;
}

.culture-card p {
  font-size: $font-size-sm;
  color: $text-secondary;
  line-height: $line-height-loose;
}

@media (max-width: $breakpoint-lg) {
  .culture-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: $breakpoint-md) {
  .culture-grid {
    grid-template-columns: 1fr;
  }
}
</style>
