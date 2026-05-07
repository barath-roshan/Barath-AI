const Scheme = require('../models/Scheme');

async function matchSchemes(profile) {
  const query = {};

  // Category filter
  if (profile.category) {
    query['eligibility.category'] = {
      $in: [profile.category]
    };
  }

  // Income filter
  if (profile.annualIncome !== undefined) {
    query['eligibility.incomeMax'] = { $gte: profile.annualIncome };
  }

  // Age filter
  if (profile.age) {
    query['eligibility.ageMin'] = { $lte: profile.age };
    query['eligibility.ageMax'] = { $gte: profile.age };
  }

  // Gender filter
  if (profile.gender) {
    query['eligibility.gender'] = { $in: [profile.gender, 'All'] };
  }

  // Occupation filter
  if (profile.occupation) {
    query['eligibility.occupation'] = { $in: [profile.occupation, 'All'] };
  }

  // Note: Model doesn't have state filter, so skipping for now to avoid errors
  
  try {
    const schemes = await Scheme.find(query).limit(5).lean();
    return schemes;
  } catch (err) {
    console.error('Scheme Matching Error:', err.message);
    return [];
  }
}

module.exports = {
  matchSchemes
};
