import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
    <BrowserRouter>
        <ChakraProvider theme={theme}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </ChakraProvider>
    </BrowserRouter>,
    document.getElementById("root")
);
