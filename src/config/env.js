// 配置编译环境和线上环境之间的切换

let iconfontVersion = ['567566_pwc3oottzol'];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `${baseUrl}/code`
const env = process.env
let baseUrl = `http://192.168.1.89:8765`;
// let baseUrl = `http://39.100.151.178:8765`;
let openUrl = 'http://192.168.1.89:8765';
// let openUrl = 'http://39.100.151.178:8765';
export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl,
    env,
    openUrl
}
