const Command = require('../command.js');
const Message = require('../message.js');
const Rover = require('../rover.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  it('constructor sets position and default values for mode and generatorWatts', function(){
    let rover = new Rover(98382)
    expect (rover.generatorWatts).toEqual(110)
    expect (rover.mode).toEqual("NORMAL")
  })
  it("response returned by receiveMessage contains name of message", function(){
    let commands = [new Command("MODE_CHANGE")]
    let rover = new Rover(2)
    let message = new Message("Alert")
    let results = rover.receiveMessage(message)
    expect (results.message).toEqual("Alert")
  })
  it("response returned by receiveMessage includes two results if two commands are sent in the message", function(){
    let rover = new Rover(3)
    let commands = [new Command("MODE_CHANGE", "LOW_POWER")]
    let message = new Message('Two commands, Alert',commands)
    let response = rover.receiveMessage(message)
    expect (response.results.length).toEqual(commands.length)
  })
  it("responses correctly to status check command", function(){
    let rover = new Rover(4)
    let commands = [new Command("STATUS_CHECK")]
    let message = new Message ("Status okay", commands)
    let real = rover.receiveMessage(message).results[0]
    let ready = {
      completed: true, 
      roverStatus: {
        position: 4,
        mode: "NORMAL",
        generatorWatts: 110
    }
    }
    expect(real).toEqual(ready)
  })  
  it("responds correctly to mode change command", function(){
    let rover = new Rover(5)
    let commands = [new Command
    ("MODE_CHANGE", "LOW_POWER")]
    let message = new Message("Mode change", commands)
    let response = rover.receiveMessage(message)
    expect (rover.mode).toEqual("LOW_POWER")
    expect (response.results[0]).toEqual(({completed: true}))
  })
  it("responds with false completed value when attempting to move in LOW_POWER mode", function(){
  let rover = new Rover(6)
  let commands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 50)]
  let message = new Message ("Low power false", commands)
  let response = rover.receiveMessage(message)
  expect (rover.position).toEqual(6)
  expect(rover.mode).toEqual("LOW_POWER")
  expect (response.results[1]).toEqual(({completed: false}))
  expect (response.results[0]).toEqual(({completed: true}))
})
  it("responds with position for move command", function(){
    let rover = new Rover(7)
    let commands = [new Command("MOVE", 40)]
    let message = new Message ("Position", commands)
    rover.receiveMessage(message)
    expect(rover.position).toEqual(40)
  })
});
