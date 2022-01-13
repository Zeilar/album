import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import NotFound from "./pages/404";
import CreateAlbum from "./pages/CreateAlbum";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyAlbums from "./pages/MyAlbums";
import Register from "./pages/Register";
import SingleAlbum from "./pages/SingleAlbum";

export default function Router() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/albums" element={<MyAlbums />} />
                <Route path="/albums/new" element={<CreateAlbum />} />
                <Route path="/albums/:id" element={<SingleAlbum />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    );
}
