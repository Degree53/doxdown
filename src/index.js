#! /usr/bin/env node

import 'babel-polyfill';
import minimist from 'minimist';

import { getDocsTrees } from './builder';
import * as options from './options';
import { getFilePaths, getDoxdownComments } from './parser';
import { generateDocs } from './writer';

const argv = minimist(process.argv.slice(2));

// Set options but skip the unnamed arguments property
Object.keys(argv).slice(1).forEach(k =>
	options.set(k, argv[k])
);

const paths = getFilePaths(options.get('src'));
const comments = getDoxdownComments(paths);
const docsTrees = getDocsTrees(comments);

generateDocs(docsTrees);
