"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import type { Task } from "@/types/models";
import { effectiveStatus, STATUS_COLOR, type EffectiveStatus } from "@/types/models";

// Ordem de prioridade: se o dia tem mais de uma tarefa, o quadrado assume a
// cor do status mais "urgente" — atraso chama mais atenção que andamento,
// que chama mais atenção que a fazer; só fica verde quando tudo está concluído.
const STATUS_PRIORITY: EffectiveStatus[] = ["LATE", "IN_PROGRESS", "TODO", "DONE"];

function dominantStatus(statuses: EffectiveStatus[]): EffectiveStatus | null {
  for (const s of STATUS_PRIORITY) {
    if (statuses.includes(s)) return s;
  }
  return null;
}

type Props = {
  monthDate: Date;
  tasks: Task[];
  selectedDate: Date | null;
  onSelectDay: (day: Date) => void;
  accentColor: string;
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function CalendarMonth({
  monthDate,
  tasks,
  selectedDate,
  onSelectDay,
  accentColor,
}: Props) {
  const start = startOfWeek(startOfMonth(monthDate));
  const end = endOfWeek(endOfMonth(monthDate));
  const days = eachDayOfInterval({ start, end });

  const tasksByDay = new Map<string, Task[]>();
  for (const t of tasks) {
    const key = format(new Date(t.date), "yyyy-MM-dd");
    const arr = tasksByDay.get(key) ?? [];
    arr.push(t);
    tasksByDay.set(key, arr);
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        minWidth: 280,
        flex: "0 0 auto",
      }}
    >
      <Typography
        variant="subtitle1"
        fontWeight={800}
        sx={{ mb: 1, textTransform: "capitalize", color: accentColor }}
      >
        {format(monthDate, "MMMM yyyy", { locale: ptBR })}
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, mb: 0.5 }}>
        {WEEKDAYS.map((d, i) => (
          <Typography
            key={i}
            variant="caption"
            color="text.secondary"
            textAlign="center"
            fontWeight={700}
          >
            {d}
          </Typography>
        ))}
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5 }}>
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const dayTasks = tasksByDay.get(key) ?? [];
          const inMonth = isSameMonth(day, monthDate);
          const selected = selectedDate && isSameDay(day, selectedDate);
          const todayFlag = isToday(day);

          const statuses = Array.from(new Set(dayTasks.map((t) => effectiveStatus(t))));
          const dominant = dominantStatus(statuses);

          return (
            <Box
              key={key}
              onClick={() => inMonth && onSelectDay(day)}
              sx={{
                aspectRatio: "1",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.2,
                cursor: inMonth ? "pointer" : "default",
                opacity: inMonth ? 1 : 0.25,
                bgcolor: dominant
                  ? STATUS_COLOR[dominant]
                  : todayFlag
                  ? `${accentColor}1F`
                  : "transparent",
                color: dominant ? "#fff" : "text.primary",
                boxShadow: selected ? `0 0 0 2.5px ${accentColor}` : "none",
                border:
                  !selected && todayFlag && !dominant
                    ? `1.5px solid ${accentColor}`
                    : "1.5px solid transparent",
                transition: "background-color 0.15s ease, box-shadow 0.15s ease",
                "&:hover": inMonth
                  ? {
                      bgcolor: dominant ? STATUS_COLOR[dominant] : `${accentColor}14`,
                      filter: dominant ? "brightness(1.08)" : "none",
                    }
                  : undefined,
              }}
            >
              <Typography
                variant="caption"
                fontWeight={selected || todayFlag || dominant ? 800 : 500}
              >
                {format(day, "d")}
              </Typography>
              {dayTasks.length > 1 && (
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    opacity: 0.85,
                    lineHeight: 1,
                  }}
                >
                  {dayTasks.length} tarefas
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
}
