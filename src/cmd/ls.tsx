/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo } from "react";
import { ExecutorProps } from "./Executor";
import { getCommands } from "./cmd";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ls(_props : ExecutorProps) : JSX.Element{
    const commands = useMemo(() => {
        return getCommands()
    },[])
    return(
        <div>
            {commands.map((cmd) => <span>{cmd.name}</span>)}
        </div>
    )
}