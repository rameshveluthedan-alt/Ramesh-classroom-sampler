
export interface SamplingParams {
  grade: string;
  total: number;
  sampleSize: number;
  reserveSize: number;
}

export interface SamplingResult extends SamplingParams {
  interval: number;
  start: number;
  mainSample: number[];
  reserveList: number[];
}
