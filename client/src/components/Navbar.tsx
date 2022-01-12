import { Flex, Link } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Navbar() {
    const { authenticated, logout } = useAuth();

    return (
        <Flex
            py="1rem"
            as="nav"
            mb="2rem"
            gridGap="2rem"
            fontSize="1.5rem"
            fontWeight="semibold"
            flexWrap="wrap"
        >
            {authenticated && (
                <>
                    <Link as={NavLink} to="/albums">
                        My albums
                    </Link>
                    <Link ml="auto" onClick={logout}>
                        Logout
                    </Link>
                </>
            )}
            {authenticated === false && (
                <>
                    <Link ml="auto" as={NavLink} to="/login">
                        Login
                    </Link>
                    <Link as={NavLink} to="/register">
                        Register
                    </Link>
                </>
            )}
        </Flex>
    );
}
