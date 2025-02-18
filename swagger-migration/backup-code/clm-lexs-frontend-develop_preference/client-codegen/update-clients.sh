#! /bin/bash
echo "----- ----- ----- UPDATE SWAGGER CLIENT START ----- ----- -----"
echo ""

LINE=1
if [ "$1" != "all" -a "$1" != "" ]
then
  # Read specific API specs one by one
  while read -r CURRENT_LINE
  do
    temp_file_name="${CURRENT_LINE#https://lexsdev.krungthai/ktb/rest/lexs/}"
    file_name="${temp_file_name%/v3/api-docs}"
    if [ "$file_name" == "$1" ]
    then
      echo "Downloading Specs: $CURRENT_LINE"
      rm spec/${file_name}.json
      wget -O ./spec/${file_name}.json $CURRENT_LINE --no-check-certificate
      break;
    fi
    ((LINE++))
  done < "./ListOfAPIs.txt"
  echo ""

  # generate client codegen step
  echo "===== ===== ==== Generating client ::: START ==== ===== ====="
  source ./client-codegen.sh
  echo "===== ===== ==== Generating client ::: END   ==== ===== ====="
else
  # Read each API specs one by one
  while read -r CURRENT_LINE
  do
    echo "Downloading Specs: $CURRENT_LINE"
    temp_file_name="${CURRENT_LINE#https://lexsdev.krungthai/ktb/rest/lexs/}"
    file_name="${temp_file_name%/v3/api-docs}"
    rm spec/${file_name}.json
    wget -O ./spec/${file_name}.json $CURRENT_LINE --no-check-certificate
    ((LINE++))
  done < "./ListOfAPIs.txt"
  echo ""

  # generate client codegen step
  echo "===== ===== ==== Generating client ::: START ==== ===== ====="
  source ./client-codegen.sh
  echo "===== ===== ==== Generating client ::: END   ==== ===== ====="
fi

echo ""
echo "----- ----- ----- UPDATE SWAGGER CLIENT END   ----- ----- -----"

echo ""
echo "----- ----- ----- EXPORT MODEL INTERFACE START ----- ----- -----"

source ./generate-barrel.sh

echo ""
echo "----- ----- ----- UPDATE MODEL INTERFACE END   ----- ----- -----"
