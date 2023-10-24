import { useMemo } from "react";
import { ExecutorProps } from "../Executor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ExtensionSizeExecutor(_props : ExecutorProps) : JSX.Element{
    const extensionSize = useMemo(() => {
        const htmlContent = new XMLSerializer().serializeToString(document);
        return (htmlContent.length/1024).toFixed(2)
    },[])

    return(
        <div>
            <span>{extensionSize} KB</span>
        </div>
    )
}