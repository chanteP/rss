/**
 * moment(date|timestamp).format(formatDescription)
 * 
 * String format(Date | timeStamp, formatDescription)  将东西变成字符串
 * Number to({hours = 0, minutes = 0, seconds = 0})  获取对应时间到某个时间点的的时间戳
 * 
 * formatDescription: (exp) YY-MM-DD HH:mm:ss
 *   Y  M  D  h   m  s  H
 *   年 月 日 12时 分 秒 24时
 */
/* eslint-disable */
class Moment{
    constructor(date){
        this.date = new Date(date);
        if(window.isNaN(this.date.getTime())){
            console.error('[moment]Invalid Date', date);
        }
    }
    parse(){
        return {
            Y: this.date.getFullYear(),
            M: this.date.getMonth() + 1,
            D: this.date.getDate(),
            H: this.date.getHours(),
            h: this.date.getHours() % 12,
            m: this.date.getMinutes(),
            s: this.date.getSeconds(),
        };
    }
    format(formatDescription = 'YY-MM-DD HH:mm:ss'){
        let codes = this.parse();
        let result = '';
        try{
            result = formatDescription.split('').reverse().join('').replace(/[YMDHms]/g, (match) => {
                if(!Array.isArray(codes[match])){
                    codes[match] = codes[match].toString().split('');
                }
                return codes[match].pop() || '0';
            }).split('').reverse().join('');
        }catch(e){
            console.error(e);
        }
        return result;
    }
    to({hours = 0, minutes = 0, seconds = 0} = {}){
        let date = new Date(this.date);
        date.setSeconds(seconds);
        date.setMinutes(minutes);
        date.setHours(hours);
        return date.getTime();
    }
}

export default (date) => {
    return new Moment(date);
};
