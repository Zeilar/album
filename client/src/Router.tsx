import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/404";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}
