import { Command, SubCommand } from "../Command";
import ShowIpExecutor from "./ShowIpExecutor";
import FileSizeExecutor from "./FileSizeExecutor";

const ipCmd = new SubCommand("ip", ShowIpExecutor, [],[],"show your current ip address")
const fileSizeCmd = new SubCommand("file-size", FileSizeExecutor, [],[],"shows the size of the current html5 document")
export const showCmd = new Command("show", [ipCmd, fileSizeCmd])