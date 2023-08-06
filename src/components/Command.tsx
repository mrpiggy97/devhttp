export default function Command() : JSX.Element{
    return(
        <div>
            <label htmlFor="command">devhttp/$</label>
            <input type="text" name="" id="command" maxLength={300} />
        </div>
    )
}