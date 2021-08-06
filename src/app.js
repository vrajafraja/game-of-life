"use strict";

const LIFE_TEMPLATES = {
  singleCell: [[0, 0]],
  block: [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
  beeHive: [
    [1, 0],
    [2, 0],
    [0, 1],
    [3, 1],
    [1, 2],
    [2, 2],
  ],
  loaf: [
    [1, 0],
    [2, 0],
    [0, 1],
    [3, 1],
    [1, 2],
    [3, 2],
    [2, 3],
  ],
  boat: [
    [0, 0],
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ],
  tub: [
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ],
  blinker: [
    [0, 0],
    [1, 0],
    [2, 0],
  ],
  toad: [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  pulsar: [
    [2, 0],
    [3, 0],
    [4, 0],
    [8, 0],
    [9, 0],
    [10, 0],
    [0, 2],
    [5, 2],
    [7, 2],
    [12, 2],
    [0, 3],
    [5, 3],
    [7, 3],
    [12, 3],
    [0, 4],
    [5, 4],
    [7, 4],
    [12, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [8, 5],
    [9, 5],
    [10, 5],
    [2, 7],
    [3, 7],
    [4, 7],
    [8, 7],
    [9, 7],
    [10, 7],
    [0, 8],
    [5, 8],
    [7, 8],
    [12, 8],
    [0, 9],
    [5, 9],
    [7, 9],
    [12, 9],
    [0, 10],
    [5, 10],
    [7, 10],
    [12, 10],
    [2, 12],
    [3, 12],
    [4, 12],
    [8, 12],
    [9, 12],
    [10, 12],
  ],
  pentaDecathlon: [
    [1, 0],
    [2, 0],
    [3, 0],
    [0, 1],
    [4, 1],
    [0, 2],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [1, 8],
    [2, 8],
    [3, 8],
    [0, 9],
    [4, 9],
    [0, 10],
    [4, 10],
    [1, 11],
    [2, 11],
    [3, 11],
  ],
  glider: [
    [1, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  LWSS: [
    [0, 0],
    [3, 0],
    [4, 1],
    [0, 2],
    [4, 2],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
  ],
  MWSS: [
    [2, 0],
    [0, 1],
    [4, 1],
    [5, 2],
    [0, 3],
    [5, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
  ],
  HWSS: [
    [2, 0],
    [3, 0],
    [0, 1],
    [5, 1],
    [6, 2],
    [0, 3],
    [6, 3],
    [1, 4],
    [2, 4],
    [3, 4],
    [4, 4],
    [5, 4],
    [6, 4],
  ],
  pentomino: [
    [1, 0],
    [2, 0],
    [0, 1],
    [1, 1],
    [1, 2],
  ],
  diehard: [
    [6, 0],
    [0, 1],
    [1, 1],
    [1, 2],
    [5, 2],
    [6, 2],
    [7, 2],
  ],
  acorn: [
    [1, 0],
    [3, 1],
    [0, 2],
    [1, 2],
    [4, 2],
    [5, 2],
    [6, 2],
  ],
  gosper: [
    [3, 0],
    [4, 0],
    [3, 1],
    [4, 1],
    [2, 10],
    [3, 10],
    [4, 10],
    [1, 11],
    [5, 11],
    [0, 12],
    [6, 12],
    [0, 13],
    [6, 13],
    [3, 14],
    [1, 15],
    [5, 15],
    [2, 16],
    [3, 16],
    [4, 16],
    [3, 17],
    [4, 20],
    [5, 20],
    [6, 20],
    [4, 21],
    [5, 21],
    [6, 21],
    [3, 22],
    [7, 22],
    [2, 24],
    [3, 24],
    [7, 24],
    [8, 24],
    [5, 34],
    [6, 34],
    [5, 35],
    [6, 35],
  ],
};

let secondsInGame = 0;
let oldTimeStamp = 0;
let blobsCreated = 0;
let generations = 0;
let liveCells = 0;

var canvas;
var context;
var mousePosition;

var speed = 0;
var size = 10;
var paused = true;
var showGrid = true;

let blobArray = [];
let newLife = [];

let desk;

let _lastSpawn = 0;

function closeModal(target) {
  target.remove();
}

function onPauseClick(event) {
  paused = !paused;
  if (paused) {
    event.innerText = "Resume";
  } else {
    event.innerText = "Pause";
  }
}

function onClearClick(event) {
  generations = 0;
  liveCells = 0;
  blobArray = [];
  desk = [...Array(canvas.width)].map((x) => Array(canvas.height).fill(false));
}

function onSpeedChange(value) {
  speed = 0.5 - value;
}

function toggleGrid(event) {
  showGrid = !showGrid;
}

function addLife(value) {
  if (value) {
    newLife = [];
    for (let point of LIFE_TEMPLATES[value]) {
      newLife.push(
        new Blob({
          positionX: point[0] * size,
          positionY: point[1] * size,
          size,
          color: "red",
        })
      );
    }
  } else newLife = [];
}

dragElement(document.getElementById("menu"));

function dragElement(element) {
  if (!document.getElementById("menu")) {
    return window.setTimeout(
      () => dragElement(document.getElementById("menu")),
      100
    );
  }
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;
  if (document.getElementById("header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById("header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    element.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    element.style.top = element.offsetTop - pos2 + "px";
    element.style.left = element.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Listen to the onLoad event
window.onload = init;

// Trigger init function when the page has loaded
function init() {
  canvas = document.getElementById("viewport");
  context = canvas.getContext("2d");
  canvas.width =
    window.innerWidth - (window.innerWidth % (size * 2)) - size * 2;
  canvas.height = window.innerHeight - (window.innerHeight % (size * 2));
  desk = [...Array(canvas.width)].map((x) => Array(canvas.height).fill(false));

  // Request an animation frame for the first time
  // The gameLoop() function will be called as a callback of this request
  window.requestAnimationFrame(gameLoop);

  let background = document.getElementById("background");
  canvas.addEventListener("mouseup", mouseUp, false);
  canvas.addEventListener("mousemove", mouseMove, false);
  background.addEventListener("click", (event) => {
    if (event.target.id === "background") {
      closeModal(event.target);
    }
    event.stopPropagation();
  });
  document.getElementById("closeModal").addEventListener("click", (event) => {
    if (event.target.id === "closeModal") {
      closeModal(background);
    }
    event.stopPropagation();
  });

  addLife("singleCell");
}

function mouseUp(event) {
  let positionX = event.layerX - (event.layerX % size);
  positionX += size / 2;
  let positionY = event.layerY - (event.layerY % size);
  positionY += size / 2;
  if (!desk[positionX][positionY]) {
    if (newLife.length) {
      newLife.forEach((blob) => {
        blob = new Blob({
          positionX: blob._positionX + positionX,
          positionY: blob._positionY + positionY,
          size,
        });
        desk[blob._positionX][blob._positionY] = blob;
        blobArray.push(blob);
        liveCells++;
      });
    } else {
      let blob = new Blob({ positionX, positionY, size });
      desk[positionX][positionY] = blob;
      blobArray.push(blob);
      liveCells++;
    }
  } else {
    desk[positionX][positionY].destroy();
    desk[positionX][positionY] = false;
    filterDestroyed();
  }
}

function filterDestroyed() {
  blobArray.map((blob) => blob.update());
  blobArray = blobArray.filter((blob) => {
    return !blob.isDestroyed();
  });
}

function mouseMove(event) {
  let positionX = event.layerX - (event.layerX % size);
  positionX += size / 2;
  let positionY = event.layerY - (event.layerY % size);
  positionY += size / 2;
  mousePosition = { positionX, positionY };
}

function gameLoop(timeStamp) {
  // Calculate how much time has passed
  var secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Update game objects
  update(secondsPassed);

  // Perform the drawing operation
  draw();

  window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
  if (!paused) {
    secondsInGame += secondsPassed;
    if (secondsInGame - _lastSpawn > speed) {
      _lastSpawn = secondsInGame;
      generations++;
      for (let x = size / 2; x < canvas.width; x += size) {
        for (let y = size / 2; y < canvas.height; y += size) {
          let tile = desk[x][y];
          let neighbours = getNeighbours(x, y, size);
          if (tile) {
            if (neighbours < 2 || neighbours > 3) {
              tile.destroy();
            }
          } else if (!tile && neighbours === 3) {
            tile = new Blob({
              positionX: x,
              positionY: y,
              size: size,
              shouldBeBorn: true,
            });
            blobArray.push(tile);
          }
        }
      }
    }
    filterDestroyed();
  }
}

function draw() {
  // Clear the canvas, draw new generations and display new life which will be placed on mouseup event
  document.getElementById("generations").innerText = generations;
  document.getElementById("liveCells").innerText = liveCells;
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (showGrid) {
    drawGrid();
  }
  blobArray.forEach((blob) => blob.draw());
  newLife.forEach((blob) => blob.draw(mousePosition));
}

function drawGrid() {
  for (var x = 0; x <= canvas.width; x += size) {
    context.moveTo(0.5 + x + size, 0);
    context.lineTo(0.5 + x + size, canvas.height);
  }

  for (var y = 0; y <= canvas.height; y += size) {
    context.moveTo(0, 0.5 + y + size);
    context.lineTo(canvas.width, 0.5 + y + size);
  }

  context.strokeStyle = "black";
  context.stroke();
}

function getNeighbours(positionX, positionY, size) {
  let neighbours = 0;
  if (
    positionX - size < 0 ||
    (positionX - size > 0 &&
      desk[positionX - size][positionY] &&
      !desk[positionX - size][positionY].shouldBeBorn())
  ) {
    neighbours++;
  }
  if (
    positionX + size >= canvas.width ||
    (positionX + size < canvas.width &&
      desk[positionX + size][positionY] &&
      !desk[positionX + size][positionY].shouldBeBorn())
  ) {
    neighbours++;
  }
  if (
    positionY - size <= 0 ||
    (positionY - size > 0 &&
      desk[positionX][positionY - size] &&
      !desk[positionX][positionY - size].shouldBeBorn())
  ) {
    neighbours++;
  }
  if (
    positionY + size >= canvas.height ||
    (positionY + size < canvas.height &&
      desk[positionX][positionY + size] &&
      !desk[positionX][positionY + size].shouldBeBorn())
  ) {
    neighbours++;
  }
  if (
    positionX - size > 0 &&
    positionY + size < canvas.height &&
    desk[positionX - size][positionY + size] &&
    !desk[positionX - size][positionY + size].shouldBeBorn()
  ) {
    neighbours++;
  }
  if (
    positionX + size < canvas.width &&
    positionY + size < canvas.height &&
    desk[positionX + size][positionY + size] &&
    !desk[positionX + size][positionY + size].shouldBeBorn()
  ) {
    neighbours++;
  }
  if (
    positionX - size > 0 &&
    positionY - size > 0 &&
    desk[positionX - size][positionY - size] &&
    !desk[positionX - size][positionY - size].shouldBeBorn()
  ) {
    neighbours++;
  }
  if (
    positionX + size < canvas.width &&
    positionY - size > 0 &&
    desk[positionX + size][positionY - size] &&
    !desk[positionX + size][positionY - size].shouldBeBorn()
  ) {
    neighbours++;
  }
  return neighbours;
}

class Blob {
  _id;
  _positionX;
  _positionY;
  _size;
  _color;
  _shouldBeDeleted;
  _shouldBeBorn;

  constructor({
    positionX = 0,
    positionY = 0,
    size = 10,
    color = "black",
    shouldBeBorn = false,
  }) {
    this._id = blobsCreated++;
    this._positionX = positionX;
    this._positionY = positionY;
    this._size = size;
    this._color = color;
    this._shouldBeDeleted = false;
    this._shouldBeBorn = shouldBeBorn;
    if (shouldBeBorn) {
      liveCells++;
    }
  }

  isDestroyed() {
    return this._isDestroyed;
  }

  shouldBeDeleted() {
    return this._shouldBeDeleted;
  }

  shouldBeBorn() {
    return this._shouldBeBorn;
  }

  destroy() {
    this._isDestroyed = true;
    liveCells--;
  }

  kill() {
    if (!this._shouldBeDeleted) {
      this._color = "red";
      this._shouldBeDeleted = true;
    } else {
      this.destroy();
    }
  }

  getPosition() {
    return { x: Math.round(this._positionX), y: Math.round(this._positionY) };
  }

  killOnBorder() {
    if (
      this._positionX === this._size / 2 ||
      this._positionY === this._size / 2 ||
      this._positionX === canvas.width - this._size / 2 ||
      this._positionY === canvas.height - this._size / 2
    ) {
      this.destroy();
    }
  }

  update() {
    this._shouldBeBorn = false;
    desk[this._positionX][this._positionY] = this;
    if (this._isDestroyed) {
      desk[this._positionX][this._positionY] = false;
    }
  }

  draw({ positionX, positionY } = { positionX: 0, positionY: 0 }) {
    context.beginPath();
    context.fillStyle = this._color;
    context.rect(
      this._positionX - this._size / 2 + positionX,
      this._positionY - this._size / 2 + positionY,
      this._size,
      this._size
    );
    context.fill();
  }
}
