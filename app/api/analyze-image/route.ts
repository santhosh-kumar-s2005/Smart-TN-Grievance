import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY not defined" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const image = formData.get("image") as File | null;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = `data:${image.type};base64,${buffer.toString("base64")}`;

    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Describe this civic complaint in one short sentence for municipal classification.",
              },
              {
                type: "input_image",
                image_url: base64,
              },
            ],
          },
        ],
      }),
    });

    if (!openaiRes.ok) {
      const errorText = await openaiRes.text();
      console.error("OpenAI error:", errorText);
      return NextResponse.json(
        { error: "OpenAI Vision error", details: errorText },
        { status: 500 }
      );
    }

    const openaiData = await openaiRes.json();

    const description =
      openaiData.output?.[0]?.content?.[0]?.text || "";

    return NextResponse.json({ description });

  } catch (error: any) {
    console.error("Vision API crash:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
