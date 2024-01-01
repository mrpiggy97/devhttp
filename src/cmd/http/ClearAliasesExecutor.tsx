import { useEffect } from "react";
import { ExecutorProps } from "../Executor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ClearAliasesExecutor(_ : ExecutorProps) : JSX.Element{
    useEffect(() => {
        localStorage.clear()
    },[])
    return(
        <div>
            <span>success, all aliases have been deleted</span>
        </div>
    )
}