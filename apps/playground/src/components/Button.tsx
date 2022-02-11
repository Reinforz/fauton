import styled from "@emotion/styled";
import { Typography } from "@mui/material";
import MuiButton from "@mui/material/Button";
import { MouseEventHandler } from "react";

const StyledMuiButton = styled(MuiButton)`
  text-transform: capitalize;
  text-align: center;
  shadow: ${({theme}) => theme.shadows[1]};
  cursor: pointer;
  padding: ${({theme}) => theme.spacing(1, 2)};
  width: fit-content;
  border-radius: ${({theme}) => theme.spacing(0.5)};
`;

export function Button(props: { disabled?: boolean, className?: string, label: string, onClick?: MouseEventHandler<HTMLButtonElement> }) {
  const { onClick, label, className = "", disabled = false } = props;
  return <StyledMuiButton color="primary" variant="contained" disabled={disabled} className={className} onClick={onClick}>
    <Typography variant="h6">
      {label}
    </Typography>
  </StyledMuiButton>
}