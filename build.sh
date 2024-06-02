#!/bin/sh
npm --registry=http://localhost:4873 install
npm run format:write
npm run build
npm run test
