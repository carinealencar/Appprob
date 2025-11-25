import { GoogleGenAI } from "@google/genai";
import { DistributionType, NormalParams, PoissonParams } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDistributionInsight = async (
  type: DistributionType,
  params: NormalParams | PoissonParams
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "Erro: Chave de API não configurada. Não é possível gerar insights.";
  }

  let prompt = "";
  if (type === DistributionType.NORMAL) {
    const p = params as NormalParams;
    prompt = `
      Atue como um estatístico sênior.
      Analise uma Distribuição Normal com Média (μ) = ${p.mean} e Desvio Padrão (σ) = ${p.stdDev}.
      1. Explique brevemente o que esses valores indicam sobre a centralidade e dispersão dos dados.
      2. Dê um exemplo prático do mundo real que poderia seguir essa distribuição com esses parâmetros aproximados.
      3. Responda em Português do Brasil, de forma concisa (máximo 100 palavras).
    `;
  } else {
    const p = params as PoissonParams;
    prompt = `
      Atue como um estatístico sênior.
      Analise uma Distribuição de Poisson com Lambda (λ) = ${p.lambda}.
      1. Explique o que o valor de lambda significa neste contexto (taxa de ocorrência).
      2. Qual a probabilidade aproximada de ocorrerem eventos exatamente igual à média?
      3. Dê um exemplo prático do mundo real (ex: fila de banco, chamadas) para este lambda.
      4. Responda em Português do Brasil, de forma concisa (máximo 100 palavras).
    `;
  }

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma explicação.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Ocorreu um erro ao conectar com a IA para gerar o insight.";
  }
};
