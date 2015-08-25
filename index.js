
	// SensorTag object.
	var sensortag

	function initialiseSensorTag()
	{
		// Create SensorTag CC2650 instance.
		//sensortag = evothings.tisensortag.createInstance(
		//	evothings.tisensortag.CC2650_BLUETOOTH_SMART)

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
			.accelerometerCallback(accelerometerHandler, 1000)
			.magnetometerCallback(magnetometerHandler, 1000)
			.gyroscopeCallback(gyroscopeHandler, 1000)
			*/
			.gyroscopeCallback(gyroscopeHandler, 1000)
			.accelerometerCallback(accelerometerHandler, 1000)
			.luxometerCallback(luxometerHandler, 1000)
	}
    function ng_clean()
    {
       //$('#flash_test').style.backgroundColor = 'white';
            document.getElementById('flash_test').style.backgroundColor ='white' 
            document.getElementById('green').style.backgroundColor ='white' 
            document.getElementById('red').style.backgroundColor ='white' 
            document.getElementById('blue').style.backgroundColor ='white' 
            document.getElementById('breath').style.backgroundColor ='white' 
            document.getElementById('acc_z').style.backgroundColor ='white' 
            document.getElementById('gyro_y').style.backgroundColor ='white' 
            document.getElementById('btn').style.backgroundColor ='white' 
    }   
	function connect()
	{
		sensortag.connectToNearestDevice()
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
			displayValue('DeviceModel', sensortag.getDeviceModel())
			displayValue('FirmwareData', sensortag.getFirmwareString())

			// Show which sensors are not supported by the connected SensorTag.
			if (!sensortag.isLuxometerAvailable())
			{
				document.getElementById('Luxometer').style.display = 'none'
			}
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
//		displayValue('TemperatureData', blank)
		displayValue('AccelerometerData', blank)
//		displayValue('HumidityData', blank)
//		displayValue('MagnetometerData', blank)
//		displayValue('BarometerData', blank)
		displayValue('GyroscopeData', blank)
		displayValue('flash', blank)

		// Reset screen color.
		setBackgroundColor('white')
	}

	function keypressHandler(data)
	{
		// Update background color.
		switch (data[0])
		{
			case 0:
				setBackgroundColor('white')
				break;
			case 1:
				setBackgroundColor('red')
				break;
			case 2:
				setBackgroundColor('blue')
				break;
			case 3:
				setBackgroundColor('magenta')
				break;
		}

		// Update the value displayed.
		var string = 'raw: 0x' + bufferToHexStr(data, 0, 1)
		displayValue('KeypressData', string)
	}


	function accelerometerHandler(data)
	{
		// Calculate the x,y,z accelerometer values from raw data.
		var values = sensortag.getAccelerometerValues(data)
		var x = values.x
		var y = values.y
		var z = values.z

		//var model = sensortag.getDeviceModel()
		//var dataOffset = (model == 2 ? 6 : 0)

		// Prepare the information to display.
		string =
			//'raw: <span style="font-family: monospace;">0x' +
			//	bufferToHexStr(data, dataOffset, 6) + '</span><br/>' +
			'x: ' + (x >= 0 ? '+' : '') + x.toFixed(5) + 'G<br/>' +
			'y: ' + (y >= 0 ? '+' : '') + y.toFixed(5) + 'G<br/>' +
			'z: ' + (z >= 0 ? '+' : '') + z.toFixed(5) + 'G<br/>'

        document.getElementById("acc_z").style.width = Math.abs((z/2.0).toFixed(2)*100)+"%" 
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

	function luxometerHandler(data)
	{
		//var value = sensortag.getLuxometerValue(data)
        value = sensortag.get_test_result(data)

		// Prepare the information to display.
		//string = "test"
			//'raw: <span style="font-family: monospace;">0x' +
			//	bufferToHexStr(data, 0, 2) + '</span><br/>' +
			//'degree: ' + (value/100.0).toPrecision(5) + '<br/>'
		// Update the value displayed.

		//console.log('item: ' + value.item)
        if (0 == value.item ){
        
            disp_test_result("flash_test",value.res)
            if (1 == value.res){
                displayValue('flash', "PASS")
            
            } else {
                displayValue('flash', "FAIL")
            
            }
        } else if (1 == value.item) {

            disp_test_result("red",value.res)

        } else if (2 == value.item){

            disp_test_result("green",value.res)
        
        } else if (3 == value.item){

            disp_test_result("blue",value.res)
        
        } else if (4 == value.item){

            disp_test_result("breath",value.res)
        
        } else if (5 == value.item){
        
            disp_test_result("btn",value.res)
            if (1 == value.res){
                displayValue('KeypressData', "PASS")
            
            } else {
                displayValue('KeypressData', "FAIL")
            
            }
        }else if (6 == value.item){
            disp_test_result("acc_z",value.res)
            
        } else if (7 == value.item){
            disp_test_result("gyro_y",value.res)
        
        }
        
            
	}

    function test_on()
    {
        sensortag.test_on() 

    }

	function displayValue(elementId, value)
	{
		document.getElementById(elementId).innerHTML = value
	}

    function disp_test_result(elem_id, value)
    {
        if (1 == value){
            document.getElementById(elem_id).style.backgroundColor ='green' 
        } else {
            document.getElementById(elem_id).style.backgroundColor ='red' 
        }
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

	document.addEventListener(
		'deviceready',
		function() { evothings.scriptsLoaded(initialiseSensorTag) },
		false)
