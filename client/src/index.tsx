import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { theme } from "./theme";

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </ChakraProvider>,
    document.getElementById("root")
);
