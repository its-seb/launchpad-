import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
    fonts: {
        text: "Open Sans",
        heading: "Open Sans",
    },
    colors: {
        brand: {
            100: "#f7fafc",
            900: "#1a202c",
        },
    },
    screen: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
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
        Box: {
            baseStyle: {
                padding: "10px 15px",
                borderRadius: "10px",
                backgroundColor: "#2f3136",
                color: "white",
            },
        },
    },
});

export default theme;
