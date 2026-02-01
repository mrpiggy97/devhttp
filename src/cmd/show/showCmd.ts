import { Command, SubCommand } from "../Command";
import ShowIpExecutor from "./ShowIpExecutor";
import ExtensionSizeExecutor from "./ExtensionSizeExecutor";
import LinksExecutor from "./LinksExecutor";

const ipCmd = new SubCommand("ip", ShowIpExecutor, [],[],"show your current ip address")
const extensionSizeCmd = new SubCommand("extension-size", ExtensionSizeExecutor, [],[],"shows the size of the extension")
const linksCmd = new SubCommand("links", LinksExecutor, [], [], "shows my professional links")
export const showCmd = new Command("show", [ipCmd, extensionSizeCmd, linksCmd])