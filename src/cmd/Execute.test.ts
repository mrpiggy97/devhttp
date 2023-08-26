import { Execute } from "./Execute";
import { Command, SubCommand, Log, Executor, addCommand } from "./Command";

describe("test Execute function", () => {
    const testExecutor : Executor = (flags : Map<string,string | undefined>, opt : Map<string,string | undefined>) : Log => {
        let message : string = `hello my name is ${flags.get("--name")}`
        if(opt.has("--year")){
            message = `${message} year is ${opt.get("--year")}`
        }
        return {
            message : message,
            error : false
        }
    }
    const subCmd : SubCommand = new SubCommand("greet", testExecutor, ["--name", "--age"],["--year"], "this is a test command")
    const Cmd : Command = new Command("app", [subCmd])
    addCommand(Cmd)
    it("test correct functionality with correct input", () => {
        const query : string = "app greet --name fabian --year 2023"
        const result : Log = Execute(query)
        expect(result.message).toBe("hello my name is fabian year is 2023")
        expect(result.error).toBe(false)
    })
    it("tests correct functionality with incorrect input", () => {
        const query : string = "resolve greet --name rod"
        const result : Log = Execute(query)
        expect(result.message).toBe("no such command exists")
        expect(result.error).toBe(true)
    })
    it("tests help command", () => {
        const query = "app help"
        const result = Execute(query)
        expect(result.error).toBe(false)
    })
})