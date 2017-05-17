[ -d iot_android ] || cordova create iot_android
rsync -av --progress ./* ./iot_android/www  --exclude build.sh --exclude iot_android --exclude neo_client.npp
export _JAVA_OPTIONS="-Xmx1024M"
cd iot_android
echo "adding android"

#[ -d platforms/android ] || cordova platforms add android
cordova platforms ls | grep 'android'   
if [ $? -eq 0 ] ; then
    echo "android platform exits"
else
    cordova platforms add android
fi

echo "adding plugins"
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-console
#cordova plugin add com.evothings.ble #obsolete
cordova plugin add cordova-plugin-ble
if [ "$1" == "build" ] ;then
    echo "building android"
    cordova build android
fi

if [[ "$#" -eq  0 ]] ;then
    echo "runing iotbox"
    cordova run android --device
fi

if [ "$1" == "install" ] ;then
    #adb install -r platforms/android/ant-build/demoapp.apk
    echo "Installing apk"
    adb install -r $PWD/platforms/android/build/outputs/apk/android-debug.apk
fi
