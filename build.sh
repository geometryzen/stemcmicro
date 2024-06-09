#!/bin/sh
pnpm --registry=http://localhost:4873 install
pnpm run format:write
pnpm run lint
pnpm run build
pnpm run test
pnpm --registry=http://localhost:4873 update
