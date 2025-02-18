#!/bin/bash

# Folder path where barrel file should be generated
FOLDER="./../projects/lexs/lexs-client/src/model"
INDEX_FILE="$FOLDER/_index.ts"

# Ensure the folder exists
if [ ! -d "$FOLDER" ]; then
  echo "Error: Directory $FOLDER does not exist."
  exit 1
fi

# Generate the barrel file
echo "Generating barrel file at $INDEX_FILE..."
> "$INDEX_FILE" # Clear the index.ts file if it exists, or create a new one

# Loop through all TypeScript files in the folder
for FILE in "$FOLDER"/*.ts; do
  BASENAME=$(basename "$FILE" .ts)

  # Skip the index.ts file itself
  if [ "$BASENAME" != "index" ]; then
    echo "export * from './$BASENAME';" >> "$INDEX_FILE"
  fi
done

echo "Barrel file created successfully."
