
import React, { useState } from 'react';
import type { SamplingResult, SamplingParams } from '../types';

interface InputFormProps {
  onSampleGenerated: (result: SamplingResult) => void;
}

const InputField: React.FC<{ label: string; id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string, placeholder?: string }> = ({ label, id, value, onChange, type = "text", placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
      required
    />
  </div>
);

function InputForm({ onSampleGenerated }: InputFormProps) {
  const [params, setParams] = useState<SamplingParams>({
    grade: '',
    total: 30,
    sampleSize: 6,
    reserveSize: 3,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setParams(prev => ({
      ...prev,
      [id]: id === 'grade' ? value : (value === '' ? '' : Number(value))
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const { total, sampleSize, reserveSize } = params;

    if (total <= 0 || sampleSize <= 0 || reserveSize < 0) {
      setError("Total, sample size, and reserve size must be positive numbers.");
      return;
    }
    if (sampleSize > total) {
      setError("Sample size cannot be greater than the total number of students.");
      return;
    }
    if (sampleSize + reserveSize > total) {
      setError("The sum of sample size and reserve size cannot exceed the total.");
      return;
    }

    // Calculate interval (k)
    const interval = Math.floor(total / sampleSize);
    if (interval < 1) {
      setError("Cannot perform systematic sampling. The total is too small for the requested sample size, resulting in an interval less than 1.");
      return;
    }
    
    // Generate random start
    const start = Math.floor(Math.random() * interval) + 1;

    // Generate main sample
    const mainSample: number[] = [];
    for (let i = 0; i < sampleSize; i++) {
      const studentNumber = start + i * interval;
      if (studentNumber <= total) {
        mainSample.push(studentNumber);
      } else {
        // This case is unlikely with correct logic but is a safeguard
        break;
      }
    }
    
    // Generate reserve list
    const allStudents = Array.from({ length: total }, (_, i) => i + 1);
    const remainingStudents = allStudents.filter(student => !mainSample.includes(student));
    
    // Shuffle remaining students for random reserve list
    for (let i = remainingStudents.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingStudents[i], remainingStudents[j]] = [remainingStudents[j], remainingStudents[i]];
    }

    const reserveList = remainingStudents.slice(0, reserveSize);

    onSampleGenerated({ ...params, interval, start, mainSample, reserveList });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Systematic Sampling</h1>
        <p className="text-slate-500 mt-1">Enter the parameters to generate a sample.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField 
          label="Grade" 
          id="grade" 
          value={params.grade} 
          onChange={handleChange}
          placeholder="e.g., Grade 6" 
        />
        <InputField 
          label="Total Students (N)" 
          id="total" 
          type="number" 
          value={String(params.total)} 
          onChange={handleChange}
        />
        <InputField 
          label="Sample Size (n)" 
          id="sampleSize" 
          type="number" 
          value={String(params.sampleSize)} 
          onChange={handleChange}
        />
        <InputField 
          label="Reserve List Size" 
          id="reserveSize" 
          type="number" 
          value={String(params.reserveSize)} 
          onChange={handleChange}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
        >
          Generate Sample
        </button>
      </form>
    </div>
  );
}

export default InputForm;
