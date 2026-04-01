import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OPENAI_API_KEY not defined');

    const formData = await req.formData();
    const audio = formData.get('audio') as File | null;
    if (!audio) return NextResponse.json({ error: 'No audio provided' }, { status: 400 });

    const buffer = Buffer.from(await audio.arrayBuffer());

    const openaiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
      body: (() => {
        const fd = new FormData();
        fd.append('file', new Blob([buffer], { type: audio.type }), audio.name || 'audio.webm');
        fd.append('model', 'gpt-4o-mini-transcribe');
        fd.append('response_format', 'text');
        return fd;
      })(),
    });

    if (!openaiRes.ok) {
      const err = await openaiRes.text();
      console.error('OpenAI Whisper error:', err);
      return NextResponse.json({ error: 'OpenAI Whisper error', details: err }, { status: 500 });
    }

    const transcript = await openaiRes.text();
    if (!transcript) return NextResponse.json({ error: 'No transcript returned from OpenAI' }, { status: 500 });

    return NextResponse.json({ transcript: transcript.trim() });
  } catch (error: any) {
    console.error('Transcribe API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
