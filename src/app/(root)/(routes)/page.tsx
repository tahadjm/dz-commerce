"use client";

import { useEffect } from "react";
import { UseStoreModal } from "@/hooks/use-store-modal";


export default function Home() {
  const onOpen = UseStoreModal((state)=> state.onOpen)
  const isOpen = UseStoreModal((state)=> state.isOpen)
  console.log("isOpen", isOpen);

  useEffect(() => {
    if(!isOpen) onOpen();
  }, [onOpen , isOpen]);
  return null;
}
