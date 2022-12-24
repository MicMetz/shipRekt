/**
 * @author MicMetzger /
 */

const GuardType = {

   DEFAULT: 'default',
   SNIPER : 'sniper',
   HEAVY  : 'heavy',
   MEDIC  : 'medic',
   SWAT   : 'SwatOfficer',
   RIOT   : 'riot'

};


function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx   = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}


function randomString(length) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (!length) {
        length = Math.floor(Math.random() * chars.length);
    }
    let str = '';
    for (let i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}


function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function randomBool() {
    return Math.random() >= 0.5;
}


function randomExcept(arr, except) {
    const filtered = arr.filter(item => item !== except);
    return filtered[randomInt(0, filtered.length - 1)];
}


function randomExExcept(arr, exceptArr) {
    const filtered = arr.filter(item => !exceptArr.includes(item));
    return filtered[randomInt(0, filtered.length - 1)];
}


export {dumpObject, randomString, randomInt, randomBool, randomExcept, randomExExcept, GuardType};
