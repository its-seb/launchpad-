import { color, extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "540px",
  md: "720px",
  lg: "960px",
  xl: "1140px",
  one: "1280px",
  two: "1366px",
  three: "1440px",
  four: "1536px",
  five: "1600px",
  six: "1920px",
});

const theme = extendTheme(
  {
    textStyles: {
      h1: {
        // you can also use responsive styles
        fontSize: [
          "2px",
          null,
          "5px",
          "10px",
          "15px",
          "20px",
          "32px",
          "35px",
          "35px",
          "36px",
          "40px",
          "50px",
        ],
        fontWeight: "bold",
        lineHeight: "110%",
        letterSpacing: "-2%",
      },
      h2: {
        fontFamily: "emoji",
        fontSize: [
          "2px",
          null,
          "5px",
          "10px",
          "15px",
          "20px",
          "30px",
          "32px",
          "35px",
          "35px",
          "35px",
          "38px",
        ],
        lineHeight: "110%",
        letterSpacing: "-1%",
      },
      h3: {
        fontFamily: "Calibri",
        fontSize: [
          "2px",
          null,
          "5px",
          "10px",
          "15px",
          "20px",
          "30px",
          "33px",
          "33px",
          "33px",
          "33px",
          "33px",
        ],
        lineHeight: "110%",
        letterSpacing: "-1%",
      },
    },
    colors: {
      brand: {
        50: "#fffadb",
        100: "#fff0ad",
        200: "#fedb4b",
        300: "#fed11b",
        400: "#fed428",
        500: "#D9B423",
        600: "#fed428",
        700: "#fed428",
      },
    },
    layerStyles: {
      card_new_collection: {
        bg: "#fed428",
        p: "6px 15px 10px 15px",
        borderRadius: "xl",
        mt: "0.5rem",
      },
      card_collection: {
        mt: "0.5rem",
        bg: "#2f3136",
        color: "white",
        p: "6px 15px 10px 15px",
        borderRadius: "xl",
        _hover: { backgroundColor: "#393c43", color: "white" },
      },
      card_title: {
        fontSize: "1.8rem",
        fontWeight: "bold",
        w: "100%",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
      card_content: {
        fontSize: "0.9rem",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
      },
      card_icon: {
        w: "1rem",
        h: "1rem",
        mt: "13px",
        float: "right",
      },
      section_title: {
        color: "white",
        fontWeight: "bold",
        fontSize: "1.2rem",
      },
      upload_box: {
        h: "100px",
        w: "100px",
        m: "auto",
        bg: "#595A5A",
        borderRadius: "10",
        textAlign: "right",
        position: "relative",
      },
      modal_container: {
        zIndex: "modal",
        top: 0,
        left: 0,
        position: "fixed",
        h: "100%",
        w: "100%",
        overflow: "auto",
        bg: "blackAlpha.600",
        display: "none",
      },
      modal_content: {
        display: "flex",
        flexDirection: "column",
        m: "5% auto 15% auto",
        position: "relative",
        px: 6,
        py: 10,
        maxWidth: "md",
        bg: "#2f3136",
        color: "white",
        borderRadius: "xl",
      },
      modal_title: {
        fontSize: "1.8rem",
        fontWeight: "600",
        pt: "15px",
        textAlign: "center",
      },
      modal_text: {
        fontSize: "1rem",
        pt: "5px",
        textAlign: "center",
      },

    },
    components: {
      Link: {
        baseStyle: {
          fontSize: "l",
          paddingRight: "2rem",
          color: "white",
          _hover: {
            textDecoration: "none",
            fontWeight: "600",
            color: "white",
          },
        },
        variants: {
          current: {
            fontWeight: "bold",
            _hover: {
              fontWeight: "bold",
            },
          },
        },
      },
      Input: {
        variants: {
          modal_input: {
            borderColor: "#4c4c4c",
            _focus: { outlineColor: "#4c4c4c", outlineOffset: "0" },
          },
        },
      },
      Button: {
        variants: {
          modal_submit: {
            bg: "#fed428",
            color: "#2f3136",
            _hover: { backgroundColor: "#fed428", boxShadow: "0" },
            _active: { backgroundColor: "#fed428" },
            _focus: { boxShadow: "0" },
          },
          modal_cancel: {
            mr: 3,
            bg: "#2f3136",
            color: "white",
            _hover: { backgroundColor: "#2f3136" },
            _active: { backgroundColor: "#2f3136" },
            _focus: { boxShadow: "0" },
          },
        },
      },
      Spinner: {
        variants: {
          loading_spinner: {
            w: "5rem",
            h: "5rem",
            borderColor: "#626262",
          },
        },
      },
    },
  },
  { breakpoints }
);

export default theme;
