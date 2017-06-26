$(document).ready(function(){
  var socket = io();
  $(".ctrl").on('click',function(){
    console.log($(this).data('id'));
    socket.emit("ctrl", $(this).data('id'), "test");
  })
})
