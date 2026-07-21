import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
const TaskStatus = { TODO: "TODO", IN_PROGRESS: "IN_PROGRESS", DONE: "DONE" } as const;

const prisma = new PrismaClient();

function dayOffset(days: number) {
  const d = new Date();
  d.setHours(9, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const passwordHash = await bcrypt.hash("demo1234", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@fluxo.app" },
    update: {},
    create: {
      name: "Usuário Demo",
      email: "demo@fluxo.app",
      password: passwordHash,
    },
  });

  const empresaX = await prisma.company.create({
    data: { name: "Empresa X", color: "#6C5CE7", ownerId: user.id },
  });

  const empresaY = await prisma.company.create({
    data: { name: "Empresa Y", color: "#00B894", ownerId: user.id },
  });

  const tasksX = [
    { title: "Levantamento de requisitos", offset: -3, status: TaskStatus.DONE },
    { title: "Reunião de alinhamento", offset: -1, status: TaskStatus.TODO },
    { title: "Enviar proposta comercial", offset: 0, status: TaskStatus.IN_PROGRESS },
    { title: "Revisar contrato", offset: 2, status: TaskStatus.TODO },
    { title: "Onboarding do cliente", offset: 5, status: TaskStatus.TODO },
    { title: "Relatório mensal", offset: 20, status: TaskStatus.TODO },
    { title: "Follow-up pós-venda", offset: 35, status: TaskStatus.TODO },
  ];

  const tasksY = [
    { title: "Ajuste de layout", offset: -5, status: TaskStatus.TODO },
    { title: "Deploy da versão 2.3", offset: -2, status: TaskStatus.TODO },
    { title: "Corrigir bug crítico", offset: 0, status: TaskStatus.IN_PROGRESS },
    { title: "Reunião de retrospectiva", offset: 1, status: TaskStatus.TODO },
    { title: "Planejamento do sprint", offset: 4, status: TaskStatus.TODO },
    { title: "Auditoria de segurança", offset: 25, status: TaskStatus.TODO },
  ];

  for (const t of tasksX) {
    await prisma.task.create({
      data: {
        title: t.title,
        description: "",
        date: dayOffset(t.offset),
        status: t.status,
        companyId: empresaX.id,
      },
    });
  }

  for (const t of tasksY) {
    await prisma.task.create({
      data: {
        title: t.title,
        description: "",
        date: dayOffset(t.offset),
        status: t.status,
        companyId: empresaY.id,
      },
    });
  }

  console.log("Seed concluído. Login: demo@fluxo.app / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
