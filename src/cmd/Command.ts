
export type Log = {
    message : string,
    error : boolean
}


export type Executor = (flags : Map<string,string | undefined>, optFlags : Map<string, string | undefined>) => Log

interface ICMD{
    Execute(args : string[]) : Log
}

export class SubCommand implements ICMD{
    name : string
    executor : Executor
    flags : Map<string,string | undefined>
    optFlags : Map<string,string | undefined>
    description: string

    constructor(n : string, exe : Executor, f : string[], opt : string[], descrip : string){
        this.name = n
        this.executor = exe
        this.flags = new Map<string, string | undefined>
        this.optFlags = new Map<string, string | undefined>
        this.description = descrip
        f.map((flag) => {
            this.flags.set(flag, undefined)
        })
        opt.map((flag) => {
            this.optFlags.set(flag,undefined)
        })
    }
    public setFlagsAsDefault() : void{
        this.flags.forEach((_,key) => {
            this.flags.set(key,undefined)
        })
        this.optFlags.forEach((_,key) => {
            this.optFlags.set(key,undefined)
        })
    }
    public setAndVerifyFlags(flags : string[]) : boolean{
        // at this point we should have something like this
        // ['--name', 'fabian', 'link', 'https://www.thelink.com']
        // while not all flags are required, a key value pair is always required
        if(flags.length%2 !== 0){
            return false
        }
        // now loop through the args and check if flags exists within
        // required flags or optional flags, if even a single value of
        // does not exist in either required or optional flags then return false
        // and set both flags and optFlags to their default values
        let currentFlag : string = ""
        for(let i = 0; i < flags.length; i++){
            const val : string = flags[i]
            if(i % 2 === 0 || i === 0){
                // if i is even then we are supposed to be dealing with
                // a flag that needs to be verified
                let isValid : boolean = this.flags.has(val)
                if(!isValid){
                    // if val is not found in flags try optFlags
                    isValid = this.optFlags.has(val)
                    if(!isValid){
                        return false
                    }
                }
                currentFlag = val
            }else{
                // if i is odd then we are dealing with a value for a flag
                if(this.flags.has(currentFlag)){
                    this.flags.set(currentFlag,val)
                }else{
                    this.optFlags.set(currentFlag,val)
                }
            }
        }
        return true
    }
    public Execute(args : string[]) : Log{
        // at this point we should get something like [--name, fabian, --port, 3000]
        const flagsValid : boolean = this.setAndVerifyFlags(args)
        if(!flagsValid){
            return {
                message:"flags provided are not valid",
                error : true
            }
        }
        const flagsCopy : Map<string,string | undefined> = structuredClone(this.flags)
        const optFlagsCopy : Map<string,string | undefined> = structuredClone(this.optFlags)
        this.setFlagsAsDefault()
        return this.executor(flagsCopy,optFlagsCopy)
    }
}

export class Command implements ICMD{
    name : string
    subCommands : Map<string,SubCommand>
    helpExecutor : Executor
    help : SubCommand
    constructor(n : string, commands : SubCommand[]){
        this.name = n
        this.subCommands = new Map<string,SubCommand>()
        commands.map((cmd) => {
            this.subCommands.set(cmd.name,cmd)
        })
        this.helpExecutor = () : Log => {
            let finalStr = ``
            this.subCommands.forEach((subCmd) => {
                finalStr = `${finalStr}\n${subCmd.name} ${subCmd.description}`
                let whitspaces = ""
                for(let i=0; i < subCmd.name.length+1; i++){
                    whitspaces = `${whitspaces} `
                }
                finalStr = `${finalStr}\n${whitspaces}flags`
                subCmd.flags.forEach((_,key) => {
                    finalStr = `${finalStr}\n${whitspaces}${key}`
                })
                finalStr = `${finalStr}\n${whitspaces}optional flags`
                subCmd.optFlags.forEach((_,key) => {
                    finalStr = `${finalStr}\n${whitspaces}${key}`
                })
            })
            return{
                message: finalStr,
                error : false
            }
        }
        this.help = new SubCommand("help", this.helpExecutor,[],[],"run if you need help")
        this.subCommands.set("help", this.help)
    }
    public Execute(args : string[]) : Log{
        // at this stage args should look something similar to
        // [create, --name, hello, --link, https://www.thelink.com]
        // link will be an optional flag while name required
        // create is the subCommand, so the first step would be to verify
        // that a subCommand with the name create exists
        if(args.length < 1){
            return {
                message: "not enough arguments were provided",
                error : true
            }
        }
        // now we verify that we have that subCommand registered
        const subCmd : SubCommand | undefined = this.subCommands.get(args[0])
        if(!subCmd){
            return {
                message: "no such SubCommand exists",
                error : true
            }
        }
        // now we delete the first string from argsSplit
        args = args.slice(1)
        // we should have the following string --name hello --link https://thelink.com
        // so we pass the rest of the execution to the subCommand
        return subCmd.Execute(args)
    }
}

export const Cmd : Map<string,Command> = new Map<string,Command>()

export function addCommand(cmd : Command) : void{
    Cmd.set(cmd.name,cmd)
}
export function removeCommand(cmd : Command) : void{
    Cmd.delete(cmd.name)
}