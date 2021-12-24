import MuiButton from "@mui/material/Button";
import { MouseEventHandler } from "react";

export function Button(props: { disabled?: boolean, className?: string, label: string, onClick?: MouseEventHandler<HTMLButtonElement> }) {
  const { onClick, label, className = "", disabled = false } = props;
  return <MuiButton color="primary" variant="contained" disabled={disabled} className={`${className} capitalize text-lg text-white text-center shadow-md cursor-pointer p-2 px-4 w-[fit-content] rounded-md`} onClick={onClick}>
    {label}
  </MuiButton>
}