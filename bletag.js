// bletag  object.
var bletag = {}
bletag.ui = {}

bletag.initialise = function()
{
}

bletag.ui.device_list = function()
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

bletag.ui.device_clean=function()
{
    localStorage.clear();
	$('#DeviceList').empty();
}

bletag.ui.device_find=function()
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
            //varstr += checkboxes[i].value + "\n"
			var address = checkboxes[i].value;
			bletag.connectToDevice (address); 
		}
	}
	//alert (varstr)
	// Return the array if it is non-empty, or null
	//return checkboxesChecked.length > 0 ? checkboxesChecked : null
}

// Handle of connected device.
var deviceHandle
bletag.connectToDevice = function(address) 
{
	evothings.ble.connect(address, connectSuccess, connectError)

	function connectSuccess(connectInfo)
	{
		if (connectInfo.state == evothings.ble.connectionState.STATE_CONNECTED)
		{
			// Save device handle.
			deviceHandle = connectInfo.deviceHandle

			showMessage('Connected to device, reading services...')

			// Read all services, characteristics and descriptors.
			evothings.ble.readAllServiceData(
				deviceHandle,
				readServicesSuccess,
				readServicesError)
				// Options not implemented.
				// { serviceUUIDs: [LUXOMETER_SERVICE] }
		}

		if (connectInfo.state == evothings.ble.connectionState.STATE_DISCONNECTED)
		{
			showMessage('Device disconnected')
		}
	}

	function readServicesSuccess(services)
	{
		showMessage('Reading services completed')

		// Get Luxometer service and characteristics.
		//var service = evothings.ble.getService(services, LUXOMETER_SERVICE)
		//var configCharacteristic = evothings.ble.getCharacteristic(service, LUXOMETER_CONFIG)
		//var dataCharacteristic = evothings.ble.getCharacteristic(service, LUXOMETER_DATA)

		// Enable notifications for Luxometer.
		//enableLuxometerNotifications(deviceHandle, configCharacteristic, dataCharacteristic)
	}

	function readServicesError(error)
	{
		showMessage('Read services error: ' + error)
	}

	// Function called when a connect error or disconnect occurs.
	function connectError(error)
	{
		showMessage('Connect error: ' + error)
	}
}

bletag.disconnect = function()
{
	if (deviceHandle){
		evothings.ble.close(devicHandle);
	}
}

function showMessage(text)
{
	document.querySelector('#message').innerHTML = text
	console.log(text)
}

var dev_data
/***
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
***/

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
    function() { evothings.scriptsLoaded(bletag.initialise) },
    false)
