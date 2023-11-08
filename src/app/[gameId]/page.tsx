"use client";
import React, { useState } from "react";
import styles from "./page.module.css";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import GroupsIcon from "@mui/icons-material/Groups";
import TableBarIcon from "@mui/icons-material/TableBar";
import DeleteIcon from "@mui/icons-material/Delete";

type instrucionProps = {
  type: "players" | "table";
  cardAmount: number;
};
export default function Page({ params }: { params: { gameId: string } }) {
  const [name, setName] = useState("");
  const [minPlayers, setMinPlayers] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("");
  const [instructions, setInstructions] = useState<instrucionProps[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [instructionEdit, setInstructionEdit] = useState<instrucionProps>({
    type: "players",
    cardAmount: 1,
  });
  const [indexToBeEdited, setIndexToBeEdited] = useState<number>();
  const [indexToBeDeleted, setIndexToBeDeleted] = useState<number>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, minPlayers, maxPlayers });
  };

  const colors = [
    "#39a3ff",
    "#ff8027",
    "#98c863",
    "#1d2023",
    "#37b8c0",
    "#ff3226",
    "#fdb854",
    "#40c065",
    "#ff3b30",
    "#2d3f48",
  ];

  const handleTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: "players" | "table"
  ) => {
    setInstructionEdit({ ...instructionEdit, type: newType });
  };

  const handleCancelInstruction = () => {
    setDialogOpen(false);
    setInstructionEdit({ type: "players", cardAmount: 1 });
  };

  const handleDeleteInstruction = () => {
    setInstructions(
      instructions.filter((_, index) => index !== indexToBeDeleted)
    );
    setDeleteDialogOpen(false);
  };

  const handleOpenEditInstruction = (index: number) => {
    setInstructionEdit(instructions[index]);
    setIndexToBeEdited(index);
    setDialogOpen(true);
  };

  const handleEditInstruction = () => {
    if (indexToBeEdited === instructions.length) {
      setInstructions([...instructions, instructionEdit]);
    } else {
      setInstructions(
        instructions.map((instruction, index) =>
          index === indexToBeEdited ? instructionEdit : instruction
        )
      );
    }
    setDialogOpen(false);
    setInstructionEdit({ type: "players", cardAmount: 1 });
    setIndexToBeEdited(undefined);
  };

  return (
    <div className={styles.main}>
      <a className={styles.back} href="/">
        <ArrowBackIcon />
      </a>
      <h1 className={styles.title}>
        {params.gameId === "new" ? "Novo" : "Editar"} Jogo
      </h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.top}>
          <TextField
            id="name"
            label="Nome"
            type="text"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className={styles.input}
            variant="filled"
            fullWidth
            required
          />
          <TextField
            id="minPlayers"
            label="Mínimo de jogadores"
            type="number"
            inputProps={{
              min: 1,
            }}
            value={minPlayers}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setMinPlayers(e.target.value);
              if (e.target.value > maxPlayers) setMaxPlayers(e.target.value);
            }}
            className={styles.input}
            variant="filled"
            fullWidth
            required
          />
          <TextField
            id="maxPlayers"
            label="Máximo de jogadores"
            type="number"
            inputProps={{
              min: minPlayers,
            }}
            value={maxPlayers}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMaxPlayers(e.target.value)
            }
            className={styles.input}
            variant="filled"
            fullWidth
            required
          />
        </div>
        {instructions.map((instruction, index) => (
          <div
            className={styles.card}
            style={{ backgroundColor: colors[index] }}
            key={index}
            onClick={() => handleOpenEditInstruction(index)}
          >
            <span>{index + 1}ª distribuição</span>
            <div className={styles.cardInfo}>
              <span>
                {instruction.cardAmount} carta
                {instruction.cardAmount > 1 && "s"}{" "}
                {instruction.type === "players"
                  ? "para cada jogador"
                  : "na mesa"}
              </span>
              <div
                className={styles.deleteCard}
                onClick={(e) => {
                  setDeleteDialogOpen(true);
                  setIndexToBeDeleted(index);
                  e.stopPropagation();
                }}
              >
                <DeleteIcon />
              </div>
            </div>
          </div>
        ))}
        <div
          className={`${styles.card} ${styles.add}`}
          onClick={() => {
            setDialogOpen(true);
            setIndexToBeEdited(instructions.length);
          }}
        >
          <AddIcon />
        </div>

        <div className={styles.buttonContainer}>
          <Button
            variant="contained"
            size="large"
            type="submit"
            className={styles.submit}
          >
            Salvar
          </Button>
        </div>
      </form>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle id="alert-dialog-title">
          {indexToBeEdited ? indexToBeEdited + 1 : 1}ª distribuição
        </DialogTitle>
        <DialogContent>
          <div className={styles.type}>
            <span style={{ flex: 1, textAlign: "right", fontWeight: 500 }}>
              Jogadores
            </span>
            <ToggleButtonGroup
              style={{ flex: 0, margin: "0 15px" }}
              value={instructionEdit.type}
              exclusive
              onChange={handleTypeChange}
              aria-label="text alignment"
            >
              <ToggleButton value="players" aria-label="left aligned">
                <GroupsIcon />
              </ToggleButton>
              <ToggleButton value="table" aria-label="right aligned">
                <TableBarIcon />
              </ToggleButton>
            </ToggleButtonGroup>
            <span style={{ flex: 1, fontWeight: 500 }}>Mesa</span>
          </div>
          <div className={styles.amount}>
            <TextField
              id="cardAmount"
              type="number"
              inputProps={{
                min: 1,
              }}
              value={instructionEdit.cardAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInstructionEdit({
                  ...instructionEdit,
                  cardAmount: Number(e.target.value),
                })
              }
              style={{ width: "335px" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    carta{instructionEdit.cardAmount > 1 && "s"}{" "}
                    {instructionEdit.type === "players"
                      ? "por jogador"
                      : "na mesa"}
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelInstruction}>Cancelar</Button>
          <Button onClick={handleEditInstruction} autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deseja realmente excluir esta distribuição?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
          <Button onClick={handleDeleteInstruction} autoFocus>
            EXCLUIR
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
