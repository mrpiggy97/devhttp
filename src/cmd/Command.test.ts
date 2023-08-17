/* eslint-disable @typescript-eslint/no-unused-vars */
import { SubCommand, Executor } from "./Command"


describe("test SubCommand",() => {
    it("tests verification of flags", () => {
        const testExecutor : Executor = (flags : Map<string,string | undefined>, opt : Map<string,string | undefined>) : string => {
            if(flags === undefined || opt === undefined){
                console.log("comply with the almight compiler")
            }
            return "testing"
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
})