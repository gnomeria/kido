import whoData from '../data/who_growth_data.json';

// Function to get the z-score for a given percentile.
// This is a simplified implementation and uses a lookup table for common percentiles.
function getZScoreForPercentile(percentile) {
  const percentileZScores = {
    3: -1.88079,
    15: -1.03643,
    50: 0,
    85: 1.03643,
    97: 1.88079
  };
  return percentileZScores[percentile];
}

export function calculateZScore(measurement, ageInMonths, gender) {
  const genderData = whoData.infant_weight_for_age[gender];

  let lmsData = genderData.find(d => d["Age (in months)"] === ageInMonths);

  if (!lmsData) {
    // If no exact match, find the two closest ages and interpolate
    let lowerBound = null;
    let upperBound = null;

    for (const d of genderData) {
        if (d["Age (in months)"] < ageInMonths) {
            lowerBound = d;
        } else {
            upperBound = d;
            break;
        }
    }

    if (!lowerBound || !upperBound) {
        throw new Error("Age is outside the range of the available data.");
    }

    const ageLower = lowerBound["Age (in months)"];
    const ageUpper = upperBound["Age (in months)"];
    const ratio = (ageInMonths - ageLower) / (ageUpper - ageLower);

    const l = lowerBound.L + ratio * (upperBound.L - lowerBound.L);
    const m = lowerBound.M + ratio * (upperBound.M - lowerBound.M);
    const s = lowerBound.S + ratio * (upperBound.S - lowerBound.S);

    lmsData = { L: l, M: m, S: s };

  }

  const { L, M, S } = lmsData;
  const x = measurement;

  if (L !== 0) {
    return (Math.pow(x / M, L) - 1) / (L * S);
  } else {
    return Math.log(x / M) / S;
  }
}

export { getZScoreForPercentile };