# 🤖 Compiler Illustrator (LogMan Edition)

Compiler Illustrator adalah sebuah alat bantu pembelajaran (berbasis web) yang dirancang untuk memvisualisasikan cara kerja *Context-Free Grammar* (CFG) dan *Top-Down Parsing*. Proyek ini menerjemahkan kode sumber menjadi *Abstract Syntax Tree* (AST) secara *real-time* menggunakan antarmuka interaktif.

Edisi **LogMan** (Logat Manado) menggunakan dialek lokal bahasa Manado sebagai *keyword* bahasa pemrogramannya, membuatnya lebih unik dan menyenangkan untuk dipelajari.

## ✨ Fitur Utama
- **Live Parsing:** Mengetik kode dan langsung melihat hasil *Parse Tree* detik itu juga.
- **Custom Lexer & Parser:** Dibangun dari nol menggunakan algoritma *Recursive Descent Parser*.
- **Smart Error Handling:** Menunjukkan lokasi error yang presisi (Baris dan Kolom) jika ada kesalahan *syntax*.
- **Math Precedence:** Mendukung hierarki operasi matematika (Piramida *Expression* -> *Term* -> *Factor*) sehingga `5 + 3 * 2` di-parse dengan urutan yang benar secara teori Automata.
- **Interactive Visualizer:** Visualisasi pohon sintaksis menggunakan *React Flow* dengan tema *Dark Mode* modern.

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite)
- **State Management:** Zustand
- **Visualization:** React Flow
- **Styling:** Vanilla CSS (Dark/Neon Theme)

## 🚀 Cara Menjalankan Proyek (Local Development)

Pastikan kamu sudah menginstal [Node.js](https://nodejs.org/) di komputermu.

1. Clone repositori ini atau buka terminal di dalam folder proyek.
2. Instal semua dependensi:
   ```bash
   npm install