var PModel = {
  mazeArray: [
    ["1HHHHHHHHHHHH21HHHHHHHHHHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["VOV  VoV   VoVVoV   VoV  VOV"],
    ["Vo3HH4o3HHH4o34o3HHH4o3HH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["Vo1HH2o12o1HHHHHH2o12o1HH2oV"],
    ["Vo3HH4oVVo3HH21HH4oVVo3HH4oV"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["3HHHH2oV3HH2 VV 1HH4Vo1HHHH4"],
    ["     VoV1HH4 34 3HH2VoV     "],
    ["     VoVV          VVoV     "],
    ["     VoVV 1HHZZHH2 VVoV     "],
    ["3HHHH4o34 V      V 34o3HHHH4"],
    ["      o   V      V   o      "],
    ["1HHHH2o12 V      V 12o1HHHH2"],
    ["     VoVV 3HHHHHH4 VVoV     "],
    ["     VoVV          VVoV     "],
    ["     VoVV 1HHHHHH2 VVoV     "],
    ["1HHHH4o34 3HH21HH4 34o3HHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["Vo3HH4o3HHH4o34o3HHH4oV1H4oV"],
    ["VOoo12oooooooP oooooooVVooOV"],
    ["3H2oVVo12o1HHHHHH2o12oVVo1H4"],
    ["1H4o34oVVo3HH21HH4oVVo34o3H2"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["Vo1HHHH43HH2oVVo1HH43HHHH2oV"],
    ["Vo3HHHHHHHH4o34o3HHHHHHHH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["3HHHHHHHHHHHHHHHHHHHHHHHHHH4"],
  ],
};

var Pacman = {

};

var PView = {
  model: null,
  cellSize: 0,
  mainDiv: null,
  cells: null,
  init: function (model, cellSize, mainDiv) {
    this.model = model;
    this.mainDiv = mainDiv;
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
        if (model.mazeArray[r][c] === "P") {
          Pacman.x = c;
          Pacman.y = r;
          Pacman.angle = '0';
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
        if(this.model.mazeArray[r][c]==='P'){
          this.cells[r][c].setAttribute("angle", Pacman.angle);
        }
      }
    }
  },
};

var PController = {
  model: null,
  view: null,
  tik: 500,
  init: function () {
    this.model = PModel;
    // this.model.init(20, 40);
    this.view = PView;
    this.view.init(this.model, 25, document.all("main"));

    this.view.draw();
    this.wait(this.tik, this.oneTik, this, this.view);
  },
  oneTik: function () {
    PController.moveNext();
    //next tik
    PController.wait(PController.tik, PController.oneTik, PController, PController.view);
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
      //case 32: //space
        //this.drop();
        //break;
      //case 27: //escape
        //this.pause();
        //break;
      //case 90:
      //case 122: //z or Z
        //this.rotateLeft();
        //break;
    }
  },

  moveNext : function () {
    switch(Pacman.angle){
      case '270':
        this.moveP(Pacman.y-1,Pacman.x, Pacman.angle);
        break; 
      case '0':
        this.moveP(Pacman.y,Pacman.x+1,Pacman.angle);
        break; 
      case '90':
        this.moveP(Pacman.y+1,Pacman.x, Pacman.angle);
        break; 
      case '180':
        this.moveP(Pacman.y,Pacman.x-1, Pacman.angle);
        break;
    }
    this.view.draw();
  },
  moveP : function (r, c, angle) {
    if(this.checkifEmpty(r,c)){
      this.model.mazeArray[Pacman.y][Pacman.x]=' ';
      Pacman.y = r;
      Pacman.x = c;
      this.model.mazeArray[Pacman.y][Pacman.x]='P';
      Pacman.angle = angle;
      this.view.draw();
      return true;

    }
  },

  moveDown: function () {
    this.moveP(Pacman.y+1,Pacman.x, '90');
  },
  moveLeft: function () {
    this.moveP(Pacman.y,Pacman.x-1, '180');
  },
  moveRight: function () {
    this.moveP(Pacman.y,Pacman.x+1, '0')
  },
  moveUp: function () {
    this.moveP(Pacman.y-1,Pacman.x, '270')
  },
  
  drop: function () {
    this.f.drop();
    this.model.removeFullLines();
    this.view.draw();
    this.f = this.model.createFigure();
    this.view.draw();
  },
  pause: function () {},

  checkifEmpty: function (r,c) {
    if(r<0||r>=this.model.mazeArray.length)return false;
    if(c<0||c>=this.model.mazeArray[c].length)return false;
    switch(this.model.mazeArray[r][c]){
      case 'o':case ' ':  return true;
    }
    return false;
  }
};


/*

    ["1HHHHHHHHHHHH21HHHHHHHHHHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["VOV  VoV   VoVVoV   VoV  VOV"],
    ["Vo3HH4o3HHH4o34o3HHH4o3HH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["Vo1HH2o12o1HHHHHH2o12o1HH2oV"],
    ["Vo3HH4oVVo3HH21HH4oVVo3HH4oV"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["3HHHH2oV3HH2 VV 1HH4Vo1HHHH4"],
    ["     VoV1HH4 34 3HH2VoV     "],
    ["     VoVV          VVoV     "],
    ["     VoVV 1HHZZHH2 VVoV     "],
    ["LHHHH4o34 V      V 34o3HHHHR"],
    ["      o   V      V   o      "],
    ["LHHHH2o12 V      V 12o1HHHHR"],
    ["     VoVV 3HHHHHH4 VVoV     "],
    ["     VoVV          VVoV     "],
    ["     VoVV 1HHHHHH2 VVoV     "],
    ["1HHHH4o34 3HH21HH4 34o3HHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2o1HHH2oVVo1HHH2o1HH2oV"],
    ["Vo3HH4o3HHH4o34o3HHH4oV1H4oV"],
    ["VOoo12oooooooP oooooooVVooOV"],
    ["3H2oVVo12o1HHHHHH2o12oVVo1H4"],
    ["1H4o34oVVo3HH21HH4oVVo34o3H2"],
    ["VooooooVVooooVVooooVVooooooV"],
    ["Vo1HHHH43HH2oVVo1HH43HHHH2oV"],
    ["Vo3HHHHHHHH4o34o3HHHHHHHH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["3HHHHHHHHHHHHHHHHHHHHHHHHHH4"],
  ],
*/