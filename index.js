
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
    function ng_clean()
    {
            document.getElementById('flash_test').style.backgroundColor ='white'; 
            document.getElementById('green').style.backgroundColor ='white'; 
            document.getElementById('red').style.backgroundColor ='white'; 
            document.getElementById('blue').style.backgroundColor ='white'; 
            document.getElementById('breath').style.backgroundColor ='white'; 
            document.getElementById('acc_z').style.backgroundColor ='white'; 
            document.getElementById('gyro_y').style.backgroundColor ='white'; 
            document.getElementById('btn').style.backgroundColor ='white'; 
            dev_data = {};
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
		displayValue('flash', blank)
		displayValue('pdm', blank)
		displayValue('act', blank)

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

    var cmd_idx = 0
    function auto_cmd()
    {
        cmd_idx += 1;
        cmd_idx = cmd_idx%3
        if (cmd_idx == 1){
            sensortag.act(0x07);
            setTimeout(function(){auto_cmd()}, 10000);
        } else if (cmd_idx == 2){
            setTimeout(function(){auto_cmd()}, 10000);
        } else {
        
            sensortag.act(0x00);
        }
    }

    var pack_sync  = 0
    var is_steps  = 0
    var act = {x:0, y:0, z:0}
	function luxometerHandler(data)
	{
		//var value = sensortag.getLuxometerValue(data)
        value = sensortag.get_test_result(data)
        if (0x01 == value.item ){
            disp_test_result("flash_test", value.res)
            if (1 == value.res){
                displayValue('flash', "PASS")
            
            } else {
                displayValue('flash', "FAIL")
            
            }
            setTimeout(function(){ sensortag.led_red() }, 1000);
        } else if (0x02 == value.item) {

            disp_test_result("red",value.res)
            setTimeout(function(){ sensortag.led_green() }, 3000);

        } else if (0x03 == value.item){

            disp_test_result("green",value.res)
            setTimeout(function(){ sensortag.led_blue() }, 3000);
        
        } else if (0x04 == value.item){

            disp_test_result("blue",value.res)
            setTimeout(function(){ sensortag.led_breath() }, 3000);
                    
        } else if (0x05 == value.item){

            disp_test_result("breath",value.res)
        
        } else if (0x06 == value.item){
        
            disp_test_result("btn",value.res)
            if (1 == value.res){
                displayValue('KeypressData', "PASS")
            
            } else {
                displayValue('KeypressData', "FAIL")
            
            }
            sensortag.act (0x07);
        } else if (10 == value.item){
            pack_data = sensortag.get_log_pack(data)
            displayValue("pdm", pack_data.res)
        
        } else if (11 == value.item){
            pack_sync = 1;
            is_steps = 0;
            act.x = 0;
            act.y = 0;
            act.z = 0;
        } else if (12 == value.item){
            if (pack_sync == 1){
            
                pack_data = sensortag.get_log_pack(data)
                is_steps = (is_steps+1)%3;
                if (is_steps == 0){
                    act.z = pack_data.res;
                    drawGraph (act.y)
                    var d = new Date(act.x*1000+Date.UTC(2000, 00, 01));
                    output({x:d.toLocaleString(), y:act.y, z:act.z});

                } else if(is_steps == 2){
                    act.y = pack_data.res;
                
                } else if (is_steps == 1){
                    act.x=pack_data.res;
                }
            }
        } else if (13 == value.item){
            pack_sync =0;
        
        }

	}

    d1 = [];
    
    // Pre-pad the arrays with 100 null values
    for (var i=0; i< 100; ++i) {
        d1.push(null);
    }

    function getGraph(id, d1)
    {
        //var graph = new RGraph.Line(id, d1, d2);
        var graph = new RGraph.Line(id, d1);
        //var graph = new RGraph.Scatter(id, d1);
        graph.Set('chart.background.barcolor1', 'white');
        graph.Set('chart.background.barcolor2', 'white');
        graph.Set('chart.title.xaxis', 'Time');
        graph.Set('chart.filled', true);
        graph.Set('chart.fillstyle', ['#daf1fa', '#faa']);
        graph.Set('chart.colors', ['rgb(169, 222, 244)', 'red']);
        graph.Set('chart.linewidth', 3);
        graph.Set('chart.ymax', 500);
        graph.Set('chart.xticks', 25);
        graph.Set('chart.gutterLeft', 30);

        return graph;
    }
    
    function drawGraph (e)
    {
        // Clear the canvas and redraw the chart
        RGraph.Clear(document.getElementById("cvs"));
        var graph = getGraph('cvs', d1);
        d1.push(e);
        graph.Draw();
        
        // Get rid of the first values of the arrays
        if (d1.length > 100) {
            d1 = RGraph.array_shift(d1);
        }

    }

    var text = "";
    function output(data)
    {
        text += data.x + "   " + data.y + "  " + (data.z) + "<br>";
        
        document.getElementById("act").innerHTML = text;   
    }

    function log_clean()
    {
        text = "";
        document.getElementById("act").innerHTML = text;   
    }

    function test_on()
    {
        sensortag.flash_test() 
    }

    function sync_on()
    {
        sensortag.sync_on()

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
