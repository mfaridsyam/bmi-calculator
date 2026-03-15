// useBMI.js — BMI calculation logic, fully bilingual (EN/ID)

export function useBMI() {

  // ── BMI Category labels by locale ─────────────────────────────────────────
  function getBMICategory(bmi, locale = 'en') {
    const labels = {
      en: {
        very_underweight: 'Very Underweight',
        underweight:      'Low Weight',
        normal:           'Normal Weight',
        overweight_risk:  'At Risk',
        overweight:       'Overweight',
        obese1:           'Obese Class I',
        obese2:           'Obese Class II',
        obese3:           'Obese Class III',
      },
      id: {
        very_underweight: 'Sangat Kurus',
        underweight:      'Berat Rendah',
        normal:           'Berat Normal',
        overweight_risk:  'Berisiko Gemuk',
        overweight:       'Kelebihan Berat',
        obese1:           'Obesitas Tingkat I',
        obese2:           'Obesitas Tingkat II',
        obese3:           'Obesitas Tingkat III',
      },
    }
    const l = labels[locale] || labels.en
    if (bmi < 17.0) return { key: 'very_underweight', label: l.very_underweight, color: '#3b82f6', colorLight: '#dbeafe', colorDark: '#1e40af' }
    if (bmi < 18.5) return { key: 'underweight',      label: l.underweight,      color: '#60a5fa', colorLight: '#eff6ff', colorDark: '#1d4ed8' }
    if (bmi < 23.0) return { key: 'normal',           label: l.normal,           color: '#16a34a', colorLight: '#dcfce7', colorDark: '#14532d' }
    if (bmi < 25.0) return { key: 'overweight_risk',  label: l.overweight_risk,  color: '#84cc16', colorLight: '#f7fee7', colorDark: '#3f6212' }
    if (bmi < 30.0) return { key: 'overweight',       label: l.overweight,       color: '#f59e0b', colorLight: '#fef3c7', colorDark: '#92400e' }
    if (bmi < 35.0) return { key: 'obese1',           label: l.obese1,           color: '#f97316', colorLight: '#fff7ed', colorDark: '#7c2d12' }
    if (bmi < 40.0) return { key: 'obese2',           label: l.obese2,           color: '#ef4444', colorLight: '#fef2f2', colorDark: '#7f1d1d' }
    return                  { key: 'obese3',           label: l.obese3,           color: '#dc2626', colorLight: '#fef2f2', colorDark: '#450a0a' }
  }

  // ── BMR — Mifflin-St Jeor ─────────────────────────────────────────────────
  function calculateBMR(weight, height, age, gender) {
    return gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161
  }

  // ── TDEE ──────────────────────────────────────────────────────────────────
  const activityMultipliers = {
    sedentary:   { factor: 1.2   },
    light:       { factor: 1.375 },
    moderate:    { factor: 1.55  },
    active:      { factor: 1.725 },
    very_active: { factor: 1.9   },
  }

  function calculateTDEE(bmr, activityKey) {
    return Math.round(bmr * (activityMultipliers[activityKey]?.factor ?? 1.2))
  }

  // ── Macros ────────────────────────────────────────────────────────────────
  function calculateMacros(tdee, bmiKey, gender) {
    let carbPct, protPct, fatPct
    if (bmiKey === 'very_underweight' || bmiKey === 'underweight') {
      carbPct = 0.50; protPct = 0.25; fatPct = 0.25
    } else if (bmiKey === 'normal' || bmiKey === 'overweight_risk') {
      carbPct = 0.45; protPct = 0.25; fatPct = 0.30
    } else {
      carbPct = 0.35; protPct = 0.35; fatPct = 0.30
    }
    const carbCal = Math.round(tdee * carbPct)
    const protCal = Math.round(tdee * protPct)
    const fatCal  = Math.round(tdee * fatPct)
    return {
      carb:    { cal: carbCal, gram: Math.round(carbCal / 4), pct: Math.round(carbPct * 100) },
      protein: { cal: protCal, gram: Math.round(protCal / 4), pct: Math.round(protPct * 100) },
      fat:     { cal: fatCal,  gram: Math.round(fatCal / 9),  pct: Math.round(fatPct * 100)  },
      sugar:   { gram: Math.round(tdee * 0.05 / 4) },
      fiber:   { gram: gender === 'male' ? 38 : 25 },
      water:   { ml: gender === 'male' ? 2625 : 1860 },
    }
  }

  // ── Calorie goal ──────────────────────────────────────────────────────────
  function getCalorieGoal(tdee, bmiKey, locale = 'en') {
    const goals = {
      en: {
        very_underweight: { cal: tdee + 500, goal: 'Surplus +500 kcal to gain weight' },
        underweight:      { cal: tdee + 300, goal: 'Surplus +300 kcal to gain weight' },
        normal:           { cal: tdee,        goal: 'Match TDEE to maintain weight'    },
        overweight_risk:  { cal: tdee - 200,  goal: 'Deficit -200 kcal to optimize'   },
        overweight:       { cal: tdee - 500,  goal: 'Deficit -500 kcal to lose weight' },
        default:          { cal: tdee - 700,  goal: 'Deficit -700 kcal (medical supervision)' },
      },
      id: {
        very_underweight: { cal: tdee + 500, goal: 'Surplus +500 kcal untuk menaikkan BB' },
        underweight:      { cal: tdee + 300, goal: 'Surplus +300 kcal untuk menaikkan BB' },
        normal:           { cal: tdee,        goal: 'Sesuai TDEE untuk mempertahankan BB' },
        overweight_risk:  { cal: tdee - 200,  goal: 'Defisit -200 kcal untuk optimasi'   },
        overweight:       { cal: tdee - 500,  goal: 'Defisit -500 kcal untuk menurunkan BB' },
        default:          { cal: tdee - 700,  goal: 'Defisit -700 kcal (dengan pengawasan medis)' },
      },
    }
    const g = goals[locale] || goals.en
    return g[bmiKey] || g.default
  }

  // ── Ideal weight (Devine) ─────────────────────────────────────────────────
  function getIdealWeightRange(height, gender) {
    const heightIn = height / 2.54
    const base  = gender === 'male' ? 50 : 45.5
    const ideal = base + 2.3 * (heightIn - 60)
    return {
      min:   parseFloat((ideal * 0.9).toFixed(1)),
      max:   parseFloat((ideal * 1.1).toFixed(1)),
      ideal: parseFloat(ideal.toFixed(1)),
    }
  }

  // ── Body fat (Deurenberg) ─────────────────────────────────────────────────
  function estimateBodyFat(bmi, age, gender) {
    return parseFloat((1.20 * bmi + 0.23 * age - 10.8 * (gender === 'male' ? 1 : 0) - 5.4).toFixed(1))
  }

  // ── Health risks — bilingual ───────────────────────────────────────────────
  function getHealthRisks(bmiKey, gender, locale = 'en') {
    const isEN = locale === 'en'

    const data = {
      very_underweight: {
        diseases: [
          { name: isEN ? 'Malnutrition'          : 'Malnutrisi',         icon: '🫀', desc: isEN ? 'Severe deficiency of essential nutrients'       : 'Kekurangan nutrisi esensial yang parah' },
          { name: isEN ? 'Anemia'                : 'Anemia',             icon: '🩸', desc: isEN ? 'Low red blood cells or hemoglobin'              : 'Kekurangan sel darah merah atau hemoglobin' },
          { name: isEN ? 'Osteoporosis'          : 'Osteoporosis',       icon: '🦴', desc: isEN ? 'Brittle bones prone to fractures'               : 'Tulang rapuh dan rentan patah' },
          { name: isEN ? 'Heart Arrhythmia'      : 'Gangguan Jantung',   icon: '❤️', desc: isEN ? 'Irregular heartbeat (arrhythmia)'               : 'Detak jantung tidak teratur (aritmia)' },
          { name: isEN ? 'Weak Immune System'    : 'Sistem Imun Lemah',  icon: '🛡️', desc: isEN ? 'Prone to infections and illness'                : 'Mudah terinfeksi penyakit' },
          ...(gender === 'female' ? [{ name: isEN ? 'Menstrual Disorders'   : 'Gangguan Menstruasi',   icon: '🔴', desc: isEN ? 'Irregular or absent periods'            : 'Siklus haid tidak teratur atau berhenti' }] : []),
          ...(gender === 'male'   ? [{ name: isEN ? 'Low Testosterone'      : 'Penurunan Testosteron', icon: '⚡', desc: isEN ? 'Male hormone drops significantly'        : 'Hormon pria menurun drastis' }] : []),
        ],
        supplements: [
          { name: 'Multivitamin & Mineral', reason: isEN ? 'Cover all essential nutrient gaps'              : 'Memenuhi kebutuhan nutrisi esensial' },
          { name: 'Vitamin D3 + K2',        reason: isEN ? 'Bone health and calcium absorption'             : 'Kesehatan tulang dan penyerapan kalsium' },
          { name: 'Vitamin B12',            reason: isEN ? 'Prevent anemia, support nerve function'         : 'Mencegah anemia dan menjaga fungsi saraf' },
          { name: 'Zinc',                   reason: isEN ? 'Boost immunity and wound healing'               : 'Memperkuat sistem imun dan penyembuhan' },
          { name: 'Omega-3',                reason: isEN ? 'Anti-inflammatory, heart health'                : 'Anti-inflamasi dan kesehatan jantung' },
          { name: 'Protein Supplement',     reason: isEN ? 'Support muscle mass gain'                       : 'Membantu kenaikan massa otot' },
        ],
      },

      underweight: {
        diseases: [
          { name: isEN ? 'Infertility'           : 'Infertilitas',       icon: '🔬', desc: isEN ? 'Difficulty conceiving children'                 : 'Kesulitan untuk memiliki keturunan' },
          { name: isEN ? 'Anemia'                : 'Anemia',             icon: '🩸', desc: isEN ? 'Iron deficiency in the blood'                   : 'Kekurangan zat besi dalam darah' },
          { name: isEN ? 'Osteoporosis'          : 'Osteoporosis',       icon: '🦴', desc: isEN ? 'Low bone density'                               : 'Densitas tulang rendah' },
          { name: isEN ? 'Weak Immune System'    : 'Sistem Imun Lemah',  icon: '🛡️', desc: isEN ? 'Reduced immune defence'                         : 'Daya tahan tubuh menurun' },
          { name: isEN ? 'Chronic Fatigue'       : 'Kelelahan Kronis',   icon: '😴', desc: isEN ? 'Persistent tiredness and low energy'             : 'Mudah lelah dan kurang energi' },
          ...(gender === 'female' ? [{ name: isEN ? 'Hormonal Imbalance'  : 'Gangguan Hormonal',    icon: '🔴', desc: isEN ? 'Estrogen imbalance'                       : 'Ketidakseimbangan hormon estrogen' }] : []),
        ],
        supplements: [
          { name: 'Multivitamin',           reason: isEN ? 'Complete daily nutrition intake'               : 'Melengkapi asupan nutrisi harian' },
          { name: isEN ? 'Iron (Zat Besi)'  : 'Zat Besi (Iron)', reason: isEN ? 'Prevent and treat anemia'            : 'Mencegah dan mengatasi anemia' },
          { name: 'Calcium + Vitamin D',    reason: isEN ? 'Maintain bone density and strength'            : 'Menjaga kepadatan dan kekuatan tulang' },
          { name: 'Vitamin B Complex',      reason: isEN ? 'Boost energy metabolism'                       : 'Meningkatkan metabolisme energi' },
          { name: 'Protein Supplement',     reason: isEN ? 'Support muscle building'                       : 'Mendukung pembentukan otot' },
        ],
      },

      normal: {
        diseases: [
          { name: isEN ? 'Low Risk'          : 'Risiko Rendah',      icon: '✅', desc: isEN ? 'Ideal body weight for overall health'          : 'Kondisi berat badan ideal untuk kesehatan' },
          { name: isEN ? 'Watch Stress'      : 'Perhatikan Stres',   icon: '🧠', desc: isEN ? 'Chronic stress can disrupt metabolism'         : 'Stres kronis dapat ganggu metabolisme' },
          { name: isEN ? 'Maintain Sleep'    : 'Jaga Kualitas Tidur',icon: '😴', desc: isEN ? 'Quality sleep for optimal recovery'            : 'Tidur cukup untuk pemulihan optimal' },
        ],
        supplements: [
          { name: 'Multivitamin',   reason: isEN ? 'Ensure all nutritional needs are met'             : 'Memastikan kebutuhan nutrisi terpenuhi' },
          { name: 'Omega-3',        reason: isEN ? 'Long-term heart and brain health'                 : 'Kesehatan jantung dan otak jangka panjang' },
          { name: 'Vitamin D3',     reason: isEN ? 'Vitamin D deficiency is very common'              : 'Banyak orang kekurangan vitamin D' },
          { name: 'Probiotics',     reason: isEN ? 'Maintain gut health and immunity'                 : 'Menjaga kesehatan pencernaan dan imunitas' },
        ],
      },

      overweight_risk: {
        diseases: [
          { name: isEN ? 'Pre-diabetes'         : 'Pra-diabetes',         icon: '🩺', desc: isEN ? 'Blood sugar starting to rise abnormally'    : 'Gula darah mulai tidak normal' },
          { name: isEN ? 'High Blood Pressure'  : 'Tekanan Darah Tinggi', icon: '❤️', desc: isEN ? 'Increased risk of hypertension'             : 'Risiko hipertensi meningkat' },
          { name: isEN ? 'High Cholesterol'     : 'Kolesterol Tinggi',    icon: '🫀', desc: isEN ? 'LDL levels beginning to rise'               : 'LDL mulai meningkat' },
          { name: isEN ? 'Mild Sleep Apnea'     : 'Sleep Apnea Ringan',   icon: '😴', desc: isEN ? 'Breathing issues during sleep'              : 'Gangguan napas saat tidur' },
        ],
        supplements: [
          { name: 'Omega-3',              reason: isEN ? 'Lower triglycerides and cholesterol'        : 'Menurunkan trigliserida dan kolesterol' },
          { name: 'Chromium Picolinate',  reason: isEN ? 'Help regulate blood sugar levels'           : 'Membantu regulasi gula darah' },
          { name: 'Vitamin D3',           reason: isEN ? 'Deficiency common in overweight individuals': 'Defisiensi umum pada kelebihan berat badan' },
          { name: 'Green Tea Extract',    reason: isEN ? 'Boost fat metabolism'                       : 'Meningkatkan metabolisme lemak' },
          { name: 'Magnesium',            reason: isEN ? 'Support insulin sensitivity'                : 'Mendukung sensitivitas insulin' },
        ],
      },

      overweight: {
        diseases: [
          { name: isEN ? 'Type 2 Diabetes'   : 'Diabetes Tipe 2',    icon: '🩺', desc: isEN ? 'Insulin resistance increases significantly'   : 'Resistensi insulin meningkat signifikan' },
          { name: isEN ? 'Hypertension'      : 'Hipertensi',         icon: '❤️', desc: isEN ? 'Dangerously high blood pressure'              : 'Tekanan darah tinggi berbahaya' },
          { name: isEN ? 'Heart Disease'     : 'Penyakit Jantung',   icon: '🫀', desc: isEN ? 'Increased risk of heart attack'               : 'Risiko serangan jantung meningkat' },
          { name: isEN ? 'Sleep Apnea'       : 'Sleep Apnea',        icon: '😴', desc: isEN ? 'Breathing disruption during sleep'            : 'Gangguan pernapasan saat tidur' },
          { name: isEN ? 'Joint Pain'        : 'Nyeri Sendi',        icon: '🦵', desc: isEN ? 'Excess load on knees and hips'                : 'Beban berlebih pada lutut dan pinggul' },
          { name: isEN ? 'GERD / Acid Reflux': 'GERD / Asam Lambung',icon: '🫁', desc: isEN ? 'Abdominal pressure pushes acid upward'        : 'Tekanan perut mendorong asam ke atas' },
          ...(gender === 'female' ? [{ name: 'PCOS', icon: '🔴', desc: isEN ? 'Polycystic ovary syndrome' : 'Sindrom ovarium polikistik' }] : []),
        ],
        supplements: [
          { name: 'Omega-3 (High Dose)',  reason: isEN ? 'Reduce inflammation and cholesterol'        : 'Mengurangi peradangan dan kolesterol' },
          { name: 'Berberine',            reason: isEN ? 'Control blood sugar like metformin'         : 'Mengontrol gula darah seperti metformin' },
          { name: 'CoQ10',               reason: isEN ? 'Support heart health and energy'             : 'Mendukung kesehatan jantung dan energi' },
          { name: 'CLA',                 reason: isEN ? 'Help burn body fat'                          : 'Membantu pembakaran lemak tubuh' },
          { name: 'Vitamin D + Magnesium',reason: isEN ? 'Important for glucose metabolism'           : 'Penting untuk metabolisme glukosa' },
        ],
      },

      obese1: {
        diseases: [
          { name: isEN ? 'Type 2 Diabetes'       : 'Diabetes Tipe 2',           icon: '🩺', desc: isEN ? 'Very high risk'                         : 'Risiko sangat tinggi' },
          { name: isEN ? 'Coronary Heart Disease' : 'Penyakit Jantung Koroner',  icon: '🫀', desc: isEN ? 'Narrowing of coronary arteries'         : 'Penyempitan pembuluh darah jantung' },
          { name: isEN ? 'Stroke'                : 'Stroke',                     icon: '🧠', desc: isEN ? 'Risk doubles'                           : 'Risiko meningkat 2x lipat' },
          { name: isEN ? 'Cancer'                : 'Kanker',                     icon: '🔴', desc: isEN ? 'Several cancers linked to obesity'       : 'Beberapa jenis kanker terkait obesitas' },
          { name: isEN ? 'Fatty Liver (NAFLD)'   : 'Fatty Liver (NAFLD)',        icon: '🫁', desc: isEN ? 'Fat buildup in the liver'               : 'Penumpukan lemak di hati' },
          { name: isEN ? 'Severe Hypertension'   : 'Hipertensi Berat',           icon: '❤️', desc: isEN ? 'Blood pressure difficult to control'    : 'Tekanan darah sulit dikendalikan' },
          { name: isEN ? 'Arthritis'             : 'Arthritis',                  icon: '🦵', desc: isEN ? 'Knee and hip joint damage'              : 'Kerusakan sendi lutut dan pinggul' },
        ],
        supplements: [
          { name: isEN ? 'Consult Doctor First' : 'Konsultasi Dokter Dulu', reason: isEN ? 'Supplements must match medical condition' : 'Suplemen harus disesuaikan kondisi medis' },
          { name: 'Omega-3',              reason: isEN ? 'Anti-inflammatory and cardioprotective'     : 'Anti-inflamasi dan kardioprotektif' },
          { name: isEN ? 'Vitamin D3 (High Dose)' : 'Vitamin D3 Dosis Tinggi', reason: isEN ? 'Severe deficiency in obesity' : 'Defisiensi parah pada obesitas' },
          { name: 'Berberine',            reason: isEN ? 'Control blood sugar and metabolism'         : 'Mengontrol gula darah dan metabolisme' },
          { name: 'Alpha Lipoic Acid',    reason: isEN ? 'Powerful antioxidant, aids insulin sensitivity' : 'Antioksidan kuat, membantu sensitivitas insulin' },
        ],
      },

      obese2: {
        diseases: [
          { name: isEN ? 'Heart Failure'    : 'Gagal Jantung',       icon: '🫀', desc: isEN ? 'Heart unable to pump blood effectively'       : 'Jantung tidak mampu memompa darah' },
          { name: isEN ? 'Severe Diabetes'  : 'Diabetes Berat',      icon: '🩺', desc: isEN ? 'Multi-organ complications'                   : 'Komplikasi multi-organ' },
          { name: isEN ? 'Kidney Disease'   : 'Gangguan Ginjal',     icon: '🫘', desc: isEN ? 'Kidney function damage'                      : 'Kerusakan fungsi ginjal' },
          { name: isEN ? 'Severe Sleep Apnea':'Sleep Apnea Berat',   icon: '😴', desc: isEN ? 'Dangerous breathing stops during sleep'      : 'Berhenti napas saat tidur berbahaya' },
          { name: isEN ? 'Depression & Anxiety':'Depresi & Anxietas',icon: '🧠', desc: isEN ? 'Mental health disorders linked to obesity'   : 'Gangguan mental terkait obesitas' },
          { name: isEN ? 'Colorectal Cancer':'Kanker Kolorektal',    icon: '🔴', desc: isEN ? 'Risk increases significantly'                : 'Risiko meningkat signifikan' },
          { name: isEN ? 'Deep Vein Thrombosis':'Trombosis Vena',    icon: '🩸', desc: isEN ? 'Dangerous blood clotting'                   : 'Pembekuan darah berbahaya' },
        ],
        supplements: [
          { name: isEN ? '⚠️ Medical Supervision Required':'⚠️ Wajib Konsultasi Dokter', reason: isEN ? 'Medical treatment essential' : 'Penanganan medis sangat diperlukan' },
          { name: 'Omega-3',              reason: isEN ? 'Essential cardiovascular protection'        : 'Wajib untuk proteksi kardiovaskular' },
          { name: isEN ? 'CoQ10 (High Dose)':'CoQ10 Dosis Tinggi',  reason: isEN ? 'Support weakened heart function' : 'Mendukung fungsi jantung lemah' },
          { name: 'Vitamin D3 + K2',      reason: isEN ? 'Prevent arterial calcification'             : 'Mencegah kalsifikasi pembuluh darah' },
        ],
      },

      obese3: {
        diseases: [
          { name: isEN ? 'Premature Death'       : 'Kematian Dini',          icon: '⚠️', desc: isEN ? 'Dramatically increased mortality risk'   : 'Risiko mortalitas meningkat drastis' },
          { name: isEN ? 'Congestive Heart Failure':'Gagal Jantung Kongestif',icon: '🫀', desc: isEN ? 'Critical heart condition'                : 'Kondisi jantung kritis' },
          { name: isEN ? 'Kidney Failure'        : 'Gagal Ginjal',           icon: '🫘', desc: isEN ? 'Permanent kidney damage'                 : 'Kerusakan ginjal permanen' },
          { name: isEN ? 'Pulmonary Embolism'    : 'Emboli Paru',            icon: '🫁', desc: isEN ? 'Dangerous blockage in the lungs'         : 'Sumbatan berbahaya di paru-paru' },
          { name: isEN ? 'Diabetes Complications': 'Komplikasi Diabetes',    icon: '🩺', desc: isEN ? 'Amputation, blindness, etc.'             : 'Amputasi, kebutaan, dll' },
          { name: isEN ? 'Multiple Cancers'      : 'Kanker Multiple',        icon: '🔴', desc: isEN ? 'Risk of various cancer types'            : 'Risiko berbagai jenis kanker' },
        ],
        supplements: [
          { name: isEN ? '🚨 Immediate Medical Care Needed':'🚨 Butuh Penanganan Medis Segera', reason: isEN ? 'Bariatric intervention may be required' : 'Intervensi bariatrik mungkin diperlukan' },
        ],
      },
    }
    return data[bmiKey] || data.normal
  }

  // ── Main calculate ─────────────────────────────────────────────────────────
  function calculate({ weight, height, age, gender, activity, locale = 'en' }) {
    const bmi         = parseFloat((weight / ((height / 100) ** 2)).toFixed(1))
    const category    = getBMICategory(bmi, locale)
    const bmr         = Math.round(calculateBMR(weight, height, age, gender))
    const tdee        = calculateTDEE(bmr, activity)
    const calorieGoal = getCalorieGoal(tdee, category.key, locale)
    const macros      = calculateMacros(calorieGoal.cal, category.key, gender)
    const idealWeight = getIdealWeightRange(height, gender)
    const bodyFat     = estimateBodyFat(bmi, age, gender)
    const risks       = getHealthRisks(category.key, gender, locale)
    const weightDiff  = parseFloat((weight - idealWeight.ideal).toFixed(1))
    return { bmi, category, bmr, tdee, calorieGoal, macros, idealWeight, bodyFat, risks, weightDiff }
  }

  return { calculate, getBMICategory, activityMultipliers }
}
