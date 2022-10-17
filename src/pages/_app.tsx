import { ChakraProvider } from '@chakra-ui/react';
import '@fontsource/josefin-sans';
import '@fontsource/vollkorn';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React, { ReactElement, ReactNode, useRef } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { Hydrate } from 'react-query/hydration';

import theme from '../theme';

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: React.FC<AppProps> = ({
  Component,
  pageProps: p,
}: AppPropsWithLayout) => {
  const queryClientRef = useRef<QueryClient>();
  // workaround for current bug in Next.js
  const pageProps: any = p;

  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <Hydrate state={pageProps.dehydratedState}>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};

export default MyApp;
