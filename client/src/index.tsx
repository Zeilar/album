import ReactDOM from "react-dom";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthContextProvider } from "./contexts/AuthContext";

ReactDOM.render(
    <ChakraProvider>
        <AuthContextProvider>
            <App />
        </AuthContextProvider>
    </ChakraProvider>,
    document.getElementById("root")
);
