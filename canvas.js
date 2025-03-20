var Canvas = document.getElementById("canvas");
var ctx = Canvas.getContext("2d");
var resize = function () {
  Canvas.width = window.innerWidth;
  Canvas.height = window.innerHeight;
};
window.addEventListener("resize", resize);
resize();

var elements = [];
var presets = {};

// Define shapes with faster movement
presets.o = function (x, y, s, dx, dy) {
  return {
    x: x,
    y: y,
    r: 12 * s,
    w: 5 * s,
    dx: dx,
    dy: dy,
    draw: function (ctx, t) {
      this.x += this.dx;
      this.y += this.dy;

      // Ensure these remain within bounds for correct animation
      if (this.x > Canvas.width) this.x = 0;
      if (this.y > Canvas.height) this.y = 0;
      if (this.x < 0) this.x = Canvas.width;
      if (this.y < 0) this.y = Canvas.height;

      ctx.beginPath();
      ctx.arc(
        this.x + Math.sin((50 + x + t / 10) / 100) * 3,
        this.y + Math.sin((45 + x + t / 10) / 100) * 4,
        this.r,
        0,
        2 * Math.PI,
        false
      );
      ctx.lineWidth = this.w;
      ctx.strokeStyle = "#0F3BEA"; // Change color here
      ctx.stroke();
    },
  };
};

presets.x = function (x, y, s, dx, dy, dr, r) {
  r = r || 0;
  return {
    x: x,
    y: y,
    s: 20 * s,
    w: 5 * s,
    r: r,
    dx: dx,
    dy: dy,
    dr: dr,
    draw: function (ctx, t) {
      this.x += this.dx;
      this.y += this.dy;
      this.r += this.dr;

      // Ensure these remain within bounds for correct animation
      if (this.x > Canvas.width) this.x = 0;
      if (this.y > Canvas.height) this.y = 0;
      if (this.x < 0) this.x = Canvas.width;
      if (this.y < 0) this.y = Canvas.height;

      var _this = this;
      var line = function (x, y, tx, ty, c, o) {
        o = o || 0;
        ctx.beginPath();
        ctx.moveTo(-o + (_this.s / 2) * x, o + (_this.s / 2) * y);
        ctx.lineTo(-o + (_this.s / 2) * tx, o + (_this.s / 2) * ty);
        ctx.lineWidth = _this.w;
        ctx.strokeStyle = c;
        ctx.stroke();
      };

      ctx.save();
      ctx.translate(
        this.x + Math.sin((x + t / 10) / 100) * 5,
        this.y + Math.sin((10 + x + t / 10) / 100) * 2
      );
      ctx.rotate((this.r * Math.PI) / 180);
      line(-1, -1, 1, 1, "#0F3BEA"); // Change color here
      line(1, -1, -1, 1, "#0F3BEA"); // Change color here
      ctx.restore();
    },
  };
};

// Modify initial shape creation for more frequent and potentially overlapping shapes
for (var x = 0; x < Canvas.width; x++) {
  for (var y = 0; y < Canvas.height; y++) {
    // Increase likelihood of shape creation (e.g., by lowering the aforementioned 8000 to 2000)
    if (Math.random() * 2000 < 1) {
      var s = (Math.random() * 5 + 1) / 10;
      var speedFactor = Math.random() * 0.5 + 0.1; // Additional speed factor

      if (Math.round(Math.random()) == 1) {
        elements.push(
          presets.o(
            x,
            y,
            s,
            (Math.random() - 0.5) * speedFactor,
            (Math.random() - 0.5) * speedFactor
          )
        );
      } else {
        elements.push(
          presets.x(
            x,
            y,
            s,
            (Math.random() - 0.5) * speedFactor,
            (Math.random() - 0.5) * speedFactor,
            (Math.random() - 0.5) / 10,
            Math.random() * 360
          )
        );
      }
    }
  }
}

// Faster frame update (lower number for faster animation)
setInterval(function () {
  ctx.clearRect(0, 0, Canvas.width, Canvas.height);
  var time = new Date().getTime();
  for (var e in elements) {
    elements[e].draw(ctx, time);
  }
}, 10);
