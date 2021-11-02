#!/bin/bash

echo script started
cd dist/capacitor/android/apk/release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../../../../../android.keystore app-release-unsigned.apk android-app-key