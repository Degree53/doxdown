#! /usr/bin/env node

import 'babel-polyfill';
import minimist from 'minimist';

import * as options from './options';
import { getDoxdownComments } from './parser';
import { getDocsTrees } from './builder';
import { generateDocs } from './writer';

const argv = minimist(process.argv.slice(2));

// Set options but skip the unnamed arguments property
Object.keys(argv).slice(1).forEach(k =>
	options.set(k, argv[k])
);

const comments = getDoxdownComments();
const docsTrees = getDocsTrees(comments);

generateDocs(docsTrees);
