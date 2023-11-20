import { httpCmd } from "./http/httpCmd";
import { Command } from "./Command";
import { showCmd } from "./show/showCmd";

export const Cmd : Map<string,Command> = new Map<string,Command>()

export function addCommand(cmd : Command) : void{
    Cmd.set(cmd.name,cmd)
}
export function removeCommand(cmd : Command) : void{
    Cmd.delete(cmd.name)
}
export function getCommands() : Command[]{
    return Array.from(Cmd.values())
}

export default function startConsole() : void{
    addCommand(httpCmd)
    addCommand(showCmd)
}