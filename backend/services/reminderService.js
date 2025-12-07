export const triggerReminder = async (req, res, next) => {
  try {
    const { userId, topic, channel } = req.body;

    // Placeholder for n8n workflow trigger
    console.log(`📤 Reminder queued for ${userId} on ${topic} via ${channel}`);

    // TODO: Replace with actual n8n webhook call
    // await axios.post('https://n8n.example.com/webhook/reminder', {
    //   userId,
    //   topic,
    //   channel,
    //   timestamp: new Date(),
    // });

    res.json({ success: true, message: 'Reminder triggered (mock)' });
  } catch (error) {
    next(error);
  }
};
