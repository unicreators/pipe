////////////
// utils
export const _isFunction = (value: any): value is Function => typeof value === 'function';
export const _isNumber = (value: any): value is Number => typeof value === 'number';
export const _isString = (value: any): value is String => typeof value === 'string';
export const _isDate = (value: any): value is Date => value instanceof Date && !isNaN(value.getTime());
export const _isBoolean = (value: any) => typeof value === 'boolean';
export const _isNullOrUndefined = (value: any): boolean => value === null || value === undefined;
export const _notNullOrUndefined = (value: any): boolean => value !== null && value !== undefined;
export const _identity = (value: any): any => value;
export const _undefined = (value: any): undefined => undefined;

export const _parseNumber = (parseFn: (value: any) => number) => (value: any, def: number = undefined): number | undefined => {
    let _value = parseFn(value);
    return isNaN(_value) ? def : _value;
}

export const _parseDate = (value: any, def: Date = undefined): Date | undefined => {
    let _value = new Date(value);
    return isNaN(_value.getTime()) ? def : _value;
}

export const _ensure = (value: any, def?: any, validate: (value: any) => boolean = _notNullOrUndefined): any => validate(value) ? value : def;
export const _ensureCall = (fnOrValue: (...args: Array<any>) => any | any, ...args: Array<any>) => _isFunction(fnOrValue) ? fnOrValue.call(undefined, ...args) : fnOrValue;
