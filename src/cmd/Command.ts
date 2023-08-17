export type Executor = (flags : Map<string,string | undefined>, optFlags : Map<string, string | undefined>) => string

interface ICMD{
    Execute(args : string[]) : string
}

export class SubCommand implements ICMD{
    name : string
    executor : Executor
    flags : Map<string,string | undefined>
    optFlags : Map<string,string | undefined>

    constructor(n : string, exe : Executor, f : string[], opt : string[]){
        this.name = n
        this.executor = exe
        this.flags = new Map<string, string | undefined>
        this.optFlags = new Map<string, string | undefined>
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
            this.flags.set(key,undefined)
        })
    }
    public setAndVerifyFlags(flags : string[]) : boolean{
        // while not all flags are required, a key value pair is always required
        if(flags.length%2 !== 0){
            return false
        }
        // now loop through the args and check if flags exists within
        // required flags or optional flags, if even a single value of
        // does not exist in either required or optional flags then return false
        // and set both flags and optFlags to their default values
        let currentFlag : string = ""
        flags.map((val, index) => {
            if(index % 2 === 0 || index === 0){
                // index is even so it is supposed to be a key, check if that key
                // is valid
                let isValid : boolean = this.flags.has(val)
                if(!isValid){
                    // if not present in flags try optionalFlags
                    isValid = this.optFlags.has(val)
                    if(!isValid){
                        // at this point the provided flags are
                        // deemed invalid
                        this.setFlagsAsDefault()
                        return false
                    }
                }
                currentFlag = val
            }else{
                if(this.flags.has(currentFlag)){
                    this.flags.set(currentFlag,val)
                }
                if(this.optFlags.has(currentFlag)){
                    this.optFlags.set(currentFlag,val)
                }
            }
        })
        return true
    }
    public Execute(args : string[]) : string{
        const flagsValid : boolean = this.setAndVerifyFlags(args)
        if(!flagsValid){
            return "flags provided are not valid"
        }
        return this.executor(this.flags,this.optFlags)
    }
}

export class Command implements ICMD{
    name : string
    subCommands : Map<string,SubCommand>
    constructor(n : string, commands : SubCommand[]){
        this.name = n
        this.subCommands = new Map<string,SubCommand>()
        commands.map((cmd) => {
            this.subCommands.set(cmd.name,cmd)
        })
    }
    public Execute(args : string[]) : string{
        // at this stage args should look something similar to
        // create --name hello --link https://www.thelink.com
        // link will be an optional flag while name required
        // create is the subCommand, so the first step would be to verify
        // that a subCommand with the name create exists
        if(args.length <= 1){
            return "not enough arguments were provided"
        }
        // now we verify that we have that subCommand registered
        const subCmd : SubCommand | undefined = this.subCommands.get(args[0])
        if(!subCmd){
            return "no such SubCommand exists"
        }
        // now we delete the first string from argsSplit
        args = args.slice(1)
        // we should have the following string --name hello --link https://thelink.com
        // so we pass the rest of the execution to the subCommand
        return subCmd.Execute(args)
    }
}