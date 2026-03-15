# BMI Calculator 🏥

Kalkulator Indeks Massa Tubuh (BMI) lengkap dengan analisis kesehatan, kebutuhan kalori, dan rekomendasi nutrisi.

## ✨ Fitur

- **Kalkulasi BMI** dengan formula standar WHO
- **Gender-aware**: BMR dan kebutuhan nutrisi berbeda untuk pria dan wanita
  - Pria: BMR lebih tinggi, kebutuhan serat lebih banyak (38g vs 25g), protein per kg lebih tinggi
  - Wanita: Estimasi lemak tubuh berbeda (formula Deurenberg), kebutuhan zat besi lebih tinggi
- **Gauge Chart interaktif** dengan jarum penunjuk BMI
- **Tingkat Aktivitas**: 5 level (sedentary → very active) untuk kalkulasi TDEE
- **Kebutuhan Kalori Detail**: BMR, TDEE, target kalori, distribusi makronutrien
  - Karbohidrat, Protein, Lemak, Gula (WHO), Serat, Air
- **Risiko Penyakit** berdasarkan kategori BMI + gender
- **Rekomendasi Vitamin & Suplemen** spesifik per kondisi
- **Berat Badan Ideal** (Formula Devine) + estimasi lemak tubuh (Deurenberg)
- **Responsive** untuk PC, laptop, iPad, dan HP

## 🚀 Setup & Development

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Deploy ke Vercel

1. Push ke GitHub:
```bash
git init
git add .
git commit -m "Initial commit: BMI Calculator"
git branch -M main
git remote add origin https://github.com/username/bmi-calculator.git
git push -u origin main
```

2. Import di [vercel.com](https://vercel.com):
   - Klik **New Project** → Import dari GitHub
   - Framework: **Vite**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Klik **Deploy** ✅

## 🧮 Rumus yang Digunakan

| Rumus | Sumber | Keterangan |
|-------|--------|------------|
| BMI | WHO | `weight / (height/100)²` |
| BMR Pria | Mifflin-St Jeor | `10W + 6.25H - 5A + 5` |
| BMR Wanita | Mifflin-St Jeor | `10W + 6.25H - 5A - 161` |
| Body Fat | Deurenberg | `1.20×BMI + 0.23×age - 10.8×sex - 5.4` |
| Ideal Weight Pria | Devine | `50 + 2.3×(height_in - 60)` |
| Ideal Weight Wanita | Devine | `45.5 + 2.3×(height_in - 60)` |
| TDEE | Harris-Benedict | `BMR × activity_factor` |

## 📱 Teknologi

- **Vue 3** (Composition API)
- **Vite** (build tool)
- **Chart.js** (gauge chart)
- **CSS Variables** (theming)
- **Google Fonts** (Sora + Lora)

## ⚠️ Disclaimer

Aplikasi ini dibuat untuk tujuan edukasi. Bukan pengganti saran medis profesional. Selalu konsultasikan kondisi kesehatan Anda dengan dokter.
