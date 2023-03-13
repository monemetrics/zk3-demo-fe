import { SystemStyleObject } from "@chakra-ui/react"
import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
    global: (): SystemStyleObject => ({
        body: {
            bg: "white",
            color: "#151c2b"
        },
        "body, #__next": {
            minHeight: "100vh"
        },
        "#__next": {
            display: "flex",
            flexDirection: "column"
        }
    })
}

export default styles
