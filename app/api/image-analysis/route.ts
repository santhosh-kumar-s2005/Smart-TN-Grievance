import { NextResponse } from 'next/server';
import { RekognitionClient, DetectLabelsCommand } from '@aws-sdk/client-rekognition';

function detectDepartment(labels: string[]): string {
  const joined = labels.map(l => l.toLowerCase()).join(' ');
  if (/(water|flood|drain)/.test(joined)) return 'SANITARY';
  if (/(road|pothole)/.test(joined)) return 'ROAD';
  if (/(electric|wire|pole)/.test(joined)) return 'POWER';
  if (/(garbage|waste)/.test(joined)) return 'SANITARY';
  return 'GENERAL';
}

function generateDescription(labels: string[]): string {
  const l = labels.map(x => x.toLowerCase());
  if (l.includes('water') && (l.includes('road') || l.includes('flood')))
    return 'Water leakage flooding the road.';
  if (l.includes('garbage') || l.includes('waste'))
    return 'Garbage accumulation in public area.';
  if ((l.includes('electric pole') || l.includes('wire')))
    return 'Damaged electric wire causing hazard.';
  return `Detected: ${labels.slice(0, 3).join(', ')}.`;
}

export async function POST(req: Request) {
  try {
    const client = new RekognitionClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    const buffer = Buffer.from(await file.arrayBuffer());

    const command = new DetectLabelsCommand({
      Image: { Bytes: buffer },
      MaxLabels: 10,
      MinConfidence: 70,
    });
    const response = await client.send(command);
    const labels = response.Labels?.map((l: { Name?: string }) => l.Name?.toLowerCase()).filter(Boolean) || [];

    let department = "GENERAL";
    let priority = "LOW";
    let description = "";
    let impactScore = 10;

    // POWER
    if (labels.some(l => [
      "electricity", "utility pole", "transformer", "power line", "wire", "electrical", "smoke"
    ].includes(l!))) {
      department = "POWER";
      description = "Electrical infrastructure issue detected (possible transformer or wire hazard)";
      if (labels.includes("smoke")) {
        priority = "CRITICAL";
        impactScore = 85;
      } else {
        priority = "HIGH";
        impactScore = 65;
      }
    }
    // SANITATION
    else if (labels.some(l => [
      "water", "leak", "flood", "garbage", "sewage"
    ].includes(l!))) {
      department = "SANITARY";
      description = "Water leakage or sanitation problem detected";
      priority = "HIGH";
      impactScore = 60;
    }
    // ROAD
    else if (labels.some(l => [
      "road", "pothole", "street", "traffic"
    ].includes(l!))) {
      department = "ROAD";
      description = "Road infrastructure issue detected";
      priority = "MEDIUM";
      impactScore = 45;
    }

    return NextResponse.json({
      labels,
      description,
      department,
      priority,
      impactScore
    });
  } catch (error: any) {
    console.error('AWS Rekognition error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
