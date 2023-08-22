import { httpCmd } from "./http/httpCmd";
import { addCommand } from "./Command";

export default function startConsole() : void{
    addCommand(httpCmd)
}