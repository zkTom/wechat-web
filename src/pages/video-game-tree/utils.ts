/**
 * 结构url
 * @param url
 * eg:
 * https://example.com?a=1&b=2 => { a: 1, b: 2 }
 * https://example.com => {}
 */
export function parseQs(qs: string) {
    const qry: { [key: string]: any; } = {};
    const idx = qs.indexOf('?');
    if (idx > -1) {
        qs = qs.substring(idx + 1);
        const pairs = qs.split('&');
        pairs.forEach(pair => {
            const temp = pair.split('=');
            qry[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
        });
    }
    return qry;
}