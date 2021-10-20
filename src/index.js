import {lazystream} from './util.js';
import {attributes as jpg} from './extractors/jpg.js';
import {attributes as png} from './extractors/png.js';
import {attributes as gif} from './extractors/gif.js';
import {attributes as bmp} from './extractors/bmp.js';
import {attributes as ico} from './extractors/ico.js';
import {attributes as dds} from './extractors/dds.js';
import {attributes as psd} from './extractors/psd.js';
import {attributes as svg} from './extractors/svg.js';
import {attributes as avi} from './extractors/avi.js';
import {attributes as ogv} from './extractors/ogv.js';
import {attributes as mp4} from './extractors/mp4.js';
import {attributes as webm} from './extractors/webm.js';

// dimension to byte mapping to make it easier
// to identify byte offsets of hexdump output
// because spec documentation is simply too
// exhausting to go through for a lazy
// developer like myself.
//
// [   2]x[    4] [00 e2]x[00 04]
// [1000]x[ 2000] [03 e8]x[07 d0]
// [6000]x[12000] [17 70]x[2e e0]

// mapping of unique initial bytes to extractors
const extractors = {
    ['424d']: bmp,
    ['ffd8']: jpg,
    ['44445320']: dds,
    ['89504e47']: png,
    ['47494638']: gif,
    ['38425053']: psd,
    ['52494646']: avi,
    ['4f676753']: ogv,
    ['00000020']: mp4,
    ['1a45dfa3']: webm,

    // ico and cur files have similar byte layouts
    // so we can use the same converter for both
    ['00000100']: ico, // ico starts with 000001
    ['00000200']: ico, // cur starts with 000002

    // svg can start with "<?xm", "<?XM", "<svg", or "<SVG"
    ['3c3f786d']: svg, // match initial bytes: <?xm
    ['3c3f584d']: svg, // match initial bytes: <?XM
    ['3c737667']: svg, // match initial bytes: <svg
    ['3c535647']: svg, // match initial bytes: <SVG

    find(identifier) {
        for (const key in extractors) {
            if (key === 'find') continue;
            if (identifier.startsWith(key)) return extractors[key];
        }
    },
};

export function attributes(file) {
    const stream = lazystream(file);
    const result = {width: 0, height: 0, size: stream.size()};
    const extract = extractors.find(stream.identifier());

    if (extract) Object.assign(result, extract(stream));

    stream.close();

    return result;
}