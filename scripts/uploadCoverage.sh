#!/usr/bin/env bash

codecov_file="${GITHUB_WORKSPACE}/scripts/codecov.sh"

curl -Os https://uploader.codecov.io/latest/linux/codecov > $codecov_file
chmod +x $codecov_file

packages=( cfg fa testing )

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

for package in "${packages[@]}" ; do
  package_name="@fauton/$package"
  file="${GITHUB_WORKSPACE}/packages/$package/coverage/lcov.info"
  echo -e "${GREEN}Uploading coverage for package $package_name${NC}"

  if ! ($codecov_file -f $file -F $package -t $CODECOV_TOKEN) then
    echo -e "${RED}Error uploading coverage for $package_name${NC}"
    exit 1
  else
    echo -e "${GREEN}Successfully uploaded coverage for $package_name${NC}"
  fi
done