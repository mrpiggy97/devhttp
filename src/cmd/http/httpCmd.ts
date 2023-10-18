import { Command, SubCommand } from "../Command";
import GetExecutor from "./GetExecutor";
import PostExecutor from "./PostExecutor";
import PutExecutor from "./PutExecutor";

const getCmd = new SubCommand("get", GetExecutor, ["--url"], ["--headers"], "makes a GET HTTP request")
const postCmd = new SubCommand("post", PostExecutor, ["--url", "--token", "--data"],[],"makes a POST HTTP request")
const putCmd = new SubCommand("put", PutExecutor, ["--url", "--token", "--data"],[], "make a PUT HTTP request")

export const httpCmd : Command = new Command("http",[getCmd, postCmd, putCmd])