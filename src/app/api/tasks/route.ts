import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  description: z.string().optional().default(""),
  date: z.string(), // ISO date
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional().default("TODO"),
  companyId: z.string(),
});

async function assertCompanyOwnership(companyId: string, userId: string) {
  const company = await prisma.company.findFirst({ where: { id: companyId, ownerId: userId } });
  return !!company;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: { company: { ownerId: session.user.id } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const owns = await assertCompanyOwnership(parsed.data.companyId, session.user.id);
  if (!owns) {
    return NextResponse.json({ error: "Empresa não encontrada" }, { status: 404 });
  }

  const task = await prisma.task.create({
    data: {
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      date: new Date(parsed.data.date),
      status: parsed.data.status,
      companyId: parsed.data.companyId,
    },
  });

  return NextResponse.json(task, { status: 201 });
}
