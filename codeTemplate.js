var five = require("johnny-five"),
    SerialPort = require("serialport").SerialPort,
    board, 
    servo;

board = new five.Board();

board.on("ready", function() {

  var leftServo, rightServo;

  // Create a new `servo` hardware instance.
  leftServo = new five.Servo(6);
  leftServo.type = "continuous";
  leftServo.isInverted = true;
  leftServo.startAt = 0;

  rightServo = new five.Servo(5);
  rightServo.type = "continuous";
  rightServo.isInverted = true;
  rightServo.startAt = 0;

  function right(num) {
    var adjustedValue = (num / 100) - .04;
    console.log("right: " + num);
    rightServo.cw(adjustedValue);
  }

  function left(num) {
    var adjustedValue = (num / 100) + .01;
    console.log("left: " + num);
    leftServo.ccw(adjustedValue);
  }
  
  var TIME_INTERVAL = 1000;

  var time = TIME_INTERVAL;

  left(0);
  right(0);

  setTimeout(function() {
    left(100);
    right(100);
  }, time);

  time += TIME_INTERVAL;
  setTimeout(function() {
    left(-100);
    right(100);
  }, time);

  time += TIME_INTERVAL;
  setTimeout(function() {
    left(0);
    right(0);
  }, time);

  time += TIME_INTERVAL;
  setTimeout(function() {
    left(3);
    right(80);
  }, time);

  time += TIME_INTERVAL;
  setTimeout(function() {
    left(0);
    right(0);
  }, time);

  setTimeout(function() {
    process.exit(0);
  }, time+100);

});

