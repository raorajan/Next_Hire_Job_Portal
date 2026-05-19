const asyncErrorHandler = require("./asyncErrorHandler");

const checkAiQuota = asyncErrorHandler(async (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Please log in to use AI features."
    });
  }

  // 1. Pro members get unlimited AI usage
  if (user.isPro) {
    req.aiCreditsRemaining = "Unlimited";
    return next();
  }

  // 2. Check if user has enough credits
  if (user.aiCredits && user.aiCredits > 0) {
    user.aiCredits -= 1;
    await user.save();
    
    // Pass the remaining credits in the request context
    req.aiCreditsRemaining = user.aiCredits;
    return next();
  }

  // 3. Credit limit reached
  return res.status(403).json({
    success: false,
    status: 403,
    needsUpgrade: true,
    message: "You have exhausted your 5 free AI Credits! Upgrade to Pro for unlimited scans, interview guides, and personalized outreach templates."
  });
});

module.exports = checkAiQuota;
