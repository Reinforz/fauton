import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import { Button } from "../components";

const Index = () => {
  const router = useRouter();
  return <>
    <Head>
      <title>Fauton Playground</title>
    </Head>
    <div className="p-3 text-white bg-gray-900 h-full w-full flex items-center justify-center flex-col gap-5">
      <Button label="Regular Expression" onClick={() => {
        router.push("/regex")
      }}/>
      <Button label="Context Free Grammar" onClick={() => {
        router.push("/cfg")
      }}/>
      <Button label="Finite Automata" onClick={() => {
        router.push("/fa")
      }}/>
      <Button label="Push down Automata" onClick={() => {
        router.push("/pda")
      }}/>
    </div>
  </>;
};

export default Index;