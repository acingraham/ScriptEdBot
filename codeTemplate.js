var five = require("johnny-five"),
    SerialPort = require("serialport").SerialPort,
    board = new five.Board();

board.on("ready", function() {
    var leftServo,
        rightServo,
        createServo,
        time = 0;
      
      
    function drive(left, right, duration) {
        
        var adjustedLeft = (left / 1000).toFixed(3),
            adjustedRight = (right / 1000).toFixed(3);
        
        setTimeout(function() {
            leftServo.ccw(adjustedLeft);
            rightServo.cw(adjustedRight);
        }, time);
    
        time += duration;
    }
  
    function stop() {
        drive(0,0,0);
        setTimeout(function() {
            process.exit(0);
        }, time+100);
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

    // YOUR CODE GOES HERE
    
    // Here's some example code to get you started
    
    // This will make both wheels drive forward at 100% speed for 2 seconds
    drive(100, 100, 2000);
    
    // This will make the left wheel go backwards at 100% speed while the right wheel goes forwards at 100% for 2 seconds
    drive(-100, 100, 2000);
    
    // This will make both wheels drive backward at 50% speed for half of 1 second
    drive(-50, -50, 500);
    
    // This is important!  Leave this at the end of your program to make the robot stop running.
    stop();

});


