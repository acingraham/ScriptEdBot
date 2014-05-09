var five = require("johnny-five"),
    SerialPort = require("serialport").SerialPort,
    board, 
    servo;

board = new five.Board();

board.on("ready", function() {
  var leftServo,
      rightServo,
      mag,
      queue,
      createServo,
      time = 0;
      
      
  function drive(left, right, duration) {
    var adjustedLeft = (left / 1000) + 0.01,
        adjustedRight = (right / 1000) - 0.06;
        
    (function (startTime) {
      setTimeout(function() {
        leftServo.ccw(adjustedLeft);
        rightServo.cw(adjustedRight);
      }, startTime);
      
    })(time);
    
    time += duration;
  }
  
  function stop() {
      drive(0,0,0);
      setTimeout(function() {
          process.exit(0);
      }, time+1);
  }
  
  createServo = function (options) {
    var servo = new five.Servo(options.slot);

    servo.type = options.type;
    servo.isInverted = options.isInverted;
    servo.startAt = options.startAt;

    return servo;
  };

  leftServo = createServo({
    slot       : 6,
    type       : 'continuous',
    isInverted : true,
    startAt    : 0
  });

  rightServo = createServo({
    slot       : 5,
    type       : 'continuous',
    isInverted : true,
    startAt    : 0
  });

  /*
  mag = new five.Magnetometer();

  mag.on("headingchange", function() {
    console.log("heading", Math.floor(this.heading));
    console.log("bearing", this.bearing);
  });
  */
  
  drive(100,100,5000);
  drive(-100,100,5000);
  stop();

});

