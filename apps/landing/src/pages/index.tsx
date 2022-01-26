import router from "next/router";
import { MouseEventHandler } from "react";

function Button(props: { className?: string, label: string, onClick?: MouseEventHandler<HTMLDivElement> }) {
  const { onClick, label, className = "" } = props;
  return <div className={`${className} hover:scale-105 transition-transform duration-150 capitalize text-lg text-center shadow-md cursor-pointer p-2 px-4 font-bold bg-gray-800 w-[fit-content] rounded-md`} onClick={onClick}>
    {label}
  </div>
}

const Index = () => {
  return <div className="p-3 flex flex-col items-center justify-center text-white bg-gray-900 h-full w-full">
    <div className="text-4xl font-bold">
      Welcome to fauton
    </div>
    <div className="flex gap-5 my-10">
      <Button label="Playground" onClick={() => router.push(`https://playground.fauton.xyz`)} />
      <Button label="Docs" />
    </div>
  </div>;
};

export default Index;