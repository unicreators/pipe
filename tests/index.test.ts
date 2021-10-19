import 'mocha';
import { expect } from 'chai';

import { int, string, float, regex, pipe, max, min, date, defaults, boolean, minLength, maxLength, def, array, behaviors, forward, any, all, path, project, includes, tap, invalid, throwError, required } from '../src/index';


describe('index.test.ts', function () {

    this.timeout(10000);

    it('int', async () => {
        let result = int()(1);
        expect(result).equal(1);

        result = int({ tryConvert: true })('4');
        expect(result).equal(4);

        result = int({ tryConvert: true })('s');
        expect(result).to.be.undefined;
    });


    it('float', async () => {
        let result = float()(1.23);
        expect(result).equal(1.23);

        result = float({ tryConvert: true })('1.54  ');
        expect(result).equal(1.54);

        result = float({ tryConvert: false })('1.54');
        expect(result).to.be.undefined;

        result = float({ fixed: 2 })(1.233333);
        expect(result).equal(1.23);
    });

    it('date', async () => {

        let d1 = new Date();
        let result = date()(d1);
        expect(result).equal(d1);

        result = date()(1);
        expect(result).to.to.undefined;

        result = date()('');
        expect(result).to.to.undefined;

        result = date({ tryConvert: true })('2012-12-12T00:00:00.000Z');
        expect(result).deep.equal(new Date('2012-12-12T00:00:00.000Z'));

    });

    it('boolean', async () => {
        let result = boolean()(1);
        expect(result).equal(true);

        result = boolean()(0);
        expect(result).equal(false);

        result = boolean()('');
        expect(result).equal(false);

        result = boolean({ tryConvert: true, emptyStringAsUndefined: true })('');
        expect(result).to.be.undefined;

        result = boolean()('false');
        expect(result).equal(true);

        result = boolean({ tryConvert: false })('false');
        expect(result).to.be.undefined;

    });

    it('string', async () => {
        let result = string()('zzz ');
        expect(result).equal('zzz');

        result = string({ trim: false })(' xxx ');
        expect(result).equal(' xxx ');

        result = string()(1);
        expect(result).to.be.undefined;
    });

    it('regex', async () => {
        let result = regex(/^\d{2}$/)('31');
        expect(result).equal('31');

        result = regex('^\\d{2}$')('31');
        expect(result).equal('31');

        result = regex('^\\d{2}$')('311');
        expect(result).to.be.undefined;
    });

    it('array', async () => {
        let result = array()([]);
        expect(result).deep.equal([]);

        result = array({ tryConvert: true })(1);
        expect(result).deep.equal([1]);

        result = array({ removeNullOrUndefined: true })([1, 2, undefined, 4]);
        expect(result).deep.equal([1, 2, 4]);


        result = array({ removeNullOrUndefined: true }, int({ tryConvert: true }))([1, 2, undefined, 4, '5', 's', 8]);
        expect(result).deep.equal([1, 2, 4, 5, 8]);

        result = array({ removeNullOrUndefined: true },
            pipe({ behavior: behaviors.Forward }, int({ tryConvert: true }), def(100)))([1, 2, undefined, 4, '5', 's', 8]);
        expect(result).deep.equal([1, 2, 100, 4, 5, 100, 8]);


        result = array(int())([1, 2, undefined, 4, '5', 's', 8]);
        expect(result).deep.equal([1, 2, undefined, 4, undefined, undefined, 8]);

    });


    it('max', async () => {
        let result = max(10)(3);
        expect(result).equal(3);

        result = max(10)(14);
        expect(result).to.be.undefined;
    });

    it('min', async () => {
        let result = min(10)(14);
        expect(result).equal(14)

        result = min(10)(9);
        expect(result).to.be.undefined;
    });




    it('minLength', async () => {
        let result = minLength(2)('zz');
        expect(result).equal('zz');

        result = minLength(2)([1]);
        expect(result).to.be.undefined;

        result = minLength(2)([1, 3, 5]);
        expect(result).deep.equal([1, 3, 5]);

        result = minLength(2)(undefined);
        expect(result).to.be.undefined;

    });

    it('maxLength', async () => {
        let result = maxLength(2)('zz');
        expect(result).equal('zz');

        result = maxLength(2)([1]);
        expect(result).deep.equal([1]);

        result = maxLength(2)([1, 3, 5]);
        expect(result).to.be.undefined;

        result = maxLength(2)(undefined);
        expect(result).to.be.undefined;
    });

    it('includes', async () => {
        let result = includes([1, 2, 3])(1);
        expect(result).equal(1);

        result = includes([2, 3])(1);
        expect(result).to.be.undefined;

        result = includes(undefined)(1);
        expect(result).equal(1);
    });

    it('def', async () => {
        let result = def(2)(undefined);
        expect(result).equal(2);

        result = def(2)(1);
        expect(result).equal(1);
    });

    it('throwError', async () => {
        let error = new Error();
        let fn = throwError(error, value => value === 1);
        expect(() => fn(1)).throw(error);
        expect(fn(2)).equal(2);

        fn = forward(int(), throwError(error, value => value === 1));
        expect(() => fn(1)).throw(error);

        fn = forward(int(), throwError(error/*, match default = isNullOrUnedfined */))
        expect(() => fn('s')).throw(error);
        expect(fn(1)).equal(1);
    });

    it('required', async () => {
        let error = new Error();
        // required = throwError(..., isNullOrUnedfined)
        let fn = forward(int(), required(error))
        expect(() => fn('s')).throw(error);
        expect(fn(1)).equal(1);
    });


    it('tap', async () => {
        let input, output;
        tap(int(), (_input, _output) => {
            input = _input; output = _output;
        })(1);
        expect(input).equal(1);
        expect(output).equal(1);

        tap(int(), (_input, _output) => {
            input = _input; output = _output;
        })('s');
        expect(input).equal('s');
        expect(output).equal(undefined);

        tap(def(4), (_input, _output) => {
            input = _input; output = _output;
        })(undefined);
        expect(input).equal(undefined);
        expect(output).equal(4);

        tap(pipe(int(), min(1), max(8)), (_input, _output) => {
            input = _input; output = _output;
        })(9);
        expect(input).equal(9);
        expect(output).equal(undefined);
    });


    it('invalid', async () => {
        let value = undefined;
        invalid(int(), (_value) => {
            // no call
            value = _value;
        })(1);
        expect(value).equal(undefined);

        value = undefined;
        invalid(int(), (_value) => {
            value = _value;
        })('s');
        expect(value).equal('s');

        value = undefined;
        invalid(pipe(int(), min(1), max(8)), (_value) => {
            value = _value;
        })(9);
        expect(value).equal(9);

        value = undefined;
        invalid(pipe(string(), minLength(1)), (_value) => {
            value = _value;
        }, { emptyStringAsNull: false })('');
        expect(value).equal('');

        value = undefined;
        invalid(pipe(string(), minLength(1)), (_value) => {
            // no call
            value = _value;
        }, { emptyStringAsNull: true })('');
        expect(value).equal(undefined);
    });



    it('pipe', async () => {
        let result = pipe()(8);
        expect(result).equal(8);

        result = pipe({ behavior: behaviors.Forward }, int(), def(2))('8');
        expect(result).equal(2);

        result = pipe<any, any>({ behavior: behaviors.BreakOnNotNullOrUndefinedValue }, int(), string(), def(2))('8');
        expect(result).equal('8');

        // custom behavior
        result = pipe({
            behavior: ({ currentValue, prevValue, handlerIndex }): { value?: any, next?: boolean } => {
                return ({
                    next: handlerIndex < 1,
                    value: currentValue
                });
            }
        }, int(), min(2), max(10))(12);
        expect(result).equal(12);

        result = pipe(int(), min(2), max(10))(8);
        expect(result).equal(8);

        result = pipe(int(), min(2), max(10))(11);
        expect(result).to.be.undefined;

        // group
        let range = pipe(min(2), max(10));
        result = pipe(int(), range)(8);
        expect(result).equal(8);
    });

    it('forward', async () => {
        let result = forward(int(), def(2), (v) => v + 2)('8');
        expect(result).equal(4);

        result = forward(int(), def(2), (v) => v + 2)(8);
        expect(result).equal(10);

        result = forward(int(), def(2), (v) => undefined)(8);
        expect(result).to.be.undefined;
    });

    it('any', async () => {
        let result = any<any, any>(int(), (v) => `#${v}`)('8');
        expect(result).equal('#8');
    });

    it('all', async () => {
        let result = all(int(), min(1))(8);
        expect(result).equal(8);

        result = all(int(), min(1), max(6))(8);
        expect(result).to.be.undefined;
    });

    it('defaults', async () => {

        defaults.string.trim = false;
        let result: any = string()('aaa ');
        expect(result).equal('aaa ');

        defaults.int.tryConvert = true;
        result = int()('1 ');
        expect(result).equal(1);

        defaults.float.tryConvert = true;
        result = float()('1.54  ');
        expect(result).equal(1.54);

        defaults.boolean.tryConvert = false;
        result = boolean()(1);
        expect(result).to.be.undefined;

        defaults.date.tryConvert = true;
        result = date()('2012-12-12T00:00:00.000Z');
        expect(result).deep.equal(new Date('2012-12-12T00:00:00.000Z'));

        defaults.array.tryConvert = true;
        result = array()(1);
        expect(result).deep.equal([1]);

        defaults.array.removeNullOrUndefined = true;
        result = array()([1, 2, undefined, 4]);
        expect(result).deep.equal([1, 2, 4]);

        defaults.pipe.behavior = behaviors.Forward;
        result = pipe(int(), def(2))('s');
        expect(result).equal(2);


    });


    it('path', async () => {
        let result = path('a')({ a: 1 });
        expect(result).equal(1);

        result = path('a', 'aa', 'aaa')({ a: { aa: { aaa: 1 } } });
        expect(result).equal(1);

        result = path('bb')({ a: 1 });
        expect(result).to.be.undefined;

        result = path('bb', 'x')({ a: 1 });
        expect(result).to.be.undefined;
    });

    it('project', async () => {
        let result = project({
            a: path('prop1'),
            b: pipe(path('b'), int()),
            c: pipe(path('prop3'), int()),
            d: forward(path('prop6'), pipe(int(), min(8)), def(1)),
            e: { fn: pipe(path('prop7', 'prop8'), int()), on: (processed) => processed.a == 2 }
        })({ prop1: 1, prop2: 's', prop3: 'v', b: 2, prop6: 6, prop7: { prop8: 100 } });
        expect(result).deep.equal({
            a: 1,
            b: 2,
            c: undefined,
            d: 1,
            e: undefined
        });

        result = project({})({ a: 1 });
        expect(result).deep.equal({});

        result = project({})(undefined);
        expect(result).deep.equal({});

    });

});

