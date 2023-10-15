import { Command, SubCommand } from "../Command";
import ShowIpExecutor from "./ShowIpExecutor";

const ipCmd = new SubCommand("ip", ShowIpExecutor, [],[],"show your current ip address")
export const showCmd = new Command("show", [ipCmd])