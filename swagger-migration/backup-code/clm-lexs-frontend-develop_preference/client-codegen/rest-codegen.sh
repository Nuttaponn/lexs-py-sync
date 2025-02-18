#!/usr/bin/env bash

codegen() {
  SERVICE=$1
  OUTPATH=$2

  NPM_NAME=lexs-app-client
  API_MODULE_PREFIX=LEXSAppClient

  # download tool
  VERSION=7.10.0
  if [ ! -f ./tool/openapi-generator-cli-$VERSION.jar ]; then
    curl -k https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/$VERSION/openapi-generator-cli-$VERSION.jar -o ./tool/openapi-generator-cli-$VERSION.jar
  fi

  node tool/fixNames.js ./spec/$SERVICE.json

  java -jar ./tool/openapi-generator-cli-$VERSION.jar generate \
    -g typescript-angular \
    -i spec/$SERVICE.json \
    -t template \
    -o $OUTPATH \
    --skip-validate-spec \
    --additional-properties=npmName=$NPM_NAME,ngVersion=18.1.3,apiModulePrefix=$API_MODULE_PREFIX
}
