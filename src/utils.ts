// @ts-nocheck
export function escapeClassName(className: string) {
	return className?.replace(/[ .]+/g, '-').replace(/[&]+/g, 'and').toLowerCase();
}

export function encloseFontFamily(fontFamily: string): string {
    return /^[^"'].*\s.*[^"']$/.test(fontFamily) ? `'${fontFamily}'` : fontFamily;
}

export function splitPath(path: string): [string, string] {
    let si = path.lastIndexOf('/') + 1;
    let folder = si == 0 ? "" : path.substring(0, si);
    let fileName = si == 0 ? path : path.substring(si);

    return [folder, fileName];
}

export function resolvePath(path: string, base: string): string {
    try {
        const prefix = "http://docx/";
        const url = new URL(path, prefix + base).toString();
        return url.substring(prefix.length);
    } catch {
        return `${base}${path}`;
    }
}

export function keyBy<T = any>(array: T[], by: (x: T) => any): Record<any, T> {
    return array.reduce((a, x) => {
        a[by(x)] = x;
        return a;
    }, {});
}

export function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = () => reject();
		reader.readAsDataURL(blob);
	});
}

export function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
}

export function isString(item: unknown): item is string {
    return typeof item === 'string' || item instanceof String;
}

export function mergeDeep(target, ...sources) {
    if (!sources.length) 
        return target;
    
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                const val = target[key] ?? (target[key] = {});
                mergeDeep(val, source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    return mergeDeep(target, ...sources);
}

export function parseCssRules(text: string): Record<string, string> {
	const result: Record<string, string> = {};

	for (const rule of text.split(';')) {
		const [key, val] = rule.split(':');
		result[key] = val;
	}

	return result
}

export function formatCssRules(style: Record<string, string>): string {
	return Object.entries(style).map((k, v) => `${k}: ${v}`).join(';');
}

export function asArray<T>(val: T | T[]): T[] {
	return Array.isArray(val) ? val : [val];
}

export function clamp(val, min, max) {
    return min > val ? min : (max < val ? max : val);
}

/**
     * 转换16进制为数值
     *
     * @method hexToNumber
     * @static
     * @param {string} h 16进制颜色表达
     * @return {number} 10进制表达
     */
export function hexToNumber(h: string) {
    if(typeof h !== 'string') return h;

    h = h.toLowerCase();
    let hex = '0123456789abcdef';
    let v = 0;
    let l = h.length;
    for(let i=0;i<l;i++) {
        let iv = hex.indexOf(h[i]);
        if(iv == 0) continue;
        
        for(let j=1;j<l - i;j++) {
            iv *= 16;
        }
        v += iv;
    }
    return v;
}

/**
 * 转换数值为16进制字符串表达
 *
 * @method hex
 * @static
 * @param {number} v 数值
 * @return {string} 16进制表达
 */
export function numberToHex(v: number) {
    let hex = '0123456789abcdef';
    
    let h = '';
    while(v > 0) {
        let t = v % 16;
        h = hex[t] + h;
        v = Math.floor(v / 16);
    }
    return h;
}

/**
 * 16进制颜色转为r g b a 对象 {r, g , b, a}
 * @param {string}} hex 16进度的颜色
 */
export function hexToRGBA(hex: string) {
    if(typeof hex === 'string') hex = hex.trim();   
    else return hex;

    let res = hex;

    //当为7位时，表示需要转为带透明度的rgba
    if(res[0] == '#') {
        if(res.includes(' ')) {
            const ps = res.split(' ');
            res = ps[0];
        }
        const color = {
            a: 1
        };
        if(res.length >= 8) {
            color.a = res.substr(1,2);
            color.g = res.substr(5,2);
            color.b = res.substr(7,2);
            color.r = res.substr(3,2);
            //透明度
            color.a = Number((hexToNumber(color.a) / 255).toFixed(4));

            color.r = hexToNumber(color.r||0);
            color.g = hexToNumber(color.g||0);
            color.b = hexToNumber(color.b||0);
            res = color; 
        }
        // #cccccc || #ccc
        else if(res.length === 7 || res.length === 4) {
            // #ccc这种情况，把每个位复制一份
            if(res.length === 4) {
                color.g = res.substr(2, 1);
                color.g = color.g + color.g;
                color.b = res.substr(3, 1);
                color.b = color.b + color.b;
                color.r = res.substr(1, 1);
                color.r = color.r + color.r;
            }
            else {
                color.g = res.substr(3, 2);//除#号外的第二位
                color.b = res.substr(5, 2);
                color.r = res.substr(1, 2);
            }

            color.r = hexToNumber(color.r||0);
            color.g = hexToNumber(color.g||0);
            color.b = hexToNumber(color.b||0);
            
            res = color; 
        }
        //如果是5位的话，# 则第2位表示A，后面依次是r,g,b
        else if(res.length === 5) {
            color.a = res.substr(1,1);
            color.g = res.substr(3,1);//除#号外的第二位
            color.b = res.substr(4,1);
            color.r = res.substr(2,1);

            color.r = hexToNumber(color.r||0);
            color.g = hexToNumber(color.g||0);
            color.b = hexToNumber(color.b||0);
            //透明度
            color.a = Number((hexToNumber(color.a) / 255).toFixed(4));
            res = color; 
        }
    }  
    if(typeof res === 'string') {
        const m = res.match(/rgb(a)?\s*\(\s*([\d\.]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.]+)\s*(,\s*[\d\.]+)?\s*\)/i); 
        if(m && m.length === 6) {
            const color = {
                r: Number(m[2]),
                g: Number(m[3]),
                b: Number(m[4]),
                a: Number((m[5]||'1', ',').trimStart())
            };
            res = color;
        }
    }
    return res;     
}

/**
 * 把255的rgb值转为0-1的值
 * @param {rgba} color 颜色
 */
export function rgbToDecimal(color: any) {
    color = {...color};
    color.r = byteToDecimal(color.r);
    color.g = byteToDecimal(color.g);
    color.b = byteToDecimal(color.b);
    return color;
}

//255值转为0-1的小数
export function byteToDecimal(b: number) {
    return b / 255;
}

/**
     * 转换颜色格式，如果输入r,g,b则转为hex格式,如果为hex则转为r,g,b格式
     *
     * @method toColor
     * @static
     * @param {string} hex 16进制颜色表达
     * @return {string} 颜色字符串
     */
export function toColor(r: string|number|object, g: number, b: number, a: number): string {    
	if(typeof r === 'string' && r) {
		r = r.trim(); 
		// 正常的颜色表达，不需要转换
		if(r[0] === '#' && (r.length === 4 || r.length === 7)) return r;

		const color = hexToRGBA(r);
		if(typeof color === 'string') return color;
		
		r = typeof color.r !== 'undefined'? color.r: r;
		g = typeof color.g !== 'undefined'? color.g: g;
		b = typeof color.b !== 'undefined'? color.b: b;
		a = typeof color.a !== 'undefined'? color.a: a;
	}
	if(r && typeof r === 'object') {
		g = r.g;
		b = r.b;
		a = r.a || 1;
		r = r.r;
	}
	if(typeof r != 'undefined' && typeof g != 'undefined' && typeof b != 'undefined') {
		if(typeof a != 'undefined') {            
			return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
		}
		else {
			return 'rgb(' + r + ',' + g + ',' + b + ')';
		}
	}
	return r;
}
