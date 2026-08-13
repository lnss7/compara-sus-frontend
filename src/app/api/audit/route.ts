import { NextResponse } from 'next/server';
import { AuditController, SupabaseAuditRepository } from '../../../../../backend/src';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const repo = new SupabaseAuditRepository();
    const controller = new AuditController(repo);

    const resultado = await controller.registrarAuditoria(body);

    if (!resultado.sucesso) {
      return NextResponse.json({ error: resultado.mensagem }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: resultado.mensagem });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erro interno ao processar audit log' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const repo = new SupabaseAuditRepository();
    const controller = new AuditController(repo);
    const logs = await controller.listarLogs();
    return NextResponse.json({ logs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
