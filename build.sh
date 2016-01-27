[ -d ng_android ] || cordova create ng_android
rsync -av --progress ./* ./ng_android/www  --exclude build.sh --exclude ng_android --exclude neo_client.npp
cd ng_android
echo "adding android"
cordova platforms add android
echo "adding plugins"
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-console
cordova plugin add com.evothings.ble
echo "building android"
cordova build android
#adb install -r platforms/android/ant-build/demoapp.apk
adb install -r /home/zhouyu/projs/ng_box/ng_android/platforms/android/build/outputs/apk/android-debug.apk
