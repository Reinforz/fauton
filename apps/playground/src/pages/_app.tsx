import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from 'next/app';
import "../../styles/main.css";
import { generateTheme } from '../utils/generateTheme';

const generatedTheme = generateTheme();

const MyApp = ({ Component, pageProps }: AppProps) => {
  return <ThemeProvider theme={generatedTheme}>
    <Component {...pageProps} />
  </ThemeProvider>
};

export default MyApp;
