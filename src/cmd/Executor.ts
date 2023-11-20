
export type ExecutorProps = {
    flags : Map<string, string | undefined> | null,
    optFlags : Map<string,string | undefined> | null,
}

export type Executor = (props : ExecutorProps) => JSX.Element