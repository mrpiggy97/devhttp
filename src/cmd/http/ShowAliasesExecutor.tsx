import { useMemo } from "react";
import { ExecutorProps } from "../Executor";

type alias = {
    value : string,
    url : string
}

function Alias(props : alias) : JSX.Element{
    return(
        <div>
            <span>{props.value} {props.url}</span>
        </div>
    )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function ShowAliasesExecutor(_ : ExecutorProps) : JSX.Element{
    const aliases: alias[] = useMemo(() => {
        const result : alias[] = []
        for(let i=0; i < localStorage.length; i++){
            const currentValue = localStorage.key(i) as string
            const currentUrl = localStorage.getItem(currentValue) as string
            result.push({value : currentValue, url : currentUrl})
        }
        console.log(result)
        return result
    },[])
    return(
        <div>
            {aliases.map((alias) => <Alias value={alias.value} url={alias.url}/>)}
        </div>
    )
}