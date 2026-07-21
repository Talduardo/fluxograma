"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import type { Company } from "@/types/models";

const PALETTE = ["#6C5CE7", "#00B894", "#F0932B", "#0984E3", "#E84393", "#E17055"];

type Props = {
  companies: Company[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: (company: Company) => void;
};

export default function CompanyTabs({ companies, selectedId, onSelect, onCreate }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PALETTE[0]);
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setLoading(true);
    const res = await fetch("/api/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), color }),
    });
    setLoading(false);
    if (res.ok) {
      const company = await res.json();
      onCreate(company);
      setOpen(false);
      setName("");
    }
  }

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: 0.5 }}>
        {companies.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            onClick={() => onSelect(c.id)}
            variant={selectedId === c.id ? "filled" : "outlined"}
            sx={{
              fontWeight: 700,
              px: 1,
              borderColor: c.color,
              bgcolor: selectedId === c.id ? c.color : "transparent",
              color: selectedId === c.id ? "#fff" : "text.primary",
              "&:hover": {
                bgcolor: selectedId === c.id ? c.color : `${c.color}14`,
              },
            }}
          />
        ))}
        <IconButton
          size="small"
          onClick={() => setOpen(true)}
          sx={{ border: "1px dashed", borderColor: "divider" }}
        >
          <AddRoundedIcon fontSize="small" />
        </IconButton>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nova empresa</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Nome da empresa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              fullWidth
            />
            <Stack direction="row" spacing={1}>
              {PALETTE.map((p) => (
                <Box
                  key={p}
                  onClick={() => setColor(p)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    bgcolor: p,
                    cursor: "pointer",
                    outline: color === p ? "2px solid #333" : "none",
                    outlineOffset: 2,
                  }}
                />
              ))}
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleCreate} disabled={loading}>
            Criar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
