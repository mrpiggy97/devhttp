/* eslint-disable @typescript-eslint/no-unused-vars */
import { SubCommand, Executor, Log } from "./Command"


describe("test SubCommand",() => {
    it("tests verification of flags", () => {
        const testExecutor : Executor = (flags : Map<string,string | undefined>, opt : Map<string,string | undefined>) : Log => {
            if(flags === undefined || opt === undefined){
                console.log("comply with the almight compiler")
            }
            return {
                message : "testing",
                error : false
            }
        }
        const cmd : SubCommand = new SubCommand("test", testExecutor, ["--name", "--port"],[])
        let testQuery : string = "--name container, --port 3000"
        let result = cmd.setAndVerifyFlags(testQuery.split(" "))
        cmd.setFlagsAsDefault()
        expect(result).toBe(true)
        cmd.flags.forEach((value,_) => {
            console.log(value)
            expect(value).toBe(undefined)
        })
        cmd.optFlags.forEach((value,_) => {
            expect(value).toBe(undefined)
        })
        testQuery = "-- name fabian --port 300"
        cmd.setFlagsAsDefault()
        result = cmd.setAndVerifyFlags(testQuery.split(" "))
        console.log(testQuery.split(" "))
        expect(result).toBe(false)
    })

    it("tests correct output log from command", () => {
        const testExecutor : Executor = (flags : Map<string,string | undefined>, opt : Map<string,string | undefined>) : Log => {
            return {
                message : `testing the name is ${flags.get("--name")} the port is ${opt.get("--port")}`,
                error : false
            }
        }
        const cmd : SubCommand = new SubCommand("test", testExecutor, ["--name"],["--port"])
        const query : string = "--name fabian --port 3000"
        const result : Log = cmd.Execute(query.split(" "))
        expect(result.message).toBe("testing the name is fabian the port is 3000")
        expect(result.error).toBe(false)
    })
})