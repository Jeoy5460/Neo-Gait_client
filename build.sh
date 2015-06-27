[ -d ng-android ] || cordova create ng-android
rsync -av --progress ./* ./ng-android/www  --exclude build.sh --exclude ng-android --exclude neo_client.npp
cd ng-android
echo "adding android"
cordova platforms add android
echo "adding plugins"
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-console
cordova plugin add com.evothings.ble
echo "building android"
cordova build android
#adb install -r platforms/android/ant-build/demoapp.apk
#adb install -r platforms/android/build/outputs/apk/android-debug.apk
