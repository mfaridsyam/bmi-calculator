<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="container">
        <div class="header-inner">
          <div class="logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="10" fill="#16a34a"/>
              <path d="M8 22 L12 12 L16 19 L19 15 L24 22" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
            </svg>
            <span class="logo-text">BMI<em>calc</em></span>
          </div>
          <div class="header-tagline">Kalkulator Indeks Massa Tubuh</div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">

        <!-- Hero -->
        <section class="hero">
          <h1 class="hero-title">Cek <em>Kesehatan</em><br>Berat Badanmu</h1>
          <p class="hero-sub">Analisis BMI lengkap dengan kebutuhan kalori, risiko penyakit, dan rekomendasi nutrisi berdasarkan gender & aktivitas.</p>
        </section>

        <!-- Two column layout -->
        <div class="layout">

          <!-- ── INPUT PANEL ── -->
          <div class="panel input-panel">
            <h2 class="panel-title">Data Diri</h2>

            <!-- Gender -->
            <div class="field">
              <label class="field-label">Jenis Kelamin</label>
              <div class="gender-toggle">
                <button
                  class="gender-btn"
                  :class="{ active: form.gender === 'male' }"
                  @click="form.gender = 'male'"
                >
                  <span class="gender-icon">♂</span>
                  <span>Laki-laki</span>
                </button>
                <button
                  class="gender-btn"
                  :class="{ active: form.gender === 'female' }"
                  @click="form.gender = 'female'"
                >
                  <span class="gender-icon">♀</span>
                  <span>Perempuan</span>
                </button>
              </div>
            </div>

            <!-- Height & Weight -->
            <div class="field-row">
              <div class="field">
                <label class="field-label" for="height">
                  Tinggi Badan
                  <span class="field-unit">cm</span>
                </label>
                <input
                  id="height"
                  v-model.number="form.height"
                  type="number"
                  class="input"
                  placeholder="cth: 170"
                  min="100"
                  max="250"
                  @input="validateHeight"
                />
                <span v-if="errors.height" class="field-error">{{ errors.height }}</span>
              </div>
              <div class="field">
                <label class="field-label" for="weight">
                  Berat Badan
                  <span class="field-unit">kg</span>
                </label>
                <input
                  id="weight"
                  v-model.number="form.weight"
                  type="number"
                  class="input"
                  placeholder="cth: 65"
                  min="20"
                  max="300"
                  step="0.1"
                  @input="validateWeight"
                />
                <span v-if="errors.weight" class="field-error">{{ errors.weight }}</span>
              </div>
            </div>

            <!-- Age -->
            <div class="field">
              <label class="field-label" for="age">
                Usia
                <span class="field-unit">tahun</span>
              </label>
              <input
                id="age"
                v-model.number="form.age"
                type="number"
                class="input"
                placeholder="cth: 25"
                min="10"
                max="100"
                @input="validateAge"
              />
              <span v-if="errors.age" class="field-error">{{ errors.age }}</span>
            </div>

            <!-- Activity -->
            <div class="field">
              <label class="field-label" for="activity">
                Tingkat Aktivitas
              </label>
              <div class="select-wrapper">
                <select id="activity" v-model="form.activity" class="select">
                  <option v-for="(act, key) in activityMultipliers" :key="key" :value="key">
                    {{ act.label }} — {{ act.desc }}
                  </option>
                </select>
                <svg class="select-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <p class="field-hint">
                Aktivitas fisik memengaruhi kebutuhan kalori harianmu (TDEE).
              </p>
            </div>

            <!-- Calculate button -->
            <button class="calc-btn" @click="handleCalculate" :disabled="!isFormValid">
              <span>Hitung BMI Saya</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M9 3l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button v-if="result" class="reset-btn" @click="handleReset">
              Reset
            </button>

            <!-- Gender note -->
            <div v-if="result" class="gender-note">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                <path d="M8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
              {{ result.genderNote }}
            </div>

          </div>

          <!-- ── RESULT PANEL ── -->
          <div class="panel result-panel" :class="{ 'has-result': !!result }">

            <!-- Empty state -->
            <div v-if="!result" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="22" stroke="#d4d0c8" stroke-width="2"/>
                  <path d="M14 28 Q19 18 24 24 Q29 30 34 20" stroke="#d4d0c8" stroke-width="2" stroke-linecap="round" fill="none"/>
                </svg>
              </div>
              <p class="empty-text">Isi data di sebelah kiri,<br>lalu tekan <strong>Hitung BMI Saya</strong></p>
            </div>

            <!-- Results -->
            <template v-else>

              <!-- Gauge -->
              <div class="result-section gauge-section">
                <BMIGauge :bmi="result.bmi" :category="result.category" />
              </div>

              <!-- Scale bar -->
              <div class="result-section">
                <p class="section-label">Posisi pada Skala BMI</p>
                <BMIScale :bmi="result.bmi" :category="result.category" />
              </div>

              <!-- Quick stats -->
              <div class="result-section stats-grid">
                <div class="stat-card" v-for="stat in quickStats" :key="stat.label">
                  <div class="stat-label">{{ stat.label }}</div>
                  <div class="stat-val" :style="stat.color ? { color: stat.color } : {}">
                    {{ stat.value }}
                  </div>
                  <div class="stat-sub">{{ stat.sub }}</div>
                </div>
              </div>

            </template>
          </div>
        </div>

        <!-- ── DETAIL SECTIONS (full-width below) ── -->
        <template v-if="result">

          <!-- Calorie & Nutrition -->
          <section class="detail-section">
            <div class="section-header">
              <div class="section-icon" style="background:#dbeafe;color:#2563eb">🔥</div>
              <div>
                <h2 class="section-title">Kebutuhan Kalori Harian</h2>
                <p class="section-desc">{{ result.calorieGoal.goal }}</p>
              </div>
            </div>

            <div class="calorie-hero">
              <div class="calorie-main">
                <div class="calorie-number">{{ result.calorieGoal.cal.toLocaleString('id-ID') }}</div>
                <div class="calorie-unit">kcal / hari</div>
              </div>
              <div class="calorie-breakdown">
                <div class="calorie-row">
                  <span>BMR (Basal Metabolic Rate)</span>
                  <strong>{{ result.bmr.toLocaleString('id-ID') }} kcal</strong>
                </div>
                <div class="calorie-row">
                  <span>TDEE (dengan aktivitas)</span>
                  <strong>{{ result.tdee.toLocaleString('id-ID') }} kcal</strong>
                </div>
                <div class="calorie-row target">
                  <span>Target kalori harianmu</span>
                  <strong>{{ result.calorieGoal.cal.toLocaleString('id-ID') }} kcal</strong>
                </div>
              </div>
            </div>

            <div class="macro-section">
              <h3 class="macro-title">Distribusi Makronutrien</h3>
              <MacroChart :macros="result.macros" :targetCal="result.calorieGoal.cal" />
              <div class="water-row">
                <span class="water-icon">💧</span>
                <div>
                  <strong>Kebutuhan Air</strong>
                  <span>{{ (result.macros.water.ml / 1000).toFixed(1) }} liter / hari</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Health Risks & Supplements -->
          <div class="two-col-section">

            <!-- Risks -->
            <section class="detail-section" :style="{ borderTop: `3px solid ${result.category.color}` }">
              <div class="section-header">
                <div class="section-icon" :style="{ background: result.category.colorLight, color: result.category.color }">⚕️</div>
                <div>
                  <h2 class="section-title">Risiko Kesehatan</h2>
                  <p class="section-desc">Berdasarkan kategori <strong>{{ result.category.label }}</strong></p>
                </div>
              </div>
              <div class="risks-list">
                <div v-for="risk in result.risks.diseases" :key="risk.name" class="risk-item">
                  <span class="risk-icon">{{ risk.icon }}</span>
                  <div class="risk-body">
                    <div class="risk-name">{{ risk.name }}</div>
                    <div class="risk-desc">{{ risk.desc }}</div>
                  </div>
                </div>
              </div>
            </section>

            <!-- Supplements -->
            <section class="detail-section">
              <div class="section-header">
                <div class="section-icon" style="background:#f0fdf4;color:#16a34a">💊</div>
                <div>
                  <h2 class="section-title">Vitamin & Suplemen</h2>
                  <p class="section-desc">Rekomendasi untuk kondisimu</p>
                </div>
              </div>
              <div class="supplements-list">
                <div v-for="sup in result.risks.supplements" :key="sup.name" class="supplement-item">
                  <div class="sup-name">{{ sup.name }}</div>
                  <div class="sup-reason">{{ sup.reason }}</div>
                </div>
              </div>
              <div class="disclaimer">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="1.5"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                Selalu konsultasikan suplemen dengan dokter atau ahli gizi sebelum mengonsumsinya.
              </div>
            </section>

          </div>

          <!-- Ideal Weight Summary -->
          <section class="detail-section ideal-section">
            <div class="ideal-grid">
              <div class="ideal-item">
                <div class="ideal-label">Berat Badan Ideal</div>
                <div class="ideal-val">{{ result.idealWeight.min }}–{{ result.idealWeight.max }} <small>kg</small></div>
                <div class="ideal-sub">Formula Devine untuk {{ form.gender === 'male' ? 'laki-laki' : 'perempuan' }}</div>
              </div>
              <div class="ideal-item">
                <div class="ideal-label">Estimasi Lemak Tubuh</div>
                <div class="ideal-val">{{ result.bodyFat }}<small>%</small></div>
                <div class="ideal-sub">{{ form.gender === 'male' ? 'Normal pria: 8–20%' : 'Normal wanita: 21–33%' }}</div>
              </div>
              <div class="ideal-item">
                <div class="ideal-label">{{ result.weightDiff >= 0 ? 'Perlu Turun' : 'Perlu Naik' }}</div>
                <div class="ideal-val"
                  :style="{ color: result.weightDiff > 2 ? '#ea580c' : result.weightDiff < -2 ? '#3b82f6' : '#16a34a' }"
                >
                  {{ Math.abs(result.weightDiff) }}<small>kg</small>
                </div>
                <div class="ideal-sub">
                  {{ Math.abs(result.weightDiff) <= 2 ? 'Sudah mendekati ideal ✓' : `Untuk mencapai ${result.idealWeight.ideal} kg` }}
                </div>
              </div>
            </div>
          </section>

          <!-- Recalculate CTA -->
          <div class="cta-row">
            <button class="calc-btn" @click="scrollToTop">
              <span>Hitung Ulang</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 8a6 6 0 1 0 1.1-3.4M2 2v4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>

        </template>

      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>© 2025 BMIcalc · Dibuat untuk tujuan edukasi. Bukan pengganti saran medis profesional.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBMI } from './composables/useBMI.js'
import BMIGauge from './components/BMIGauge.vue'
import BMIScale from './components/BMIScale.vue'
import MacroChart from './components/MacroChart.vue'

const { calculate, activityMultipliers } = useBMI()

const form = ref({
  gender: 'male',
  height: null,
  weight: null,
  age: null,
  activity: 'moderate',
})

const errors = ref({ height: '', weight: '', age: '' })
const result = ref(null)

function validateHeight() {
  const v = form.value.height
  if (!v) { errors.value.height = ''; return }
  if (v < 100 || v > 250) errors.value.height = 'Tinggi harus antara 100–250 cm'
  else errors.value.height = ''
}
function validateWeight() {
  const v = form.value.weight
  if (!v) { errors.value.weight = ''; return }
  if (v < 20 || v > 300) errors.value.weight = 'Berat harus antara 20–300 kg'
  else errors.value.weight = ''
}
function validateAge() {
  const v = form.value.age
  if (!v) { errors.value.age = ''; return }
  if (v < 10 || v > 100) errors.value.age = 'Usia harus antara 10–100 tahun'
  else errors.value.age = ''
}

const isFormValid = computed(() => {
  const { height, weight, age } = form.value
  return (
    height >= 100 && height <= 250 &&
    weight >= 20 && weight <= 300 &&
    age >= 10 && age <= 100 &&
    !errors.value.height && !errors.value.weight && !errors.value.age
  )
})

function handleCalculate() {
  if (!isFormValid.value) return
  result.value = calculate({
    weight: form.value.weight,
    height: form.value.height,
    age: form.value.age,
    gender: form.value.gender,
    activity: form.value.activity,
  })
  // Scroll to results on mobile
  setTimeout(() => {
    const el = document.querySelector('.result-panel')
    if (el && window.innerWidth < 900) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, 100)
}

function handleReset() {
  form.value = { gender: 'male', height: null, weight: null, age: null, activity: 'moderate' }
  errors.value = { height: '', weight: '', age: '' }
  result.value = null
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const quickStats = computed(() => {
  if (!result.value) return []
  const r = result.value
  return [
    { label: 'BMR',           value: r.bmr.toLocaleString('id-ID'),  sub: 'kcal/hari',     color: null },
    { label: 'TDEE',          value: r.tdee.toLocaleString('id-ID'), sub: 'kcal/hari',     color: null },
    { label: 'Lemak Tubuh',   value: r.bodyFat + '%',                sub: 'Estimasi',      color: null },
    { label: 'BB Ideal',      value: r.idealWeight.ideal + ' kg',    sub: 'Formula Devine',color: '#16a34a' },
  ]
})
</script>

<style scoped>
/* ── Layout ─────────────────────────────── */
.app { min-height: 100vh; display: flex; flex-direction: column; }
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* ── Header ─────────────────────────────── */
.header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky; top: 0; z-index: 100;
  backdrop-filter: blur(8px);
}
.header-inner {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 0;
}
.logo { display: flex; align-items: center; gap: 10px; }
.logo-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
}
.logo-text em { color: var(--color-green); font-style: italic; }
.header-tagline { font-size: 12px; color: var(--color-text-faint); }
@media (max-width: 480px) { .header-tagline { display: none; } }

/* ── Hero ─────────────────────────────── */
.hero {
  text-align: center;
  padding: 48px 0 40px;
}
.hero-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 600;
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: 14px;
}
.hero-title em { color: var(--color-green); font-style: italic; }
.hero-sub {
  font-size: 15px;
  color: var(--color-text-muted);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.7;
}

/* ── Two-col layout ─────────────────────── */
.layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 24px;
  align-items: start;
}
@media (max-width: 900px) {
  .layout { grid-template-columns: 1fr; }
}

/* ── Panels ─────────────────────────────── */
.panel {
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border: 1px solid var(--color-border);
  padding: 28px;
  box-shadow: var(--shadow-sm);
}
.panel-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--color-text);
}

/* ── Form ─────────────────────────────── */
.field { margin-bottom: 20px; }
.field-label {
  display: flex; align-items: center; justify-content: space-between;
  font-size: 13px; font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: 8px;
  text-transform: uppercase; letter-spacing: 0.04em;
}
.field-unit {
  font-size: 11px; font-weight: 500;
  background: var(--color-surface-2);
  color: var(--color-text-faint);
  padding: 2px 8px; border-radius: 100px;
  text-transform: none; letter-spacing: 0;
}
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.input {
  width: 100%;
  padding: 11px 14px;
  font-size: 15px;
  font-family: var(--font-body);
  font-weight: 500;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  -moz-appearance: textfield;
}
.input::-webkit-inner-spin-button,
.input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
.input:focus {
  border-color: var(--color-green);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
}
.input::placeholder { color: var(--color-text-faint); font-weight: 400; }
.field-error { font-size: 11px; color: var(--color-red); margin-top: 4px; display: block; }
.field-hint { font-size: 12px; color: var(--color-text-faint); margin-top: 6px; }

/* Gender toggle */
.gender-toggle { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.gender-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 12px;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: var(--font-body); font-size: 14px; font-weight: 500;
  color: var(--color-text-muted);
  transition: all 0.2s;
}
.gender-btn:hover { border-color: var(--color-green); color: var(--color-green); }
.gender-btn.active {
  border-color: var(--color-green);
  background: var(--color-green-light);
  color: var(--color-green-dark);
}
.gender-icon { font-size: 18px; }

/* Select */
.select-wrapper { position: relative; }
.select {
  width: 100%;
  padding: 11px 40px 11px 14px;
  font-size: 14px;
  font-family: var(--font-body);
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  outline: none;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.2s;
}
.select:focus { border-color: var(--color-green); box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12); }
.select-arrow {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--color-text-faint); pointer-events: none;
}

/* Buttons */
.calc-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 14px 24px;
  background: var(--color-green);
  color: white; border: none; border-radius: var(--radius-md);
  font-family: var(--font-body); font-size: 15px; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.calc-btn:hover:not(:disabled) { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(22,163,74,0.3); }
.calc-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
.reset-btn {
  width: 100%; margin-top: 10px; padding: 10px;
  background: transparent; border: 1px solid var(--color-border);
  border-radius: var(--radius-md); cursor: pointer;
  font-family: var(--font-body); font-size: 13px;
  color: var(--color-text-muted); transition: all 0.2s;
}
.reset-btn:hover { border-color: var(--color-red); color: var(--color-red); }

.gender-note {
  display: flex; align-items: flex-start; gap: 8px;
  margin-top: 16px; padding: 12px 14px;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  font-size: 12px; color: var(--color-text-muted); line-height: 1.5;
}

/* ── Result panel ─────────────────────── */
.result-panel { min-height: 300px; }
.empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; height: 260px; gap: 16px;
}
.empty-text { text-align: center; font-size: 14px; color: var(--color-text-faint); line-height: 1.7; }

.result-section { margin-bottom: 24px; }
.result-section:last-child { margin-bottom: 0; }
.section-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-faint); margin-bottom: 14px; }

.gauge-section { display: flex; justify-content: center; }

/* Stats grid */
.stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.stat-card {
  padding: 14px 16px;
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}
.stat-label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: var(--color-text-faint); margin-bottom: 4px; }
.stat-val { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--color-text); line-height: 1.2; }
.stat-sub { font-size: 11px; color: var(--color-text-faint); margin-top: 2px; }

/* ── Detail sections ─────────────────── */
.detail-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 28px;
  margin-top: 24px;
  box-shadow: var(--shadow-sm);
}
.section-header { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
.section-icon {
  width: 44px; height: 44px; border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.section-title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 600; margin-bottom: 2px; }
.section-desc { font-size: 13px; color: var(--color-text-muted); }

/* Calorie hero */
.calorie-hero {
  display: grid; grid-template-columns: auto 1fr; gap: 28px; align-items: start;
  padding: 20px; background: var(--color-surface-2);
  border-radius: var(--radius-lg); margin-bottom: 24px;
}
@media (max-width: 600px) { .calorie-hero { grid-template-columns: 1fr; } }
.calorie-main { text-align: center; padding: 8px 0; }
.calorie-number {
  font-family: var(--font-display);
  font-size: 3rem; font-weight: 600;
  color: var(--color-green);
  line-height: 1;
}
.calorie-unit { font-size: 13px; color: var(--color-text-muted); margin-top: 4px; }
.calorie-breakdown { display: flex; flex-direction: column; gap: 10px; }
.calorie-row {
  display: flex; justify-content: space-between; align-items: center;
  font-size: 13px; padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}
.calorie-row:last-child { border-bottom: none; }
.calorie-row.target strong { color: var(--color-green); }
.calorie-row span { color: var(--color-text-muted); }

.macro-section { }
.macro-title { font-size: 14px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.04em; font-size: 11px; }

.water-row {
  display: flex; align-items: center; gap: 10px;
  margin-top: 18px; padding: 12px 16px;
  background: #eff6ff; border-radius: var(--radius-md);
  font-size: 14px;
}
.water-icon { font-size: 20px; }
.water-row strong { font-weight: 600; margin-right: 8px; }

/* Two-col for risks + suppl */
.two-col-section {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 20px; margin-top: 24px;
}
@media (max-width: 700px) { .two-col-section { grid-template-columns: 1fr; } }

/* Risks */
.risks-list { display: flex; flex-direction: column; gap: 12px; }
.risk-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px; background: var(--color-surface-2);
  border-radius: var(--radius-md); border: 1px solid var(--color-border);
}
.risk-icon { font-size: 20px; flex-shrink: 0; line-height: 1; margin-top: 2px; }
.risk-name { font-size: 14px; font-weight: 600; color: var(--color-text); }
.risk-desc { font-size: 12px; color: var(--color-text-muted); margin-top: 2px; }

/* Supplements */
.supplements-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }
.supplement-item {
  padding: 12px 14px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: var(--radius-md);
}
.sup-name { font-size: 14px; font-weight: 600; color: #14532d; }
.sup-reason { font-size: 12px; color: #166534; margin-top: 3px; }
.disclaimer {
  display: flex; align-items: flex-start; gap: 6px;
  font-size: 11px; color: var(--color-text-faint);
  padding: 10px; background: var(--color-surface-2);
  border-radius: var(--radius-sm);
}

/* Ideal section */
.ideal-section { }
.ideal-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 600px) { .ideal-grid { grid-template-columns: 1fr; } }
.ideal-item { text-align: center; padding: 20px 16px; }
.ideal-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-faint); margin-bottom: 8px; }
.ideal-val { font-family: var(--font-display); font-size: 2rem; font-weight: 600; color: var(--color-text); line-height: 1; }
.ideal-val small { font-size: 1rem; color: var(--color-text-muted); }
.ideal-sub { font-size: 12px; color: var(--color-text-muted); margin-top: 6px; }

/* CTA row */
.cta-row {
  display: flex; justify-content: center;
  padding: 32px 0 40px;
}
.cta-row .calc-btn { width: auto; padding: 14px 32px; }

/* ── Footer ─────────────────────────────── */
.footer {
  margin-top: auto;
  border-top: 1px solid var(--color-border);
  padding: 20px 0;
  text-align: center;
  font-size: 12px;
  color: var(--color-text-faint);
}

/* ── Animations ─────────────────────────── */
.has-result { animation: fadeIn 0.4s ease; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>
