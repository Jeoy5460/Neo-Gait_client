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
window.localStorage.setItem("abc123", "hello");
   $('#DeviceList').empty();
   for(var i in window.localStorage){
	   val = localStorage.getItem(i); 
	   //value +=  val+'<br/>' 
       var div = document.createElement("div");
       div.className="ui-checkbox";

	   var label= document.createElement("label");

	   var checkbox = document.createElement("input");
	   checkbox.type = "checkbox";    // make the element a checkbox
	   checkbox.name = "ezfind";      // give it a name we can check on the server side
       checkbox.value = i;         // make its value "pair"
       //checkbox.className="ui-btn"
       checkbox.id=i

       //label.appendChild(checkbox);   // add the box to the element
	   var description = document.createTextNode(val);
       decription = val;
	   label.htmlFor= i;
       label.appendChild(description);// add the description to the elemen
       div.appendChild(checkbox);
       div.appendChild(label);
	   $('#DeviceList').append(div).trigger("create");
	   
	   //$("input[type='checkbox']").checkbox("refresh");
	   //$("#DeviceList").append('<input type="checkbox" name="' + checkbox.name + '" id="id' + i + '"><label for="id' + i + '">' + val + '</label>');

	}

	//$('#DeviceList').html(value);
}

bletag.ui.device_clean=function()
{
    localStorage.clear();
	$('#DeviceList').empty();
}

bletag.ui.device_reset=function()
{

	var checkboxes = document.getElementsByName('ezfind');
	for (var i=0; i<checkboxes.length; i++) {
		checkboxes[i].parentNode.style.backgroundColor = "white";
	}
}

var deviceHandle;
var devlist=[];
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
            var device={};
			device.address = checkboxes[i].value;
            device.ui = checkboxes[i]
            devlist.push(device);
		}
/*        
                if (devlist.length){
            bletag.connectToDevice (devlist.pop());
        }
*/

	}
	if (devlist.length){
		bletag.startScan (bletag.connectToNext);
	}
	//alert (varstr)
	// Return the array if it is non-empty, or null
	//return checkboxesChecked.length > 0 ? checkboxesChecked : null
}

bletag.stopScan = function()
{
	evothings.ble.stopScan();
};

bletag.startScan = function(callbackFun)
{
	bletag.stopScan();

	evothings.ble.startScan(
		function(device)
		{
			// Report success. Sometimes an RSSI of +127 is reported.
			// We filter out these values here.
			if (device.rssi <= 0)
			{
				callbackFun(device, null);
			}
		},
		function(errorCode)
		{
			// Report error.
			callbackFun(null, errorCode);
		}
	);
};

bletag.connectToNext = function(device, erroCode)
{
    if (devlist.length && device){
		var index;
		for (index = 0; index < devlist.length; ++index) {
			if (devlist[index].address === device.address){
				bletag.connectToDevice (devlist[index]); 
				devlist.splice(index,1);
			}
		}
    }
}

// Handle of connected device.
bletag.connectToDevice = function(device) 
{
	evothings.ble.connect(device.address, connectSuccess, connectError)

	function connectSuccess(connectInfo)
	{
		if (connectInfo.state == evothings.ble.connectionState.STATE_CONNECTED)
		{
			// Save device handle.
			deviceHandle = connectInfo.deviceHandle;

			showMessage('Connected to device, reading services...');

            device.ui.parentNode.style.backgroundColor = "#bff0a1";

            bletag.disconnect ();
			// Read all services, characteristics and descriptors.
			//evothings.ble.readAllServiceData(
			//	deviceHandle,
			//	readServicesSuccess,
			//	readServicesError)
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
		evothings.ble.close(deviceHandle);
        showMessage('disconnected');
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
    false);

document.addEventListener("DOMContentLoaded", function(event) {
	bletag.ui.device_list();
});

//$( document ).on("pagecreate", "#main-page", function(){
    $( document ).on("swipeleft swiperight", "#DeviceList label", function(event){
        var listitem = $(this),
            dir = event.type === "swipeleft" ? "left":"right",
            transition = $.support.cssTransform3d? dir: false;
            confirmAndDelete(listitem, transition);
			console.log(dir);
        });

	function confirmAndDelete(listitem, transition){
		if ( transition ) {
                listitem
                    // Add the class for the transition direction
                    .addClass( transition )
                    // When the transition is done...
                    .on( "webkitTransitionEnd transitionend otransitionend", function() {
                        // ...the list item will be removed
						console.log("transition");
                        listitem.remove();
                        // ...the list will be refreshed and the temporary class for border styling removed
                        //$( "#DeviceList" ).listview( "refresh" ).find( ".border-bottom" ).removeClass( "border-bottom" );
                    })
                    // During the transition the previous button gets bottom border
                    //.prev( "label" ).children( "a" ).addClass( "border-bottom" )
                    // Remove the highlight
                    //.end().end().children( ".ui-btn" ).removeClass( "ui-btn-active" );
            }

	}
//});
