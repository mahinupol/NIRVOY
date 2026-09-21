import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || 'gpt-5.6-luna';

async function testPredict() {
  const prompt = `You are an expert Bangladeshi clinical pharmacist and prescription handwriting decoder.
A doctor wrote messy handwriting on a prescription: "1. Tab Np 500 -- 1+0+1 (after meal) 3 days; 2. Cap Sclo 20 -- 1+0+1 (before meal) 7 days; 3. Tab Fxo 120 -- 0+0+1 5 days".
Matched candidate medicines from 21,700+ Bangladeshi DGDA dataset:
- For "Np 500": Napa 500 mg Tablet (Paracetamol, Beximco), Napa Extra, Naproxen
- For "Sclo 20": Seclo 20 mg Capsule (Omeprazole, Square), Sergel 20 mg
- For "Fxo 120": Fexo 120 mg Tablet (Fexofenadine, Square), Fenadin 120 mg

Identify and predict each intended medicine from the Bangladeshi pharmaceutical database. Return JSON with array of predicted medicines.`;

  try {
    const res = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        instructions: 'You are an expert AI clinical transcriptionist. Always return valid JSON.',
        input: prompt
      })
    });

    const data = await res.json();
    console.log('HTTP status:', res.status);
    if (!res.ok) {
      console.log('OpenAI error:', data);
    } else {
      const assistantMsg = data.output?.find(item => item.type === 'message' && item.role === 'assistant');
      const text = assistantMsg?.content?.find(c => c.type === 'output_text')?.text;
      console.log('OpenAI prediction result:\n', text?.slice(0, 300));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

testPredict();
