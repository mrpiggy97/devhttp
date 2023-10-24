import { Command, SubCommand } from "../Command";
import ShowIpExecutor from "./ShowIpExecutor";
import ExtensionSizeExecutor from "./ExtensionSizeExecutor";

const ipCmd = new SubCommand("ip", ShowIpExecutor, [],[],"show your current ip address")
const extensionSizeCmd = new SubCommand("extension-size", ExtensionSizeExecutor, [],[],"shows the size of the extension")
export const showCmd = new Command("show", [ipCmd, extensionSizeCmd])