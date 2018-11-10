$(document).ready(function() {

  var config = {
    //colors: ["#0000ff", "#ffff00", "#006600", "#ff0000", "#cc00cc", "#ff9900"]
    colors: ["#339933", "#00cc00", "#009900", "#00cc99", "#66ff66", "#0000ff"]
  };
  
  var terrain = [
  {
    name: "2",
    color: "#339933",
    mobile: false
  },
  {
    name: "3",
    color: "#00cc00",
    mobile: false
  },
  {
    name: "4",
    color: "#009900",
    mobile: false
  },
  {
    name: "5",
    color: "#00cc99",
    mobile: false
  },
  {
    name: "6",
    color: "#66ff66",
    mobile: false
  }
  ];
  
  var organisms = [
  {
    name: "1",
    color: "#0000ff",
    mobile: true
  }
  ];
  
  

  // Init
  var environ = new Environ(100, 100);
  environ.create("environ");
  environ.animate();
  console.log(environ);
  
  // Binding
  $("#create").click(function() {
    environ.create();
    environ.animate();
  });
  
  $("#populate").click(function() {
    environ.populate();
    environ.animate();
  });
  
  $("#animate").click(function() {
    environ.animate();
  });
  
  $("#move").click(function() {
    if ($(this).data("id"))
      environ.move($(this).data("id"));
    else
      alert("No Id.");
  });
  
  $("td").click(function() {
    var id = $(this).attr("id");
    $("#move").data("id", id);
  });
 
  // Utilities
  
  function random(n) {
    var rand = Math.floor((Math.random() * n) + 1);
    return rand;
  }
  
  function idToXY(id, nRows, nCols) {
    var x = id % nCols;
    if (x > 0)
      x = x - 1;
    else
      x = nCols - 1;
    var t = nRows * nCols;
    var y = Math.floor(((id-1)/t)*(nRows));
    return [x, y];
  }
 
  // Simulation

  function Environ(nX, nY) {
    
    var env = this;
    
    this.matrix;
    
    this.create = function(id) {
      var count = 1;
      var outer = [];
      $("#" + id).empty();
      for (var i  = 0; i < nY; i++) {
        var inner = [];
        var r = '<tr>';
        for (var j = 0; j < nX; j++) {
          var location = count;
          var cell = new Cell(location);
          inner.push(cell);
          var c = '<td class="cell" id="' + count + '"></td>';
          r += c;
          count += 1;
        }
        outer.push(inner);
        r += '</tr>';
        $("#" + id).append(r);
      }
      env.matrix = outer;
    }
    
    this.populate = function(id) {
      var i = id || random(nX * nY) - 1;
      var loc = idToXY(i, nX, nY);
      var critter = new Organism(i);
      env.matrix[loc[0]][loc[1]].data = critter.data;
    }
    
    this.animate  = function() {
      $(".cell").each(function() {
        var c = $(this);
        var id = c.attr("id");
        var xy = idToXY(id, nX, nY);
        var x = xy[0];
        var y = xy[1];
        var data = env.matrix[x][y].data;
        c.css("background-color", data.color)
      });
    }
    
    this.move = function(id) {
      var sur = env.surroundings(id);
      for (var i = 0; i < sur.length; i++) {
        var popId = sur[i];
        env.populate(popId);
        environ.animate();
      }
    }
    
    this.surroundings = function(id) {
      var t = nX * nY;
      var x = parseInt(id);
      var loc = idToXY(id, nX, nY);
      var s = [];
      
      var left = (loc[0] > 0);
      var right = (loc[0] < nX - 1);
      var upper = (loc[1] > 0);
      var lower = (loc[1] < nY - 1);
     
      if (right)
        s.push(x + 1);
      if (lower && right)
        s.push(x + nX + 1);
      if (lower)
        s.push(x + nX);
      if (lower && left)
        s.push(x + nX - 1);
      if (left)
        s.push(x - 1);
      if (upper && left)
        s.push(x - nX - 1);
      if (upper)
        s.push(x - nX);
      if (upper && right)
        s.push(x - nX + 1);
      
      return s;
    }
    
    // Internal classes
    function Organism(id) {
    
      // Local vars
      var org = this;
      var r = random(organisms.length) - 1;
      
      // Organism properties
      this.id = id;
      this.data = organisms[r];
    
      // Organism methods
      this.spread = function() {
        var sur = env.surroundings(org.id);
        for (var i = 0; i < sur.length; i++) {
          var popId = sur[i];
          var xy = idToXY(popId, nX, nY);
          var x = xy[0];
          var y = xy[1];
          console.log(env.matrix[x][y]);
          //env.populate(popId);
        }
      }
      
      // Organism procedure
      // setTimeout(function() {
        // console.log("Spreading from ", org.id);
        // org.spread();
      // }, 500);
      
    }
    
  }
  
  function Cell(location) {
    var r = random(terrain.length) - 1;
    this.data = terrain[r];
  }
 

});










