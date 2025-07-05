export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 100
      })
    });

    const data = await response.json();

    if (!data.choices || !data.choices.length) {
      return res.status(500).json({ error: "No response from OpenAI" });
    }

    res.status(200).json({ reply: data.choices[0].text.trim() });
  } catch (err) {
    res.status(500).json({ error: "Server error: " + err.message });
  }
}
