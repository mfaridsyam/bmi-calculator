<template>
  <div class="scale-container">
    <div class="scale-bar">
      <div
        v-for="seg in segments"
        :key="seg.label"
        class="scale-seg"
        :style="{ flex: seg.flex, background: seg.color }"
        :title="seg.label"
      ></div>
      <div
        class="scale-needle"
        :style="{ left: needlePercent + '%' }"
      >
        <div class="needle-dot" :style="{ background: category.color }"></div>
        <div class="needle-tag" :style="{ background: category.color, color: '#fff' }">
          {{ bmi }}
        </div>
      </div>
    </div>
    <div class="scale-labels">
      <span>10</span>
      <span>17</span>
      <span>18.5</span>
      <span>23</span>
      <span>25</span>
      <span>30</span>
      <span>35</span>
      <span>40+</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  bmi: Number,
  category: Object,
})

const MIN = 10, MAX = 50
const segments = [
  { label: 'Sangat Kurus', color: '#93c5fd', flex: 7 },
  { label: 'Berat Rendah', color: '#60a5fa', flex: 1.5 },
  { label: 'Normal',       color: '#22c55e', flex: 4.5 },
  { label: 'Berisiko',     color: '#a3e635', flex: 2 },
  { label: 'Berlebih',     color: '#fbbf24', flex: 5 },
  { label: 'Obesitas I',   color: '#fb923c', flex: 5 },
  { label: 'Obesitas II',  color: '#f87171', flex: 5 },
  { label: 'Obesitas III', color: '#dc2626', flex: 10 },
]

const needlePercent = computed(() => {
  const pct = Math.max(0, Math.min(100, ((props.bmi - MIN) / (MAX - MIN)) * 100))
  return pct
})
</script>

<style scoped>
.scale-container { width: 100%; }

.scale-bar {
  position: relative;
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: visible;
  margin-bottom: 24px;
}

.scale-seg {
  height: 100%;
}
.scale-seg:first-child { border-radius: 6px 0 0 6px; }
.scale-seg:last-child  { border-radius: 0 6px 6px 0; }

.scale-needle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: left 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 10;
}

.needle-dot {
  width: 16px; height: 16px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background 0.4s;
}

.needle-tag {
  position: absolute;
  top: 18px;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  transition: background 0.4s;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: var(--color-text-faint);
  font-weight: 500;
  margin-top: 4px;
}
</style>
