#!/bin/sh
pnpm --registry=http://localhost:4873 install
pnpm run format:write
pnpm run lint
pnpm run build
pnpm run test
# pnpm --registry=http://localhost:4873 update
git status
echo "Please enter a commit message"
read message
git add --all
git commit -m "'$message'"
git push origin main
pnpm run version --loglevel silly
pnpm run publish --loglevel silly
# pnpm run docs
# pnpm run pages
