#!/usr/bin/env bash
DEBUG=1
indent=""
function debug {
  if [[ $DEBUG == 1 ]]; then
    echo "$indent" "$@" >> /tmp/hie-wrapper.log
  fi
}

curDir=`pwd`
debug "Launching HIE for project located at $curDir"
indent="  "

USE_STACK=
GHCBIN='ghc'
HIE_PREFIX=
# If a .stack-work exists, assume we are using stack.
if [ -d ".stack-work" ]; then
  debug 'Using stack GHC and HIE'
  USE_STACK=1
  GHCBIN='stack ghc --'
  HIE_PREFIX='stack exec --'
else
  debug 'Using plain GHC and HIE'
fi
versionNumber=`$GHCBIN --version`
debug $versionNumber

HIEBIN='hie'
BACKUP_HIEBIN='hie'
# Match the version number with a HIE version, and provide a fallback without
# the patch number.
if [[ $versionNumber = *"8.0.1"* ]]; then
  debug "Project is using GHC 8.0.1"
  HIEBIN='hie-8.0.1'
  BACKUP_HIEBIN='hie-8.0'
elif [[ $versionNumber = *"8.0.2"* ]]; then
  debug "Project is using GHC 8.0.2"
  HIEBIN='hie-8.0.2'
  BACKUP_HIEBIN='hie-8.0'
elif [[ $versionNumber = *"8.0"* ]]; then
  debug "Project is using GHC 8.0.*"
  HIEBIN='hie-8.0'
elif [[ $versionNumber = *"8.2.1"* ]]; then
  debug "Project is using GHC 8.2.1"
  HIEBIN='hie-8.2.1'
  BACKUP_HIEBIN='hie-8.2'
elif [[ $versionNumber = *"8.2.2"* ]]; then
  debug "Project is using GHC 8.2.2"
  HIEBIN='hie-8.2.2'
  BACKUP_HIEBIN='hie-8.2'
elif [[ $versionNumber = *"8.2"* ]]; then
  debug "Project is using GHC 8.2.*"
  HIEBIN='hie-8.2'
else
  debug "WARNING: GHC version does not match any of the checked ones."
fi

find-hie-path () {
  if [[ -n "$USE_STACK" ]]; then
    stack exec -- which "$1"
  else
    command -v "$1"
  fi
}

if [ -x "$(find-hie-path $HIEBIN)" ]; then
  debug "$HIEBIN was found on path"
elif [ -x "$(find-hie-path $BACKUP_HIEBIN)" ]; then
  debug "Backup $BACKUP_HIEBIN was found on path"
  HIEBIN=$BACKUP_HIEBIN
elif [ -x "$(find-hie-path hie)" ]; then
  debug "Falling back to plain hie"
  HIEBIN='hie'
else
  error_message='{"jsonrpc":"2.0","id":1,"error":{"code":-32099,"message":"Cannot find hie in the path"}}'
  printf 'Content-Length: %s\r\n\r\n%s' ${#error_message} "$error_message"
  exit 1
fi

debug "Starting HIE"
exec $HIE_PREFIX "$HIEBIN" "$@"
