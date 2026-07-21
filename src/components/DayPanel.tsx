"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Task, TaskStatus } from "@/types/models";
import { effectiveStatus, STATUS_COLOR, STATUS_LABEL } from "@/types/models";

type Props = {
  open: boolean;
  date: Date | null;
  companyId: string | null;
  companyColor: string;
  tasks: Task[];
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
};

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: "TODO", label: "A fazer" },
  { value: "IN_PROGRESS", label: "Em andamento" },
  { value: "DONE", label: "Concluída" },
];

export default function DayPanel({
  open,
  date,
  companyId,
  companyColor,
  tasks,
  onClose,
  onTaskCreated,
  onTaskUpdated,
  onTaskDeleted,
}: Props) {
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuTaskId, setMenuTaskId] = useState<string | null>(null);

  async function handleAdd() {
    if (!title.trim() || !date || !companyId) return;
    setSaving(true);
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        date: date.toISOString(),
        companyId,
        status: "TODO",
      }),
    });
    setSaving(false);
    if (res.ok) {
      const task = await res.json();
      onTaskCreated(task);
      setTitle("");
    }
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    setMenuAnchor(null);
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const task = await res.json();
      onTaskUpdated(task);
    }
  }

  async function handleDelete(taskId: string) {
    const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
    if (res.ok) onTaskDeleted(taskId);
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: "100%", sm: 380 }, p: 3 } } }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {date ? format(date, "EEEE", { locale: ptBR }) : ""}
          </Typography>
          <Typography variant="h6" fontWeight={800} sx={{ textTransform: "capitalize" }}>
            {date ? format(date, "d 'de' MMMM", { locale: ptBR }) : ""}
          </Typography>
        </Box>
        <IconButton onClick={onClose}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Nova tarefa para o dia..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          fullWidth
        />
        <Button
          variant="contained"
          onClick={handleAdd}
          disabled={saving || !title.trim()}
          sx={{ bgcolor: companyColor, "&:hover": { bgcolor: companyColor } }}
        >
          <AddRoundedIcon />
        </Button>
      </Stack>

      <Divider sx={{ mb: 2 }} />

      <Stack spacing={1.5}>
        {tasks.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            Nenhuma tarefa para este dia ainda.
          </Typography>
        )}

        {tasks.map((task) => {
          const status = effectiveStatus(task);
          return (
            <Box
              key={task.id}
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    textDecoration: task.status === "DONE" ? "line-through" : "none",
                    color: task.status === "DONE" ? "text.secondary" : "text.primary",
                  }}
                >
                  {task.title}
                </Typography>
                <IconButton size="small" onClick={() => handleDelete(task.id)}>
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Stack>

              <Chip
                label={STATUS_LABEL[status]}
                size="small"
                onClick={(e) => {
                  setMenuAnchor(e.currentTarget);
                  setMenuTaskId(task.id);
                }}
                sx={{
                  mt: 1,
                  fontWeight: 700,
                  bgcolor: `${STATUS_COLOR[status]}1F`,
                  color: STATUS_COLOR[status],
                  cursor: "pointer",
                }}
              />
            </Box>
          );
        })}
      </Stack>

      <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={() => setMenuAnchor(null)}>
        {STATUS_OPTIONS.map((opt) => (
          <MenuItem
            key={opt.value}
            onClick={() => menuTaskId && handleStatusChange(menuTaskId, opt.value)}
          >
            {opt.label}
          </MenuItem>
        ))}
      </Menu>
    </Drawer>
  );
}
