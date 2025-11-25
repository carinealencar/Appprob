export enum DistributionType {
  // Continuous
  NORMAL = 'NORMAL',
  UNIFORM = 'UNIFORM',
  EXPONENTIAL = 'EXPONENTIAL',
  
  // Discrete
  POISSON = 'POISSON',
  DISCRETE_UNIFORM = 'DISCRETE_UNIFORM',
  BERNOULLI = 'BERNOULLI',
  BINOMIAL = 'BINOMIAL',
}

export enum CalculationOperator {
  LESS_EQUAL = 'LESS_EQUAL', // P(X <= x)
  GREATER = 'GREATER',       // P(X > x)
  EQUAL = 'EQUAL',           // P(X = x) - Only for Discrete
  BETWEEN = 'BETWEEN',       // P(x1 < X < x2) - Only for Continuous
}

// --- Params Interfaces ---

export interface NormalParams {
  mean: number;
  stdDev: number;
}

export interface UniformParams {
  min: number;
  max: number;
}

export interface ExponentialParams {
  rate: number; // lambda
}

export interface PoissonParams {
  lambda: number;
}

export interface DiscreteUniformParams {
  min: number;
  max: number;
}

export interface BernoulliParams {
  prob: number; // p
}

export interface BinomialParams {
  trials: number; // n
  prob: number;   // p
}

export type DistributionParams = 
  | NormalParams 
  | UniformParams 
  | ExponentialParams 
  | PoissonParams
  | DiscreteUniformParams
  | BernoulliParams
  | BinomialParams;

export interface DataPoint {
  x: number;
  y: number; // Probability (PDF or PMF)
  label: string;
  highlightY?: number;
  baseY?: number;
}

export interface ProbabilityResult {
  value: number;
  label: string;
}

export interface GeminiInsightState {
  loading: boolean;
  text: string | null;
  error: string | null;
}