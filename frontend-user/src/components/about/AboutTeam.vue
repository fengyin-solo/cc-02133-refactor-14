<template>
  <div class="team-grid">
    <div
      v-for="member in data.items"
      :key="member.name"
      class="team-card"
    >
      <div class="member-avatar">
        <el-icon :size="48"><User /></el-icon>
      </div>
      <h4 class="member-name">{{ member.name }}</h4>
      <p class="member-title">{{ member.title }}</p>
      <p class="member-desc">{{ member.description }}</p>
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

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $spacing-lg;
}

.team-card {
  background: $bg-white;
  padding: $spacing-xl;
  border-radius: $radius-lg;
  text-align: center;
  box-shadow: $shadow-md;
}

.member-avatar {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, $primary-color, $primary-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto $spacing-md;
  color: #fff;
}

.member-name {
  font-size: $font-size-lg;
  color: $text-primary;
  margin-bottom: $spacing-xs;
}

.member-title {
  font-size: $font-size-sm;
  color: $primary-color;
  margin-bottom: $spacing-sm;
}

.member-desc {
  font-size: $font-size-sm;
  color: $text-secondary;
}

@media (max-width: $breakpoint-lg) {
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: $breakpoint-md) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
