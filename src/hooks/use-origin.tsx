"use client"
import { useEffect, useState } from "react";

const useOrigin = () => {
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        // This will only run on the client
        setOrigin(window.location.origin);
    }, []);

    return origin;
};

export default useOrigin;