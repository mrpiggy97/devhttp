import { httpCmd } from "./http/httpCmd";
import { Command } from "./Command";

export const Cmd : Map<string,Command> = new Map<string,Command>()

export function addCommand(cmd : Command) : void{
    Cmd.set(cmd.name,cmd)
}
export function removeCommand(cmd : Command) : void{
    Cmd.delete(cmd.name)
}

export default function startConsole() : void{
    addCommand(httpCmd)
}