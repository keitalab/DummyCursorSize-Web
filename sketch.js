window.addEventListener("load", eventWindowLoaded, false);
let canvas = document.querySelector("canvas");
let ctx = canvas.getContext("2d");

let cursors = new Array(9); //0:リアルカーソル, 0以外: ダミーカーソル
let windowLeft = 0;
let movementX = 0;
let movementY = 0;
let cursorSize = [1, 10, 189, 377, 566, 754, 1080];

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

  for (let i = 0; i < cursors.length; i++) {
    let c = cursors[i];
    c.update(movementX, movementY);
    c.checkEdges();
    c.display(ctx);
  }

  ctx.font = "18px NotoSans";
  ctx.fillStyle = "white";
  ctx.fillText("キーボード操作", 10, 50);
  ctx.fillText("r:リセット", 10, 80);
  ctx.fillText("s:自身のカーソルを表示", 10, 110);

  ctx.fillText(
    "1~" + String(cursorSize.length) + ":カーソルの大きさを変更",
    10,
    140
  );

  ctx.fillText("※実際の実験環境とは異なります", 10, canvas.height - 200);
}

function initCursors() {
  for (let i = 0; i < cursors.length; i++) {
    let x = random(canvas.width);
    let y = random(canvas.height);
    let c = new Cursor(x, y);

    if (i == 0) {
      c.moveRad = degToRad(0);
    } else {
      c.moveRad = degToRad(45 + i * 30);
    }
    c.id = i;
    c.xMin = windowLeft;
    c.xMax = canvas.width - windowLeft;
    c.yMin = 0;
    c.yMax = canvas.height;
    c.size = 10;

    cursors[i] = c;
  }
}

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
        cursors.forEach(function (cursor) {
          cursor.size = cursorSize[i];
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
