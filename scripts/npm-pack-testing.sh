#!/usr/bin/env bash
set -e

npm run dist
npm run pack

TMPDIR="/tmp/npm-pack-testing.$$"
mkdir "$TMPDIR"
mv *-*.*.*.tgz "$TMPDIR"
cp tests/fixtures/smoke-testing.ts "$TMPDIR"

cd $TMPDIR
npm init -y
npm install *-*.*.*.tgz \
  @chatie/tsconfig

./node_modules/.bin/tsc \
  --target es6 \
  --lib esnext \
  --noEmitOnError \
  --noImplicitAny \
  --experimentalDecorators \
  --emitDecoratorMetadata \
  --esModuleInterop \
  smoke-testing.ts

node smoke-testing.js
