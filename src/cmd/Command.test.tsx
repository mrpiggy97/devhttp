import { Command, SubCommand } from "./Command";
import { ExecutorProps } from "./Executor";
const exe = (props : ExecutorProps) : JSX.Element => {
    const message1 = props.flags.get("--message1") as string
    const message2 = props.optFlags.get("--message2") as string
    return(
        <div>
            <span>{message1}</span>
            <span>{message2}</span>
        </div>
    )
}
const greetingCmd = new SubCommand("greeting", exe, ["--message1"],["--message2"],"lays out a greeting")

const exe2 = (props : ExecutorProps) : JSX.Element => {
    const name = props.flags.get("--name") as string
    const age = props.optFlags.get("--age") as string
    return(
        <div>
            <span>{name}</span>
            <span>{age}</span>
        </div>
    )
}

const personCmd = new SubCommand("person",exe2,["--name"],["--age"],"prints name and age")

const mainCmd = new Command("main", [greetingCmd,personCmd])

describe("test SubCommand", () => {

    it("tests if flags are verified and set correctly", () => {
        let testinput = "--message1 hello man --message2 my name is fabian"
        let result = greetingCmd.setAndVerifyFlags(testinput.split(" "))
        expect(result).toBe(true)
        expect(greetingCmd.flags.get("--message1")).toBe("hello man")
        testinput = "--nonexistant name --message2 hello"
        result = greetingCmd.setAndVerifyFlags(testinput.split(" "))
        expect(result).toBe(false)
        testinput = "--message2 hello"
        result = greetingCmd.setAndVerifyFlags(testinput.split(" "))
        expect(result).toBe(false)
    })
    it("tests Execute method", () => {
        const testInput = "--message1 hello man --message2 i am fabian"
        const result = greetingCmd.Execute(testInput.split(" "))
        expect(result.props.flags.get("--message1")).toBe("hello man")
        expect(result.props.optFlags.get("--message2")).toBe("i am fabian")
    })
})

describe("test Command functionalities and methods", () => {
    it("tests correct output of Execute method", () => {
        const testInput = "person --name chris --age 25"
        const result = mainCmd.Execute(testInput.split(" "))
        expect(result.props.flags.get("--name")).toBe("chris")
        expect(result.props.optFlags.get("--age")).toBe("25")
    })
})