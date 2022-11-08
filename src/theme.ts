import { defineStyleConfig, extendTheme } from '@chakra-ui/react';

const Button = defineStyleConfig({
  variants: {
    outline: {
      // _active: {
      //   bg: 'nk_lightOrange',
      // },
      _hover: {
        bg: 'nk_lightOrange',
      },
    },
  },
});

const theme = extendTheme({
  styles: {
    global: {
      html: {
        height: '100vh',
      },
      body: {
        color: 'nk_black',
      },
    },
  },
  fonts: {
    heading: `'Vollkorn', sans-serif`,
    body: `'Josefin Sans', sans-serif`,
  },
  colors: {
    brand: {
      100: '#DF8527',
    },
    nk_black: '#2C303C',
    nk_orange: '#DF8527',
    nk_lightOrange: '#DF85271A',
    nk_gray: {
      10: '#DCDCDC',
      20: '#C1C3C5',
      30: '#929497',
    },
    nk_beige: 'E8D7B9',
  },
  components: {
    Button,
  },
});

export default theme;
