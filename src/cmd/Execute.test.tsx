import { Command, SubCommand } from "./Command";
import { addCommand } from "./cmd";
import { ExecutorProps } from "./Executor";
import Execute from "./Execute";

const greetExe = (props : ExecutorProps) : JSX.Element => {
    const message = props.flags.get("--message") as string
    return(
        <div>
            <span>{message}</span>
        </div>
    )
}

const calculateExe = (props : ExecutorProps) : JSX.Element => {
    const num = props.flags.get("--num") as string
    const calc = parseInt(num)**2
    return(
        <div>
            <span>{num}</span>
            <span>{calc}</span>
        </div>
    )
}

const greetCmd = new SubCommand("greet", greetExe, ["--message"], [], "prints a greet")
const calculateCmd = new SubCommand("calculate", calculateExe, ["--num"],[],"prints a calculation")
const testCmd = new Command("test", [greetCmd, calculateCmd])
addCommand(testCmd)

describe("test Execute function", () => {
    it("tests correct output of Execute function with valid input", () => {
        const input = "test greet --message hello fellow coder"
        const result = Execute(input)
        expect(result.props.flags.get("--message")).toBe("hello fellow coder")
    })
    it("tests correct output with invalid input", () => {
        const input = "if correctness --message hello"
        const result = Execute(input)
        expect(result.props.flags.get("--message")).toBe("no such command exists")
    })
})