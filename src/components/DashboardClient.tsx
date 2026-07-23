"use client";

import { useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { addMonths, isSameDay } from "date-fns";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import type { Company, Task } from "@/types/models";
import { STATUS_COLOR, STATUS_LABEL } from "@/types/models";
import CompanyTabs from "@/components/CompanyTabs";
import CalendarMonth from "@/components/CalendarMonth";
import StatusSummary from "@/components/StatusSummary";
import DayPanel from "@/components/DayPanel";
import InstallPwaButton from "@/components/InstallPwaButton";

type Props = {
  userName: string;
  initialCompanies: Company[];
  initialTasks: Task[];
};

export default function DashboardClient({ userName, initialCompanies, initialTasks }: Props) {
  const [companies, setCompanies] = useState<Company[]>(initialCompanies);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    initialCompanies[0]?.id ?? null
  );
  const [monthsCount, setMonthsCount] = useState(3);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) ?? null;

  const companyTasks = useMemo(
    () => tasks.filter((t) => t.companyId === selectedCompanyId),
    [tasks, selectedCompanyId]
  );

  const months = useMemo(() => {
    const base = new Date();
    return Array.from({ length: monthsCount }, (_, i) => addMonths(base, i));
  }, [monthsCount]);

  const dayTasks = useMemo(
    () =>
      selectedDate
        ? companyTasks.filter((t) => isSameDay(new Date(t.date), selectedDate))
        : [],
    [companyTasks, selectedDate]
  );

  function handleCompanyCreated(company: Company) {
    setCompanies((prev) => [...prev, company]);
    setSelectedCompanyId(company.id);
  }

  function handleTaskCreated(task: Task) {
    setTasks((prev) => [...prev, task]);
  }

  function handleTaskUpdated(task: Task) {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  }

  function handleTaskDeleted(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <Box sx={{ minHeight: "100dvh", bgcolor: "background.default" }}>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: 5,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {/* Mobile: logo da empresa no lugar do ícone. Troque /public/logo.svg pela logo real. */}
            <Box
              component="img"
              src="/logo.svg"
              alt="Logo da empresa"
              sx={{
                display: { xs: "block", md: "none" },
                width: 36,
                height: 36,
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
            <Avatar
              sx={{
                display: { xs: "none", md: "flex" },
                bgcolor: "primary.main",
                width: 36,
                height: 36,
              }}
            >
              <CalendarMonthRoundedIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              Fluxo
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
              Olá, {userName.split(" ")[0]}
            </Typography>
            <InstallPwaButton />
            <Button
              size="small"
              startIcon={<LogoutRoundedIcon />}
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              Sair
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Box sx={{ position: "relative", overflow: "hidden" }}>
        {/* Desktop: logo da empresa como plano de fundo atrás dos calendários. */}
        <Box
          component="img"
          src="/logo.svg"
          alt=""
          aria-hidden="true"
          sx={{
            display: { xs: "none", md: "block" },
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "min(46vw, 560px)",
            height: "min(46vw, 560px)",
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
          }}
        />

        <Box sx={{ position: "relative", zIndex: 1, px: { xs: 2, md: 4 }, py: 3 }}>
          <Stack spacing={3}>
          <CompanyTabs
            companies={companies}
            selectedId={selectedCompanyId}
            onSelect={setSelectedCompanyId}
            onCreate={handleCompanyCreated}
          />

          {!selectedCompany ? (
            <Box
              sx={{
                p: 6,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: 3,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                Crie sua primeira empresa para começar a organizar as demandas no calendário.
              </Typography>
            </Box>
          ) : (
            <>
              <StatusSummary tasks={companyTasks} />

              <Stack direction="row" spacing={2.5} flexWrap="wrap" rowGap={0.5}>
                {(["IN_PROGRESS", "LATE", "DONE", "TODO"] as const).map((s) => (
                  <Stack key={s} direction="row" spacing={0.75} alignItems="center">
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "4px",
                        bgcolor: STATUS_COLOR[s],
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {STATUS_LABEL[s]}
                    </Typography>
                  </Stack>
                ))}
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: "4px",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "#fff",
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Sem tarefas
                  </Typography>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
                {months.map((m) => (
                  <CalendarMonth
                    key={m.toISOString()}
                    monthDate={m}
                    tasks={companyTasks}
                    selectedDate={selectedDate}
                    onSelectDay={setSelectedDate}
                    accentColor={selectedCompany.color}
                  />
                ))}
              </Stack>

              <Box>
                <Button
                  size="small"
                  endIcon={<ExpandMoreRoundedIcon />}
                  onClick={() => setMonthsCount((c) => c + 3)}
                >
                  Mostrar mais meses
                </Button>
              </Box>
            </>
          )}
        </Stack>
        </Box>
      </Box>

      <DayPanel
        open={!!selectedDate}
        date={selectedDate}
        companyId={selectedCompanyId}
        companyColor={selectedCompany?.color ?? "#D4AF37"}
        tasks={dayTasks}
        onClose={() => setSelectedDate(null)}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        onTaskDeleted={handleTaskDeleted}
      />
    </Box>
  );
}
