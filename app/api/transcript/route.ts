import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { messages, testInfo, lang } = await req.json();

    const isBm = lang === 'bm';

    const systemPrompt = isBm
      ? `Anda adalah doktor veterinar akuakultur bertauliah yang menjana transkrip klinikal untuk rekod ladang udang dan hatcheri. Jana laporan yang berstruktur, profesional, dan ringkas dalam Bahasa Melayu.`
      : `You are a certified aquaculture veterinarian generating a clinical transcript for prawn farm and hatchery records. Generate a structured, professional, and concise report in English.`;

    const conversationText = messages
      .map((m: { senderName: string; senderRole: string; content: string }) =>
        `[${m.senderRole === 'vet' ? 'Vet' : 'Farmer'} - ${m.senderName}]: ${m.content}`
      )
      .join('\n');

    const userPrompt = isBm
      ? `Jana transkrip klinikal berstruktur berdasarkan konsultasi akuakultur berikut.

MAKLUMAT UJIAN AIR:
- Ladang: ${testInfo.farmName}
- Penternak: ${testInfo.farmerName}
- Keputusan Warna Kit: ${testInfo.colorLabel}
- Tahap Risiko: ${testInfo.riskLevel}
- Nota Penternak: ${testInfo.notes || 'Tiada'}

PERBUALAN KONSULTASI:
${conversationText}

Sila jana transkrip klinikal yang merangkumi:
1. **Ringkasan Kes** - Maklumat ladang dan keputusan ujian
2. **Penemuan Klinikal** - Apa yang dibincangkan semasa konsultasi
3. **Diagnosis Sementara** - Berdasarkan warna kit dan perbincangan
4. **Cadangan Rawatan** - Tindakan yang disyorkan oleh doktor veterinar
5. **Tindakan Susulan** - Langkah seterusnya untuk penternak
6. **Nota Tambahan** - Sebarang pemerhatian penting lain`
      : `Generate a structured clinical transcript based on the following aquaculture consultation.

WATER TEST INFORMATION:
- Farm: ${testInfo.farmName}
- Farmer: ${testInfo.farmerName}
- Kit Color Result: ${testInfo.colorLabel}
- Risk Level: ${testInfo.riskLevel}
- Farmer's Notes: ${testInfo.notes || 'None'}

CONSULTATION CONVERSATION:
${conversationText}

Please generate a clinical transcript covering:
1. **Case Summary** - Farm information and test results
2. **Clinical Findings** - What was discussed during the consultation
3. **Provisional Diagnosis** - Based on kit color and discussion
4. **Treatment Recommendations** - Actions recommended by the vet
5. **Follow-up Actions** - Next steps for the farmer
6. **Additional Notes** - Any other important observations`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const transcript = message.content[0].type === 'text' ? message.content[0].text : '';

    return NextResponse.json({ transcript });
  } catch (error) {
    console.error('Transcript generation error:', error);
    return NextResponse.json({ error: 'Failed to generate transcript' }, { status: 500 });
  }
}
