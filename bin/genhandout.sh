#!/bin/bash

if [ "$#" -ne 2 ]
then
	echo 'usage: '$0' <xmlfile> <destdir>' >&2
	exit 1
fi


tmpdir="`mktemp -d`"
xmlfile="$1"
destdir="`realpath "$2"`"
xmlbasename="`basename "$xmlfile"`"
xmlstem="${xmlbasename/.xml/}"

set -x

cp "$xmlfile" "$tmpdir"
chmod 666 -R "$tmpdir"
chmod 777 "$tmpdir"
su - handout -c cp\ \""$tmpdir"/"$xmlbasename"\"\ \~/adatlabor-feladatlap/handout/
su - handout -c 'cd ~/adatlabor-feladatlap; scons HD="'"${xmlstem}"'"'
su - handout -c 'cd ~/adatlabor-feladatlap/handout;cp -v "'"${xmlstem}"'"* "'"$tmpdir"'"'

chmod 666 -R "$tmpdir"
pushd "$tmpdir"
mkdir "${xmlstem}"
mv "$xmlstem".* "$xmlstem"
zip -r "$xmlstem.zip" "$xmlstem"
mkdir -p "$destdir"
mv "$xmlstem.zip" "$destdir"
chown backend:backend "$destdir/$xmlstem.zip"
popd

rm -rf "$tmpdir"
