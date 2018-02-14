#!/usr/bin/sh

echo 'Commiting the submodule'

git add .
git commit -m "$1"
git push

cd ..
git add .
git commit -m "$1"
git push

cd section07

