<template>
  <div class="timeline">
    <div
      v-for="item in data.items"
      :key="item.year"
      class="timeline-item"
    >
      <div class="timeline-year">{{ item.year }}</div>
      <div class="timeline-content">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
      </div>
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

.timeline {
  position: relative;
  padding-left: 120px;

  &::before {
    content: '';
    position: absolute;
    left: 100px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: $border-color;
  }
}

.timeline-item {
  position: relative;
  padding-bottom: $spacing-xl;

  &::before {
    content: '';
    position: absolute;
    left: -24px;
    top: 8px;
    width: 12px;
    height: 12px;
    background: $primary-color;
    border-radius: 50%;
    border: 3px solid #fff;
    box-shadow: 0 0 0 3px rgba($primary-color, 0.2);
  }
}

.timeline-year {
  position: absolute;
  left: -120px;
  top: 0;
  font-size: $font-size-lg;
  font-weight: 700;
  color: $primary-color;
}

.timeline-content {
  background: $bg-white;
  padding: $spacing-lg;
  border-radius: $radius-md;
  box-shadow: $shadow-sm;

  h4 {
    font-size: $font-size-lg;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }

  p {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
}

@media (max-width: $breakpoint-md) {
  .timeline {
    padding-left: 30px;

    &::before {
      left: 10px;
    }
  }

  .timeline-year {
    position: static;
    margin-bottom: $spacing-xs;
  }

  .timeline-item::before {
    left: -24px;
  }
}
</style>
