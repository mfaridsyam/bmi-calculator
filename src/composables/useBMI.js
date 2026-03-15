export function useBMI() {

  function getBMICategory(bmi) {
    if (bmi < 17.0) return { key: 'very_underweight', label: 'Sangat Kurus',      color: '#3b82f6', colorLight: '#dbeafe', colorDark: '#1e40af' }
    if (bmi < 18.5) return { key: 'underweight',      label: 'Berat Rendah',      color: '#60a5fa', colorLight: '#eff6ff', colorDark: '#1d4ed8' }
    if (bmi < 23.0) return { key: 'normal',           label: 'Berat Normal',      color: '#16a34a', colorLight: '#dcfce7', colorDark: '#14532d' }
    if (bmi < 25.0) return { key: 'overweight_risk',  label: 'Berisiko Gemuk',    color: '#84cc16', colorLight: '#f7fee7', colorDark: '#3f6212' }
    if (bmi < 30.0) return { key: 'overweight',       label: 'Kelebihan Berat',   color: '#f59e0b', colorLight: '#fef3c7', colorDark: '#92400e' }
    if (bmi < 35.0) return { key: 'obese1',           label: 'Obesitas Tingkat I',color: '#f97316', colorLight: '#fff7ed', colorDark: '#7c2d12' }
    if (bmi < 40.0) return { key: 'obese2',           label: 'Obesitas Tingkat II',color:'#ef4444', colorLight: '#fef2f2', colorDark: '#7f1d1d' }
    return                  { key: 'obese3',           label: 'Obesitas Tingkat III',color:'#dc2626',colorLight: '#fef2f2', colorDark: '#450a0a' }
  }

  function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
      return 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      return 10 * weight + 6.25 * height - 5 * age - 161
    }
  }

  const activityMultipliers = {
    sedentary:   { factor: 1.2,  label: 'Sangat Rendah',  desc: 'Tidak olahraga / kerja kantoran' },
    light:       { factor: 1.375,label: 'Ringan',         desc: 'Olahraga ringan 1–3 hari/minggu' },
    moderate:    { factor: 1.55, label: 'Sedang',         desc: 'Olahraga sedang 3–5 hari/minggu' },
    active:      { factor: 1.725,label: 'Aktif',          desc: 'Olahraga intensif 6–7 hari/minggu' },
    very_active: { factor: 1.9,  label: 'Sangat Aktif',   desc: 'Atlet / kerja fisik berat' },
  }

  function calculateTDEE(bmr, activityKey) {
    const mult = activityMultipliers[activityKey]?.factor ?? 1.2
    return Math.round(bmr * mult)
  }

  function calculateMacros(tdee, bmiKey, gender) {
    let carbPct, protPct, fatPct

    if (bmiKey === 'very_underweight' || bmiKey === 'underweight') {
      carbPct = 0.50; protPct = 0.25; fatPct = 0.25
    } else if (bmiKey === 'normal' || bmiKey === 'overweight_risk') {
      carbPct = 0.45; protPct = 0.25; fatPct = 0.30
    } else {
      carbPct = 0.35; protPct = 0.35; fatPct = 0.30
    }

    const proteinPerKg = gender === 'male' ? 1.8 : 1.6

    const carbCal  = Math.round(tdee * carbPct)
    const protCal  = Math.round(tdee * protPct)
    const fatCal   = Math.round(tdee * fatPct)

    return {
      carb:    { cal: carbCal,  gram: Math.round(carbCal / 4),    pct: Math.round(carbPct * 100) },
      protein: { cal: protCal,  gram: Math.round(protCal / 4),    pct: Math.round(protPct * 100) },
      fat:     { cal: fatCal,   gram: Math.round(fatCal / 9),     pct: Math.round(fatPct * 100) },
      sugar:   { gram: Math.round(tdee * 0.05 / 4) },
      fiber:   { gram: gender === 'male' ? 38 : 25 },
      water:   { ml: gender === 'male' ? Math.round(35 * 75) : Math.round(31 * 60) },
    }
  }

  function getCalorieGoal(tdee, bmiKey) {
    if (bmiKey === 'very_underweight')  return { cal: tdee + 500, goal: 'Surplus +500 kcal untuk menaikkan BB' }
    if (bmiKey === 'underweight')       return { cal: tdee + 300, goal: 'Surplus +300 kcal untuk menaikkan BB' }
    if (bmiKey === 'normal')            return { cal: tdee,        goal: 'Sesuai TDEE untuk mempertahankan BB' }
    if (bmiKey === 'overweight_risk')   return { cal: tdee - 200,  goal: 'Defisit -200 kcal untuk optimasi' }
    if (bmiKey === 'overweight')        return { cal: tdee - 500,  goal: 'Defisit -500 kcal untuk menurunkan BB' }
    return                                     { cal: tdee - 700,  goal: 'Defisit -700 kcal (dengan pengawasan medis)' }
  }

  function getIdealWeightRange(height, gender) {
    const heightIn = height / 2.54
    const base = gender === 'male' ? 50 : 45.5
    const ideal = base + 2.3 * (heightIn - 60)
    const min = parseFloat((ideal * 0.9).toFixed(1))
    const max = parseFloat((ideal * 1.1).toFixed(1))
    return { min, max, ideal: parseFloat(ideal.toFixed(1)) }
  }

  function estimateBodyFat(bmi, age, gender) {
    const sexFactor = gender === 'male' ? 1 : 0
    return parseFloat((1.20 * bmi + 0.23 * age - 10.8 * sexFactor - 5.4).toFixed(1))
  }

  function getHealthRisks(bmiKey, gender) {
    const risks = {
      very_underweight: {
        diseases: [
          { name: 'Malnutrisi',         icon: '🫀', desc: 'Kekurangan nutrisi esensial yang parah' },
          { name: 'Anemia',             icon: '🩸', desc: 'Kekurangan sel darah merah atau hemoglobin' },
          { name: 'Osteoporosis',       icon: '🦴', desc: 'Tulang rapuh dan rentan patah' },
          { name: 'Gangguan Jantung',   icon: '❤️', desc: 'Detak jantung tidak teratur (aritmia)' },
          { name: 'Sistem Imun Lemah',  icon: '🛡️', desc: 'Mudah terinfeksi penyakit' },
          ...(gender === 'female' ? [{ name: 'Gangguan Menstruasi', icon: '🔴', desc: 'Siklus haid tidak teratur atau berhenti' }] : []),
          ...(gender === 'male'   ? [{ name: 'Penurunan Testosteron', icon: '⚡', desc: 'Hormon pria menurun drastis' }] : []),
        ],
        supplements: [
          { name: 'Multivitamin & Mineral', reason: 'Memenuhi kebutuhan nutrisi esensial' },
          { name: 'Vitamin D3 + K2',        reason: 'Kesehatan tulang dan penyerapan kalsium' },
          { name: 'Vitamin B12',            reason: 'Mencegah anemia dan menjaga fungsi saraf' },
          { name: 'Zinc',                   reason: 'Memperkuat sistem imun dan penyembuhan' },
          { name: 'Omega-3',                reason: 'Anti-inflamasi dan kesehatan jantung' },
          { name: 'Protein Whey/Plant',     reason: 'Membantu kenaikan massa otot' },
        ]
      },
      underweight: {
        diseases: [
          { name: 'Infertilitas',          icon: '🔬', desc: 'Kesulitan untuk memiliki keturunan' },
          { name: 'Anemia',                icon: '🩸', desc: 'Kekurangan zat besi dalam darah' },
          { name: 'Osteoporosis',          icon: '🦴', desc: 'Densitas tulang rendah' },
          { name: 'Sistem Imun Lemah',     icon: '🛡️', desc: 'Daya tahan tubuh menurun' },
          { name: 'Kelelahan Kronis',      icon: '😴', desc: 'Mudah lelah dan kurang energi' },
          ...(gender === 'female' ? [{ name: 'Gangguan Hormonal', icon: '🔴', desc: 'Ketidakseimbangan hormon estrogen' }] : []),
        ],
        supplements: [
          { name: 'Multivitamin',    reason: 'Melengkapi asupan nutrisi harian' },
          { name: 'Zat Besi (Iron)', reason: 'Mencegah dan mengatasi anemia' },
          { name: 'Kalsium + Vit D', reason: 'Menjaga kepadatan dan kekuatan tulang' },
          { name: 'Vitamin B Complex', reason: 'Meningkatkan metabolisme energi' },
          { name: 'Protein Supplement', reason: 'Mendukung pembentukan otot' },
        ]
      },
      normal: {
        diseases: [
          { name: 'Risiko Rendah',     icon: '✅', desc: 'Kondisi berat badan ideal untuk kesehatan' },
          { name: 'Perhatikan Stres',  icon: '🧠', desc: 'Stres kronis dapat ganggu metabolisme' },
          { name: 'Jaga Kualitas Tidur',icon: '😴', desc: 'Tidur cukup untuk pemulihan optimal' },
        ],
        supplements: [
          { name: 'Multivitamin',          reason: 'Memastikan kebutuhan nutrisi terpenuhi' },
          { name: 'Omega-3',               reason: 'Kesehatan jantung dan otak jangka panjang' },
          { name: 'Vitamin D3',            reason: 'Banyak orang Indonesia kekurangan vitamin D' },
          { name: 'Probiotik',             reason: 'Menjaga kesehatan pencernaan dan imunitas' },
        ]
      },
      overweight_risk: {
        diseases: [
          { name: 'Pra-diabetes',       icon: '🩺', desc: 'Gula darah mulai tidak normal' },
          { name: 'Tekanan Darah Tinggi', icon: '❤️', desc: 'Risiko hipertensi meningkat' },
          { name: 'Kolesterol Tinggi',  icon: '🫀', desc: 'LDL mulai meningkat' },
          { name: 'Sleep Apnea Ringan', icon: '😴', desc: 'Gangguan napas saat tidur' },
        ],
        supplements: [
          { name: 'Omega-3',          reason: 'Menurunkan trigliserida dan kolesterol' },
          { name: 'Chromium Picolinate', reason: 'Membantu regulasi gula darah' },
          { name: 'Vitamin D3',       reason: 'Defisiensi umum pada kelebihan berat badan' },
          { name: 'Green Tea Extract', reason: 'Meningkatkan metabolisme lemak' },
          { name: 'Magnesium',        reason: 'Mendukung sensitivitas insulin' },
        ]
      },
      overweight: {
        diseases: [
          { name: 'Diabetes Tipe 2',    icon: '🩺', desc: 'Resistensi insulin meningkat signifikan' },
          { name: 'Hipertensi',         icon: '❤️', desc: 'Tekanan darah tinggi berbahaya' },
          { name: 'Penyakit Jantung',   icon: '🫀', desc: 'Risiko serangan jantung meningkat' },
          { name: 'Sleep Apnea',        icon: '😴', desc: 'Gangguan pernapasan saat tidur' },
          { name: 'Nyeri Sendi',        icon: '🦵', desc: 'Beban berlebih pada lutut dan pinggul' },
          { name: 'GERD / Asam Lambung',icon: '🫁', desc: 'Tekanan perut mendorong asam ke atas' },
          ...(gender === 'female' ? [{ name: 'PCOS', icon: '🔴', desc: 'Sindrom ovarium polikistik' }] : []),
        ],
        supplements: [
          { name: 'Omega-3 Dosis Tinggi', reason: 'Mengurangi peradangan dan kolesterol' },
          { name: 'Berberine',            reason: 'Mengontrol gula darah seperti metformin' },
          { name: 'CoQ10',               reason: 'Mendukung kesehatan jantung dan energi' },
          { name: 'CLA (Conjugated LA)',  reason: 'Membantu pembakaran lemak tubuh' },
          { name: 'Vitamin D + Magnesium',reason: 'Penting untuk metabolisme glukosa' },
        ]
      },
      obese1: {
        diseases: [
          { name: 'Diabetes Tipe 2',       icon: '🩺', desc: 'Risiko sangat tinggi' },
          { name: 'Penyakit Jantung Koroner',icon: '🫀', desc: 'Penyempitan pembuluh darah jantung' },
          { name: 'Stroke',                icon: '🧠', desc: 'Risiko meningkat 2x lipat' },
          { name: 'Kanker',                icon: '🔴', desc: 'Beberapa jenis kanker terkait obesitas' },
          { name: 'Fatty Liver (NAFLD)',   icon: '🫁', desc: 'Penumpukan lemak di hati' },
          { name: 'Hipertensi Berat',      icon: '❤️', desc: 'Tekanan darah sulit dikendalikan' },
          { name: 'Arthritis',             icon: '🦵', desc: 'Kerusakan sendi lutut dan pinggul' },
        ],
        supplements: [
          { name: 'Konsultasi Dokter Dulu', reason: 'Suplemen harus disesuaikan kondisi medis' },
          { name: 'Omega-3',               reason: 'Anti-inflamasi dan kardioprotektif' },
          { name: 'Vitamin D3 Dosis Tinggi', reason: 'Defisiensi parah pada obesitas' },
          { name: 'Berberine',             reason: 'Mengontrol gula darah dan metabolisme' },
          { name: 'Alpha Lipoic Acid',     reason: 'Antioksidan kuat, membantu sensitivitas insulin' },
        ]
      },
      obese2: {
        diseases: [
          { name: 'Gagal Jantung',         icon: '🫀', desc: 'Jantung tidak mampu memompa darah' },
          { name: 'Diabetes Berat',        icon: '🩺', desc: 'Komplikasi multi-organ' },
          { name: 'Gangguan Ginjal',       icon: '🫘', desc: 'Kerusakan fungsi ginjal' },
          { name: 'Sleep Apnea Berat',     icon: '😴', desc: 'Berhenti napas saat tidur berbahaya' },
          { name: 'Depresi & Anxietas',    icon: '🧠', desc: 'Gangguan mental terkait obesitas' },
          { name: 'Kanker Kolorektal',     icon: '🔴', desc: 'Risiko meningkat signifikan' },
          { name: 'Trombosis Vena',        icon: '🩸', desc: 'Pembekuan darah berbahaya' },
        ],
        supplements: [
          { name: '⚠️ Wajib Konsultasi Dokter', reason: 'Penanganan medis sangat diperlukan' },
          { name: 'Omega-3',               reason: 'Wajib untuk proteksi kardiovaskular' },
          { name: 'CoQ10 Dosis Tinggi',    reason: 'Mendukung fungsi jantung lemah' },
          { name: 'Vitamin D3 + K2',       reason: 'Mencegah kalsifikasi pembuluh darah' },
        ]
      },
      obese3: {
        diseases: [
          { name: 'Kematian Dini',         icon: '⚠️', desc: 'Risiko mortalitas meningkat drastis' },
          { name: 'Gagal Jantung Kongestif',icon: '🫀', desc: 'Kondisi jantung kritis' },
          { name: 'Gagal Ginjal',          icon: '🫘', desc: 'Kerusakan ginjal permanen' },
          { name: 'Emboli Paru',           icon: '🫁', desc: 'Sumbatan berbahaya di paru-paru' },
          { name: 'Komplikasi Diabetes',   icon: '🩺', desc: 'Amputasi, kebutaan, dll' },
          { name: 'Kanker Multiple',       icon: '🔴', desc: 'Risiko berbagai jenis kanker' },
        ],
        supplements: [
          { name: '🚨 Butuh Penanganan Medis Segera', reason: 'Intervensi bariatrik mungkin diperlukan' },
        ]
      },
    }
    return risks[bmiKey] || risks['normal']
  }

  function getGenderNote(gender) {
    if (gender === 'male') {
      return 'Pria memiliki BMR lebih tinggi karena massa otot lebih besar. Kebutuhan protein dan serat harian juga lebih tinggi.'
    }
    return 'Wanita memiliki persentase lemak tubuh alami lebih tinggi (10–13% lebih). BMR dihitung dengan formula Mifflin-St Jeor yang mempertimbangkan perbedaan ini.'
  }

  function calculate({ weight, height, age, gender, activity }) {
    const bmi = parseFloat((weight / ((height / 100) ** 2)).toFixed(1))
    const category = getBMICategory(bmi)
    const bmr = Math.round(calculateBMR(weight, height, age, gender))
    const tdee = calculateTDEE(bmr, activity)
    const calorieGoal = getCalorieGoal(tdee, category.key)
    const macros = calculateMacros(calorieGoal.cal, category.key, gender)
    const idealWeight = getIdealWeightRange(height, gender)
    const bodyFat = estimateBodyFat(bmi, age, gender)
    const risks = getHealthRisks(category.key, gender)
    const weightDiff = parseFloat((weight - idealWeight.ideal).toFixed(1))

    return {
      bmi,
      category,
      bmr,
      tdee,
      calorieGoal,
      macros,
      idealWeight,
      bodyFat,
      risks,
      weightDiff,
      genderNote: getGenderNote(gender),
    }
  }

  return {
    calculate,
    activityMultipliers,
    getBMICategory,
  }
}
