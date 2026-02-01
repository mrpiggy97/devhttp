import { ExecutorProps } from "../Executor";
import "./LinksExecutor.css"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function LinksExecutor(_props : ExecutorProps) : JSX.Element{
    return(
        <div id="link-executor">
            <p>
                <a className="link" target="_blank" href="https://www.github.com/mrpiggy97">GitHub</a>                
            </p>
            <p>
                <a className="link" target="_blank" href="https://www.linkedin.com/in/fabian-jesus-rivas">LinkedIn</a>                
            </p>
            <p>
                <a className="link" target="_blank" href="https://www.leetcode.com/mrpiggy97">Leetcode.com</a>                
            </p>

        </div>
    )
}