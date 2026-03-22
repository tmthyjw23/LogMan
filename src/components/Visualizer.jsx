import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useCompilerStore } from '../store/store';

// Fungsi untuk mengubah struktur AST menjadi Node dan Edge React Flow
const astToGraph = (ast) => {
  const nodes = [];
  const edges = [];
  let yOffset = 50;

  // Fungsi rekursif untuk menelusuri pohon
  const traverse = (node, parentId = null, xOffset = 250) => {
    if (!node) return;

    // Buat ID unik untuk setiap kotak
    const id = Math.random().toString();
    
    // Tentukan teks yang muncul di dalam kotak
    let label = node.label || node.type;
    if (node.type === "PrintStatement") label = `inga("${node.value}")`;
    if (node.type === "IfStatement") label = `Kalo (${node.condition})`;
    if (node.type === "Program") label = "Mulai (Program)";

    // 1. Tambahkan Node (Kotak)
    nodes.push({
      id: id,
      position: { x: xOffset, y: yOffset },
      data: { label: label },
      style: { 
        backgroundColor: '#fff', 
        border: '2px solid #333', 
        fontWeight: 'bold',
        padding: '10px',
        borderRadius: '5px'
      }
    });

    // 2. Tambahkan Edge (Garis) - Tanpa efek animasi
    if (parentId) {
      edges.push({ 
        id: `e-${parentId}-${id}`, 
        source: parentId, 
        target: id,
        type: 'step', // Garis bersudut tegas, bukan melengkung
        animated: false // Mematikan efek sesuai kebutuhan
      });
    }

    yOffset += 100; // Jarak vertikal ke level berikutnya bawahnya

    // 3. Telusuri anak-anaknya (Block body & Binary Branches)
    
    // Jika node memiliki body (seperti fungsi atau blok if)
    if (node.body && Array.isArray(node.body)) {
      const totalWidth = node.body.length * 200;
      let startX = xOffset - (totalWidth / 2) + 100;
      node.body.forEach((child) => {
        traverse(child, id, startX);
        startX += 200;
      });
    }

    // Jika node adalah Binary/Assignment/Condition (punya left dan right)
    if (node.left) {
      traverse(node.left, id, xOffset - 120); // Tarik garis ke kiri bawah
    }
    if (node.right) {
      traverse(node.right, id, xOffset + 120); // Tarik garis ke kanan bawah
    }
    
    // Tambahan khusus untuk If/While yang punya condition
    if (node.condition && typeof node.condition === 'object') {
      traverse(node.condition, id, xOffset + 150); // Gambar kondisi di sebelah kanan tulisan "Kalo"
    }
  };

  traverse(ast);
  return { nodes, edges };
};


export default function Visualizer() {
  // Ambil data AST dari Zustand store
  const ast = useCompilerStore((state) => state.ast);

  // Memoize hasil grafik supaya tidak dirender ulang terus-menerus kecuali AST berubah
  const { nodes, edges } = useMemo(() => {
    if (!ast) return { nodes: [], edges: [] };
    return astToGraph(ast);
  }, [ast]);

  return (
    <div className="section" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
      <h2><span className="section-number">4</span> Parse Tree</h2>
      <div style={{ flexGrow: 1, backgroundColor: '#0a0a0a', borderRadius: '8px', border: '1px solid #333' }}>
        {ast ? (
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#333" gap={16} />
            <Controls />
          </ReactFlow>
        ) : (
          <div style={{ padding: '20px', color: '#ff4444', textAlign: 'center', marginTop: '50px' }}>
            Perbaiki error di kode untuk melihat visualisasi.
          </div>
        )}
      </div>
    </div>
  );
}