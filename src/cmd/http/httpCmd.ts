import { Command, SubCommand } from "../Command";
import GetExecutor from "./GetExecutor";

const getCmd : SubCommand = new SubCommand("get", GetExecutor, ["--url", "--headers"], [], "makes a GET HTTP request")

export const httpCmd : Command = new Command("http",[getCmd])