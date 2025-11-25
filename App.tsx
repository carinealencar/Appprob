import React, { useState, useEffect, useCallback } from 'react';
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
  BinomialParams,
  ProbabilityResult 
} from './types';
import { 
  calculateNormalProbability,
  calculatePoissonProbability,
  calculateUniformProbability,
  calculateExponentialProbability,
  calculateDiscreteUniformProbability,
  calculateBernoulliProbability,
  calculateBinomialProbability,
  generateNormalData, 
  generatePoissonData,
  generateUniformData,
  generateExponentialData,
  generateDiscreteUniformData,
  generateBernoulliData,
  generateBinomialData
} from './utils/mathUtils';

import InputPanel from './components/InputPanel';
import Visualization from './components/Visualization';
import StatsPanel from './components/StatsPanel';
import { isContinuous } from './utils/mathUtils';

const App: React.FC = () => {
  // Application State
  const [distributionType, setDistributionType] = useState<DistributionType>(DistributionType.NORMAL);
  
  // Parameters State
  // Normal
  const [mean, setMean] = useState<number>(0);
  const [stdDev, setStdDev] = useState<number>(1);
  // Poisson & Exponential (Lambda/Rate)
  const [lambda, setLambda] = useState<number>(1);
  // Uniform (Cont & Disc)
  const [distMin, setDistMin] = useState<number>(0);
  const [distMax, setDistMax] = useState<number>(10);
  // Binomial / Bernoulli
  const [distProb, setDistProb] = useState<number>(0.5); // p
  const [trials, setTrials] = useState<number>(10); // n

  // Probability Calculation State
  const [targetX, setTargetX] = useState<number>(0);
  const [targetX2, setTargetX2] = useState<number>(1); // For "Between" calculation
  const [calcOp, setCalcOp] = useState<CalculationOperator>(CalculationOperator.LESS_EQUAL);

  // Axis Config State
  const [xMin, setXMin] = useState<string>('');
  const [xMax, setXMax] = useState<string>('');
  const [yMin, setYMin] = useState<string>('');
  const [yMax, setYMax] = useState<string>('');

  // Results
  const [chartData, setChartData] = useState<DataPoint[]>([]);
  const [probabilityResult, setProbabilityResult] = useState<ProbabilityResult | undefined>(undefined);
  
  // Calculate and Update Data
  const runModel = useCallback(() => {
    let data: DataPoint[] = [];
    let probValue = 0;
    let probLabel = "";

    const xMinNum = xMin !== '' ? parseFloat(xMin) : undefined;
    const xMaxNum = xMax !== '' ? parseFloat(xMax) : undefined;

    // 1. Math Generation & Probability Calc
    switch (distributionType) {
      case DistributionType.NORMAL: {
        const params: NormalParams = { mean, stdDev };
        data = generateNormalData(params, xMinNum, xMaxNum);
        probValue = calculateNormalProbability(params, targetX, calcOp, targetX2);
        break;
      }
      case DistributionType.UNIFORM: {
        const params: UniformParams = { min: distMin, max: distMax };
        data = generateUniformData(params, xMinNum, xMaxNum);
        probValue = calculateUniformProbability(params, targetX, calcOp, targetX2);
        break;
      }
      case DistributionType.EXPONENTIAL: {
        const params: ExponentialParams = { rate: lambda };
        data = generateExponentialData(params, xMinNum, xMaxNum);
        probValue = calculateExponentialProbability(params, targetX, calcOp, targetX2);
        break;
      }
      case DistributionType.POISSON: {
        const params: PoissonParams = { lambda };
        data = generatePoissonData(params, xMinNum, xMaxNum);
        probValue = calculatePoissonProbability(params, targetX, calcOp);
        break;
      }
      case DistributionType.DISCRETE_UNIFORM: {
        const params: DiscreteUniformParams = { min: distMin, max: distMax };
        data = generateDiscreteUniformData(params, xMinNum, xMaxNum);
        probValue = calculateDiscreteUniformProbability(params, targetX, calcOp);
        break;
      }
      case DistributionType.BERNOULLI: {
        const params: BernoulliParams = { prob: distProb };
        data = generateBernoulliData(params, xMinNum, xMaxNum);
        probValue = calculateBernoulliProbability(params, targetX, calcOp);
        break;
      }
      case DistributionType.BINOMIAL: {
        const params: BinomialParams = { trials, prob: distProb };
        data = generateBinomialData(params, xMinNum, xMaxNum);
        probValue = calculateBinomialProbability(params, targetX, calcOp);
        break;
      }
    }

    // Format Label
    if (calcOp === CalculationOperator.BETWEEN) {
      const min = Math.min(targetX, targetX2);
      const max = Math.max(targetX, targetX2);
      probLabel = `P(${min} < X < ${max})`;
    } else {
      const opSymbol = calcOp === CalculationOperator.LESS_EQUAL ? '≤' : calcOp === CalculationOperator.GREATER ? '>' : '=';
      probLabel = `P(X ${opSymbol} ${targetX})`;
    }

    setChartData(data);
    setProbabilityResult({ value: probValue, label: probLabel });
  }, [distributionType, mean, stdDev, lambda, distMin, distMax, distProb, trials, targetX, targetX2, calcOp, xMin, xMax]);

  // Initial Run
  useEffect(() => {
    runModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  // Auto-run when distribution type switches
  useEffect(() => {
    const isCont = isContinuous(distributionType);
    
    // Reset operator logic if switching between discrete/continuous
    if (!isCont && calcOp === CalculationOperator.BETWEEN) {
      setCalcOp(CalculationOperator.LESS_EQUAL);
    }
    if (isCont && calcOp === CalculationOperator.EQUAL) {
      setCalcOp(CalculationOperator.LESS_EQUAL); // Continuous shouldn't use Equal usually
    }

    runModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionType]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">ProbModeler</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">Calculadora de Probabilidade</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Controls */}
          <div className="lg:col-span-4 space-y-6">
            <InputPanel 
              type={distributionType}
              setType={setDistributionType}
              
              // Params Passing
              mean={mean} setMean={setMean}
              stdDev={stdDev} setStdDev={setStdDev}
              lambda={lambda} setLambda={setLambda}
              distMin={distMin} setDistMin={setDistMin}
              distMax={distMax} setDistMax={setDistMax}
              distProb={distProb} setDistProb={setDistProb}
              trials={trials} setTrials={setTrials}

              // Calc
              targetX={targetX} setTargetX={setTargetX}
              targetX2={targetX2} setTargetX2={setTargetX2}
              calcOp={calcOp} setCalcOp={setCalcOp}

              // Axis Config
              xMin={xMin} setXMin={setXMin}
              xMax={xMax} setXMax={setXMax}
              yMin={yMin} setYMin={setYMin}
              yMax={yMax} setYMax={setYMax}

              onRun={runModel}
            />
          </div>

          {/* Visualization Area */}
          <div className="lg:col-span-8">
            <StatsPanel probabilityResult={probabilityResult} />
            <Visualization 
              data={chartData} 
              type={distributionType} 
              xMin={xMin !== '' ? parseFloat(xMin) : 'auto'}
              xMax={xMax !== '' ? parseFloat(xMax) : 'auto'}
              yMin={yMin !== '' ? parseFloat(yMin) : 'auto'}
              yMax={yMax !== '' ? parseFloat(yMax) : 'auto'}
              // Pass Highlight Props
              targetX={targetX}
              targetX2={targetX2}
              calcOp={calcOp}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;