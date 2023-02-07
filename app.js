var PModel = {
  mazeArray: [
    ["1HHHHHHHHHHHH21HHHHHHHHHHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["VoV  VoV   VoVVoV   VoV  VoV"],
    ["Vo3HH4o3HHH4o34o3HHH4o3HH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["Vo1HH2o12o1HHHHHH2o12o1HH2oV"],
    ["Vo3HH4oVVo3HH21HH4oVVo3HH4oV"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["3HHHH2oV3HH2 VV 1HH4Vo1HHHH4"],
    ["     VoV1HH4 34 3HH2VoV     "],
    ["     VoVV    5     VVoV     "],
    ["     VoVV 1HHZZHH2 VVoV     "],
    ["3HHHH4o34 V      V 34o3HHHH4"],
    ["      o   V6  7 8V   o      "],
    ["1HHHH2o12 V      V 12o1HHHH2"],
    ["     VoVV 3HHZZHH4 VVoV     "],
    ["     VoVV          VVoV     "],
    ["     VoVV 1HHHHHH2 VVoV     "],
    ["1HHHH4o34 3HH21HH4 34o3HHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["Vo3H2Vo3HHH4o34o3HHH4oV1H4oV"],
    ["VoooVVoooooooP oooooooVVoooV"],
    ["3H2oVVo12o1HHHHHH2o12oVVo1H4"],
    ["1H4o34oVVo3HH21HH4oVVo34o3H2"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["Vo1HHHH43HH2oVVo1HH43HHHH2oV"],
    ["Vo3HHHHHHHH4o34o3HHHHHHHH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["3HHHHHHHHHHHHHHHHHHHHHHHHHH4"],
  ],
  ghosts: [],
  score: 0,
};

function Ghost() {
  this.id;
  this.angle = "90";
  this.pastEl = " ";
}
Ghost.prototype = {
  angRandom: function () {
    const angles = ["0", "90", "180", "270"];

    const randomAng = Math.floor(Math.random() * 4);
    this.angle = angles[randomAng];
  },

  moveGhost: function () {
    let arr = [
      { a: "270", d: this.getDistance(this.y - 1, this.x) },
      { a: "0", d: this.getDistance(this.y, this.x + 1) },
      { a: "90", d: this.getDistance(this.y + 1, this.x) },
      { a: "180", d: this.getDistance(this.y, this.x - 1) },
    ];
    arr.sort(function (a, b) {
      return a.d - b.d;
    });
    this.angle = arr[0].a;

    switch (this.angle) {
      case "270":
        if (PController.checkifEmpty(this.y - 1, this.x, this.angle)) {
          this.moveG(this.y - 1, this.x, this.angle);
        }
        //this.moveG(this.y-1,this.x, this.angle);
        break;
      case "0":
        if (PController.checkifEmpty(this.y, this.x + 1, this.angle)) {
          this.moveG(this.y, this.x + 1, this.angle);
        }

        break;
      case "90":
        if (PController.checkifEmpty(this.y + 1, this.x, this.angle)) {
          this.moveG(this.y + 1, this.x, this.angle);
        }
        break;
      case "180":
        if (PController.checkifEmpty(this.y, this.x - 1, this.angle)) {
          this.moveG(this.y, this.x - 1, this.angle);
        }
        break;
    }
    PController.view.draw();
  },

  getDistance: function (r, c) {
    if (!PController.checkifEmpty(r, c, this.angle)) {
      return 100000;
    }
    return Math.pow(Pacman.y - r, 2) + Math.pow(Pacman.x - c, 2);
  },

  moveGhost1: function (arr) {
    arr.sort(function (a, b) {
      return a.d - b.d;
    });
    this.angle = arr[0].a;
    this.moveGhost();
  },

  moveG: function (r, c, angle) {
    if (PController.checkifEmpty(r, c)) {
      this.model.mazeArray[this.y][this.x] = this.pastEl;
      this.y = r;
      this.x = c;
      this.pastEl = this.model.mazeArray[this.y][this.x];
      this.model.mazeArray[this.y][this.x] = this.id;
      this.angle = angle;
      PController.view.draw();
      return true;
    } else {
      return;
    }
  },
};

var Pacman = {};

var PView = {
  model: null,
  cellSize: 0,
  mainDiv: null,
  cells: null,
  init: function (model, cellSize, mainDiv) {
    this.model = model;
    this.mainDiv = mainDiv;
    for (let i = 0; i < 4; i++) {
      model.ghosts[i] = new Ghost();
      model.ghosts[i].model = model;
    }
    this.playerScorePara = document.getElementById("score");
    model.ghosts[0].id = 5;
    model.ghosts[1].id = 6;
    model.ghosts[2].id = 7;
    model.ghosts[3].id = 8;
    var s = "",
      row;
    this.cells = [];
    for (let r = 0, rows = model.mazeArray.length; r < rows; r++) {
      row = [];
      model.mazeArray[r] = model.mazeArray[r][0].split("");
      if (r === 0) {
        this.model.h = rows;
        this.model.w = model.mazeArray[r].length;
      }
      for (let c = 0, cols = model.mazeArray[r].length; c < cols; c++) {
        row.push(null);
        let x = model.mazeArray[r][c];
        if (x === "P") {
          Pacman.x = c;
          Pacman.y = r;
          Pacman.angle = "0";
        } else if (x >= "5" && x <= "8") {
          // let f=parseInt(x);
          model.ghosts[x - 5].x = c;
          model.ghosts[x - 5].y = r;
        }
        s +=
          '<DIV id="' +
          r +
          "_" +
          c +
          '" style="position:absolute;top:' +
          r * cellSize +
          "px;left:" +
          c * cellSize +
          "px;width:" +
          cellSize +
          "px;height:" +
          cellSize +
          'px"></DIV>';
      }
      this.cells.push(row);
    }
    mainDiv.innerHTML = s;
    var c = mainDiv.childNodes,
      b,
      x,
      y,
      k;
    for (let d = 0, len = c.length; d < len; d++) {
      b = c[d];
      k = b.id.indexOf("_");
      x = parseInt(b.id.substring(0, k));
      y = parseInt(b.id.substring(k + 1));
      this.cells[x][y] = b;
    }
  },
  draw: function () {
    for (let r = 0, rows = this.model.mazeArray.length; r < rows; r++) {
      for (let c = 0, cols = this.model.mazeArray[r].length; c < cols; c++) {
        this.cells[r][c].setAttribute("type", this.model.mazeArray[r][c]);
        if (this.model.mazeArray[r][c] === "P") {
          this.cells[r][c].setAttribute("angle", Pacman.angle);
        }
      }
    }
  },
};

var PController = {
  model: null,
  view: null,
  tik: 200,
  pauseInd: 0,
  init: function () {
    this.model = PModel;
    // this.model.init(20, 40);
    this.view = PView;
    this.view.init(this.model, 25, document.all("main"));

    this.view.draw();
    this.wait(this.tik, this.oneTik, this, this.view);
  },
  oneTik: function () {
    if (!this.pauseInd) {
      PController.moveNext();
      for (let i = 0; i < 4; i++) {
        this.model.ghosts[i].moveGhost();
      }
    }
    //next tik
    PController.wait(
      PController.tik,
      PController.oneTik,
      PController,
      PController.view
    );
  },
  wait: function (milliseconds, foo, ctx, view) {
    setTimeout(function () {
      foo.call(ctx); // will be executed after the specified time
      view.draw();
    }, milliseconds);
  },

  keyDown: function (e) {
    switch (e.keyCode) {
      case 40:
        this.moveDown();
        break;
      case 37: //left arrow
        this.moveLeft();
        break;
      case 39: //right arrow
        this.moveRight();
        break;
      case 38: //up arrow
        this.moveUp();
        break;
      case 27: //escape
        this.pause();
        break;
    }
  },

  moveNext: function () {
    switch (Pacman.angle) {
      case "270":
        this.moveP(Pacman.y - 1, Pacman.x, Pacman.angle);
        break;
      case "0":
        this.moveP(Pacman.y, Pacman.x + 1, Pacman.angle);
        break;
      case "90":
        this.moveP(Pacman.y + 1, Pacman.x, Pacman.angle);
        break;
      case "180":
        this.moveP(Pacman.y, Pacman.x - 1, Pacman.angle);
        break;
    }
    this.view.draw();
  },
  moveP: function (r, c, angle) {
    if (PController.pauseInd == 0) {
      if (this.checkifEmpty(r, c)) {
        if (this.model.mazeArray[r][c] === "o") {
          updateScore();
        }
        this.model.mazeArray[Pacman.y][Pacman.x] = " ";
        Pacman.y = r;
        Pacman.x = c;
        this.model.mazeArray[Pacman.y][Pacman.x] = "P";
        Pacman.angle = angle;
        this.view.draw();
        return true;
      }
    }
  },

  moveDown: function () {
    if (this.checkifFacing("90")) {
      this.moveP(Pacman.y + 1, Pacman.x, "90");
    }
  },
  moveLeft: function () {
    if (this.checkifFacing("180")) {
      this.moveP(Pacman.y, Pacman.x - 1, "180");
    }
  },
  moveRight: function () {
    if (this.checkifFacing("0")) {
      this.moveP(Pacman.y, Pacman.x + 1, "0");
    }
  },
  moveUp: function () {
    if (this.checkifFacing("270")) {
      this.moveP(Pacman.y - 1, Pacman.x, "270");
    }
  },

  drop: function () {
    this.f.drop();
    this.model.removeFullLines();
    this.view.draw();
    this.f = this.model.createFigure();
    this.view.draw();
  },

  checkifFacing: function (angle) {
    if (Pacman.angle != angle) {
      return true;
    }
    return false;
  },

  checkifEmpty: function (r, c) {
    if (r < 0 || r >= this.model.mazeArray.length) return false;
    if (c < 0 || c >= this.model.mazeArray[c].length) return false;
    switch (this.model.mazeArray[r][c]) {
      case "o":
      case " ":
      case "Z":
        return true;
    }
    return false;
  },
  pause: function () {
    if (PController.pauseInd) {
      PController.pauseInd = 0;
      this.tik = 200;
      PView.mainDiv.style.opacity = 1;
      PController.view.playerScorePara.style.opacity = 1;
    } else {
      PController.pauseInd = 1;
      PView.mainDiv.style.opacity = 0.1;
      PController.view.playerScorePara.style.opacity = 0.3;
    }
  },
};

function updateScore() {
  PController.model.score += 10;
  PController.view.playerScorePara.innerHTML = `Score   ${PController.model.score}`;
}
