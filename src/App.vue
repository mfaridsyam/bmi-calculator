<template>
  <div class="app">
    <transition name="overlay-fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-card">
          <div class="loading-icon-wrap">
            <svg class="loading-spin" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" stroke="#e8e6e0" stroke-width="3"/>
              <path d="M30 4 A26 26 0 0 1 56 30" stroke="#16a34a" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <div class="loading-inner-icon">
              <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                <path d="M6 24 L10 14 L14 21 L17 17 L22 24" stroke="#16a34a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
          <div class="loading-step">{{ loadingStepText }}</div>
          <div class="loading-bar-wrap"><div class="loading-bar-fill" :style="{ width: loadingPct + '%' }"></div></div>
          <div class="loading-pct">{{ loadingPct }}%</div>
        </div>
      </div>
    </transition>

    <header class="header">
      <div class="container">
        <div class="header-inner">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="10" fill="#16a34a"/><path d="M8 22 L12 12 L16 19 L19 15 L24 22" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            <span class="logo-text">BMI<em>calc</em></span>
          </div>
          <div class="header-right">
            <div class="header-tagline">{{ t.tagline }}</div>
            <div class="lang-toggle">
              <button class="lang-btn" :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
              <button class="lang-btn" :class="{ active: locale === 'id' }" @click="setLocale('id')">ID</button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <section class="hero">
          <h1 class="hero-title">{{ t.heroTitle1 }} <em>{{ t.heroTitleEm }}</em><br>{{ t.heroTitle2 }}</h1>
          <p class="hero-sub">{{ t.heroSub }}</p>
        </section>

        <div class="layout">
          <div class="panel input-panel">
            <h2 class="panel-title">{{ t.personalData }}</h2>
            <div class="field">
              <label class="field-label">{{ t.gender }}</label>
              <div class="gender-toggle">
                <button class="gender-btn" :class="{ active: form.gender === 'male' }" @click="form.gender = 'male'"><span class="gender-icon">♂</span><span>{{ t.male }}</span></button>
                <button class="gender-btn" :class="{ active: form.gender === 'female' }" @click="form.gender = 'female'"><span class="gender-icon">♀</span><span>{{ t.female }}</span></button>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label class="field-label" for="height"><span class="field-label-text">{{ t.height }}</span><span class="field-unit">cm</span></label>
                <input id="height" v-model.number="form.height" type="number" class="input" :placeholder="locale==='en'?'e.g. 170':'cth: 170'" min="100" max="250" @input="validateHeight"/>
                <span v-if="errors.height" class="field-error">{{ t.errHeight }}</span>
              </div>
              <div class="field">
                <label class="field-label" for="weight"><span class="field-label-text">{{ t.weight }}</span><span class="field-unit">kg</span></label>
                <input id="weight" v-model.number="form.weight" type="number" class="input" :placeholder="locale==='en'?'e.g. 65':'cth: 65'" min="20" max="300" step="0.1" @input="validateWeight"/>
                <span v-if="errors.weight" class="field-error">{{ t.errWeight }}</span>
              </div>
            </div>
            <div class="field">
              <label class="field-label" for="age"><span class="field-label-text">{{ t.age }}</span><span class="field-unit">{{ t.years }}</span></label>
              <input id="age" v-model.number="form.age" type="number" class="input" :placeholder="locale==='en'?'e.g. 25':'cth: 25'" min="10" max="100" @input="validateAge"/>
              <span v-if="errors.age" class="field-error">{{ t.errAge }}</span>
            </div>
            <div class="field">
              <label class="field-label" for="activity">{{ t.activityLevel }}</label>
              <div class="select-wrapper">
                <select id="activity" v-model="form.activity" class="select">
                  <option value="sedentary">{{ t.actSedentaryLabel }} — {{ t.actSedentaryDesc }}</option>
                  <option value="light">{{ t.actLightLabel }} — {{ t.actLightDesc }}</option>
                  <option value="moderate">{{ t.actModerateLabel }} — {{ t.actModerateDesc }}</option>
                  <option value="active">{{ t.actActiveLabel }} — {{ t.actActiveDesc }}</option>
                  <option value="very_active">{{ t.actVeryActiveLabel }} — {{ t.actVeryActiveDesc }}</option>
                </select>
                <svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <p class="field-hint">{{ t.activityHint }}</p>
            </div>
            <button class="calc-btn" @click="handleCalculate" :disabled="!isFormValid || isLoading">
              <span>{{ t.calculateBtn }}</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
            <button v-if="result" class="reset-btn" @click="handleReset">{{ t.reset }}</button>
            <div v-if="result" class="gender-note">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
              {{ form.gender === 'male' ? t.genderNoteMale : t.genderNoteFemale }}
            </div>
          </div>

          <div class="panel result-panel" :class="{ 'has-result': !!result }">
            <div v-if="!result" class="empty-state">
              <div class="empty-icon"><svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#d4d0c8" stroke-width="2"/><path d="M14 28 Q19 18 24 24 Q29 30 34 20" stroke="#d4d0c8" stroke-width="2" stroke-linecap="round" fill="none"/></svg></div>
              <p class="empty-text">{{ locale==='en'?'Fill in the data on the left, then press':'Isi data di sebelah kiri, lalu tekan' }}<br><strong>{{ t.calculateBtn }}</strong></p>
            </div>
            <template v-else>
              <div class="result-section gauge-section"><BMIGauge :bmi="result.bmi" :category="result.category" /></div>
              <div class="result-section">
                <p class="section-label">{{ t.bmiPosition }}</p>
                <BMIScale :bmi="result.bmi" :category="result.category" />
              </div>
              <div class="result-section stats-grid">
                <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-val" :style="stat.color?{color:stat.color}:{}">{{ stat.value }}</div>
                  <div class="stat-sub">{{ stat.sub }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <template v-if="result">
          <section class="detail-section">
            <div class="section-header">
              <div class="section-icon" style="background:#dbeafe;color:#2563eb">🔥</div>
              <div><h2 class="section-title">{{ t.dailyCalorieNeeds }}</h2><p class="section-desc">{{ result.calorieGoal.goal }}</p></div>
            </div>
            <div class="calorie-hero">
              <div class="calorie-main"><div class="calorie-number">{{ result.calorieGoal.cal.toLocaleString() }}</div><div class="calorie-unit">{{ t.kcalPerDay }}</div></div>
              <div class="calorie-breakdown">
                <div class="calorie-row"><span>{{ t.bmrLabel }}</span><strong>{{ result.bmr.toLocaleString() }} kcal</strong></div>
                <div class="calorie-row"><span>{{ t.tdeeLabel }}</span><strong>{{ result.tdee.toLocaleString() }} kcal</strong></div>
                <div class="calorie-row target"><span>{{ t.yourDailyTarget }}</span><strong>{{ result.calorieGoal.cal.toLocaleString() }} kcal</strong></div>
              </div>
            </div>
            <div class="macro-section">
              <h3 class="macro-title">{{ t.macroDistribution }}</h3>
              <MacroChart :macros="result.macros" :targetCal="result.calorieGoal.cal" :t="t" />
              <div class="water-row"><span class="water-icon">💧</span><div><strong>{{ t.waterNeeds }}</strong><span>{{ (result.macros.water.ml/1000).toFixed(1) }} {{ t.litersPerDay }}</span></div></div>
            </div>
          </section>

          <div class="two-col-section">
            <section class="detail-section" :style="{borderTop:`3px solid ${result.category.color}`}">
              <div class="section-header">
                <div class="section-icon" :style="{background:result.category.colorLight,color:result.category.color}">⚕️</div>
                <div><h2 class="section-title">{{ t.healthRisks }}</h2><p class="section-desc">{{ t.basedOnCategory }} <strong>{{ result.category.label }}</strong></p></div>
              </div>
              <div class="risks-list">
                <div v-for="risk in result.risks.diseases" :key="risk.name" class="risk-item">
                  <span class="risk-icon">{{ risk.icon }}</span>
                  <div class="risk-body"><div class="risk-name">{{ risk.name }}</div><div class="risk-desc">{{ risk.desc }}</div></div>
                </div>
              </div>
            </section>
            <section class="detail-section">
              <div class="section-header">
                <div class="section-icon" style="background:#f0fdf4;color:#16a34a">💊</div>
                <div><h2 class="section-title">{{ t.vitaminsSupplements }}</h2><p class="section-desc">{{ t.recommendedForYou }}</p></div>
              </div>
              <div class="supplements-list">
                <div v-for="sup in result.risks.supplements" :key="sup.name" class="supplement-item"><div class="sup-name">{{ sup.name }}</div><div class="sup-reason">{{ sup.reason }}</div></div>
              </div>
              <div class="disclaimer"><svg width="12" height="12" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>{{ t.disclaimer }}</div>
            </section>
          </div>

          <section class="detail-section">
            <div class="ideal-grid">
              <div class="ideal-item">
                <div class="ideal-label">{{ t.idealWeight }}</div>
                <div class="ideal-val">{{ result.idealWeight.min }}–{{ result.idealWeight.max }} <small>kg</small></div>
                <div class="ideal-sub">{{ t.devineFor }} {{ form.gender==='male'?t.maleStr:t.femaleStr }}</div>
              </div>
              <div class="ideal-item">
                <div class="ideal-label">{{ t.bodyFatEstimate }}</div>
                <div class="ideal-val">{{ result.bodyFat }}<small>%</small></div>
                <div class="ideal-sub">{{ form.gender==='male'?t.normalMale:t.normalFemale }}</div>
              </div>
              <div class="ideal-item">
                <div class="ideal-label">{{ result.weightDiff>=0?t.needLose:t.needGain }}</div>
                <div class="ideal-val" :style="{color:result.weightDiff>2?'#ea580c':result.weightDiff<-2?'#3b82f6':'#16a34a'}">{{ Math.abs(result.weightDiff) }}<small>kg</small></div>
                <div class="ideal-sub">{{ Math.abs(result.weightDiff)<=2?t.nearIdeal:`${t.toReach} ${result.idealWeight.ideal} kg` }}</div>
              </div>
            </div>
          </section>

          <section class="detail-section">
            <div class="section-header">
              <div class="section-icon" style="background:#fef9c3;color:#ca8a04">🎯</div>
              <div><h2 class="section-title">{{ t.targetWeight }}</h2><p class="section-desc">{{ t.targetDesc }}</p></div>
            </div>
            <div class="target-input-row">
              <div class="target-input-wrap">
                <input v-model.number="targetWeight" type="number" class="input target-input" :placeholder="`e.g. ${result.idealWeight.ideal}`" min="20" max="300" step="0.1" @keydown.enter="computeTarget"/>
                <span class="target-unit">kg</span>
              </div>
              <button class="target-btn" @click="computeTarget" :disabled="!targetWeight">{{ t.analyzeTarget }}</button>
            </div>
            <div class="target-pills">
              <button v-for="pill in targetSuggestions" :key="pill.label" class="target-pill" :class="{active:targetWeight===pill.val}" @click="setTargetPill(pill.val)">{{ pill.label }} ({{ pill.val }} kg)</button>
            </div>
            <transition name="fade-slide">
              <div v-if="targetResult" class="target-result">
                <div class="target-bmi-bar" :style="{background:targetResult.category.colorLight,borderColor:targetResult.category.color+'55'}">
                  <div class="target-bmi-left">
                    <div class="target-bmi-num" :style="{color:targetResult.category.color}">{{ targetResult.bmi }}</div>
                    <div class="target-bmi-cat" :style="{color:targetResult.category.color}">{{ targetResult.category.label }}</div>
                  </div>
                  <div class="target-bmi-right">
                    <div class="tbi-row"><span>{{ t.weightChange }}</span><strong :style="{color:targetResult.diff>0?'#ea580c':targetResult.diff<0?'#3b82f6':'#16a34a'}">{{ targetResult.diff>0?'+':'' }}{{ targetResult.diff }} kg</strong></div>
                    <div class="tbi-row"><span>{{ t.bmiChange }}</span><strong>{{ result.bmi }} → {{ targetResult.bmi }}</strong></div>
                    <div class="tbi-row" v-if="targetResult.warning"><span style="color:#ea580c">⚠ {{ targetResult.warning }}</span></div>
                  </div>
                </div>
                <div class="timeline-grid">
                  <div v-for="plan in targetResult.plans" :key="plan.rate" class="timeline-card" :class="{recommended:plan.recommended}">
                    <div v-if="plan.recommended" class="rec-badge">{{ t.recommended }}</div>
                    <div class="tl-rate">{{ plan.rateLabel }}</div>
                    <div class="tl-duration">{{ plan.duration }}</div>
                    <div class="tl-cal">{{ plan.dailyCal.toLocaleString() }} {{ t.kcalPerDay }}</div>
                    <div class="tl-deficit">{{ plan.deficitLabel }}</div>
                    <div class="tl-target-date">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>
                      {{ t.estimatedDate }} {{ plan.targetDate }}
                    </div>
                  </div>
                </div>
                <div class="target-tips">
                  <div class="tips-title">{{ t.tipsTitle }}</div>
                  <ul class="tips-list"><li v-for="tip in targetResult.tips" :key="tip">{{ tip }}</li></ul>
                </div>
              </div>
            </transition>
          </section>

          <div class="cta-row">
            <button class="calc-btn" @click="scrollToTop">
              <span>{{ t.recalculate }}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8a6 6 0 1 0 1.1-3.4M2 2v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </template>
      </div>
    </main>

    <footer class="footer"><div class="container"><p>{{ t.footerText }}</p></div></footer>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useBMI } from './composables/useBMI.js'
import { translations } from './i18n.js'
import BMIGauge from './components/BMIGauge.vue'
import BMIScale from './components/BMIScale.vue'
import MacroChart from './components/MacroChart.vue'

const { calculate, getBMICategory } = useBMI()

const locale = ref('en')
const t = computed(() => translations[locale.value])
function setLocale(l) {
  locale.value = l
}

watch(locale, (newLocale) => {
  if (result.value) {
    result.value = calculate({
      weight: form.value.weight, height: form.value.height,
      age: form.value.age, gender: form.value.gender,
      activity: form.value.activity, locale: newLocale,
    })
  }
  if (targetResult.value && targetWeight.value) {
    const hM = form.value.height / 100
    const targetBmi = parseFloat((targetWeight.value / (hM * hM)).toFixed(1))
    targetResult.value = { ...targetResult.value, category: getBMICategory(targetBmi, newLocale) }
  }
})

const form = ref({ gender: 'male', height: null, weight: null, age: null, activity: 'moderate' })
const errors = ref({ height: '', weight: '', age: '' })
const result = ref(null)

function validateHeight() { const v = form.value.height; errors.value.height = v && (v < 100 || v > 250) ? t.value.errHeight : '' }
function validateWeight() { const v = form.value.weight; errors.value.weight = v && (v < 20 || v > 300) ? t.value.errWeight : '' }
function validateAge()    { const v = form.value.age;    errors.value.age    = v && (v < 10 || v > 100) ? t.value.errAge    : '' }

const isFormValid = computed(() => {
  const { height, weight, age } = form.value
  return height >= 100 && height <= 250 && weight >= 20 && weight <= 300 &&
    age >= 10 && age <= 100 && !errors.value.height && !errors.value.weight && !errors.value.age
})

const isLoading = ref(false)
const loadingPct = ref(0)
const loadingStepIdx = ref(0)
const loadingStepText = computed(() => {
  const steps = t.value.loadingSteps
  return steps[Math.min(loadingStepIdx.value, steps.length - 1)] || ''
})

function handleCalculate() {
  if (!isFormValid.value) return
  isLoading.value = true; loadingPct.value = 0; loadingStepIdx.value = 0
  const stepsCount = t.value.loadingSteps.length
  let tick = 0
  const timer = setInterval(() => {
    tick++
    loadingPct.value = tick
    loadingStepIdx.value = Math.min(Math.floor(tick / (100 / stepsCount)), stepsCount - 1)
    if (tick >= 100) {
      clearInterval(timer)
      result.value = calculate({ weight: form.value.weight, height: form.value.height, age: form.value.age, gender: form.value.gender, activity: form.value.activity, locale: locale.value })
      targetWeight.value = null; targetResult.value = null
      setTimeout(() => {
        isLoading.value = false
        setTimeout(() => { const el = document.querySelector('.result-panel'); if (el && window.innerWidth < 900) el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }, 100)
      }, 250)
    }
  }, 20)
}

function handleReset() {
  form.value = { gender: 'male', height: null, weight: null, age: null, activity: 'moderate' }
  errors.value = { height: '', weight: '', age: '' }
  result.value = null; targetWeight.value = null; targetResult.value = null
}
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }) }

const targetWeight = ref(null)
const targetResult = ref(null)
const targetSuggestions = computed(() => {
  if (!result.value) return []
  const ideal = result.value.idealWeight.ideal, curr = form.value.weight
  const items = [{ label: t.value.idealBB, val: parseFloat(ideal.toFixed(1)) }]
  if (curr < ideal - 3) { items.push({ label: '+5 kg', val: parseFloat((curr+5).toFixed(1)) }); items.push({ label: '+10 kg', val: parseFloat((curr+10).toFixed(1)) }) }
  if (curr > ideal + 3) { items.push({ label: '-5 kg', val: parseFloat((curr-5).toFixed(1)) }); items.push({ label: '-10 kg', val: parseFloat((curr-10).toFixed(1)) }) }
  return items
})

function setTargetPill(val) { targetWeight.value = val; computeTarget() }
function computeTarget() {
  if (!targetWeight.value || !result.value) return
  const tw = parseFloat(targetWeight.value); if (tw < 20 || tw > 300) return
  const hM = form.value.height / 100
  const targetBmi = parseFloat((tw / (hM * hM)).toFixed(1))
  const category = getBMICategory(targetBmi, locale.value)
  const diff = parseFloat((tw - form.value.weight).toFixed(1))
  const absDiff = Math.abs(diff), isGain = diff > 0, tdee = result.value.tdee
  const tr = t.value
  let warning = ''
  if (targetBmi < 18.5) warning = tr.warningBelow
  else if (targetBmi >= 25) warning = tr.warningAbove
  if (tw === form.value.weight) warning = tr.warningEqual
  const rateOpts = [
    { rate: 0.25, labelKey: 'slow',     recommended: false },
    { rate: 0.5,  labelKey: 'moderate', recommended: true  },
    { rate: 1.0,  labelKey: 'fast',     recommended: false },
  ]
  const dateLocale = locale.value === 'id' ? 'id-ID' : 'en-US'
  const plans = rateOpts.map(opt => {
    const dc = Math.round((opt.rate * 7700) / 7)
    const dailyCal = isGain ? tdee + dc : tdee - dc
    const weeks = Math.ceil(absDiff / opt.rate)
    const d = new Date(); d.setDate(d.getDate() + weeks * 7)
    const dateStr = d.toLocaleDateString(dateLocale, { day: 'numeric', month: 'long', year: 'numeric' })
    const months = Math.floor(weeks / 4.33), remW = Math.round(weeks % 4.33)
    const duration = months > 0 ? `${months} ${tr.months}${remW > 0 ? ` ${remW} ${tr.weeks}` : ''}` : `${weeks} ${tr.weeks}`
    const rateLabel = `${tr[opt.labelKey]} · ${opt.rate} kg${tr.perWeek}`
    const deficitLabel = isGain ? `${tr.surplus} +${dc} ${tr.kcalPerDay}` : `${tr.deficit} -${dc} ${tr.kcalPerDay}`
    return { ...opt, rateLabel, dailyCal, deficitLabel, duration, targetDate: dateStr }
  })
  const gainTips = [tr.tipGain1, tr.tipGain2, tr.tipGain3, tr.tipGain4, tr.tipGain5, tr.tipGain6]
  const loseTips = [tr.tipLose1, tr.tipLose2, tr.tipLose3, tr.tipLose4, tr.tipLose5, tr.tipLose6]
  targetResult.value = { bmi: targetBmi, category, diff, warning, plans, tips: isGain ? gainTips : loseTips }
}

const quickStats = computed(() => {
  if (!result.value) return []
  const r = result.value, tr = t.value
  return [
    { label: tr.bmr,             value: r.bmr.toLocaleString(),       sub: tr.kcalPerDay,    color: null },
    { label: tr.tdee,            value: r.tdee.toLocaleString(),      sub: tr.kcalPerDay,    color: null },
    { label: tr.bodyFatEstimate, value: r.bodyFat + '%',              sub: tr.estimate,      color: null },
    { label: tr.idealWeight,     value: r.idealWeight.ideal + ' kg', sub: tr.devineFormula, color: '#16a34a' },
  ]
})
</script>

<style scoped>
.app{min-height:100vh;display:flex;flex-direction:column}.container{max-width:1100px;margin:0 auto;padding:0 20px}
.loading-overlay{position:fixed;inset:0;z-index:9999;background:rgba(248,247,244,0.92);backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center}
.loading-card{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);padding:44px 52px;text-align:center;box-shadow:var(--shadow-lg);min-width:280px;max-width:360px;width:90vw}
.loading-icon-wrap{position:relative;width:70px;height:70px;margin:0 auto 22px}
.loading-spin{animation:spin 1.1s linear infinite;position:absolute;inset:0;width:100%;height:100%}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-inner-icon{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
.loading-step{font-size:14px;font-weight:500;color:var(--color-text-muted);margin-bottom:20px;min-height:22px}
.loading-bar-wrap{width:100%;height:5px;background:var(--color-border);border-radius:3px;overflow:hidden;margin-bottom:10px}
.loading-bar-fill{height:100%;background:linear-gradient(90deg,#16a34a,#22c55e);border-radius:3px;transition:width 0.05s linear}
.loading-pct{font-family:var(--font-display);font-size:13px;color:var(--color-text-faint)}
.overlay-fade-enter-active{transition:opacity 0.2s}.overlay-fade-leave-active{transition:opacity 0.35s 0.1s}
.overlay-fade-enter-from,.overlay-fade-leave-to{opacity:0}
.header{background:var(--color-surface);border-bottom:1px solid var(--color-border);position:sticky;top:0;z-index:100;backdrop-filter:blur(8px)}
.header-inner{display:flex;align-items:center;justify-content:space-between;padding:12px 0}
.logo{display:flex;align-items:center;gap:10px;flex-shrink:0}
.logo-text{font-family:var(--font-display);font-size:1.25rem;font-weight:600;color:var(--color-text)}
.logo-text em{color:var(--color-green);font-style:italic}
.header-right{display:flex;align-items:center;gap:14px}
.header-tagline{font-size:12px;color:var(--color-text-faint)}
@media(max-width:520px){.header-tagline{display:none}}
.lang-toggle{display:flex;background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:10px;padding:3px;gap:2px}
.lang-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;background:transparent;border:none;border-radius:8px;font-family:var(--font-body);font-size:12px;font-weight:700;color:var(--color-text-faint);cursor:pointer;transition:all 0.18s;letter-spacing:0.04em;white-space:nowrap}
.lang-btn.active{background:var(--color-surface);color:var(--color-text);box-shadow:0 1px 4px rgba(0,0,0,0.1)}
.lang-btn:hover:not(.active){color:var(--color-text)}
.lang-flag{font-size:14px;line-height:1}
.hero{text-align:center;padding:48px 0 40px}
.hero-title{font-family:var(--font-display);font-size:clamp(2rem,5vw,3rem);font-weight:600;line-height:1.15;color:var(--color-text);margin-bottom:14px}
.hero-title em{color:var(--color-green);font-style:italic}
.hero-sub{font-size:15px;color:var(--color-text-muted);max-width:520px;margin:0 auto;line-height:1.7}
.layout{display:grid;grid-template-columns:400px 1fr;gap:24px;align-items:start}
@media(max-width:900px){.layout{grid-template-columns:1fr}}
.panel{background:var(--color-surface);border-radius:var(--radius-xl);border:1px solid var(--color-border);padding:28px;box-shadow:var(--shadow-sm)}
.panel-title{font-family:var(--font-display);font-size:1.1rem;font-weight:600;margin-bottom:24px;color:var(--color-text)}
.field{margin-bottom:20px}
.field-label{display:flex;align-items:center;justify-content:space-between;font-size:12px;font-weight:600;color:var(--color-text-muted);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.04em;white-space:nowrap;gap:6px}
.field-label-text{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.field-unit{font-size:11px;font-weight:500;background:var(--color-surface-2);color:var(--color-text-faint);padding:2px 8px;border-radius:100px;text-transform:none;letter-spacing:0;flex-shrink:0}
.field-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:400px){.field-row{grid-template-columns:1fr}}
.input{width:100%;padding:11px 14px;font-size:15px;font-family:var(--font-body);font-weight:500;background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text);outline:none;transition:border-color 0.2s,box-shadow 0.2s;-moz-appearance:textfield}
.input::-webkit-inner-spin-button,.input::-webkit-outer-spin-button{-webkit-appearance:none;margin:0}
.input:focus{border-color:var(--color-green);box-shadow:0 0 0 3px rgba(22,163,74,0.12)}
.input::placeholder{color:var(--color-text-faint);font-weight:400}
.field-error{font-size:11px;color:var(--color-red);margin-top:4px;display:block}
.field-hint{font-size:12px;color:var(--color-text-faint);margin-top:6px}
.gender-toggle{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.gender-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:12px;background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-size:14px;font-weight:500;color:var(--color-text-muted);transition:all 0.2s}
.gender-btn:hover{border-color:var(--color-green);color:var(--color-green)}
.gender-btn.active{border-color:var(--color-green);background:var(--color-green-light);color:var(--color-green-dark)}
.gender-icon{font-size:18px}
.select-wrapper{position:relative}
.select{width:100%;padding:11px 40px 11px 14px;font-size:14px;font-family:var(--font-body);background:var(--color-bg);border:1.5px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-text);outline:none;appearance:none;cursor:pointer;transition:border-color 0.2s}
.select:focus{border-color:var(--color-green);box-shadow:0 0 0 3px rgba(22,163,74,0.12)}
.select-arrow{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--color-text-faint);pointer-events:none}
.calc-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:14px 24px;background:var(--color-green);color:white;border:none;border-radius:var(--radius-md);font-family:var(--font-body);font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s}
.calc-btn:hover:not(:disabled){background:#15803d;transform:translateY(-1px);box-shadow:0 4px 16px rgba(22,163,74,0.3)}
.calc-btn:disabled{opacity:0.45;cursor:not-allowed;transform:none;box-shadow:none}
.reset-btn{width:100%;margin-top:10px;padding:10px;background:transparent;border:1px solid var(--color-border);border-radius:var(--radius-md);cursor:pointer;font-family:var(--font-body);font-size:13px;color:var(--color-text-muted);transition:all 0.2s}
.reset-btn:hover{border-color:var(--color-red);color:var(--color-red)}
.gender-note{display:flex;align-items:flex-start;gap:8px;margin-top:16px;padding:12px 14px;background:var(--color-surface-2);border-radius:var(--radius-md);font-size:12px;color:var(--color-text-muted);line-height:1.5}
.result-panel{min-height:300px}
.empty-state{display:flex;flex-direction:column;align-items:center;justify-content:center;height:260px;gap:16px}
.empty-text{text-align:center;font-size:14px;color:var(--color-text-faint);line-height:1.8}
.result-section{margin-bottom:24px}
.result-section:last-child{margin-bottom:0}
.section-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--color-text-faint);margin-bottom:14px}
.gauge-section{display:flex;justify-content:center}
.stats-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
.stat-card{padding:14px 16px;background:var(--color-surface-2);border-radius:var(--radius-md);border:1px solid var(--color-border)}
.stat-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:var(--color-text-faint);margin-bottom:4px}
.stat-val{font-family:var(--font-display);font-size:1.3rem;font-weight:600;line-height:1.2}
.stat-sub{font-size:11px;color:var(--color-text-faint);margin-top:2px}
.detail-section{background:var(--color-surface);border:1px solid var(--color-border);border-radius:var(--radius-xl);padding:28px;margin-top:24px;box-shadow:var(--shadow-sm)}
.section-header{display:flex;align-items:center;gap:14px;margin-bottom:24px}
.section-icon{width:44px;height:44px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.section-title{font-family:var(--font-display);font-size:1.15rem;font-weight:600;margin-bottom:2px}
.section-desc{font-size:13px;color:var(--color-text-muted)}
.calorie-hero{display:grid;grid-template-columns:auto 1fr;gap:28px;align-items:start;padding:20px;background:var(--color-surface-2);border-radius:var(--radius-lg);margin-bottom:24px}
@media(max-width:600px){.calorie-hero{grid-template-columns:1fr}}
.calorie-main{text-align:center;padding:8px 0}
.calorie-number{font-family:var(--font-display);font-size:3rem;font-weight:600;color:var(--color-green);line-height:1}
.calorie-unit{font-size:13px;color:var(--color-text-muted);margin-top:4px}
.calorie-breakdown{display:flex;flex-direction:column;gap:10px}
.calorie-row{display:flex;justify-content:space-between;align-items:center;font-size:13px;padding:8px 0;border-bottom:1px solid var(--color-border)}
.calorie-row:last-child{border-bottom:none}
.calorie-row.target strong{color:var(--color-green)}
.calorie-row span{color:var(--color-text-muted)}
.macro-section{}
.macro-title{font-size:11px;font-weight:600;color:var(--color-text-muted);margin-bottom:16px;text-transform:uppercase;letter-spacing:0.04em}
.water-row{display:flex;align-items:center;gap:10px;margin-top:18px;padding:12px 16px;background:#eff6ff;border-radius:var(--radius-md);font-size:14px}
.water-icon{font-size:20px}
.water-row strong{font-weight:600;margin-right:8px}
.two-col-section{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:24px}
@media(max-width:700px){.two-col-section{grid-template-columns:1fr}}
.risks-list{display:flex;flex-direction:column;gap:12px}
.risk-item{display:flex;align-items:flex-start;gap:12px;padding:12px;background:var(--color-surface-2);border-radius:var(--radius-md);border:1px solid var(--color-border)}
.risk-icon{font-size:20px;flex-shrink:0;line-height:1;margin-top:2px}
.risk-name{font-size:14px;font-weight:600}
.risk-desc{font-size:12px;color:var(--color-text-muted);margin-top:2px}
.supplements-list{display:flex;flex-direction:column;gap:10px;margin-bottom:16px}
.supplement-item{padding:12px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:var(--radius-md)}
.sup-name{font-size:14px;font-weight:600;color:#14532d}
.sup-reason{font-size:12px;color:#166534;margin-top:3px}
.disclaimer{display:flex;align-items:flex-start;gap:6px;font-size:11px;color:var(--color-text-faint);padding:10px;background:var(--color-surface-2);border-radius:var(--radius-sm)}
.ideal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
@media(max-width:600px){.ideal-grid{grid-template-columns:1fr}}
.ideal-item{text-align:center;padding:20px 16px}
.ideal-label{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:var(--color-text-faint);margin-bottom:8px}
.ideal-val{font-family:var(--font-display);font-size:2rem;font-weight:600;color:var(--color-text);line-height:1}
.ideal-val small{font-size:1rem;color:var(--color-text-muted)}
.ideal-sub{font-size:12px;color:var(--color-text-muted);margin-top:6px}
.target-input-row{display:flex;gap:12px;align-items:stretch;margin-bottom:14px}
@media(max-width:560px){.target-input-row{flex-direction:column}.target-btn{width:100%;padding:15px 24px;font-size:15px;min-height:52px}}
.target-input-wrap{position:relative;flex:1}
.target-input{padding-right:42px;font-family:var(--font-display);font-size:1.1rem;font-weight:600}
.target-unit{position:absolute;right:14px;top:50%;transform:translateY(-50%);font-size:13px;color:var(--color-text-faint);pointer-events:none}
.target-btn{padding:0 22px;min-height:48px;background:#fef9c3;border:1.5px solid #fde047;border-radius:var(--radius-md);font-family:var(--font-body);font-size:14px;font-weight:600;color:#854d0e;cursor:pointer;white-space:nowrap;transition:all 0.2s}
.target-btn:hover:not(:disabled){background:#fef08a;transform:translateY(-1px)}
.target-btn:disabled{opacity:0.4;cursor:not-allowed}
.target-pills{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px}
.target-pill{padding:5px 14px;background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:100px;font-size:12px;font-weight:500;color:var(--color-text-muted);cursor:pointer;transition:all 0.18s}
.target-pill:hover{border-color:#ca8a04;color:#92400e;background:#fef9c3}
.target-pill.active{background:#fef9c3;border-color:#fde047;color:#854d0e;font-weight:600}
.fade-slide-enter-active{transition:opacity 0.35s ease,transform 0.35s ease}
.fade-slide-leave-active{transition:opacity 0.2s ease}
.fade-slide-enter-from{opacity:0;transform:translateY(10px)}
.fade-slide-leave-to{opacity:0}
.target-bmi-bar{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding:16px 20px;border:1px solid;border-radius:var(--radius-lg);margin-bottom:18px}
.target-bmi-left{text-align:center}
.target-bmi-num{font-family:var(--font-display);font-size:2.2rem;font-weight:600;line-height:1}
.target-bmi-cat{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;margin-top:4px}
.target-bmi-right{flex:1;display:flex;flex-direction:column;gap:8px}
.tbi-row{display:flex;justify-content:space-between;font-size:13px;padding:6px 0;border-bottom:1px solid var(--color-border)}
.tbi-row:last-child{border-bottom:none}
.tbi-row span{color:var(--color-text-muted)}
.timeline-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}
@media(max-width:640px){.timeline-grid{grid-template-columns:1fr}}
.timeline-card{position:relative;padding:18px 16px;background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:var(--radius-lg)}
.timeline-card.recommended{background:#f0fdf4;border:2px solid #86efac}
.rec-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:#16a34a;color:white;font-size:10px;font-weight:700;letter-spacing:0.05em;padding:3px 10px;border-radius:100px;white-space:nowrap}
.tl-rate{font-size:11px;font-weight:600;color:var(--color-text-faint);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:8px}
.tl-duration{font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--color-text);line-height:1.1;margin-bottom:8px}
.tl-cal{font-size:13px;font-weight:600;margin-bottom:3px}
.tl-deficit{font-size:11px;color:var(--color-text-faint);margin-bottom:10px}
.tl-target-date{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--color-text-muted);padding-top:10px;border-top:1px solid var(--color-border)}
.target-tips{background:var(--color-surface-2);border:1px solid var(--color-border);border-radius:var(--radius-lg);padding:18px 20px}
.tips-title{font-size:13px;font-weight:600;margin-bottom:12px}
.tips-list{list-style:none;display:flex;flex-direction:column;gap:8px}
.tips-list li{display:flex;align-items:flex-start;gap:8px;font-size:13px;color:var(--color-text-muted);line-height:1.5}
.tips-list li::before{content:'→';color:var(--color-green);font-weight:700;flex-shrink:0;margin-top:1px}
.cta-row{display:flex;justify-content:center;padding:32px 0 40px}
.cta-row .calc-btn{width:auto;padding:14px 32px}
.footer{margin-top:auto;border-top:1px solid var(--color-border);padding:20px 0;text-align:center;font-size:12px;color:var(--color-text-faint)}
.has-result{animation:fadeIn 0.4s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
</style>
