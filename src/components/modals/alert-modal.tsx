"use client";

import { useEffect, useState } from "react";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";

interface AlertModalProps{
    isOpen:boolean
    onClose: () => void
    onConfirm: () => void
    loading: boolean
}
const AlertModal = ({isOpen,onClose,onConfirm,loading}:AlertModalProps) => {
    const [isMounted,setIsMounted] =useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);
    return (
        <Modal title="are you sure!" description="This action cannot be undone" isOpen={isOpen} onClose={onClose}>
            <div className="flex items-center-justity-end pt-6 space-x-6 w-full">
                <Button variant={"ghost"} disabled={loading} onClick={onClose}>
                    Cancel
                </Button>
                <Button variant={"destructive"} disabled={loading} onClick={onConfirm}>
                    Confirm
                </Button>
            </div>
        </Modal>
    );
}

export default AlertModal;