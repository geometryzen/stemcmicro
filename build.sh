#!/bin/sh
npm --registry=http://localhost:4873 install
npm --registry=http://localhost:4873 update
npm run format:write
npm run build
npm run test
