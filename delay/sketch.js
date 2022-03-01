window.addEventListener("load", eventWindowLoaded, false);
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let cursors = new Array(10); //0:リアルカーソル, 0以外: ダミーカーソル
let windowLeft = 0;
let delays = [0, 100, 200, 300, 400];
let delayIndex = 0;

function eventWindowLoaded() {
  setup();
  draw(0, 0);
}

function canvasLoop(e) {
  let movementX = e.movementX || e.mozMovementX || 0;
  let movementY = e.movementY || e.mozMovementY || 0;
  console.log(movementX, movementY);
  setTimeout(() => { draw(movementX, movementY) }, delays[delayIndex]);
}

function setup() {
  vel = 0.99;
  canvas.width = window.outerWidth * vel;
  canvas.height = window.outerHeight * (vel - 0.08);
  windowLeft = ((canvas.width - canvas.height) * vel) / 2;
  initCursors();
}

function draw(movementX, movementY) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.fillStyle = "white";
  ctx.fillRect(
    windowLeft,
    0,
    canvas.width - 2 * windowLeft,
    canvas.clientHeight
  );
  ctx.fill();

  if (!checkFullScreen()) {
    ctx.font = "36px NotoSans";
    ctx.fillStyle = "black";
    ctx.fillText("画面をダブルクリックしてください", canvas.clientWidth / 2 - 36 * 8, canvas.clientHeight / 2);
    ctx.fill();
    return;
  }
  // console.log(movementX, movementY);


  // ctx.fillStyle = "black";
  // ctx.arc(canvas.width / 2, canvas.height / 2, 50, 0, 2 * Math.PI, false);
  // ctx.fill();
  ctx.beginPath();
  cursors.forEach((cursor) => {
    cursor.update(movementX, movementY);
    cursor.checkEdges();
    cursor.display(ctx);
  });

  ctx.beginPath();


  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, windowLeft, canvas.clientHeight);
  ctx.fillRect(
    canvas.width - windowLeft,
    0,
    canvas.clientWidth,
    canvas.clientHeight
  );
  ctx.fill();

  ctx.font = "24px NotoSans";
  ctx.fillStyle = "white";
  ctx.fillText("キーボード操作方法", 10, 50);
  ctx.font = "18px NotoSans";
  ctx.fillText("r:リセット", 10, 80);
  ctx.fillText("s:自身のカーソルを表示", 10, 110);
  ctx.fillText("1~" + String(delays.length) + ":カーソル遅延を変更", 10, 140);
  ctx.fillText("※実際の実験環境とは異なります", 10, canvas.height - 200);
  ctx.font = "24px NotoSans";
  if (delayIndex == 0) {
    ctx.fillText("遅延なし", canvas.width - windowLeft + 10, 50);
  } else {
    ctx.fillText("遅延あり: " + String(delays[delayIndex]), canvas.width - windowLeft + 10, 50);
  }
  ctx.fill();

}

function initCursors() {
  for (let i = 0; i < cursors.length; i++) {
    let x = random(canvas.width);
    let y = random(canvas.height);
    let c = new Cursor(x, y);

    if (i == 0) {
      c.moveRad = degToRad(0);
    } else {
      c.moveRad = degToRad(45 + (i - 1) * 30);
    }

    c.xMin = windowLeft;
    c.xMax = canvas.width - windowLeft;
    c.yMin = 0;
    c.yMax = canvas.height;
    c.size = 50;

    c.checkEdges();

    console.log(c.location.x, c.location.y);

    cursors[i] = c;
  }
}

/*
 *fullScreen
 */

function fullscreen() {
  let el = document.getElementById('canvas');

  if (el.webkitRequestFullScreen) {
    el.webkitRequestFullScreen();
  }
  else {
    el.mozRequestFullScreen();
  }
  // draw(0, 0);
}

canvas.addEventListener("click", fullscreen)

function checkFullScreen() {

  var fullscreen_flag = false;
  if (document.fullscreenElement || document.mozFullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
    fullscreen_flag = true;
  }
  return fullscreen_flag;
}

//フルスクリーンの開始と解除時に発動
document.addEventListener("fullscreenchange", () => { draw(0, 0) }, false);
document.addEventListener("webkitfullscreenchange", () => { draw(0, 0) }, false);
document.addEventListener("mozfullscreenchange", () => { draw(0, 0) }, false);


/*
 *キーボード操作
 */
document.addEventListener(
  "keydown",
  (event) => {
    const keyName = event.key;

    //カーソルリセット
    if (keyName === "r") {
      initCursors();
      draw(0, 0);
    }

    //リアルカーソルだけ赤くする
    if (keyName === "s") {
      cursors[0].showCursor = true;
      draw(0, 0);
    }


    for (let i = 0; i < delays.length; i++) {
      if (keyName === String(i + 1)) {
        delayIndex = i;
      }
    }
  },
  false
);

/*
 *カーソル固定
 */
canvas.requestPointerLock =
  canvas.requestPointerLock || canvas.mozRequestPointerLock;
document.exitPointerLock =
  document.exitPointerLock || document.mozExitPointerLock;

canvas.onclick = function () {
  canvas.requestPointerLock();
};

document.addEventListener("pointerlockchange", lockChangeAlert, false);
document.addEventListener("mozpointerlockchange", lockChangeAlert, false);

function lockChangeAlert() {
  if (
    document.pointerLockElement === canvas ||
    document.mozPointerLockElement === canvas
  ) {
    console.log("The pointer lock status is now locked");
    document.addEventListener("mousemove", canvasLoop, false);
  } else {
    console.log("The pointer lock status is now unlocked");
    document.removeEventListener("mousemove", canvasLoop, false);
  }
}

/*
 *数式関係
 */

function degToRad(degrees) {
  let result = (Math.PI / 180) * degrees;
  return result;
}

function random(max) {
  return Math.floor(Math.random() * max);
}
