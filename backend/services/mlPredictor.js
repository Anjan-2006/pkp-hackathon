export const predictForgetProbability = async (confidenceLevel, score, topic) => {
  // Mock ML prediction (XGBoost placeholder)
  // Formula: Higher score + high confidence = lower forget probability
  const baseProbability = 100 - score;
  const confidenceFactor = (6 - confidenceLevel) * 8;
  
  const forgetProbability = Math.max(10, Math.min(90, baseProbability + confidenceFactor));
  
  return Math.round(forgetProbability);
};
