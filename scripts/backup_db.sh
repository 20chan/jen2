#/bin/bash

NOW=$(date +"%Y-%m-%d-%H%M%S")
cp prisma/dev.db backups/$NOW.db