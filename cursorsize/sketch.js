window.addEventListener("load", eventWindowLoaded, false);
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let cursors = new Array(10); //0:リアルカーソル, 0以外: ダミーカーソル
let windowLeft = 0;
let movementX = 0;
let movementY = 0;
let cursorSize = [1, 10, 50, 189, 377, 566, 754, 1080];
let cursorSizeIndex = 1;

function eventWindowLoaded() {
  setup();
  draw();
}

function canvasLoop(e) {
  movementX = e.movementX || e.mozMovementX || 0;
  movementY = e.movementY || e.mozMovementY || 0;
  draw();
}

function setup() {
  vel = 0.99;
  canvas.width = window.outerWidth * vel;
  canvas.height = window.outerHeight * (vel - 0.08);
  windowLeft = ((canvas.width - canvas.height) * vel) / 2;
  initCursors();
}

function draw() {
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


  cursors.forEach(function (cursor) {
    cursor.update(movementX, movementY);
    cursor.checkEdges();
    cursor.display(ctx);
  });


  ctx.fillStyle = "black";
  // ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  ctx.fillRect(0, 0, windowLeft, canvas.clientHeight);
  ctx.fillRect(
    canvas.width - windowLeft,
    0,
    canvas.clientWidth,
    canvas.clientHeight
  );
  ctx.fill();

  ctx.font = "18px NotoSans";
  ctx.fillStyle = "white";
  ctx.fillText("キーボード操作", 10, 50);
  ctx.fillText("r:リセット", 10, 80);
  ctx.fillText("s:自身のカーソルを表示", 10, 110);
  ctx.fillText("1~" + String(cursorSize.length) + ":カーソルの大きさを変更", 10, 140);
  ctx.fillText("※実際の実験環境とは異なります", 10, canvas.height - 200);
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
    c.size = cursorSize[cursorSizeIndex] * 2;

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
  draw();
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
document.addEventListener("fullscreenchange", draw, false);
document.addEventListener("webkitfullscreenchange", draw, false);
document.addEventListener("mozfullscreenchange", draw, false);


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
    }

    //リアルカーソルだけ赤くする
    if (keyName === "s") {
      cursors[0].showCursor = true;
    }


    for (let i = 0; i < cursorSize.length; i++) {
      if (keyName === String(i + 1)) {
        cursorSizeIndex = i;
        cursors.forEach(function (cursor) {
          cursor.size = cursorSize[cursorSizeIndex] * 2;
        });
      }
    }

    draw();
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
