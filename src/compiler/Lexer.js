const keywords = {
  "Kalo": "KW_IF",
  "kalo nda": "KW_ELIF",
  "pas itu": "KW_WHILE",
  "selama": "KW_FOR",
  "inga": "KW_PRINT",
  "maksud": "KW_DEF",
  "kase bale": "KW_RETURN",
  "nda ada": "KW_NONE",
  "deng": "OP_AND",
  "ato": "OP_OR",
  "nda": "OP_NOT",
};

const operators = {
  "==": "OP_EQ",
  "!=": "OP_NEQ",
  "<=": "OP_LTE", // Kurang dari sama dengan
  ">=": "OP_GTE", // Lebih dari sama dengan
  "<": "OP_LT",   // Kurang dari
  ">": "OP_GT",   // Lebih dari
  "=": "OP_ASSIGN",
  "+": "OP_PLUS",
  "-": "OP_MINUS",
  "*": "OP_MULTIPLY", // Sekalian kita tambah kali
  "/": "OP_DIVIDE",   // Sekalian kita tambah bagi
  "{": "LBRACE",
  "}": "RBRACE",
  "(": "LPAREN",
  ")": "RPAREN",
  ";": "SEMICOLON",
  ":": "COLON"
};

export function tokenize(input) {
  let tokens = [];
  let cursor = 0;
  let line = 1;
  let col = 1;

  while (cursor < input.length) {
    let char = input[cursor];

    // 1. Handle Whitespace & Newlines
    if (char === "\n") {
      line++;
      col = 1;
      cursor++;
      continue;
    }
    if (/\s/.test(char)) {
      cursor++;
      col++;
      continue;
    }

    // 2. Handle Multichar Operators (==, !=)
    let twoChar = input.substr(cursor, 2);
    if (operators[twoChar]) {
      tokens.push({ type: operators[twoChar], value: twoChar, line, col });
      cursor += 2;
      col += 2;
      continue;
    }

    // 3. Handle Single Char Operators/Delimiters
    if (operators[char]) {
      tokens.push({ type: operators[char], value: char, line, col });
      cursor++;
      col++;
      continue;
    }

    // 4. Handle Identifiers & Keywords (Kalo, inga, nama_variabel)
    if (/[a-zA-Z_]/.test(char)) {
      let value = "";
      let startCol = col;
      while (cursor < input.length && /[a-zA-Z0-9_\s]/.test(input[cursor])) {
        let potentialKeyword = null;
        for (let kw in keywords) {
          if (input.substr(cursor, kw.length) === kw && !/[a-zA-Z0-9_]/.test(input[cursor + kw.length] || "")) {
            potentialKeyword = kw;
            break;
          }
        }

        if (potentialKeyword) {
          if (value !== "") break; 
          tokens.push({ type: keywords[potentialKeyword], value: potentialKeyword, line, col: startCol });
          cursor += potentialKeyword.length;
          col += potentialKeyword.length;
          value = null; 
          break;
        }

        if (/\s/.test(input[cursor])) break; 
        value += input[cursor];
        cursor++;
        col++;
      }
      
      if (value) {
        tokens.push({ type: "IDENTIFIER", value, line, col: startCol });
      }
      continue;
    }

    // 5. Handle Strings ("Halo")
    if (char === '"') {
      let value = "";
      let startCol = col;
      cursor++; col++; // Skip opening quote
      while (cursor < input.length && input[cursor] !== '"') {
        value += input[cursor];
        cursor++; col++;
      }
      cursor++; col++; // Skip closing quote
      tokens.push({ type: "STRING", value, line, col: startCol });
      continue;
    }

    // 5.5 Handle Numbers (Angka) - INI TAMBAHAN BARUNYA
    if (/[0-9]/.test(char)) {
      let value = "";
      let startCol = col;
      while (cursor < input.length && /[0-9]/.test(input[cursor])) {
        value += input[cursor];
        cursor++; 
        col++;
      }
      tokens.push({ type: "NUMBER", value, line, col: startCol });
      continue;
    }

    // 6. Unknown Character Error
    throw new Error(`Karakter nda dikenal: '${char}' di Baris ${line}, Kolom ${col}`);
  }

  return tokens;
}