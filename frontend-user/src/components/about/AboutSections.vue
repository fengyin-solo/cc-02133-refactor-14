<template>
  <template v-for="section in sections" :key="section.id">
    <section class="section" :class="`section-${section.theme}`">
      <div class="container">
        <template v-if="section.type === 'intro'">
          <div class="about-intro">
            <div class="intro-content">
              <SectionTitle :title="section.title" />
              <p
                v-for="paragraph in section.paragraphs"
                :key="paragraph"
                class="intro-text"
              >
                {{ paragraph }}
              </p>
              <div class="intro-stats">
                <div
                  v-for="stat in section.stats"
                  :key="`${stat.value}-${stat.label}`"
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
                  <component :is="section.image.icon" />
                </el-icon>
                <span>{{ section.image.caption }}</span>
              </div>
            </div>
          </div>
        </template>

        <template v-else>
          <SectionTitle
            :title="section.title"
            :subtitle="section.subtitle"
          />

          <div v-if="section.type === 'timeline'" class="timeline">
            <div
              v-for="item in section.items"
              :key="item.id"
              class="timeline-item"
            >
              <div class="timeline-year">{{ item.year }}</div>
              <div class="timeline-content">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div v-else-if="section.type === 'culture'" class="culture-grid">
            <div
              v-for="culture in section.items"
              :key="culture.id"
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

          <div v-else-if="section.type === 'team'" class="team-grid">
            <div
              v-for="member in section.items"
              :key="member.id"
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
      </div>
    </section>
  </template>
</template>

<script setup>
import SectionTitle from '@/components/SectionTitle.vue'
import { useAboutContent } from '@/composables/useAboutContent'

const { sections } = useAboutContent()
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
  .about-intro {
    flex-direction: column;
  }

  .intro-image {
    flex: none;
    width: 100%;
  }

  .culture-grid,
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
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

  .culture-grid,
  .team-grid {
    grid-template-columns: 1fr;
  }

  .intro-stats {
    flex-wrap: wrap;
  }
}
</style>
