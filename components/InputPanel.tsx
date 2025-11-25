import React from 'react';
import { CalculationOperator, DistributionType } from '../types';
import { isContinuous } from '../utils/mathUtils';

interface InputPanelProps {
  type: DistributionType;
  setType: (type: DistributionType) => void;
  
  // Params - Normal
  mean: number;
  setMean: (val: number) => void;
  stdDev: number;
  setStdDev: (val: number) => void;
  
  // Params - Poisson/Exp
  lambda: number;
  setLambda: (val: number) => void;

  // Params - Uniforms
  distMin: number;
  setDistMin: (val: number) => void;
  distMax: number;
  setDistMax: (val: number) => void;

  // Params - Binomial/Bernoulli
  distProb: number;
  setDistProb: (val: number) => void;
  trials: number;
  setTrials: (val: number) => void;

  // Probability Calc Props
  targetX: number;
  setTargetX: (val: number) => void;
  targetX2: number;
  setTargetX2: (val: number) => void;
  calcOp: CalculationOperator;
  setCalcOp: (op: CalculationOperator) => void;

  // Axis Config
  xMin: string;
  setXMin: (val: string) => void;
  xMax: string;
  setXMax: (val: string) => void;
  yMin: string;
  setYMin: (val: string) => void;
  yMax: string;
  setYMax: (val: string) => void;

  onRun: () => void;
}

const InputPanel: React.FC<InputPanelProps> = ({
  type,
  setType,
  mean,
  setMean,
  stdDev,
  setStdDev,
  lambda,
  setLambda,
  distMin,
  setDistMin,
  distMax,
  setDistMax,
  distProb,
  setDistProb,
  trials,
  setTrials,
  targetX,
  setTargetX,
  targetX2,
  setTargetX2,
  calcOp,
  setCalcOp,
  xMin,
  setXMin,
  xMax,
  setXMax,
  yMin,
  setYMin,
  yMax,
  setYMax,
  onRun,
}) => {
  
  const isCont = isContinuous(type);

  const renderParams = () => {
    switch (type) {
      case DistributionType.NORMAL:
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Média (μ)</label>
              <input type="number" value={mean} onChange={(e) => setMean(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Desvio Padrão (σ)</label>
              <input type="number" min="0.0001" step="0.1" value={stdDev} onChange={(e) => setStdDev(parseFloat(e.target.value) || 1)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        );
      case DistributionType.POISSON:
        return (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Lambda (λ)</label>
            <input type="number" min="0" step="0.1" value={lambda} onChange={(e) => setLambda(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        );
      case DistributionType.EXPONENTIAL:
        return (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Taxa (λ)</label>
            <input type="number" min="0.0001" step="0.1" value={lambda} onChange={(e) => setLambda(parseFloat(e.target.value) || 0.1)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        );
      case DistributionType.UNIFORM:
      case DistributionType.DISCRETE_UNIFORM:
        return (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Mínimo (a)</label>
              <input type="number" value={distMin} onChange={(e) => setDistMin(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Máximo (b)</label>
              <input type="number" value={distMax} onChange={(e) => setDistMax(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        );
      case DistributionType.BERNOULLI:
        return (
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Probabilidade Sucesso (p)</label>
            <input type="number" min="0" max="1" step="0.01" value={distProb} onChange={(e) => setDistProb(parseFloat(e.target.value) || 0.5)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
        );
      case DistributionType.BINOMIAL:
        return (
          <div className="grid grid-cols-2 gap-3">
             <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Tentativas (n)</label>
              <input type="number" min="1" step="1" value={trials} onChange={(e) => setTrials(parseInt(e.target.value) || 10)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Sucesso (p)</label>
              <input type="number" min="0" max="1" step="0.01" value={distProb} onChange={(e) => setDistProb(parseFloat(e.target.value) || 0.5)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-600"><line x1="6" y1="3" x2="6" y2="15"></line><circle cx="18" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><path d="M18 9a9 9 0 0 1-9 9"></path></svg>
        Parâmetros e Cálculo
      </h2>

      {/* Distribution Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Modelo Probabilístico</label>
        <select 
          value={type}
          onChange={(e) => setType(e.target.value as DistributionType)}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
        >
          <optgroup label="Distribuições Contínuas">
            <option value={DistributionType.NORMAL}>Normal (Gaussiana)</option>
            <option value={DistributionType.UNIFORM}>Uniforme Contínua</option>
            <option value={DistributionType.EXPONENTIAL}>Exponencial</option>
          </optgroup>
          <optgroup label="Distribuições Discretas">
            <option value={DistributionType.POISSON}>Poisson</option>
            <option value={DistributionType.BINOMIAL}>Binomial</option>
            <option value={DistributionType.BERNOULLI}>Bernoulli</option>
            <option value={DistributionType.DISCRETE_UNIFORM}>Uniforme Discreta</option>
          </optgroup>
        </select>
      </div>

      {/* Distribution Parameters Inputs */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Parâmetros da Distribuição</h3>
        {renderParams()}
      </div>

      {/* Probability Calculation Input */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Definição do Evento (x)</h3>
         <div className="grid grid-cols-2 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Operador</label>
              <select 
                value={calcOp}
                onChange={(e) => setCalcOp(e.target.value as CalculationOperator)}
                className="w-full px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value={CalculationOperator.LESS_EQUAL}>P(X ≤ x)</option>
                <option value={CalculationOperator.GREATER}>P(X &gt; x)</option>
                {!isCont && (
                  <option value={CalculationOperator.EQUAL}>P(X = x)</option>
                )}
                 {isCont && (
                  <option value={CalculationOperator.BETWEEN}>P(x₁ &lt; X &lt; x₂)</option>
                )}
              </select>
            </div>
            
            {/* Conditional Rendering for inputs */}
            <div className="col-span-1">
              {calcOp === CalculationOperator.BETWEEN ? (
                 <div className="flex gap-2">
                   <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">x₁</label>
                     <input
                      type="number"
                      step="0.1"
                      value={targetX}
                      onChange={(e) => setTargetX(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                   </div>
                   <div>
                     <label className="block text-xs font-medium text-slate-500 mb-1">x₂</label>
                     <input
                      type="number"
                      step="0.1"
                      value={targetX2}
                      onChange={(e) => setTargetX2(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                   </div>
                 </div>
              ) : (
                <>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Valor de x</label>
                  <input
                    type="number"
                    step={isCont ? "0.1" : "1"}
                    value={targetX}
                    onChange={(e) => setTargetX(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </>
              )}
            </div>
         </div>
      </div>

      {/* Axis Configuration */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Configuração dos Eixos</h3>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">X Mínimo</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(e.target.value)}
              placeholder="Auto"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">X Máximo</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(e.target.value)}
              placeholder="Auto"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Y Mínimo</label>
            <input
              type="number"
              value={yMin}
              onChange={(e) => setYMin(e.target.value)}
              placeholder="Auto"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Y Máximo</label>
            <input
              type="number"
              value={yMax}
              onChange={(e) => setYMax(e.target.value)}
              placeholder="Auto"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      <button
        onClick={onRun}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Calcular Probabilidade
      </button>
    </div>
  );
};

export default InputPanel;