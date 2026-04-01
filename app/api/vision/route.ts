import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY not defined');
    }

    const formData = await req.formData();
    const image = formData.get('image') as File | null;
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Describe this civic complaint in one short sentence suitable for municipal classification.'
              },
              {
                type: 'image_url',
                image_url: { url: base64 }
              }
            ]
          }
        ],
        max_tokens: 100
      })
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      return NextResponse.json({ error: 'OpenAI Vision error', details: err }, { status: 500 });
    }

    const openaiData = await openaiRes.json();
    const description = openaiData.choices?.[0]?.message?.content?.trim() || '';
    if (!description) {
      return NextResponse.json({ error: 'No description returned from OpenAI' }, { status: 500 });
    }

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('Vision API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
