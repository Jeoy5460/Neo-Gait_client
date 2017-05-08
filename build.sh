[ -d iot_android ] || cordova create iot_android
rsync -av --progress ./* ./iot_android/www  --exclude build.sh --exclude iot_android --exclude neo_client.npp
export _JAVA_OPTIONS="-Xmx1024M"
cd iot_android
echo "adding android"
[ -d platforms/android ] || cordova platforms add android
echo "adding plugins"
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-console
#cordova plugin add com.evothings.ble
cordova plugin cordova-plugin-ble
echo "building android"
#cordova run android
cordova build android
#adb install -r platforms/android/ant-build/demoapp.apk
adb install -r /home/xFrog/projs/iotbox/iot_android/platforms/android/build/outputs/apk/android-debug.apk
