import React from 'react';
import Editor from './components/Editor';
import Visualizer from './components/Visualizer';

export default function App() {
  const cfgText = `Program -> Statement*
Statement -> Assignment | Print | If | While | For | Def
Assignment -> ID "=" Expr ";"
Print -> "inga" "(" Expr ")" ";"
If -> "Kalo" "(" Expr ")" "{" Statement* "}"
While -> "pas itu" "(" Expr ")" "{" Statement* "}"
Expr -> Term (("+"|"-") Term)*
Term -> Factor (("*"|"/") Factor)*
Factor -> NUMBER | ID | "(" Expr ")"`;

  return (
    <div>
      <header>
        <h1>🤖 Compiler Illustrator</h1>
        <p>Compiler Logat Manado(LogMan Edition)</p>
        <code>by tmthyjw</code> 
      </header>
      
      <div className="container">
        <div className="sections">
          
          {/* Section 1: Define Language (Read-Only Info for now) */}
          <div className="section">
            <h2><span className="section-number">1</span> Define Language</h2>
            <p style={{color: '#888', marginBottom: '10px', fontSize: '0.9rem'}}>
              *Parser saat ini di-hardcode untuk dialek Manado.
            </p>
            <textarea readOnly value={cfgText} style={{ color: '#ccc' }} />
          </div>
          
          {/* Section 2: Generate CFG */}
          <div className="section">
            <h2><span className="section-number">2</span> Generate CFG</h2>
            <p style={{color:'#888', marginBottom:'1rem'}}>Aturan CFG yang aktif di mesin Parser:</p>
            <pre id="cfgDisplay">{cfgText}</pre>
            <button onClick={() => {
              navigator.clipboard.writeText(cfgText);
              alert('CFG disalin ke clipboard!');
            }}>Copy CFG</button>
          </div>
          
          {/* Section 3: Test Code (Memanggil Editor kita) */}
          <Editor />
          
          {/* Section 4: Parse Tree (Memanggil Visualizer kita) */}
          <Visualizer />
          
        </div>
      </div>
    </div>
  );
}