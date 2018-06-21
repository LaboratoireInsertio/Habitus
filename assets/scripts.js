var socket = io.connect();
var activityPIR = [],
  activitySoundLoud = [];
activitySoundGlobal = [];
activityStairs = [];
activityCellDown = [];
activityCellUp = [];
activityGlobal = [];


//Ask for send the data of mongoDB
// socket.emit('datas');

//Receive the activation of the sensors and show on the interface
socket.on('data', function(sensor, value) {
  if (value == 0) {
    $('#' + sensor).removeClass('active');
  } else {
    $('#' + sensor).addClass('active');
  }
});

//Receive from the server the value of global Activity
//Update in the interface the value of global Activity
var remapValue;
socket.on('globalActivity', function(globalActivity) {
  remapValue = globalActivity.value.map(0, globalActivity.maxValue, 0, 100);
  $("#globalActivity .value").html(remapValue);
  $('#globalActivity #globalVal').css('width', remapValue + '%');
});



socket.on('stateStairs', function(stateStairs) {
  // console.log(stateStairs);
  for(var i=0;i<stateStairs.tints.length;i++){
    $(".tint[data-idtint="+i+"]").css("backgroundColor", "rgba(0,0,0,"+stateStairs.tints[i]+")")
  }
  for(var i=0;i<stateStairs.bulbs.length;i++){
    console.log(stateStairs.bulbs[i].map(0,255,0,1));
    $(".bulb[data-idbulb="+i+"]").css("backgroundColor", "rgba(255,229,46,"+stateStairs.bulbs[i].map(0,255,0,1)+")");
  }
});

/// UPDATE! : Maintenanant nous utilisons Metabase pour visualiser les données de mongo!

//Generate graph for showing global Activity saved in the database Mongo
// socket.on('globalActivityData', function(datas) {
//   generateCharts("graphGlobalActivity", "Global Activity", datas, "line", 'rgba(128, 0, 98, 0.33)', 'rgba(128, 0, 98, 1)');
// });

//Generate graph for showing sensor PIR values saved in the database Mongo
// socket.on('pirData', function(datas) {
//   $.each(datas, function(time, activation) {
//     activityPIR.push({
//       'x': time,
//       'y': activation.length
//     });
//   });
//   generateCharts("graphPir", "PIR", activityPIR, "line", 'rgba(255,221,18,0.5)', 'rgba(255,221,18,1)');
// });

//Generate graph for showing sensor Sound loud values saved in the database Mongo
// socket.on('SoundLoudData', function(datas) {
//   $.each(datas, function(time, activation) {
//     activitySoundLoud.push({
//       'x': time,
//       'y': activation.length
//     });
//   });
//   generateCharts("graphSound_1", "Sensor sound Loud", activitySoundLoud, "line", 'rgba(183,230,230,0.5)', 'rgba(183,230,230,1)');
// });

//Generate graph for showing sensor Sound global values saved in the database Mongo
// var totalSound = 0;
// socket.on('SoundGlobalData', function(datas) {
//   $.each(datas, function(time, minute) {
//     $.each(minute, function(i, activation) {
//       totalSound = +totalSound + +activation.y;
//     });
//     activitySoundGlobal.push({
//       'x': time,
//       'y': totalSound
//     });
//     totalSound = 0;
//   });
//   generateCharts("graphSound_2", "Sensor sound Global", activitySoundGlobal, "line", 'rgba(163,216,106,0.5)', 'rgba(163,216,106,1)');
// });


//Generate graph for showing sensor photocell down values saved in the database Mongo
// socket.on('CellDownData', function(datas) {
//   $.each(datas, function(time, activation) {
//     activityCellDown.push({
//       'x': time,
//       'y': activation.length
//     });
//   });
//   generateCharts("graphCellDown", "Sensor Photocell Down", activityCellDown, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
// });

//Generate graph for showing sensor photocell up values saved in the database Mongo
// socket.on('CellUpData', function(datas) {
//   $.each(datas, function(time, activation) {
//     activityCellUp.push({
//       'x': time,
//       'y': activation.length
//     });
//   });
//   generateCharts("graphCellUp", "Sensor Photocell Up", activityCellUp, "line", 'rgba(234,86,61,0.5)', 'rgba(234,86,61,1)');
// });


// var dataSound_1 = [];

// function generateCharts(id, label, datas, type, bgColor, color) {

//   var ctx = document.getElementById(id);
//   var scatterChart = new Chart(ctx, {
//     type: type,
//     data: {
//       datasets: [{
//         label: label,
//         data: datas,
//         lineTension: 0,
//         borderColor: color,
//         backgroundColor: bgColor
//       }]
//     },
//     options: {
//       maintainAspectRatio: false,
//       scales: {
//         xAxes: [{
//           type: 'time',
//           time: {
//             displayFormats: {
//               'millisecond': 'h:mm:ss',
//               'hour': 'h:mm:ss',
//             }
//           },
//         }],
//         yAxes: [{
//           ticks: {
//             beginAtZero: true,
//           }
//         }]
//       }
//     },
//   });
// }



Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
