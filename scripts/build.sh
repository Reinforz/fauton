#!/usr/bin/env bash

packages=( cfg fa testing )

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

for package in "${packages[@]}" ; do
  package_name="@fauton/$package"
  cd "${GITHUB_WORKSPACE}/packages/$package"
  echo -e "${BLUE}Building package $package_name${NC}"

  if ! (npm install -g) then
    echo -e "${RED}Error installing $package_name globally${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully installed $package_name globally${NC}"
  fi

  if ! (npm install) then
    echo -e "${RED}Error installing $package_name dependencies${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully installed $package_name dependencies${NC}"
  fi

  if ! (npm run build) then
    echo -e "${RED}Error building $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully build $package_name${NC}"
  fi

  if ! (npm run test) then
    echo -e "${RED}Error testing $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully tested $package_name${NC}"
  fi
  # If the examples directory exist for this package
  if [ -d "./examples" ]; then
    cd ./examples
    npm link $package_name
    if ! (npm run build) then
      echo -e "${RED}Error building $package_name examples${NC}"
      exit 1
    else
      echo -e "${GREEN}Successfully build $package_name examples${NC}"
    fi
  fi
done