import { ExecutorProps } from "../Executor";

export default function AliasExecutor(props : ExecutorProps) : JSX.Element{
    const url : string = props.flags.get("url") as string
    const alias : string = props.flags.get("alias") as string
    localStorage.setItem(alias, url)
    return(
        <div>
            <span>success now you can use {alias} as url value for {url}</span>
        </div>
    )
}