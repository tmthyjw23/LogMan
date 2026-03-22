export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.cursor = 0;
  }

  peek() {
    return this.tokens[this.cursor] || { type: "EOF", value: "" };
  }

  eat(expectedType) {
    const token = this.peek();
    if (token.type !== expectedType) {
      throw new Error(`Salah di Baris ${token.line}: Kita cari "${expectedType}", mar dapa "${token.value}".`);
    }
    this.cursor++;
    return token;
  }

  // --- PIRAMIDA EKSPRESI (Dari Prioritas Terendah ke Tertinggi) ---

  // 1. Logika (deng, ato)
  parseExpression() {
    let left = this.parseComparison();
    while (["OP_AND", "OP_OR"].includes(this.peek().type)) {
      const operator = this.eat(this.peek().type).value;
      const right = this.parseComparison();
      left = { type: "BinaryExpression", left, operator, right, label: operator };
    }
    return left;
  }

  // 2. Perbandingan (==, !=, <, >)
  parseComparison() {
    let left = this.parseMathExpr();
    while (["OP_EQ", "OP_NEQ", "OP_LT", "OP_GT", "OP_LTE", "OP_GTE"].includes(this.peek().type)) {
      const operator = this.eat(this.peek().type).value;
      const right = this.parseMathExpr();
      left = { type: "BinaryExpression", left, operator, right, label: operator };
    }
    return left;
  }

  // 3. Matematika: Tambah/Kurang (Sesuai Slide: Expr)
  parseMathExpr() {
    let left = this.parseTerm();
    while (["OP_PLUS", "OP_MINUS"].includes(this.peek().type)) {
      const operator = this.eat(this.peek().type).value;
      const right = this.parseTerm();
      left = { type: "BinaryExpression", left, operator, right, label: operator }; // Node Cabang
    }
    return left;
  }

  // 4. Matematika: Kali/Bagi (Sesuai Slide: Term)
  parseTerm() {
    let left = this.parseFactor();
    while (["OP_MULTIPLY", "OP_DIVIDE"].includes(this.peek().type)) {
      const operator = this.eat(this.peek().type).value;
      const right = this.parseFactor();
      left = { type: "BinaryExpression", left, operator, right, label: operator }; // Node Cabang
    }
    return left;
  }

  // 5. Angka Dasar (Sesuai Slide: Factor)
  parseFactor() {
    const token = this.peek();
    
    if (token.type === "NUMBER") {
      this.eat("NUMBER");
      return { type: "Literal", value: token.value, label: token.value }; // Daun Pohon
    }
    if (token.type === "IDENTIFIER") {
      this.eat("IDENTIFIER");
      return { type: "Identifier", value: token.value, label: token.value }; // Daun Pohon
    }
    if (token.type === "LPAREN") {
      this.eat("LPAREN");
      const node = this.parseExpression(); // Masuk lagi ke piramida paling atas
      this.eat("RPAREN");
      return node;
    }

    throw new Error(`Baris ${token.line}: Mustinya angka, variabel, atau '(', mar dapa '${token.value}'`);
  }

  // --- MAIN PARSING LOGIC ---

  parseBlock() {
    this.eat("LBRACE");
    const body = [];
    while (this.peek().type !== "RBRACE" && this.peek().type !== "EOF") {
      body.push(this.parseStatement());
    }
    this.eat("RBRACE");
    return body;
  }

  parse() {
    const nodes = [];
    while (this.peek().type !== "EOF") {
      nodes.push(this.parseStatement());
    }
    return { type: "Program", body: nodes, label: "Mulai (Program)" };
  }

  parseStatement() {
    const token = this.peek();
    if (token.type === "KW_DEF") return this.parseDef();
    if (token.type === "KW_PRINT") return this.parsePrint();
    if (token.type === "KW_IF") return this.parseIf();
    if (token.type === "KW_WHILE") return this.parseWhile();
    if (token.type === "KW_FOR") return this.parseFor();
    if (token.type === "IDENTIFIER") return this.parseAssignment();

    throw new Error(`Baris ${token.line}: Perintah "${token.value}" nda dikenal.`);
  }

  // Update Statement agar menggunakan pohon ekspresi baru
  parseAssignment() {
    const name = this.eat("IDENTIFIER");
    this.eat("OP_ASSIGN");
    const exprTree = this.parseExpression();
    this.eat("SEMICOLON");

    // Persis seperti visualisasi di Slide 30
    return {
      type: "Assignment",
      label: "=",
      left: { type: "Identifier", label: name.value },
      right: exprTree
    };
  }

  parsePrint() {
    this.eat("KW_PRINT");
    this.eat("LPAREN");
    
    let exprTree;
    if (this.peek().type === "STRING") {
        const str = this.eat("STRING");
        exprTree = { type: "Literal", label: `"${str.value}"` };
    } else {
        exprTree = this.parseExpression();
    }
    
    this.eat("RPAREN");
    this.eat("SEMICOLON");
    return { type: "PrintStatement", label: "inga", right: exprTree };
  }

  parseIf() {
    this.eat("KW_IF");
    this.eat("LPAREN");
    const conditionTree = this.parseExpression();
    this.eat("RPAREN");
    const body = this.parseBlock();
    return { type: "IfStatement", label: "Kalo", condition: conditionTree, body: body };
  }

  parseWhile() {
    this.eat("KW_WHILE");
    this.eat("LPAREN");
    const conditionTree = this.parseExpression();
    this.eat("RPAREN");
    const body = this.parseBlock();
    return { type: "WhileStatement", label: "pas itu", condition: conditionTree, body: body };
  }

  parseDef() {
    this.eat("KW_DEF");
    const name = this.eat("IDENTIFIER");
    this.eat("LPAREN");
    this.eat("RPAREN");
    const body = this.parseBlock();
    return { type: "FunctionDeclaration", label: `maksud ${name.value}()`, body: body };
  }

  parseFor() {
    this.eat("KW_FOR");
    this.eat("LPAREN");
    // Simplified for prototype: expects standard format (i = 0; i < 10; i = i + 1)
    const init = this.parseAssignment();
    const condition = this.parseExpression();
    this.eat("SEMICOLON");
    const update = this.parseStatement(); // Note: must not end with semicolon in real grammar, but we adapt for simple logic
    this.eat("RPAREN");
    const body = this.parseBlock();
    return { type: "ForStatement", label: "selama", body: [init, condition, update, ...body] };
  }
}