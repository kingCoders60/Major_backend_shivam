#!/bin/bash
git add .
git commit -m "Automatic sync: $(date)"
git push origin master  # Change 'master' if your branch has a different name
