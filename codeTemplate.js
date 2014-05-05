var five = require("johnny-five"),
    SerialPort = require("serialport").SerialPort,
    board, 
    servo;

board = new five.Board();

board.on("ready", function() {
  var leftServo,
      rightServo,
      queue,

      DriveAction,
      DriveQueue,

      createServo;

  DriveAction = function (directions) {
    this.leftSpeed = directions.leftSpeed;
    this.rightSpeed = directions.rightSpeed;
    
    this.turnLeftWheel();
    this.turnRightWheel();
  };
  DriveAction.prototype.turnLeftWheel = function () {
    var speed = this.leftSpeed,
        adjustedSpeed = (speed / 1000) + 0.01;

    leftServo.ccw(adjustedSpeed);
  };
  DriveAction.prototype.turnRightWheel = function () {
    var speed = this.rightSpeed,
        adjustedSpeed = (speed / 1000) - 0.06;

    rightServo.cw(adjustedSpeed);
  };
  
  DriveQueue = function () {
    this.tasks = [];
  };
  DriveQueue.prototype.add = function (task) {
    this.tasks.push( function (callback) {
        var taskMessage;
        new DriveAction(task.directions);
        if (callback) {
          taskMessage = '{ left: ' + task.directions.leftSpeed;
          taskMessage += ', right: ' + task.directions.rightSpeed;
          taskMessage += ', duration: ' + task.durationInSeconds + ' }';
          console.log(taskMessage);
          setTimeout( function () {
            callback();
          }, task.durationInSeconds * 1000);
        }
    });
  };
  DriveQueue.prototype.run = function () {
    var self = this,
        task;

    (function next() {
          if(self.tasks.length > 0) {
              task = self.tasks.shift();
              task.apply(self, [next].concat(Array.prototype.slice.call(arguments, 0)));
          }
          else {
            self.end();
          }
    })();
  };
  DriveQueue.prototype.end = function () {
    new DriveAction({
        leftSpeed: 0,
        rightSpeed: 0
    });
    setTimeout( function () {
      process.exit(0);
    }, 300);
  };
  
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

  queue = new DriveQueue();

  // Add driving directions to the driving queue
  queue.add({
    directions : {
      leftSpeed  : 100,
      rightSpeed : -100
    },
    durationInSeconds : 2
  });
  
  // Start the driving queue
  queue.run();
});
