import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import "../../styles/main.css";
import { generateTheme } from '../utils/generateTheme';

const generatedTheme = generateTheme();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <ThemeProvider theme={generatedTheme}>
    <div className="text-white bg-gray-900 h-full">
      <Component {...pageProps} />
    </div>
  </ThemeProvider>
};

export default MyApp;
