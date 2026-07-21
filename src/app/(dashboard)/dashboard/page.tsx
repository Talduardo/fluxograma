import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [companies, tasks] = await Promise.all([
    prisma.company.findMany({
      where: { ownerId: userId },
      orderBy: { createdAt: "asc" },
    }),
    prisma.task.findMany({
      where: { company: { ownerId: userId } },
      orderBy: { date: "asc" },
    }),
  ]);

  return (
    <DashboardClient
      userName={session!.user.name ?? "Você"}
      initialCompanies={companies.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
      initialTasks={tasks.map((t) => ({
        ...t,
        date: t.date.toISOString(),
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      }))}
    />
  );
}
