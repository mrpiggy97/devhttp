import { Command } from "../Command";
import { getCmd } from "./GetCmd";

export const httpCmd : Command = new Command("http",[getCmd])