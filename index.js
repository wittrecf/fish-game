var height = $('#tunnel').height() / 2;
var pressed = false;
var acceleration = .05;
var velocity = 0;
var maxVel = 2;
var obsVel = 1;
var score = 0;
var paused = true;
var gameTime = 0;
var speed = 1;
var dead = false;
var hasGateSpawned = false;
var tmp1;
var tmp2;
var gateColors = ["rgba(250, 128, 114, 0.5)", "rgba(255, 105, 180, 0.5)", "rgba(0, 0, 0, 0.5)", "rgba(255, 255, 0, 0.5)", "rgba(0, 0, 255, 0.5)", "rgba(255, 128, 0, 0.5)", "rgba(102, 0, 102, 0.5)", "rgba(255, 0, 0, 0.5)", "rgba(0, 255, 0, 0.5)"];

checkCollisions = function() {
  var obstacles = $('.obs');
  var rect1 = $('#obj')[0].getBoundingClientRect();
  var rect2;
  for (var i = 0; i < obstacles.length; i++) {
    rect2 = obstacles[i].getBoundingClientRect();
    if (!(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom)) {
      dead = true;
      paused = true;
      $('#title').html("Game over").css("display", "block");
      $('#subtitle').html("Score: " + score).css("display", "block");
      $('#controls').html("Press 'p' to restart").css("display", "block");
      $('#obj').css("display", "none");
      $('#score').css("display", "none");
      $('#pause').css("display", "none");
      $('.obs').remove();
      $('.gate').remove();
    }
  }
}

spawn = function() {
  var barchange = (Math.random()*$('#obj').height()*4) - ($('#obj').height()*2);
  if ((tmp1 + barchange > $('#tunnel').height()/2) || (tmp2 - barchange > $('#tunnel').height()/2)) {
    barchange = -barchange/2;
  }
  tmp1 = tmp1 + barchange;
  tmp2 = tmp2 - barchange;
  $('#game').append($("<div></div>").css("top", 10).css("height", tmp1).css("left", $('#tunnel').width() - 20).css({ WebkitTransform: 'rotate(' + 180 + 'deg)'}).attr("class", "obs"));
  $('#game').append($("<div></div>").css("top", $('#tunnel').height() - tmp2 + 10).css("height", tmp2).css("left", $('#tunnel').width() - 20).attr("class", "obs"));
}

spawnGate = function(level) {
  $('#game').append($(`<div><span>L\ne\nv\ne\nl\n<b>${level - 1}</b></span></div>`).css("top", 10).css("height", $('#tunnel').height()).css("left", $('#tunnel').width() - 20).css("background-color", gateColors[(level) % gateColors.length]).css("font-size", "3em").css("text-align", "center").attr("class", "gate"));
}

move = function() {
  if (paused) {
    return;
  }
  if (score % Math.floor(1500/(25 - speed*1.5)) == 0) {
    if (score < (2000 * (speed - 1)) - (660 / speed)) {
      if (hasGateSpawned) {
        spawn();
      } else {
        spawnGate(speed);
        hasGateSpawned = true;
      }
    }
  }
  if (score % 2000 == 0) {
    speed++;
    hasGateSpawned = false;
  }
  if (pressed) {
    velocity += acceleration;
    velocity = velocity > maxVel ? maxVel : velocity;
    height += velocity;
  } else {
    velocity -= acceleration/2;
    velocity = velocity < -maxVel/2 ? -maxVel/2 : velocity;
    height += velocity;
  }
  if (height >= $('#tunnel').height() - $('#obj').height()) {
    height = $('#tunnel').height() - $('#obj').height();
    velocity = -velocity/4;
  } else if (height <= 0) {
    height = 0;
    velocity = -velocity/4;
  }
  height = Math.round(height * 100) / 100;
  velocity = Math.round(velocity * 100) / 100;
  $('#obj').css("margin-top", $('#tunnel').height() - $('#obj').height() - height);
  score++;
  $('#score').html(Math.floor(score));
  $('.obs').each(function( index ) {
    $(this).css("left", parseInt($(this).css("left"), 10) - obsVel*speed);
    if (parseInt($(this).css("left"), 10) + parseInt($(this).css("width"), 10) <= 0) {
      $(this).remove();
    }
  });
  $('.gate').each(function( index ) {
    $(this).css("left", parseInt($(this).css("left"), 10) - obsVel*speed);
    if (parseInt($(this).css("left"), 10) <= 0) {
      $(this).remove();
    }
  });
  checkCollisions();
}

function pause() {
  paused = !paused;
  if (paused) {
    $('#pause').text("Play");
    $('#pause').blur();
    $('#game').focus();
  } else {
    $('#pause').text("Pause");
    $('#pause').blur();
    $('#game').focus();
    if (dead) {
      score = 0;
      speed = 1;
      height = $('#tunnel').height() / 2;
      velocity = 0;
      dead = false;
    }
    if ($('#obj').css("display") == "none") {
      $('#obj').css("display", "block");
      $('#score').css("display", "block");
      $('#pause').css("display", "block");
      $('#title').css("display", "none");
      $('#subtitle').css("display", "none");
      $('#controls').css("display", "none");
      tmp1 = Math.random() * $('#tunnel').height()/2;
      tmp2 = $('#tunnel').height() - tmp1 - ($('#tunnel').height()*1/2);
    }
  }
}

$('#game').bind('keydown', function(event) {
    if (event.keyCode == "32" && !pressed) {
      pressed = true;
    }
});

$('#game').bind('keyup', function(event) {
    if (event.keyCode == "32") {
      pressed = false;
    } else if (event.keyCode == "80") {
      pause();
    }
});
  
$('#game').mousedown(function() {
    pressed = true;
});
  
$('#game').mouseup(function() {
    pressed = false;
});

setInterval(move, 10);
$('#game').focus();