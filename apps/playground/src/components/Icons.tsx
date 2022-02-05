import AddCircleIcon from '@mui/icons-material/AddCircle';
import MuiDeleteIcon from '@mui/icons-material/Delete';
import { SvgIconProps } from "@mui/material";
import { grey } from "@mui/material/colors";

interface IconProps extends SvgIconProps{
  size?: number
  disabled?: boolean
}

export function AddIcon(props: IconProps) {
  const { disabled, ...rest } = props;
  return <AddCircleIcon fontSize='small' {...rest} sx={{
    fill: !disabled ? "#4fcf67" : grey[500]
  }} />
}

export function DeleteIcon(props: IconProps) {
  const { disabled, ...rest } = props;
  return <MuiDeleteIcon fontSize='small' {...rest} sx={{
    fill: !disabled ? "#fa2e4a" : grey[500]
  }}/>
  
}