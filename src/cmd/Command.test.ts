/* eslint-disable @typescript-eslint/no-unused-vars */
import { SubCommand, Executor, Log, Command, addCommand, Execute } from "./Command"


describe("test SubCommand",() => {
    const testExecutor : Executor = (flags : Map<string,string | undefined>, opt : Map<string,string | undefined>) : Log => {
        return {
            message : `testing the name is ${flags.get("--name")} the port is ${opt.get("--port")}`,
            error : false
        }
    }
    const cmd : SubCommand = new SubCommand("test", testExecutor, ["--name"],["--port"])
    it("tests verification of flags with correct input", () => {
        const testQuery : string = "--name container --port 3000"
        const result = cmd.setAndVerifyFlags(testQuery.split(" "))
        expect(result).toBe(true)
    })

    it("tests correct verification of flags with wrong input", () => {
        const testQuery : string = "--wrong dummy --port 3000"
        const result = cmd.setAndVerifyFlags(testQuery.split(" "))
        expect(result).toBe(false)
    })

    it("tests correct output log from command with correct flags", () => {
        const query : string = "--name fabian --port 3000"
        const result : Log = cmd.Execute(query.split(" "))
        expect(result.message).toBe("testing the name is fabian the port is 3000")
        expect(result.error).toBe(false)
    })
    it("tests correct output log of command with incorrect flags ", () => {
        const query : string = "--wrong dummy --port 4000"
        const result : Log = cmd.Execute(query.split(" "))
        expect(result.error).toBe(true)
        expect(result.message).toBe("flags provided are not valid")
    })
})

describe("test Command", () => {
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
    const subCmd : SubCommand = new SubCommand("greet", testExecutor, ["--name"],["--year"])
    const Cmd : Command = new Command("app", [subCmd])
    it("tests execution of command with correct input", () => {
        const query : string = "greet --name fabian --year 2023"
        const result : Log = Cmd.Execute(query.split(" "))
        expect(result.message).toBe("hello my name is fabian year is 2023")
        expect(result.error).toBe(false)
    })
    it("tests execution of command with incorrect input", () => {
        const query : string = "greet --wrong dummy"
        const result : Log = Cmd.Execute(query.split(" "))
        expect(result.message).toBe("flags provided are not valid")
        expect(result.error).toBe(true)
    })
})

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
    const subCmd : SubCommand = new SubCommand("greet", testExecutor, ["--name"],["--year"])
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
})