
export type ExecutorProps = {
    flags : Map<string, string | undefined>,
    optFlags : Map<string,string | undefined>,
}

export type Executor = (props : ExecutorProps) => JSX.Element