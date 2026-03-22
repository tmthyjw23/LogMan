import React, { useEffect } from 'react';
import { useCompilerStore } from '../store/store';

export default function Editor() {
  const code = useCompilerStore((state) => state.code);
  const error = useCompilerStore((state) => state.error);
  const setCode = useCompilerStore((state) => state.setCode);
  const compile = useCompilerStore((state) => state.compile);

  useEffect(() => {
    compile();
  }, [compile]);

  const handleTyping = (e) => {
    setCode(e.target.value);
    compile(); 
  };

  return (
    <div className="section">
      <h2><span className="section-number">3</span> Test Code</h2>
      <textarea
        value={code}
        onChange={handleTyping}
        spellCheck="false"
        placeholder="Tulis kode Manado di sini..."
      />
      <button onClick={compile}>Parse Code 🚀</button>

      {/* Kotak Status Berubah Sesuai Tema Baru */}
      <div className={`result ${error ? 'invalid' : 'valid'}`}>
        {error ? (
          <>
            <span className="status-badge status-invalid">✗ Error</span>
            <br/><br/>{error}
          </>
        ) : (
          <>
            <span className="status-badge status-valid">✓ Valid</span> 
            Pohon Sintaksis berhasil dibentuk!
          </>
        )}
      </div>
    </div>
  );
}