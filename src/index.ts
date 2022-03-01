#!/usr/bin/env node
import jetpack from 'fs-jetpack';
import path from 'path';
import sade from 'sade';

import { white, gray, pink, teal } from './colors';

sade('esm-script [file]', true).describe('convert a cjs file to esm').action((file) => {
  if (file && jetpack.exists(file)) {
    const text = jetpack.read(file);

    const esmText = text
      .replace(/const (.+) = require\((.+)\);/g, (match, p1, p2) => `import ${p1} from ${p2};`)
      .replace(/([.\s\S\n]+)(import .+ from .+;\n)([.\s\S\n]+)(require\(')(.+)('\))([.\s\S\n]+)/g, (match, p1, p2, p3, p4, p5, p6, p7) =>
        `${p1}${p2}import ${p5} from '${p5}';
        ${p3}${p5}${p7}`);

    jetpack.write(file, esmText);
  } else {
    if (!file) {
      process.stderr.write(pink('you must provide a file to use esm-script\n'));
    } else {
      process.stderr.write(pink(`no file found at ${file}\n`));
    }
    process.exit(1);
  }
}).parse(process.argv);