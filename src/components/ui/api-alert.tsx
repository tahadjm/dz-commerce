"use client"
import { Copy, Server } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./alert"
import { Badge ,VariantProps} from "./badge"
import { Button } from "./button"
import { copyToClipboard } from "@/utils/clipboard"

interface ApiAlertProps{
    title: string
    description: string
    variant: "public" | "admin"
}

const TextMap: Record<ApiAlertProps["variant"], string> = {
    public: "Public",
    admin: "Admin"
};

const VariantMap: Record<ApiAlertProps["variant"], VariantProps> = {
    public: "secondary",
    admin: "destructive"
};

// export const onCopy = (description:string) => {
//     navigator.clipboard.writeText(description);
//     toast.success("API Route copied to the clipboard")
// }


const ApiAlert =  ({title,description,variant="public"}:ApiAlertProps) => {
    return (
        <div>
            <Alert>
                <Server className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-x-2" >
                    {title}
                    <Badge variant={VariantMap[variant]} >
                        {TextMap[variant]}
                    </Badge>
                </AlertTitle>
                <AlertDescription className="ml-4 flex items-center justify-between">
                    <code className="relative rounded bg-muted font-semibold px-[0.3rem] py-[0.2rem]">
                        {description}
                    </code>
                    <Button variant={"outline"}  onClick={() => copyToClipboard(description,"API Route copied to the clipboard")}>
                        <Copy className="h-4 w-4"/>
                    </Button>
                </AlertDescription>
            </Alert>
        </div>
    );
}

export default ApiAlert;