import * as recommendationRepository from '../repositories/recommendationRepository.js';

/* ─────────────── LAYER 1: SKILL MATCHING ─────────────── */

const calculateSkillMatch = (freelancerSkills, projectSkills) => {
  if (!projectSkills.length) return { score: 0, reasons: [] };

  const flSkillNames = new Set(freelancerSkills.map(s => s.skill_name.toLowerCase()));
  let matchedCount = 0;
  const matchedSkills = [];

  for (const ps of projectSkills) {
    if (flSkillNames.has(ps.skill_name.toLowerCase())) {
      matchedCount++;
      matchedSkills.push(ps.skill_name);
    }
  }

  const score = Math.round((matchedCount / projectSkills.length) * 100);
  const reasons = matchedCount > 0
    ? [`Matches ${matchedCount} of ${projectSkills.length} required skills`]
    : ['No direct skill match'];

  return { score, reasons };
};

/* ─────────────── LAYER 2: HISTORICAL PREFERENCE ─────────────── */

const calculateHistoricalPreference = (
  freelancer,
  freelancerSkills,
  employerHistory,
  employerProjectSkills,
  projectCategoryId
) => {
  const reasons = [];
  let bonusPoints = 0;
  const maxBonus = 100;

  if (!employerHistory.length) {
    return { score: 50, reasons: ['No employer history available'] };
  }

  // Check if freelancer was previously hired by this employer
  const previouslyHired = employerHistory.some(h => h.freelancer_id === freelancer.user_id);
  if (previouslyHired) {
    bonusPoints += 30;
    reasons.push('Previously hired by this employer');
  }

  // Check category preference
  const categoryMatches = employerHistory.filter(h => h.category_id === projectCategoryId).length;
  if (categoryMatches > 0) {
    const categoryScore = Math.min(categoryMatches * 10, 20);
    bonusPoints += categoryScore;
    reasons.push(`Hired ${categoryMatches} freelancers for this category`);
  }

  // Check skill preference
  if (employerProjectSkills.length > 0) {
    const empSkillNames = new Set(employerProjectSkills.map(s => s.skill_name.toLowerCase()));
    const flSkillNames = new Set(freelancerSkills.map(s => s.skill_name.toLowerCase()));
    const commonSkills = [...empSkillNames].filter(s => flSkillNames.has(s));
    if (commonSkills.length > 0) {
      const skillBonus = Math.min(commonSkills.length * 10, 20);
      bonusPoints += skillBonus;
      reasons.push(`Employer frequently hires ${commonSkills.slice(0, 3).join(', ')} developers`);
    }
  }

  // Check rating preference
  if (employerHistory.length > 0) {
    const avgHiredRating = employerHistory.reduce((sum, h) => sum + (h.rating_average || 0), 0) / employerHistory.length;
    if (freelancer.rating_average >= avgHiredRating) {
      bonusPoints += 15;
      reasons.push('Rating matches employer\'s preferred range');
    }
  }

  // Check experience preference
  if (employerHistory.length > 0) {
    const avgExperience = employerHistory.reduce((sum, h) => sum + (h.experience_years || 0), 0) / employerHistory.length;
    if (freelancer.experience_years >= avgExperience * 0.8) {
      bonusPoints += 15;
      reasons.push('Experience level meets employer preference');
    }
  }

  return { score: Math.min(bonusPoints, maxBonus), reasons };
};

/* ─────────────── LAYER 3: PROPOSAL QUALITY ─────────────── */

const calculateProposalQuality = (freelancer, proposals) => {
  const reasons = [];
  let score = 50; // Base score

  const flProposals = proposals.filter(p => p.freelancer_id === freelancer.user_id);
  if (!flProposals.length) {
    return { score: 50, reasons: ['No proposal history'] };
  }

  const p = flProposals[0];

  // Acceptance rate
  const total = p.total_proposals || 0;
  const accepted = p.accepted_proposals || 0;
  if (total > 0) {
    const acceptanceRate = (accepted / total) * 100;
    if (acceptanceRate > 50) {
      score += 20;
      reasons.push(`High proposal acceptance rate (${Math.round(acceptanceRate)}%)`);
    }
  }

  // Delivery feasibility
  if (p.avg_delivery_days) {
    const deliveryDays = Math.round(p.avg_delivery_days);
    if (deliveryDays <= 7) {
      score += 15;
      reasons.push('Consistent quick delivery (avg ' + deliveryDays + ' days)');
    } else if (deliveryDays <= 30) {
      score += 10;
      reasons.push('Reasonable delivery estimates (avg ' + deliveryDays + ' days)');
    }
  }

  // Proposal completeness - based on having cover letter content
  const hasPortfolioDescription = freelancer.portfolio_summary && freelancer.portfolio_summary.length > 50;
  if (hasPortfolioDescription) {
    score += 15;
    reasons.push('Detailed portfolio and project descriptions');
  }

  return { score: Math.min(score, 100), reasons };
};

/* ─────────────── LAYER 4: SEMANTIC MATCHING ─────────────── */

const calculateSemanticMatch = (freelancer, freelancerSkills, project, portfolios) => {
  const reasons = [];
  let score = 50;

  // Build project text vector
  const projectText = [
    project.title || '',
    project.description || '',
    project.category_name || ''
  ].join(' ').toLowerCase();

  // Build freelancer text vector
  const freelancerPortfolios = portfolios.filter(p => p.freelancer_id === freelancer.user_id);
  const portfolioTexts = freelancerPortfolios.map(p => `${p.title} ${p.description}`).join(' ');
  const freelancerText = [
    freelancer.headline || '',
    freelancer.portfolio_summary || '',
    portfolioTexts
  ].join(' ').toLowerCase();

  if (!freelancerText.trim()) {
    return { score: 30, reasons: ['Limited portfolio information'] };
  }

  // Tokenize and compute keyword overlap
  const projectTokens = new Set(projectText.split(/\s+/).filter(t => t.length > 3));
  const freelancerTokens = freelancerText.split(/\s+/).filter(t => t.length > 3);
  const freelancerTokenSet = new Set(freelancerTokens);

  let overlapCount = 0;
  for (const token of projectTokens) {
    if (freelancerTokenSet.has(token)) overlapCount++;
  }

  if (projectTokens.size > 0) {
    const overlapRatio = overlapCount / projectTokens.size;
    score += Math.round(overlapRatio * 40);

    if (overlapRatio > 0.3) {
      reasons.push('Portfolio highly matches project scope');
    } else if (overlapRatio > 0.1) {
      reasons.push('Portfolio partially matches project requirements');
    } else {
      reasons.push('Portfolio has some relevant keywords');
    }
  }

  // Add freelancer skill coverage in semantic analysis
  const skillNames = freelancerSkills.map(s => s.skill_name.toLowerCase());
  const projectHasRelatedSkills = skillNames.some(skill =>
    projectText.includes(skill)
  );
  if (projectHasRelatedSkills) {
    score += 10;
    if (reasons.length === 0) {
      reasons.push('Skills align with project domain');
    }
  }

  if (reasons.length === 0) {
    reasons.push('Moderate semantic relevance');
  }

  return { score: Math.min(score, 100), reasons };
};

/* ─────────────── MAIN RECOMMENDATION ENGINE ─────────────── */

export const getRecommendations = async (projectId) => {
  // 1. Fetch project details
  const project = await recommendationRepository.getProjectDetails(projectId);
  if (!project) {
    throw new Error('PROJECT_NOT_FOUND');
  }

  // 2. Fetch project skills
  const projectSkills = await recommendationRepository.getProjectSkills(projectId);

  // 3. Fetch employer history
  const [employerHistory, employerProjectSkills] = await Promise.all([
    recommendationRepository.getEmployerHistory(project.employer_id),
    recommendationRepository.getEmployerProjectSkills(project.employer_id)
  ]);

  // 4. Fetch all active freelancers
  const freelancers = await recommendationRepository.getFreelancersForProject(projectId);
  if (!freelancers.length) return [];

  // 5. Batch fetch freelancer data
  const freelancerIds = freelancers.map(f => f.user_id);
  const [allFreelancerSkills, allProposals, allContracts, allPortfolios] = await Promise.all([
    recommendationRepository.getFreelancerSkills(freelancerIds),
    recommendationRepository.getFreelancerProposals(freelancerIds),
    recommendationRepository.getFreelancerContracts(freelancerIds),
    recommendationRepository.getFreelancerPortfolios(freelancerIds)
  ]);

  // 6. Organize data by freelancer
  const skillsByFreelancer = {};
  allFreelancerSkills.forEach(s => {
    if (!skillsByFreelancer[s.freelancer_id]) skillsByFreelancer[s.freelancer_id] = [];
    skillsByFreelancer[s.freelancer_id].push(s);
  });

  const contractsByFreelancer = {};
  allContracts.forEach(c => {
    contractsByFreelancer[c.freelancer_id] = c;
  });

  // 7. Calculate scores for each freelancer
  const recommendations = freelancers.map(freelancer => {
    const flSkills = skillsByFreelancer[freelancer.user_id] || [];

    // Layer 1: Skill Matching (40%)
    const { score: skillScore, reasons: skillReasons } = calculateSkillMatch(flSkills, projectSkills);

    // Layer 2: Historical Preference (20%)
    const { score: historyScore, reasons: historyReasons } = calculateHistoricalPreference(
      freelancer, flSkills, employerHistory, employerProjectSkills, project.category_id
    );

    // Layer 3: Proposal Quality (20%)
    const { score: proposalScore, reasons: proposalReasons } = calculateProposalQuality(freelancer, allProposals);

    // Layer 4: Semantic Matching (20%)
    const { score: semanticScore, reasons: semanticReasons } = calculateSemanticMatch(
      freelancer, flSkills, project, allPortfolios
    );

    // Final Score
    const finalScore = Math.round(
      skillScore * 0.40 +
      historyScore * 0.20 +
      proposalScore * 0.20 +
      semanticScore * 0.20
    );

    // Combine unique reasons
    const allReasons = [...new Set([...skillReasons, ...historyReasons, ...proposalReasons, ...semanticReasons])];

    return {
      userId: freelancer.user_id,
      fullName: freelancer.full_name,
      avatarUrl: freelancer.avatar_url,
      headline: freelancer.headline,
      rating: freelancer.rating_average || 0,
      totalReviews: freelancer.total_reviews || 0,
      experienceYears: freelancer.experience_years || 0,
      hourlyRate: freelancer.hourly_rate || 0,
      availabilityStatus: freelancer.availability_status,
      recommendationScore: finalScore,
      scoreBreakdown: {
        skillMatch: skillScore,
        historicalPreference: historyScore,
        proposalQuality: proposalScore,
        semanticMatch: semanticScore
      },
      recommendationReasons: allReasons.slice(0, 5) // Top 5 reasons
    };
  });

  // 8. Sort by score descending, return top 10
  return recommendations
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, 10);
};