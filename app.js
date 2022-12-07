var PModel = {
  mazeArray: [
    ["1HHHHHHHHHHHHTTHHHHHHHHHHHH2"],
    ["VooooooooooooVVooooooooooooV"],
    ["Vo1HH2oXXXXXoVVo1HHH2o1HH2oV"],
    ["VOV  VoXXXXXoVVoV   VoV  VOV"],
    ["Vo3HH4oXXXXXo34o3HHH4o3HH4oV"],
    ["VooooooooooooooooooooooooooV"],
    ["Vo1HH2oXXoXXXXXXXXoXXoXXXXoV"],
    ["Vo3HH4oXXoXXXXXXXXoXXoXXXXoV"],
    ["VooooooXXooooXXooooXXooooooV"],
    ["LHHHH2oXXXXX XX XXXXXoXXXXXV"],
    ["V    VoXXXXX XX XXXXXoXXXXXV"],
    ["V    VoXX          XXoXXXXXV"],
    ["V    VoXX 1HHHHHH2 XXoXXXXXV"],
    ["3HHHH4oXX V      V XXo3HHHH4"],
    ["      o   V      V   o      "],
    ["1HHHH2oXX V      V 12o1HHHH2"],
    ["VXXXXVoXX 3HHHHHH4 VVoV    V"],
    ["VXXXXXoXX          VVoV    V"],
    ["VXXXXXoXX XXXXXXXX VVoV    V"],
    ["VXXXXXoXX XXXXXXXX 34o3HHHHV"],
    ["VooooooooooooXXooooooooooooV"],
    ["VoXXXXoXXXXXoXXoXXXXXoXXXXoV"],
    ["VoXXXXoXXXXXoXXoXXXXXoXXXXoV"],
    ["VOooXXoooooooP oooooooXXooOV"],
    ["VXXoXXoXXoXXXXXXXXoXXoXXoXXV"],
    ["VXXoXXoXXoXXXXXXXXoXXoXXoXXV"],
    ["VooooooXXooooXXooooXXooooooV"],
    ["VoXXXXXXXXXXoXXoXXXXXXXXXXoV"],
    ["VoXXXXXXXXXXoXXoXXXXXXXXXXoV"],
    ["VooooooooooooooooooooooooooV"],
    ["3HHHHHHHHHHHHHHHHHHHHHHHHHH4"],
  ],

  
};

var Pacman = {
  
}

var PView = {
  model: null,
  cellSize: 0,
  mainDiv: null,
  cells: null,
  init: function (model, cellSize, mainDiv) {
    this.model = model;
    this.mainDiv = mainDiv;
    var s = "", row;
    this.cells = [];
    for(let r=0,rows=model.mazeArray.length;r<rows;r++) {
      row=[];
      model.mazeArray[r]=model.mazeArray[r][0].split('');
      if(r===0){
        this.model.h=rows;
        this.model.w=model.mazeArray[r].length;
      }
      for(let c=0,cols=model.mazeArray[r].length;c<cols;c++) {
        row.push(null);
        if(model.mazeArray[r][c]==='P'){
          Pacman.x=c;
          Pacman.y=r;
        };
        s +=
          '<DIV id="' +
          r +
          "_" +
          c +
          '" style="position:absolute;top:' +
          ( r) * cellSize +
          "px;left:" +
          c * cellSize +
          "px;width:" +
          (cellSize ) +
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
    for(let r=0,rows=this.model.mazeArray.length;r<rows;r++) {
      for(let c=0,cols=this.model.mazeArray[r].length;c<cols;c++) {
        this.cells[r][c].setAttribute("type",this.model.mazeArray[r][c]);
      }
    }

  }
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
   // this.wait(this.tik, this.oneTik, this.f, this.view);
  },
  oneTik: function () {
    var THIS = PController;
    if (!THIS.f.moveDown()) {
      THIS.drop();
    } else {
      THIS.view.draw();
    }
    //next tik
    THIS.wait(THIS.tik, THIS.oneTik, THIS.f, THIS.view);
  },
  wait: function (milliseconds, foo, ctx, view) {
    setTimeout(function () {
      foo.call(ctx); // will be executed after the specified time
      view.draw();
    }, milliseconds);
  },
  keyDown: function (e) {
    switch (e.keyCode) {
      case 37: //left arrow
        this.moveLeft();
        break;
      case 39: //right arrow
        this.moveRight();
        break;
      case 38: //up arrow
        this.rotateRight();
        break;
      case 32: //space
        this.drop();
        break;
      case 27: //escape
        this.pause();
        break;
      case 90:
      case 122: //z or Z
        this.rotateLeft();
        break;
    }
  },
  moveLeft: function () {
    this.f.moveLeft();
    this.view.draw();
  },
  moveRight: function () {
    this.f.moveRight();
    this.view.draw();
  },
  rotateRight: function () {
    this.f.rotateRight();
    this.view.draw();
  },
  rotateLeft: function () {
    this.f.rotateLeft();
    this.view.draw();
  },
  drop: function () {
    this.f.drop();
    this.model.removeFullLines();
    this.view.draw();
    this.f = this.model.createFigure();
    this.view.draw();
  },
  pause: function () {},
};
