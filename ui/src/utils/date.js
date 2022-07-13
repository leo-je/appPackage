
var formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}
// 时间格式化
var formatTime = _date => {
    if (typeof _date !== Date)
        var date = new Date(_date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    var _r = [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
    console.log(_r);
    return _r;
}

var formatTime_yy_MM_dd = _date => {
    if (typeof _date !== Date)
        var date = new Date(_date)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    var _r = [year, month, day].map(formatNumber).join('-');
    console.log(_r);
    return _r;
}

export {
    formatNumber,
    formatTime,
    formatTime_yy_MM_dd
}