"use client";

import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RadioButtonUncheckedRoundedIcon from "@mui/icons-material/RadioButtonUncheckedRounded";
import type { Task } from "@/types/models";
import { effectiveStatus } from "@/types/models";

type Props = {
  tasks: Task[];
};

export default function StatusSummary({ tasks }: Props) {
  const counts = { TODO: 0, IN_PROGRESS: 0, LATE: 0, DONE: 0 };
  for (const t of tasks) counts[effectiveStatus(t)]++;

  const cards = [
    {
      key: "IN_PROGRESS",
      label: "Em andamento",
      value: counts.IN_PROGRESS,
      color: "#F0932B",
      icon: <AccessTimeRoundedIcon />,
    },
    {
      key: "LATE",
      label: "Em atraso",
      value: counts.LATE,
      color: "#E74C3C",
      icon: <ErrorRoundedIcon />,
    },
    {
      key: "DONE",
      label: "Concluídas",
      value: counts.DONE,
      color: "#00B894",
      icon: <CheckCircleRoundedIcon />,
    },
    {
      key: "TODO",
      label: "A fazer",
      value: counts.TODO,
      color: "#8E8BA8",
      icon: <RadioButtonUncheckedRoundedIcon />,
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((c) => (
        <Grid item xs={6} md={3} key={c.key}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: `${c.color}1F`,
                color: c.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {c.icon}
            </Box>
            <Stack spacing={0} minWidth={0}>
              <Typography variant="h6" fontWeight={800} lineHeight={1.1}>
                {c.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {c.label}
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
