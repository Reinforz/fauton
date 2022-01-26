import { MouseEventHandler } from "react";

interface IconProps {
  onClick: MouseEventHandler<SVGSVGElement>
  size?: number
  disabled?: boolean
}

export function AddIcon(props: IconProps) {
  const { onClick, size = ".75em", disabled } = props;
  return <svg className="cursor-pointer hover:scale-110 transition-transform duration-150 " onClick={onClick} stroke="currentColor" fill={!disabled ? "#4fcf67" : "bg-grey-600"} strokeWidth="0" viewBox="0 0 512 512" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm144 276c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92h-92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>
}

export function DeleteIcon(props: IconProps) {
  const { onClick, size = ".75em", disabled } = props;
  return <svg onClick={onClick} className="cursor-pointer hover:scale-110 transition-transform duration-150 " stroke="currentColor" fill={!disabled ? "#fa2e4a" : "bg-grey-600"} strokeWidth="0" viewBox="0 0 24 24" height={size} width={size} xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
}