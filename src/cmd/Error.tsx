import { ExecutorProps } from "./Executor"

export default function Error(props : ExecutorProps) : JSX.Element{
    const message : string | undefined = props.flags.get("--message")
    return(
        <div>
            {message ? <span>{message}</span> : <span>an error ocurred during execution</span>}
        </div>
    )
}