var socket = io.connect();
var activityPIR = [],
		activitySoundLoud = [];
		activitySoundGlobal = [];
		activityStairs = [];


socket.emit('datas');

socket.on('data', function(sensor, value){
		if(value == 0){
			$('#'+sensor).removeClass('active');
		}else{
			$('#'+sensor).addClass('active');
		}
});

var remapValue;
socket.on('globalActivity', function(globalActivity){
	remapValue = globalActivity.value.map(0,globalActivity.maxValue,0,100);
	$("#globalActivity .value").html(remapValue);
	$('#globalActivity #globalVal').css('width', remapValue+'%');
});


socket.on('pirData', function (datas) {

  $.each(datas, function(time, activation){
  	activityPIR.push({'x' : time, 'y' : activation.length});
  });
  generateCharts("pir", "PIR", activityPIR, "line", 'rgba(255,221,18,0.5)', 'rgba(255,221,18,1)');

  // generateCharts("sound_2", "Sensor sound 2", datas, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
  // generateCharts("piezo", "Main courante", datas, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');

});

socket.on('SoundLoudData', function (datas) {
  $.each(datas, function(time, activation){
  	activitySoundLoud.push({'x' : time, 'y' : activation.length});
  });
  generateCharts("sound_1", "Sensor sound Loud", activitySoundLoud, "line", 'rgba(183,230,230,0.5)', 'rgba(183,230,230,1)');

  // generateCharts("sound_2", "Sensor sound 2", datas, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
  // generateCharts("piezo", "Main courante", datas, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');

});
var totalSound = 0;
socket.on('SoundGlobalData', function (datas) {
  $.each(datas, function(time, minute){
  	$.each(minute, function(i,activation){
  		totalSound = +totalSound + +activation.y;
  		// console.log(activation.y);
  	});
  	console.log(totalSound);
  	activitySoundGlobal.push({'x' : time, 'y' : totalSound});
  	totalSound = 0;
  });
  generateCharts("sound_2", "Sensor sound Global", activitySoundGlobal, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');

  // generateCharts("sound_2", "Sensor sound 2", datas, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
  // generateCharts("piezo", "Main courante", datas, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');

});


socket.on('StairsData', function (datas) {
  $.each(datas, function(time, activation){
  	activityStairs.push({'x' : time, 'y' : activation.length});
  });
  generateCharts("stairs", "Stairs", activityStairs, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');

  // generateCharts("sound_2", "Sensor sound 2", datas, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
  // generateCharts("piezo", "Main courante", datas, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');

});


var dataSound_1 = [];
function generateCharts(id, label, datas, type, bgColor, color){

	var ctx = document.getElementById(id);
	var scatterChart = new Chart(ctx, {
    type: type,
    data: {
        datasets: [{
            label: label,
            data: datas,
            lineTension : 0,
            borderColor : color,
            backgroundColor : bgColor
        }]
    },
    options: {
    		maintainAspectRatio : false,
        scales: {
            xAxes: [{
                type: 'time',
                time : {
                	displayFormats: {
                        'millisecond': 'h:mm:ss',
                        'hour' :'h:mm:ss',
                    }
                },
            }]
            ,
            yAxes: [{
                ticks: {
                		beginAtZero : true,
                }
            }]
        }
    },
	});
}



$(document).ready(function(){
	//
	// var globalActivity = {
	// 	maxValue  : 200,
	// 	value : 200
	// }
	// var remapValue;
	//
	//
	// setInterval(function(){
	// 	globalActivity.value--;
	// 	remapValue = globalActivity.value.map(0,globalActivity.maxValue,0,100);
	// 	console.log('val',remapValue);
	//
	// 	$("#globalActivity .value").html(remapValue);
	// 	$('#globalActivity #globalVal').css('width', remapValue+'%');
	// },1000);

	$('#function').keyup(function(e){
		console.log(e.keyCode);
    if(e.keyCode == 13)
    {
			socket.emit("ctrl", $('#function').val());
    }
});

});

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
