// SensorTag object.
var sensortag
var dev_data
function initialiseSensorTag()
{
    // Uncomment to use SensorTag CC2541.
    //sensortag = evothings.tisensortag.createInstance(
    //	evothings.tisensortag.CC2541_BLUETOOTH_SMART)
    
    // Uncomment to use SensorTag neo-gait.
    sensortag = evothings.tisensortag.createInstance(
        evothings.tisensortag.NEO_BLUETOOTH_SMART)

    //
    // Here sensors are set up.
    //
    // If you wish to use only one or a few sensors, just set up
    // the ones you wish to use.
    //
    // First parameter to sensor function is the callback function.
    // Several of the sensors take a millisecond update interval
    // as the second parameter.
    //
    sensortag
        .statusCallback(statusHandler)
        .errorCallback(errorHandler)
        /*
        .keypressCallback(keypressHandler)
        .magnetometerCallback(magnetometerHandler, 1000)
        .gyroscopeCallback(gyroscopeHandler, 1000)
        */
        .accelerometerCallback(accelerometerHandler, 1000)
        .luxometerCallback(luxometerHandler, 1000)
}

function display_devices()
{
/*
    value="<br/>"
    for(var i in window.localStorage){
	   val = localStorage.getItem(i); 
	   value +=  val+'<br/>' 
	}
*/
   for(var i in window.localStorage){
	   val = localStorage.getItem(i); 
	   //value +=  val+'<br/>' 
	   var label= document.createElement("label");
	   var description = document.createTextNode(val);
	   var checkbox = document.createElement("input");

	   checkbox.type = "checkbox";    // make the element a checkbox
	   checkbox.name = "ezfind";      // give it a name we can check on the server side
       checkbox.value = i;         // make its value "pair"

       label.appendChild(checkbox);   // add the box to the element
       label.appendChild(description);// add the description to the elemen
	   $('#DeviceList').append(label);
	}

	//$('#DeviceList').html(value);
}

function device_clean()
{
    localStorage.clear();
	$('#DeviceList').empty();
}

function device_find()
{
	varstr = "\n"
	//checkedValue = $('.messageCheckbox:checked').val();
	var checkboxes = document.getElementsByName('ezfind');
	var checkboxesChecked = [];
	// loop over them all
	for (var i=0; i<checkboxes.length; i++) {
		// And stick the checked ones onto an array...
		if (checkboxes[i].checked) {
			//checkboxesChecked.push(checkboxes[i]);
            varstr += checkboxes[i].value + "\n"
		}
	}
	alert (varstr)
	// Return the array if it is non-empty, or null
	//return checkboxesChecked.length > 0 ? checkboxesChecked : null
}

function connect()
{
    sensortag.connectToNearestDevice()
    //setTimeout(function(){ connect() }, 10000);
}

function disconnect()
{
    sensortag.disconnectDevice()
    resetSensorDisplayValues()
    ng_clean()
}

function statusHandler(status)
{
    if ('DEVICE_INFO_AVAILABLE' == status)
    {
        // Show a notification about that the firmware should be
        // upgraded if the connected device is a SensorTag CC2541
        // with firmware revision less than 1.5, since this the
        // SensorTag library does not support these versions.
        var upgradeNotice = document.getElementById('upgradeNotice')
        if ('CC2541' == sensortag.getDeviceModel() &&
            parseFloat(sensortag.getFirmwareString()) < 1.5)
        {
            upgradeNotice.classList.remove('hidden')
        }
        else
        {
            upgradeNotice.classList.add('hidden')
        }

        // Show device model and firmware version.
        //displayValue('DeviceModel', sensortag.getDeviceModel())
        displayValue('DeviceModel', sensortag.device.name)
        displayValue('FirmwareData', sensortag.getFirmwareString())

        // Show which sensors are not supported by the connected SensorTag.
        if (!sensortag.isLuxometerAvailable())
        {
            document.getElementById('Luxometer').style.display = 'none'
        }
        store_dev_inf()
    }
    if ('SENSORTAG_ONLINE' == status){
        sensortag.set_time(); 
    }

    displayValue('StatusData', status)
}

function errorHandler(error)
{
    console.log('Error: ' + error)

    if (evothings.easyble.error.DISCONNECTED == error)
    {
        resetSensorDisplayValues()
    }
    else
    {
        displayValue('StatusData', 'Error: ' + error)
    }
}

function resetSensorDisplayValues()
{
    // Clear current values.
    var blank = '[Waiting for value]'
    displayValue('StatusData', 'Press Connect to find a Neo-Gait')
    displayValue('DeviceModel', '?')
    displayValue('FirmwareData', '?')
    displayValue('KeypressData', blank)
    displayValue('AccelerometerData', blank)
    displayValue('GyroscopeData', blank)

    // Reset screen color.
    setBackgroundColor('white')
}

function accelerometerHandler(data)
{
    // Calculate the x,y,z accelerometer values from raw data.
    var x = sensortag.getAccelerometerValues(data)


    // Prepare the information to display.
    string =
        //'raw: <span style="font-family: monospace;">0x' +
        //	bufferToHexStr(data, dataOffset, 6) + '</span><br/>' +
        'angle:' + (x >= 0 ? '+' : '') + x.toFixed(3) 

   //ocument.getElementById("acc_z").style.width = Math.abs((z/2.0).toFixed(2)*100)+"%" 
    // Update the value displayed.
    displayValue('AccelerometerData', string)
}

function magnetometerHandler(data)
{
    // Calculate the magnetometer values from raw sensor data.
    var values = sensortag.getMagnetometerValues(data)
    var x = values.x
    var y = values.y
    var z = values.z

    //var model = sensortag.getDeviceModel()
    //var dataOffset = (model == 2 ? 12 : 0)

    // Prepare the information to display.
    string =
        //'raw: <span style="font-family: monospace;">0x' +
        //	bufferToHexStr(data, dataOffset, 6) + '</span><br/>' +
        'x: ' + (x >= 0 ? '+' : '') + x.toFixed(5) + '&micro;T <br/>' +
        'y: ' + (y >= 0 ? '+' : '') + y.toFixed(5) + '&micro;T <br/>' +
        'z: ' + (z >= 0 ? '+' : '') + z.toFixed(5) + '&micro;T <br/>'

    // Update the value displayed.
    displayValue('MagnetometerData', string)
}

function gyroscopeHandler(data)
{
    // Calculate the gyroscope values from raw sensor data.
    var values = sensortag.getGyroscopeValues(data)
    var x = values.x
    var y = values.y
    var z = values.z

    // Prepare the information to display.
    string =
        //'raw: <span style="font-family: monospace;">0x' +
        //	bufferToHexStr(data, 0, 6) + '</span><br/>' +
        'x: ' + (x >= 0 ? '+' : '') + x.toFixed(5) + '<br/>' +
        'y: ' + (y >= 0 ? '+' : '') + y.toFixed(5) + '<br/>' +
        'z: ' + (z >= 0 ? '+' : '') + z.toFixed(5) + '<br/>'
    var gyro_w = y/40.0 
    document.getElementById("gyro_y").style.width = Math.abs((gyro_w).toFixed(2)*100)+"%" 

    // Update the value displayed.
    displayValue('GyroscopeData', string)
}

function store_dev_inf()
{
    dev_data = {
                "name":sensortag.device.name,
                'mac':sensortag.device.address,
                'version': sensortag.getFirmwareString(),
                'factory': "上达"
                };
    $.ajax({
        async:true,
        crossOrigin: true,
        type:"POST",
        dataType: "json",
        data:JSON.stringify(dev_data), 
        //url: "http://123.59.57.67:8000",
        //url: "http://10.42.0.1:8080/add",
        //url: "http://10.42.0.1:8080/add",
        url: "http://192.168.199.185:8080/add",
        //contentType: "application/json; charset=utf-8",
        success: function(data){
        },
        error:function(jqXHR, exception){
            if (jqXHR.status != 200){
                displayValue('st_net', "Network Error(code:" + jqXHR.status + ")")
            } else {
                displayValue('st_net', "OK (code: " + jqXHR.status + ")")
            
            }
            //alert("Error Code: " + jqXHR.status + " (Network Error)");
        }
    });
}

function setBackgroundColor(color)
{
    document.documentElement.style.background = color
    document.body.style.background = color
}

/**
 * Convert byte buffer to hex string.
 * @param buffer - an Uint8Array
 * @param offset - byte offset
 * @param numBytes - number of bytes to read
 * @return string with hex representation of bytes
 */
function bufferToHexStr(buffer, offset, numBytes)
{
    var hex = ''
    for (var i = 0; i < numBytes; ++i)
    {
        hex += byteToHexStr(buffer[offset + i])
    }
    return hex
}

/**
 * Convert byte number to hex string.
 */
function byteToHexStr(d)
{
    if (d < 0) { d = 0xFF + d + 1 }
    var hex = Number(d).toString(16)
    var padding = 2
    while (hex.length < padding)
    {
        hex = '0' + hex
    }
    return hex
}

/*
document.addEventListener(
    'deviceready',
    function() { evothings.scriptsLoaded(initialiseSensorTag) },
    false)
    */
