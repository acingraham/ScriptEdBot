var five = require("johnny-five"),
    SerialPort = require("serialport").SerialPort,
    board, 
    servo;

board = new five.Board();

board.on("ready", function() {
  var leftServo,
      rightServo,
      penServo,
      mag,
      queue,
      createServo,
      time = 0;
      
      
  function drive(left, right, duration) {
        
    var adjustedLeft = (left / 1000),
        adjustedRight = (right / 1000);
        
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
      stopMarker();
      setTimeout(function() {
          process.exit(0);
      }, time+100);
  }
  
  function stopMarker() {
      setTimeout(function() {
          penServo.to(90);
      }, time);
  }

  function raiseMarker() {
    setTimeout(function() {
      penServo.to(90);
    }, time);
    time += 1000;
    stopMarker();
  }

  function lowerMarker() {
    setTimeout(function() {
      penServo.to(0);
    }, time);
    time += 1000;
    stopMarker();
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

  penServo = createServo({
    slot       : 11,
    type       : 'continuous',
    isInverted : true,
    startAt    : 0
  });


  try {
      // YOUR CODE GOES HERE
      /*
      mag = new five.Magnetometer();
    
      mag.on("headingchange", function() {
        console.log("heading", Math.floor(this.heading));
        console.log("bearing", this.bearing);
      });
      */
      //lowerMarker();
      
      //for(var i = 0; i < 10; ++i) {
          drive(0,0, 3000)
          drive(50,50, 3000)
          drive(100,100, 3000)
          //drive(100,100,1500);
          //raiseMarker();
          //drive(-100,100,1633);
          //lowerMarker();
      //}
  } finally {
    stop();
  } 

});



