import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ChakraBaseProvider, ColorModeScript } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';
import { extendTheme } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom'
import { RecoilRoot } from 'recoil';
import React from 'react';
import { SocketContextProvider } from '../context/SocketContext.jsx';

const styles = {
  global: (props) => ({
    body: {
      color: mode('gray.800', 'whiteAlpha.900')(props),
      bg: mode('gray.100', '#101010')(props),
    }
  })
};

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true
};

const colors = {
  gray: {
    light: '#616161',
    dark: '#1e1e1e'
  }
};

const theme = extendTheme({ colors, styles, config });

createRoot(document.getElementById('root')).render(
  // this strict mode in react re render the components i.e it gives twice errors if some thing has gone wrong and in production it should work well strict mode helps developers to make their production app to be null errors
  <StrictMode>
    <RecoilRoot>

      <BrowserRouter>
        <ChakraBaseProvider theme={theme}>
          <ColorModeScript initialColorMode={theme.config.initialColorMode} />
          <SocketContextProvider>
            <App />
          </SocketContextProvider>
        </ChakraBaseProvider>
      </BrowserRouter>
    </RecoilRoot>
  </StrictMode>
);
