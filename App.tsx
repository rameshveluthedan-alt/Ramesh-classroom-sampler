
import React, { useState } from 'react';
import type { SamplingResult } from './types';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [result, setResult] = useState<SamplingResult | null>(null);

  const handleSampleGenerated = (newResult: SamplingResult) => {
    setResult(newResult);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex items-center justify-center font-sans p-4">
      <main className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 md:p-8">
        {result ? (
          <ResultsDisplay result={result} onReset={handleReset} />
        ) : (
          <InputForm onSampleGenerated={handleSampleGenerated} />
        )}
      </main>
    </div>
  );
}

export default App;
