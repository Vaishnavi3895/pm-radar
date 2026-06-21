export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1000,
        messages: req.body.messages,
      }),
    });

    const data = await response.json();

    // Normalize Groq response to Anthropic-style so the frontend needs no changes
    if (data.choices && data.choices[0]) {
      return res.status(200).json({
        content: [{ type: 'text', text: data.choices[0].message.content }]
      });
    }

    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
