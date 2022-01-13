import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
    fonts: {
        text: 'Open Sans',
        heading: 'Open Sans',
    },
    colors: {
        brand: {
            100: "#f7fafc",
            900: "#1a202c",
        },
    },
    screen: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
    },
})

export default theme