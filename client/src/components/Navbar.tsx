import { Flex } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <Flex as="nav" mb="2rem">
            Navbar
            <NavLink to="/albums">My albums</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
        </Flex>
    );
}
