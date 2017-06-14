[ -d iot_android ] || cordova create iot_android
rsync -av --progress ./* ./iot_android/www  --exclude build.sh --exclude iot_android --exclude neo_client.npp
export _JAVA_OPTIONS="-Xmx1024M"
cd iot_android
echo "adding platforms"

#[ -d platforms/android ] || cordova platforms add android
pfs=$(cordova platforms ls)   

echo $pfs | grep -q 'android' 
if [ $? -eq 0 ] ; then
    echo "  android platform exits"
else
    cordova platforms add android
fi

echo $pfs | grep -q 'browser' 
if [ $? -eq 0 ] ; then
    echo "  browser platform exits"
else
    cordova platforms add browser
fi

echo "adding plugins"
plugins=$(cordova plugin ls)
echo $plugins | grep -q "plugin-device"
if [ $? -eq 0 ] ; then
    echo "  device plugin exits"
else
    cordova plugin add cordova-plugin-device
fi

echo $plugins | grep -q "plugin-console"
if [ $? -eq 0 ] ; then
    echo "  console plugin exits"
else
    cordova plugin add cordova-plugin-console
fi

#cordova plugin add com.evothings.ble #obsolete
echo $plugins | grep -q "plugin-ble"
if [ $? -eq 0 ] ; then
    echo "  ble plugin exits"
else
    cordova plugin add cordova-plugin-ble
fi

echo $plugins | grep -q "plugin-globalization"
if [ $? -eq 0 ] ; then
    echo "  globalization plugin exits"
else
    cordova plugin add cordova-plugin-globalization
fi

if [ "$1" == "build" ] ;then
    echo "building android"
    cordova build android
fi

if [[ "$#" -eq  0 ]] ;then
    echo "runing iotbox"
    #cordova run android --device
    cordova run browser --target=chromium
fi

if [ "$1" == "install" ] ;then
    #adb install -r platforms/android/ant-build/demoapp.apk
    echo "Installing apk"
    adb install -r $PWD/platforms/android/build/outputs/apk/android-debug.apk
fi
