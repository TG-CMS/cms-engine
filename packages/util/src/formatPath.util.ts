import * as path from "path";

export const formatPath=(p:string)=> {
    const sep = path.sep;
    // 如果返回 / 则为 macOS
    if (sep === '/') {
        return p;
    } else {
        return p.replace(/\\/g, '/');
    }
}
