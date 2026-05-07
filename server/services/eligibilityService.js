/**
 * Deep Eligibility Checker Logic
 * Matches user profile against scheme eligibility criteria
 */
function checkEligibility(scheme, profile) {
  let score = 100;
  const passed = [];
  const reasons = [];

  const criteria = scheme.eligibility || {};

  // 1. Age Check
  if (profile.age !== undefined) {
    const minAge = criteria.ageMin || 0;
    const maxAge = criteria.ageMax || 100;
    if (profile.age < minAge || profile.age > maxAge) {
      score -= 30;
      reasons.push(`Age ${profile.age} is outside required range ${minAge}-${maxAge}`);
    } else {
      passed.push('Age requirement met');
    }
  }

  // 2. Gender Check
  if (profile.gender && criteria.gender && criteria.gender !== 'All') {
    if (profile.gender !== criteria.gender) {
      score -= 40;
      reasons.push(`Scheme is for ${criteria.gender}, user is ${profile.gender}`);
    } else {
      passed.push('Gender requirement met');
    }
  }

  // 3. Income Check
  if (profile.annualIncome !== undefined && criteria.incomeMax) {
    if (profile.annualIncome > criteria.incomeMax) {
      score -= 50;
      reasons.push(`Annual income ₹${profile.annualIncome} exceeds maximum limit ₹${criteria.incomeMax}`);
    } else {
      passed.push('Income requirement met');
    }
  }

  // 4. Category Check
  if (profile.category && criteria.category && criteria.category.length > 0) {
    if (!criteria.category.includes(profile.category) && !criteria.category.includes('All')) {
      score -= 30;
      reasons.push(`Category ${profile.category} not eligible for this scheme`);
    } else {
      passed.push('Category requirement met');
    }
  }

  // 5. Occupation Check
  if (profile.occupation && criteria.occupation && criteria.occupation !== 'All') {
    if (profile.occupation !== criteria.occupation) {
      score -= 20;
      reasons.push(`Occupation ${profile.occupation} does not match required ${criteria.occupation}`);
    } else {
      passed.push('Occupation requirement met');
    }
  }

  // 6. BPL Status Check
  if (profile.hasBplCard !== undefined && criteria.bplOnly) {
    if (criteria.bplOnly && !profile.hasBplCard) {
      score -= 40;
      reasons.push('This scheme is exclusively for BPL card holders');
    } else {
      passed.push('BPL requirement met');
    }
  }

  return {
    isEligible: score >= 60,
    score: Math.max(0, score),
    passed,
    reasons
  };
}

module.exports = {
  checkEligibility
};
