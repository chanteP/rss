#!/usr/bin/env bash
set -e

npm run build
git add .
git ci -m "shell build..."
git subtree push --prefix dist github gh-pages