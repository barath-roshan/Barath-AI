function extractEntities(message) {
  const entities = {};

  // Application number
  const appMatch = message.match(/APP[-\s]?(\d{4})[-\s]?(\d{6})/i);
  if (appMatch) entities.applicationNumber = `APP-${appMatch[1]}-${appMatch[2]}`;

  // Age
  const ageMatch = message.match(/(\d{1,2})\s*(years?\s*old|வயது)/i) ||
                   message.match(/age\s*(?:is\s*)?(\d{1,2})/i) ||
                   message.match(/i(?:'m| am)\s*(\d{1,2})/i);
  if (ageMatch) entities.age = parseInt(ageMatch[1]);

  // Income
  const incomeMatch = message.match(/(?:earn|income|salary|வருமானம்)[^\d]*(\d+(?:,\d+)*(?:\.\d+)?)\s*(lakh|thousand|k|L)?/i) ||
                      message.match(/(\d+(?:,\d+)*)\s*(lakh|thousand|k|L)\s*(?:per year|annual|monthly)?/i);
  if (incomeMatch) {
    let amount = parseFloat(incomeMatch[1].replace(/,/g, ''));
    const unit = incomeMatch[2]?.toLowerCase();
    if (unit === 'lakh' || unit === 'l') amount *= 100000;
    if (unit === 'thousand' || unit === 'k') amount *= 1000;
    entities.annualIncome = amount;
  }

  // State
  const states = ['Tamil Nadu','Maharashtra','Karnataka','Kerala','Andhra Pradesh',
    'Telangana','Uttar Pradesh','Bihar','Rajasthan','Gujarat','Punjab','Haryana',
    'Madhya Pradesh','West Bengal','Odisha','Assam','Jharkhand','Chhattisgarh'];
  for (const state of states) {
    if (new RegExp(state, 'i').test(message)) {
      entities.state = state;
      break;
    }
  }
  // Tamil Nadu variants
  if (/tamil\s*nadu|tamilnadu|தமிழ்நாடு|tn\b/i.test(message)) entities.state = 'Tamil Nadu';

  // Category
  if (/\b(obc)\b/i.test(message)) entities.category = 'OBC';
  else if (/\b(sc|scheduled caste|dalit|தலித்)\b/i.test(message)) entities.category = 'SC';
  else if (/\b(st|scheduled tribe|tribal|பழங்குடி)\b/i.test(message)) entities.category = 'ST';
  else if (/\b(ews|economically weaker)\b/i.test(message)) entities.category = 'EWS';
  else if (/\bgeneral\b/i.test(message)) entities.category = 'General';

  // Occupation
  const occupationMap = {
    'farmer': /farmer|agriculture|farming|கிருஷி|விவசாயி/i,
    'student': /student|studying|school|college|மாணவ/i,
    'daily wage': /daily wage|labour|laborer|கூலி/i,
    'small business': /business|shop|merchant|entrepreneur|தொழில்/i,
    'unemployed': /unemployed|no job|jobless|வேலையில்லா/i,
    'salaried': /salaried|job|employed|office|working|சம்பளம்/i,
  };
  for (const [occ, pattern] of Object.entries(occupationMap)) {
    if (pattern.test(message)) { entities.occupation = occ; break; }
  }

  // Gender
  if (/\b(female|woman|girl|பெண்)\b/i.test(message)) entities.gender = 'Female';
  else if (/\b(male|man|boy|ஆண்)\b/i.test(message)) entities.gender = 'Male';

  // BPL
  if (/bpl|below poverty|ration card/i.test(message)) entities.hasBplCard = true;

  // Scheme names
  const schemeMap = {
    'PM-KISAN': /pm.?kisan|கிசான்/i,
    'Ayushman Bharat': /ayushman|pm.?jay|ஆயுஷ்மான்/i,
    'PM Awas Yojana': /pm.?awas|awas|வீட்டுவசதி/i,
    'PMEGP': /pmegp|employment generation/i,
    'MUDRA': /mudra|முத்ரா/i,
    'Startup India': /startup/i,
    'Ujjwala': /ujjwala|lpg|உஜ்வலா/i,
  };
  for (const [scheme, pattern] of Object.entries(schemeMap)) {
    if (pattern.test(message)) { entities.schemeName = scheme; break; }
  }

  return entities;
}

// Detect language
function detectLanguage(message) {
  const tamilChars = (message.match(/[\u0B80-\u0BFF]/g) || []).length;
  const totalChars = message.replace(/\s/g, '').length;
  if (tamilChars === 0) return 'en';
  if (tamilChars / totalChars > 0.5) return 'ta';
  return 'mixed';
}

module.exports = {
  extractEntities,
  detectLanguage
};
