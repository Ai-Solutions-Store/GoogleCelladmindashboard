const express = require('express');
const router = express.Router();

// Initial hardcoded strategic activation stats (will be dynamic later)
router.get('/stats', (req, res) => {
  res.json({
    success: true,
    active_campaigns: 3,
    funds_raised: 0,
    strategy: 'Holiday Gift Shop',
    tribute_catalog: [
      { code: 'BURN_KIT', label: 'Emergency Burn Kit', price: 50 },
      { code: 'TEDDY_RECOVERY', label: 'Teddy Bear Post-Op Recovery', price: 25 },
      { code: 'WOUND_PACK', label: 'Portable Wound Care Pack', price: 100 }
    ],
    kpis: {
      first_donor_hours_target: 24,
      match_peak_multiplier_target: 3,
      tribute_conversion_target_percent: 12
    },
    generated_at: new Date().toISOString()
  });
});

module.exports = router;
