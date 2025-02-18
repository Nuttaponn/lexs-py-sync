#!/usr/bin/env node

const fs = require('fs');
const file1 = process.argv[2];
const content1 = fs.readFileSync(file1);
const data1 = JSON.parse(content1);

const file2 = process.argv[3];
const content2 = fs.readFileSync(file2);
const data2 = JSON.parse(content2);

const deepmerge = require('deepmerge');
const merged = deepmerge(data1, data2);
fs.writeFileSync(file1, JSON.stringify(merged, null, 4));
