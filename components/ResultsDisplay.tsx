
import React from 'react';
import type { SamplingResult } from '../types';

interface ResultsDisplayProps {
  result: SamplingResult;
  onReset: () => void;
}

const NumberBox: React.FC<{ number: number }> = ({ number }) => (
  <div className="bg-slate-100 rounded-md p-3 text-center text-slate-800 font-medium text-lg shadow-sm">
    {number}
  </div>
);

const ParameterItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <span className="text-slate-600">{label}:</span>
    <span className="font-semibold text-slate-800 ml-2">{value}</span>
  </div>
);

function ResultsDisplay({ result, onReset }: ResultsDisplayProps) {
  const { grade, total, sampleSize, reserveSize, interval, start, mainSample, reserveList } = result;

  const handleDownload = () => {
    let content = `SAMPLING RESULTS\n`;
    content += `====================\n\n`;
    content += `PARAMETERS\n`;
    content += `--------------------\n`;
    content += `Grade: ${grade}\n`;
    content += `Total (N): ${total}\n`;
    content += `Sample (n): ${sampleSize}\n`;
    content += `Reserve: ${reserveSize}\n`;
    content += `Interval (k): ${interval}\n`;
    content += `Start: ${start}\n\n`;
    content += `MAIN SAMPLE (${mainSample.length} STUDENTS)\n`;
    content += `--------------------\n`;
    content += `${mainSample.join(', ')}\n\n`;
    content += `RESERVE LIST (${reserveList.length} STUDENTS)\n`;
    content += `--------------------\n`;
    content += `${reserveList.join(', ')}\n\n`;
    content += `INSTRUCTIONS:\n`;
    content += `Get the attendance register and select the students corresponding to the numbers in the MAIN SAMPLE list.\n`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sampling_results_grade_${grade.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-slate-800">Sampling Results</h1>
      
      <section>
        <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2">Parameters</h2>
        <div className="bg-slate-50 p-4 rounded-lg grid grid-cols-2 gap-x-4 gap-y-2 text-md">
          <ParameterItem label="Grade" value={grade} />
          <ParameterItem label="Total (N)" value={total} />
          <ParameterItem label="Sample (n)" value={sampleSize} />
          <ParameterItem label="Reserve" value={reserveSize} />
          <ParameterItem label="Interval (k)" value={interval} />
          <ParameterItem label="Start" value={start} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2">Main Sample ({mainSample.length} Students)</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {mainSample.map(num => <NumberBox key={`main-${num}`} number={num} />)}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase text-slate-500 tracking-wider mb-2">Reserve List ({reserveList.length} Students)</h2>
         <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {reserveList.map(num => <NumberBox key={`reserve-${num}`} number={num} />)}
        </div>
      </section>
      
      <div className="space-y-3 pt-4">
        <button
          onClick={handleDownload}
          className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out"
        >
          Download Results (.txt)
        </button>
        <button
          onClick={onReset}
          className="w-full bg-slate-700 text-white font-bold py-3 px-4 rounded-md hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition duration-150 ease-in-out"
        >
          Start New Sample
        </button>
      </div>
    </div>
  );
}

export default ResultsDisplay;
