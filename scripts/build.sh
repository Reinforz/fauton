#!/usr/bin/env bash

packages=( cfg fa testing )

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo $GITHUB_WORKSPACE

for package in "${packages[@]}" ; do
  package_name="@fauton/$package"
  cd "${GITHUB_WORKSPACE}/packages/$package"
  tsc="${GITHUB_WORKSPACE}/node_modules/.bin/tsc"
  jest="${GITHUB_WORKSPACE}/node_modules/.bin/jest"
  eslint="${GITHUB_WORKSPACE}/node_modules/.bin/eslint"

  # if ! (npm install -g) then
  #   echo -e "${RED}Error installing $package_name globally${NC}"
  #   exit 1
  # else
  #   echo -e "${GREEN}Successfully installed $package_name globally${NC}"
  # fi

  if ! (npm install) then
    echo -e "${RED}Error installing $package_name dependencies${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully installed $package_name dependencies${NC}"
  fi

  if ! (node $eslint ./libs --ext tsx,ts) then
    echo -e "${RED}Error linting $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully linted $package_name${NC}"
  fi

  if ! (node $tsc --sourceMap false) then
    echo -e "${RED}Error building $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully build $package_name${NC}"
  fi

  if ! (node $jest --runInBand) then
    echo -e "${RED}Error testing $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully tested $package_name${NC}"
  fi
done