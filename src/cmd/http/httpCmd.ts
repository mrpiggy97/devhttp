import { Command, SubCommand } from "../Command";
import GetExecutor from "./GetExecutor";
import PostExecutor from "./PostExecutor";
import PutExecutor from "./PutExecutor";
import AliasExecutor from "./AliasExecutor";
import ShowAliasesExecutor from "./ShowAliasesExecutor";
import ClearAliasesExecutor from "./ClearAliasesExecutor";

const getCmd = new SubCommand("get", GetExecutor, ["--url"], ["--headers"], "makes a GET HTTP request")
const postCmd = new SubCommand("post", PostExecutor, ["--url", "--token", "--data"],[],"makes a POST HTTP request")
const putCmd = new SubCommand("put", PutExecutor, ["--url", "--token", "--data"],[], "make a PUT HTTP request")
const aliasCmd = new SubCommand("alias", AliasExecutor, ["--url", "--value"],[],"gives an alias to a url")
const showAliasesCmd = new SubCommand("show-aliases", ShowAliasesExecutor, [],[], "prints aliases and their urls")
const clearAliasesCmd = new SubCommand("clear-aliases", ClearAliasesExecutor, [], [], "clears aliases from local storage")

export const httpCmd : Command = new Command("http",[getCmd, postCmd, putCmd, aliasCmd, showAliasesCmd, clearAliasesCmd])