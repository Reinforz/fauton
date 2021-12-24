import { MouseEventHandler } from "react";

export function Button(props: { className?: string, label: string, onClick?: MouseEventHandler<HTMLDivElement> }) {
  const { onClick, label, className = "" } = props;
  return <div className={`${className} hover:scale-105 transition-transform duration-150 capitalize text-lg text-center shadow-md cursor-pointer p-2 px-4 bg-gray-800 w-[fit-content] rounded-md`} onClick={onClick}>
    {label}
  </div>
}