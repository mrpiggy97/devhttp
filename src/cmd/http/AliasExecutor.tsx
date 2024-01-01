import { ExecutorProps } from "../Executor";

export default function AliasExecutor(props : ExecutorProps) : JSX.Element{
    const url : string = props.flags.get("--url") as string
    const value : string = props.flags.get("--value") as string
    localStorage.setItem(value, url)
    return(
        <div>
            <span>success now you can use {value} as url value for {url}</span>
        </div>
    )
}