import "./SubCommand.css"

export type SubCommandComponentProps = {
    flags: Map<string,string | undefined>
    optFlags : Map<string,string | undefined>
    name : string,
    description : string
}

export default function SubCommandComponent(props : SubCommandComponentProps) : JSX.Element{
    const flagsArray : string[] = Array.from(props.flags.keys())
    const optionalFlags : string[] = Array.from(props.optFlags.keys())
    return(
        <div className="sub-command">
            <div className="basic-info">
                <span className="name">{props.name}</span>
                <span className="description">{props.description}</span>
            </div>
            <div className="flags">
                {flagsArray.map((str) => <span>{str}</span>)}
                {optionalFlags.map((str) => <span>{str}</span>)}
            </div>
        </div>
    )
}