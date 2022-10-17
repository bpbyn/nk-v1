import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/vollkorn';
import type { AppProps } from 'next/app';
import React, { useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import theme from '../theme';

const MyApp: React.FC<AppProps> = ({ Component, pageProps: p }: AppProps) => {
  const queryClientRef = useRef<QueryClient>();
  // workaround for current bug in Next.js
  const pageProps: any = p;

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default MyApp;
