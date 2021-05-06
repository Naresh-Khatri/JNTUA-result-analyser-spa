#!/bin/bash

echo script started
quasar build
cd dist/spa/
ls
git init
git remote add origin https://github.com/Naresh-Khatri/JNTUA-result-analyser-spa.git
git checkout -b gh-pages
git status
git add .

git status
git commit -m 'Corrected feedback endpoint'
#git pull origin gh-pages --allow-unrelated-histories
git push origin gh-pages --force
