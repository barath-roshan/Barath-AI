const Scheme = require('../models/Scheme');
const { checkEligibility } = require('../services/eligibilityService');

exports.getSchemes = async (req, res) => {
    try {
        const schemes = await Scheme.find();
        res.json(schemes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getSchemesByCategory = async (req, res) => {
    try {
        const schemes = await Scheme.find({ categoryEn: req.params.category });
        res.json(schemes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.checkEligibilityBulk = async (req, res) => {
    try {
        const profile = req.body;
        const schemes = await Scheme.find();
        
        const results = schemes.filter(scheme => {
            const { score } = checkEligibility(scheme, profile);
            return score >= 60; // Include only eligible or partially eligible
        });

        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const seedData = [
    {
        nameEn: "PM-KISAN",
        nameTa: "பிஎம்-கிசான்",
        ministryEn: "Ministry of Agriculture & Farmers Welfare",
        ministryTa: "விவசாயம் மற்றும் விவசாயிகள் நல அமைச்சகம்",
        benefitEn: "₹6,000/yr",
        benefitTa: "ஆண்டுக்கு ₹6,000",
        benefitDescEn: "Financial support",
        benefitDescTa: "நிதியுதவி",
        categoryEn: "Agriculture",
        categoryTa: "விவசாயம்",
        badgeChar: "P",
        badgeColor: "bg-green",
        tags: [{ en: "Agriculture", ta: "விவசாயம்", class: "tag-agri" }],
        eligibility: { ageMin: 18, ageMax: 100, gender: 'All', incomeMax: 200000 }
    },
    {
        nameEn: "Ayushman Bharat PM-JAY",
        nameTa: "ஆயுஷ்மான் பாரத் பிஎம்-ஜேஏஒய்",
        ministryEn: "Ministry of Health and Family Welfare",
        ministryTa: "சுகாதாரம் மற்றும் குடும்ப நல அமைச்சகம்",
        benefitEn: "₹5 Lakh/yr",
        benefitTa: "ஆண்டுக்கு ₹5 லட்சம்",
        benefitDescEn: "Health cover",
        benefitDescTa: "சுகாதார காப்பீடு",
        categoryEn: "Health",
        categoryTa: "சுகாதாரம்",
        badgeChar: "A",
        badgeColor: "bg-blue",
        tags: [{ en: "Health", ta: "சுகாதாரம்", class: "tag-health" }],
        eligibility: { ageMin: 0, ageMax: 100, gender: 'All', incomeMax: 500000 }
    },
    {
        nameEn: "PM Awas Yojana Urban",
        nameTa: "பிஎம் ஆவாஸ் யோஜனா நகர்ப்புறம்",
        ministryEn: "Ministry of Housing and Urban Affairs",
        ministryTa: "வீட்டுவசதி மற்றும் நகர்ப்புற விவகாரங்கள் அமைச்சகம்",
        benefitEn: "₹2.67 Lakh",
        benefitTa: "₹2.67 லட்சம்",
        benefitDescEn: "Subsidy",
        benefitDescTa: "மானியம்",
        categoryEn: "Housing",
        categoryTa: "வீட்டுவசதி",
        badgeChar: "P",
        badgeColor: "bg-saffron",
        tags: [{ en: "Housing", ta: "வீட்டுவசதி", class: "tag-housing" }],
        eligibility: { ageMin: 18, ageMax: 70, gender: 'All', incomeMax: 1800000 }
    },
    {
        nameEn: "Startup India Seed Fund",
        nameTa: "ஸ்டார்ட்அப் இந்தியா விதை நிதி",
        ministryEn: "Ministry of Commerce & Industry",
        ministryTa: "வர்த்தகம் மற்றும் தொழில் அமைச்சகம்",
        benefitEn: "Up to ₹50 Lakh",
        benefitTa: "₹50 லட்சம் வரை",
        benefitDescEn: "Seed funding",
        benefitDescTa: "தொடக்க நிதி",
        categoryEn: "Business",
        categoryTa: "வணிகம்",
        badgeChar: "S",
        badgeColor: "bg-purple",
        tags: [{ en: "Business", ta: "வணிகம்", class: "tag-biz" }],
        eligibility: { ageMin: 18, ageMax: 100, gender: 'All', incomeMax: 10000000 }
    },
    {
        nameEn: "Beti Bachao Beti Padhao",
        nameTa: "பெண் குழந்தைகளை காப்போம், கற்பிப்போம்",
        ministryEn: "Ministry of Women and Child Development",
        ministryTa: "பெண்கள் மற்றும் குழந்தைகள் மேம்பாட்டு அமைச்சகம்",
        benefitEn: "Financial Aid",
        benefitTa: "நிதி உதவி",
        benefitDescEn: "Support",
        benefitDescTa: "ஆதரவு",
        categoryEn: "Women & Child",
        categoryTa: "பெண்கள் & குழந்தைகள்",
        badgeChar: "B",
        badgeColor: "bg-pink",
        tags: [{ en: "Women & Child", ta: "பெண்கள் & குழந்தைகள்", class: "tag-women" }],
        eligibility: { ageMin: 0, ageMax: 18, gender: 'Female', incomeMax: 1000000 }
    },
    {
        nameEn: "PMEGP",
        nameTa: "பிஎம்இஜிபி",
        ministryEn: "Ministry of Micro, Small and Medium Enterprises",
        ministryTa: "சிறு, குறு மற்றும் நடுத்தர தொழில்கள் அமைச்சகம்",
        benefitEn: "35% Subsidy",
        benefitTa: "35% மானியம்",
        benefitDescEn: "Margin money",
        benefitDescTa: "விளிம்பு தொகை",
        categoryEn: "Employment",
        categoryTa: "வேலைவாய்ப்பு",
        badgeChar: "P",
        badgeColor: "bg-teal",
        tags: [
            { en: "Business", ta: "வணிகம்", class: "tag-biz" },
            { en: "Employment", ta: "வேலைவாய்ப்பு", class: "tag-agri" }
        ],
        eligibility: { ageMin: 18, ageMax: 100, gender: 'All', incomeMax: 1000000 }
    }
];

exports.seedSchemesLocal = async () => {
    await Scheme.deleteMany({});
    await Scheme.insertMany(seedData);
    return { count: seedData.length };
};

exports.seedSchemes = async (req, res) => {
    try {
        const result = await exports.seedSchemesLocal();
        res.json({ message: "Seeded successfully!", ...result });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
