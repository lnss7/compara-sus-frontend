import { NextResponse } from 'next/server';
import { CruzamentoController, SupabaseAuditRepository } from '../../../../../backend/src';

export async function POST(request: Request) {
  try {
    const { rawEsusData, rawSiapsData, userEmail } = await request.json();

    if (!Array.isArray(rawEsusData) || !Array.isArray(rawSiapsData)) {
      return NextResponse.json(
        { error: 'Dados brutos do e-SUS e SIAPS devem ser fornecidos como Arrays.' },
        { status: 400 }
      );
    }

    const repo = new SupabaseAuditRepository();
    const controller = new CruzamentoController(repo);

    const resultado = await controller.processarLinhasBrutas(rawEsusData, rawSiapsData, userEmail);

    return NextResponse.json({
      success: true,
      pacientes: resultado.pacientes,
      kpis: resultado.kpis,
      executadoEm: resultado.executadoEm,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro ao processar cruzamento de dados' },
      { status: 500 }
    );
  }
}
