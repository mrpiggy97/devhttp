/* eslint-disable @typescript-eslint/no-unused-vars */
import { SubCommand, Executor, Log } from "./Command"


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