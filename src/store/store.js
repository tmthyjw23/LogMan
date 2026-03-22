import { create } from 'zustand';
import { tokenize } from '../compiler/Lexer';
import { Parser } from '../compiler/parser';

export const useCompilerStore = create((set) => ({
  // State
  // code: 'maksud utama() {\n  inga("Halo Manado");\n}',
  // Di dalam src/store/store.js
  code: 'maksud utama() {\n  inga("Timothy ganteng");\n  Kalo (x == 1) {\n    inga("Mantap!");\n  }\n}',
  tokens: [],
  ast: null,
  error: null,

  // Actions
  setCode: (newCode) => set({ code: newCode }),
  
  compile: () => set((state) => {
    try {
      // 1. Jalankan Lexer
      const newTokens = tokenize(state.code);
      
      // 2. Jalankan Parser
      const parser = new Parser(newTokens);
      const newAst = parser.parse();
      
      // Jika sukses, simpan hasil dan bersihkan error
      return { tokens: newTokens, ast: newAst, error: null };
    } catch (err) {
      // Jika gagal (Syntax/Lexical Error), tangkap pesan errornya
      return { error: err.message, ast: null };
    }
  }),
}));
