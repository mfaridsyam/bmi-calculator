<template>
  <div class="macros-chart">
    <div v-for="item in items" :key="item.label" class="macro-row">
      <div class="macro-info">
        <div class="macro-dot" :style="{ background: item.color }"></div>
        <span class="macro-name">{{ item.label }}</span>
        <span class="macro-value">{{ item.primary }}</span>
      </div>
      <div class="macro-bar-track">
        <div class="macro-bar-fill" :style="{ width: item.pct + '%', background: item.color }"></div>
      </div>
      <span class="macro-sub">{{ item.secondary }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  macros: { type: Object, required: true },
  targetCal: { type: Number, required: true },
  t: { type: Object, default: () => ({}) },
})

const items = computed(() => [
  {
    label: props.t.carb || 'Carbohydrates',
    primary: `${props.macros.carb.gram}g`,
    secondary: `${props.macros.carb.cal} kcal (${props.macros.carb.pct}%)`,
    pct: props.macros.carb.pct,
    color: '#3b82f6',
  },
  {
    label: props.t.protein || 'Protein',
    primary: `${props.macros.protein.gram}g`,
    secondary: `${props.macros.protein.cal} kcal (${props.macros.protein.pct}%)`,
    pct: props.macros.protein.pct,
    color: '#16a34a',
  },
  {
    label: props.t.fat || 'Fat',
    primary: `${props.macros.fat.gram}g`,
    secondary: `${props.macros.fat.cal} kcal (${props.macros.fat.pct}%)`,
    pct: props.macros.fat.pct,
    color: '#f59e0b',
  },
  {
    label: props.t.sugar || 'Sugar (max)',
    primary: `${props.macros.sugar.gram}g`,
    secondary: props.t.whoRec || 'WHO Recommendation',
    pct: Math.min((props.macros.sugar.gram / 50) * 100, 100),
    color: '#ef4444',
  },
  {
    label: props.t.fiber || 'Fiber',
    primary: `${props.macros.fiber.gram}g`,
    secondary: props.t.dailyNeeds || 'Daily needs',
    pct: Math.min((props.macros.fiber.gram / 40) * 100, 100),
    color: '#84cc16',
  },
])
</script>

<style scoped>
.macros-chart { display: flex; flex-direction: column; gap: 14px; }
.macro-row { display: flex; flex-direction: column; gap: 5px; }
.macro-info { display: flex; align-items: center; gap: 8px; }
.macro-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.macro-name { font-size: 13px; font-weight: 500; color: var(--color-text); flex: 1; }
.macro-value { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--color-text); }
.macro-bar-track { height: 6px; background: var(--color-border); border-radius: 3px; overflow: hidden; }
.macro-bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
.macro-sub { font-size: 11px; color: var(--color-text-faint); }
</style>
