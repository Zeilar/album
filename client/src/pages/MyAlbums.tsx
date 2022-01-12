import { Spinner, useToast } from "@chakra-ui/react";
import { Navigate } from "react-router";
import useAuth from "../hooks/useAuth";

export default function MyAlbums() {
    const { authenticated } = useAuth();
    const toast = useToast();

    if (authenticated === null) {
        return <Spinner mx="auto" color="blue" />;
    }

    if (authenticated === false) {
        toast({
            status: "error",
            position: "top",
            title: "You must be logged in to do that",
        });
        return <Navigate to="/" />;
    }

    return <div></div>;
}
