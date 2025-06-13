// src/utils/clipboard.ts

import toast from "react-hot-toast";

export const copyToClipboard = (text: string,SuccessMessage:string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${SuccessMessage}`);
};

export const formatter = new Intl.NumberFormat("en-US",{
    style:"currency",
    currency: "USD"
})