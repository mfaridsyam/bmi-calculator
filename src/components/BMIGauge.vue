<template>
  <div class="gauge-wrapper">
    <canvas ref="canvasRef" :width="canvasSize" :height="canvasSize * 0.6"></canvas>
    <div class="gauge-center">
      <div class="gauge-value" :style="{ color: category.color }">{{ bmi }}</div>
      <div class="gauge-label" :style="{ color: category.color }">{{ category.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Chart, ArcElement, DoughnutController, Tooltip } from 'chart.js'

Chart.register(ArcElement, DoughnutController, Tooltip)

const props = defineProps({
  bmi: { type: Number, required: true },
  category: { type: Object, required: true },
})

const canvasRef = ref(null)
let chartInstance = null

const canvasSize = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(window.innerWidth - 60, 320)
  }
  return 320
})

// Gauge segments: very_underweight | underweight | normal | overweight_risk | overweight | obese1 | obese2+
const segments = [
  { label: 'Sangat Kurus (<17)',  color: '#93c5fd', range: [10, 17] },
  { label: 'Berat Rendah (17–18.5)', color: '#60a5fa', range: [17, 18.5] },
  { label: 'Normal (18.5–23)',    color: '#22c55e', range: [18.5, 23] },
  { label: 'Berisiko (23–25)',    color: '#a3e635', range: [23, 25] },
  { label: 'Berlebih (25–30)',    color: '#fbbf24', range: [25, 30] },
  { label: 'Obesitas I (30–35)', color: '#fb923c', range: [30, 35] },
  { label: 'Obesitas II (35–40)',color: '#f87171', range: [35, 40] },
  { label: 'Obesitas III (40+)',  color: '#dc2626', range: [40, 50] },
]

const MIN_BMI = 10
const MAX_BMI = 50

function bmiToPercent(bmi) {
  const clamped = Math.max(MIN_BMI, Math.min(MAX_BMI, bmi))
  return (clamped - MIN_BMI) / (MAX_BMI - MIN_BMI)
}

function buildChartData(bmi) {
  // Each segment = its range size (normalized)
  const total = MAX_BMI - MIN_BMI
  const segData = segments.map(s => (s.range[1] - s.range[0]) / total * 100)
  const segColors = segments.map(s => s.color)

  // Needle overlay: small filled arc at bmi position
  return {
    datasets: [
      {
        data: segData,
        backgroundColor: segColors,
        borderColor: '#f8f7f4',
        borderWidth: 2,
        borderRadius: 0,
        circumference: 180,
        rotation: 270,
      }
    ],
  }
}

function drawNeedle(chart, bmi) {
  const ctx = chart.ctx
  const { width, height } = chart.canvas
  const centerX = width / 2
  const centerY = height * 0.92

  const pct = bmiToPercent(bmi)
  const angle = Math.PI + pct * Math.PI // 0° = left (low), 180° = right (high)

  const needleLen = Math.min(width, height) * 0.35
  const needleWidth = 3

  ctx.save()
  ctx.translate(centerX, centerY)

  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.2)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 2

  // Needle line
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(
    Math.cos(angle) * needleLen,
    Math.sin(angle) * needleLen
  )
  ctx.strokeStyle = '#1a1917'
  ctx.lineWidth = needleWidth
  ctx.lineCap = 'round'
  ctx.stroke()

  // Center dot
  ctx.shadowColor = 'transparent'
  ctx.beginPath()
  ctx.arc(0, 0, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1917'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 0, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#f8f7f4'
  ctx.fill()

  ctx.restore()
}

const needlePlugin = {
  id: 'needlePlugin',
  afterDatasetsDraw(chart) {
    drawNeedle(chart, props.bmi)
  }
}

function initChart() {
  if (!canvasRef.value) return
  const ctx = canvasRef.value.getContext('2d')
  if (chartInstance) chartInstance.destroy()
  chartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: buildChartData(props.bmi),
    options: {
      responsive: false,
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
      },
      cutout: '68%',
      animation: { duration: 800, easing: 'easeOutQuart' },
    },
    plugins: [needlePlugin],
  })
}

onMounted(() => {
  initChart()
})

watch(() => props.bmi, () => {
  if (chartInstance) {
    chartInstance.data = buildChartData(props.bmi)
    chartInstance.update('active')
  }
})
</script>

<style scoped>
.gauge-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.gauge-center {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  pointer-events: none;
}

.gauge-value {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 600;
  line-height: 1;
  transition: color 0.4s ease;
}

.gauge-label {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-top: 4px;
  transition: color 0.4s ease;
}

canvas {
  max-width: 100%;
}
</style>
