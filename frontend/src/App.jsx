import React, { useState } from 'react';

export default function App() {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');
  const [activeTab, setActiveTab] = useState('calc');
  
  const [amount, setAmount] = useState(1);
  const [fromCurr, setFromCurr] = useState('USD');
  const [toCurr, setToCurr] = useState('EUR');
  const [conversionResult, setConversionResult] = useState(null);

  const handleCalculate = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/calculate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ expression })
});
      const data = await res.json();
      if (data.success) {
        setResult(data.result);
      } else {
        setResult('Error: ' + data.error);
      }
    } catch (err) {
      setResult('Backend Connection Failed');
    }
  };

  const handleConvert = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/convert?from=${fromCurr}&to=${toCurr}&amount=${amount}`);
      const data = await res.json();
      if (data.success) {
        setConversionResult(`${data.amount} ${data.from} = ${data.result.toFixed(4)} ${data.to} (Rate: ${data.rate})`);
      } else {
        setConversionResult('Conversion failed');
      }
    } catch (err) {
      setConversionResult('API Error');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', background: '#1e293b', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
      <h2 style={{ textAlign: 'center', color: '#38bdf8' }}>Advanced Local API Calculator</h2>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('calc')} style={{ padding: '8px 16px', background: activeTab === 'calc' ? '#0284c7' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Scientific Calculator</button>
        <button onClick={() => setActiveTab('api')} style={{ padding: '8px 16px', background: activeTab === 'api' ? '#0284c7' : '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Live Currency API</button>
      </div>

      {activeTab === 'calc' ? (
        <div>
          <input 
            type="text" 
            value={expression} 
            onChange={(e) => setExpression(e.target.value)} 
            placeholder="e.g. sin(45 deg) + sqrt(16) * 3"
            style={{ width: '100%', padding: '12px', fontSize: '18px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px', boxSizing: 'border-box', marginBottom: '15px' }}
          />
          <button onClick={handleCalculate} style={{ width: '100%', padding: '12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Compute via Local API</button>
          
          <div style={{ marginTop: '20px', padding: '15px', background: '#0f172a', borderRadius: '6px', minHeight: '40px' }}>
            <strong>Result:</strong> <span style={{ color: '#4ade80', fontSize: '20px' }}>{result}</span>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ flex: 1, padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }} />
            <select value={fromCurr} onChange={(e) => setFromCurr(e.target.value)} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
            </select>
            <select value={toCurr} onChange={(e) => setToCurr(e.target.value)} style={{ padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '6px' }}>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="JPY">JPY</option>
            </select>
          </div>
          <button onClick={handleConvert} style={{ width: '100%', padding: '12px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>Fetch External Exchange Rate</button>

          <div style={{ marginTop: '20px', padding: '15px', background: '#0f172a', borderRadius: '6px', minHeight: '40px' }}>
            <strong>Live Conversion:</strong> <span style={{ color: '#38bdf8', fontSize: '18px' }}>{conversionResult}</span>
          </div>
        </div>
      )}
    </div>
  );
}