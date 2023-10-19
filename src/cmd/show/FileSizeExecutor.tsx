import { ExecutorProps } from "../Executor";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function FileSizeExecutor(_props : ExecutorProps) : JSX.Element{
    const htmlContent = new XMLSerializer().serializeToString(document);
    const size = htmlContent.length
    // Convert bytes to kilobytes (KB)
    const sizeInKb = size / 1024;
    return(
        <div>
            <span>{sizeInKb.toFixed(2)} KB</span>
        </div>
    )
}