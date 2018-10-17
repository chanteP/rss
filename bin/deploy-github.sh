#!/usr/bin/env bash
set -e

npm run build
git add .
git ci -m "shell build..."
# git push github :gh-pages
git subtree push --prefix dist github gh-pages