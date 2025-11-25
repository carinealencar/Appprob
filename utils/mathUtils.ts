import { 
  CalculationOperator, 
  DataPoint, 
  DistributionType, 
  NormalParams, 
  PoissonParams, 
  UniformParams,
  ExponentialParams,
  DiscreteUniformParams,
  BernoulliParams,
  BinomialParams
} from '../types';

// --- General Helpers ---

export const isContinuous = (type: DistributionType): boolean => {
  return [
    DistributionType.NORMAL, 
    DistributionType.UNIFORM, 
    DistributionType.EXPONENTIAL
  ].includes(type);
};

// Error function (erf)
const erf = (x: number): number => {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
};

const factorial = (n: number): number => {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
};

const combinations = (n: number, k: number): number => {
  if (k < 0 || k > n) return 0;
  return factorial(n) / (factorial(k) * factorial(n - k));
};

// --- NORMAL ---

const normalCDF = (x: number, mean: number, stdDev: number): number => {
  if (stdDev <= 0) return 0;
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
};

const normalPDF = (x: number, mean: number, stdDev: number): number => {
  if (stdDev <= 0) return 0;
  const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
};

export const generateNormalData = (params: NormalParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { mean, stdDev } = params;
  let start = mean - 4 * stdDev;
  let end = mean + 4 * stdDev;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = xMinOverride;
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = xMaxOverride;
  if (start >= end) end = start + 1;

  const points = 200;
  const step = (end - start) / points;
  const data: DataPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    data.push({ x: Number(x.toFixed(2)), y: normalPDF(x, mean, stdDev), label: x.toFixed(1) });
  }
  return data;
};

export const calculateNormalProbability = (params: NormalParams, targetX: number, op: CalculationOperator, targetX2?: number): number => {
  const { mean, stdDev } = params;
  const cdf1 = normalCDF(targetX, mean, stdDev);
  switch (op) {
    case CalculationOperator.LESS_EQUAL: return cdf1;
    case CalculationOperator.GREATER: return 1 - cdf1;
    case CalculationOperator.BETWEEN:
      if (targetX2 === undefined) return 0;
      return Math.abs(normalCDF(targetX2, mean, stdDev) - cdf1);
    default: return 0;
  }
};

// --- UNIFORM (Continuous) ---

const uniformPDF = (x: number, min: number, max: number): number => {
  if (x < min || x > max) return 0;
  return 1 / (max - min);
};

const uniformCDF = (x: number, min: number, max: number): number => {
  if (x < min) return 0;
  if (x > max) return 1;
  return (x - min) / (max - min);
};

export const generateUniformData = (params: UniformParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { min, max } = params;
  // Visualize a bit wider than the range
  const margin = (max - min) * 0.5;
  let start = min - margin;
  let end = max + margin;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = xMinOverride;
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = xMaxOverride;
  if (start >= end) end = start + 1;

  const points = 200;
  const step = (end - start) / points;
  const data: DataPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    data.push({ x: Number(x.toFixed(2)), y: uniformPDF(x, min, max), label: x.toFixed(1) });
  }
  return data;
};

export const calculateUniformProbability = (params: UniformParams, targetX: number, op: CalculationOperator, targetX2?: number): number => {
  const { min, max } = params;
  const cdf1 = uniformCDF(targetX, min, max);
  switch (op) {
    case CalculationOperator.LESS_EQUAL: return cdf1;
    case CalculationOperator.GREATER: return 1 - cdf1;
    case CalculationOperator.BETWEEN:
      if (targetX2 === undefined) return 0;
      return Math.abs(uniformCDF(targetX2, min, max) - cdf1);
    default: return 0;
  }
};

// --- EXPONENTIAL ---

const exponentialPDF = (x: number, rate: number): number => {
  if (x < 0) return 0;
  return rate * Math.exp(-rate * x);
};

const exponentialCDF = (x: number, rate: number): number => {
  if (x < 0) return 0;
  return 1 - Math.exp(-rate * x);
};

export const generateExponentialData = (params: ExponentialParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { rate } = params;
  // Default range: 0 to where PDF drops significantly (e.g., CDF ~0.99) => x = -ln(0.01)/rate ≈ 4.6/rate
  let start = 0;
  let end = 5 / rate;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = xMinOverride;
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = xMaxOverride;
  if (start >= end) end = start + 1;

  const points = 200;
  const step = (end - start) / points;
  const data: DataPoint[] = [];

  for (let i = 0; i <= points; i++) {
    const x = start + i * step;
    data.push({ x: Number(x.toFixed(2)), y: exponentialPDF(x, rate), label: x.toFixed(1) });
  }
  return data;
};

export const calculateExponentialProbability = (params: ExponentialParams, targetX: number, op: CalculationOperator, targetX2?: number): number => {
  const { rate } = params;
  const cdf1 = exponentialCDF(targetX, rate);
  switch (op) {
    case CalculationOperator.LESS_EQUAL: return cdf1;
    case CalculationOperator.GREATER: return 1 - cdf1;
    case CalculationOperator.BETWEEN:
      if (targetX2 === undefined) return 0;
      return Math.abs(exponentialCDF(targetX2, rate) - cdf1);
    default: return 0;
  }
};

// --- POISSON ---

const poissonPMF = (k: number, lambda: number): number => {
  if (k < 0 || !Number.isInteger(k)) return 0;
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
};

const poissonCDF = (k: number, lambda: number): number => {
  if (k < 0) return 0;
  let sum = 0;
  const limit = Math.floor(k);
  for (let i = 0; i <= limit; i++) sum += poissonPMF(i, lambda);
  return sum;
};

export const generatePoissonData = (params: PoissonParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { lambda } = params;
  let start = 0;
  let maxK = Math.ceil(lambda + 4 * Math.sqrt(lambda)) + 2;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = Math.max(0, Math.floor(xMinOverride));
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) maxK = Math.max(maxK, Math.ceil(xMaxOverride));

  const data: DataPoint[] = [];
  for (let k = start; k <= maxK; k++) {
    data.push({ x: k, y: poissonPMF(k, lambda), label: k.toString() });
  }
  return data;
};

export const calculatePoissonProbability = (params: PoissonParams, targetX: number, op: CalculationOperator): number => {
  const { lambda } = params;
  switch (op) {
    case CalculationOperator.EQUAL: return poissonPMF(targetX, lambda);
    case CalculationOperator.LESS_EQUAL: return poissonCDF(targetX, lambda);
    case CalculationOperator.GREATER: return 1 - poissonCDF(targetX, lambda);
    default: return 0;
  }
};

// --- DISCRETE UNIFORM ---

const discreteUniformPMF = (k: number, min: number, max: number): number => {
  if (k < min || k > max || !Number.isInteger(k)) return 0;
  return 1 / (max - min + 1);
};

const discreteUniformCDF = (k: number, min: number, max: number): number => {
  if (k < min) return 0;
  if (k >= max) return 1;
  return (Math.floor(k) - min + 1) / (max - min + 1);
};

export const generateDiscreteUniformData = (params: DiscreteUniformParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { min, max } = params;
  let start = min - 1;
  let end = max + 1;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = Math.floor(xMinOverride);
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = Math.ceil(xMaxOverride);

  const data: DataPoint[] = [];
  for (let k = start; k <= end; k++) {
    data.push({ x: k, y: discreteUniformPMF(k, min, max), label: k.toString() });
  }
  return data;
};

export const calculateDiscreteUniformProbability = (params: DiscreteUniformParams, targetX: number, op: CalculationOperator): number => {
  const { min, max } = params;
  switch (op) {
    case CalculationOperator.EQUAL: return discreteUniformPMF(targetX, min, max);
    case CalculationOperator.LESS_EQUAL: return discreteUniformCDF(targetX, min, max);
    case CalculationOperator.GREATER: return 1 - discreteUniformCDF(targetX, min, max);
    default: return 0;
  }
};

// --- BERNOULLI ---

const bernoulliPMF = (k: number, p: number): number => {
  if (k === 1) return p;
  if (k === 0) return 1 - p;
  return 0;
};

export const generateBernoulliData = (params: BernoulliParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { prob } = params;
  // Always just 0 and 1, but respect axis if user zooms out weirdly
  let start = -1; 
  let end = 2;
  
  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = Math.floor(xMinOverride);
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = Math.ceil(xMaxOverride);
  
  const data: DataPoint[] = [];
  for (let k = start; k <= end; k++) {
     // Only add points for integers
     data.push({ x: k, y: bernoulliPMF(k, prob), label: k.toString() });
  }
  return data;
};

export const calculateBernoulliProbability = (params: BernoulliParams, targetX: number, op: CalculationOperator): number => {
  const { prob } = params;
  // Discrete calculation logic
  switch (op) {
    case CalculationOperator.EQUAL: return bernoulliPMF(targetX, prob);
    case CalculationOperator.LESS_EQUAL: 
      if (targetX < 0) return 0;
      if (targetX >= 1) return 1;
      return 1 - prob; // targetX is 0 (or 0.something)
    case CalculationOperator.GREATER: 
      if (targetX < 0) return 1;
      if (targetX >= 1) return 0;
      return prob; // targetX is 0
    default: return 0;
  }
};

// --- BINOMIAL ---

const binomialPMF = (k: number, n: number, p: number): number => {
  if (k < 0 || k > n || !Number.isInteger(k)) return 0;
  return combinations(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
};

const binomialCDF = (k: number, n: number, p: number): number => {
  if (k < 0) return 0;
  let sum = 0;
  const limit = Math.min(Math.floor(k), n);
  for (let i = 0; i <= limit; i++) sum += binomialPMF(i, n, p);
  return sum;
};

export const generateBinomialData = (params: BinomialParams, xMinOverride?: number, xMaxOverride?: number): DataPoint[] => {
  const { trials, prob } = params;
  let start = 0;
  let end = trials;

  if (xMinOverride !== undefined && !isNaN(xMinOverride)) start = Math.max(0, Math.floor(xMinOverride));
  if (xMaxOverride !== undefined && !isNaN(xMaxOverride)) end = Math.min(trials, Math.ceil(xMaxOverride));
  
  // Optimization: If n is huge, maybe don't render all bars? 
  // For this app, we assume reasonable N for visualization.
  
  const data: DataPoint[] = [];
  for (let k = start; k <= end; k++) {
    data.push({ x: k, y: binomialPMF(k, trials, prob), label: k.toString() });
  }
  return data;
};

export const calculateBinomialProbability = (params: BinomialParams, targetX: number, op: CalculationOperator): number => {
  const { trials, prob } = params;
  switch (op) {
    case CalculationOperator.EQUAL: return binomialPMF(targetX, trials, prob);
    case CalculationOperator.LESS_EQUAL: return binomialCDF(targetX, trials, prob);
    case CalculationOperator.GREATER: return 1 - binomialCDF(targetX, trials, prob);
    default: return 0;
  }
};
