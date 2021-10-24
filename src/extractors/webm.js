import {lazystream} from '../util';

export function attributes(input) {
    const stream = lazystream(input);
    const result = {...stream.attrs(), width: 0, height: 0};
    const startIndex = stream.indexOf(Buffer.from([0xb0]));

    if (startIndex !== -1) {
        const widthSize = stream.goto(startIndex).skip(1).take()[0] & 0x7;
        result.width = stream.takeUIntBE(widthSize);

        const heightSize = stream.skip(1).take()[0] & 0x7;
        result.height = stream.takeUIntBE(heightSize);
    }

    stream.close();

    return result;
}
