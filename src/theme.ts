import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      html: {
        height: '100vh',
      },
    },
  },
  fonts: {
    heading: `'Vollkorn', sans-serif`,
    body: `'Josefin Sans', sans-serif`,
  },
  colors: {
    nk_black: '#2C303C',
    nk_orange: '#DF8527',
    nk_gray: {
      10: '#DCDCDC',
      20: '#C1C3C5',
      30: '#929497',
    },
    nk_beige: 'E8D7B9',
  },
});

export default theme;
