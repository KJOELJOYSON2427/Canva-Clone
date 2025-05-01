const Subscription = require('../models/subscription');

exports.getSubscription = async (req, res) => {
  try {
    const userId = req.user.userId;

    let subscription = await Subscription.findOne({ userId });

    // If no subscription exists, create and save one
    if (!subscription) {
      subscription = new Subscription({ userId });
      await subscription.save(); // ✅ Save the new subscription
    }

    // Always return the subscription
    return res.status(200).json({
      success: true,
      data: {
        isPremium: subscription.isPremium,
        premiumSince: subscription.premiumSince,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: 'Some error occurred',
    });
  }
};
