import {readdirSync} from 'fs';
import test from 'ava';
import mime from 'mime-types';
import {readMediaAttributes} from '../src/index.js';

readdirSync('test/files')
    .map((name) => {
        const path = `test/files/${name}`;

        return {
            path,
            name,
            mime: readMediaAttributes(path).mime,
            expected: mime.lookup(path),
        };
    })
    .reduce((acc, file, _, files) => {
        if (acc.every(([mime]) => mime !== file.mime)) {
            acc.push([
                file.mime,
                files.filter((otherFile) => otherFile.mime === file.mime),
            ]);
        }

        return acc;
    }, [])
    .forEach(([mime, files]) => {
        files.forEach((file) => {
            const tester = file.expected ? test : test.skip;

            tester(`${mime} (${file.name})`, (t) => t.is(file.expected, mime));
        });
    });
