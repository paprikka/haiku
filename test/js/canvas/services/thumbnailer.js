angular.module('pl.paprikka.canvas.thumbnailer', []).service('Thumbnailer', [
  function() {
    var lanczosCreate, thumbnailer;
    lanczosCreate = function(lobes) {
      return function(x) {
        var xx;
        if (x > lobes) {
          return 0;
        }
        x *= Math.PI;
        if (Math.abs(x) < 1e-16) {
          return 1;
        }
        xx = x / lobes;
        return Math.sin(x) * Math.sin(xx) / x / xx;
      };
    };
    thumbnailer = function(elem, img, sx, lobes) {
      this.canvas = elem;
      elem.width = img.width;
      elem.height = img.height;
      elem.style.display = "none";
      this.ctx = elem.getContext("2d");
      this.ctx.drawImage(img, 0, 0);
      this.img = img;
      this.src = this.ctx.getImageData(0, 0, img.width, img.height);
      this.dest = {
        width: sx,
        height: Math.round(img.height * sx / img.width)
      };
      this.dest.data = new Array(this.dest.width * this.dest.height * 3);
      this.lanczos = lanczosCreate(lobes);
      this.ratio = img.width / sx;
      this.rcp_ratio = 2 / this.ratio;
      this.range2 = Math.ceil(this.ratio * lobes / 2);
      this.cacheLanc = {};
      this.center = {};
      this.icenter = {};
      return setTimeout(this.process1, 0, this, 0);
    };
    thumbnailer.prototype.process1 = function(self, u) {
      var a, b, f_x, f_y, g, i, idx, j, r, v, weight;
      self.center.x = (u + 0.5) * self.ratio;
      self.icenter.x = Math.floor(self.center.x);
      v = 0;
      while (v < self.dest.height) {
        self.center.y = (v + 0.5) * self.ratio;
        self.icenter.y = Math.floor(self.center.y);
        a = void 0;
        r = void 0;
        g = void 0;
        b = void 0;
        a = r = g = b = 0;
        i = self.icenter.x - self.range2;
        while (i <= self.icenter.x + self.range2) {
          if (i < 0 || i >= self.src.width) {
            continue;
          }
          f_x = Math.floor(1000 * Math.abs(i - self.center.x));
          if (!self.cacheLanc[f_x]) {
            self.cacheLanc[f_x] = {};
          }
          j = self.icenter.y - self.range2;
          while (j <= self.icenter.y + self.range2) {
            if (j < 0 || j >= self.src.height) {
              continue;
            }
            f_y = Math.floor(1000 * Math.abs(j - self.center.y));
            if (self.cacheLanc[f_x][f_y] === undefined) {
              self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
            }
            weight = self.cacheLanc[f_x][f_y];
            if (weight > 0) {
              idx = (j * self.src.width + i) * 4;
              a += weight;
              r += weight * self.src.data[idx];
              g += weight * self.src.data[idx + 1];
              b += weight * self.src.data[idx + 2];
            }
            j++;
          }
          i++;
        }
        idx = (v * self.dest.width + u) * 3;
        self.dest.data[idx] = r / a;
        self.dest.data[idx + 1] = g / a;
        self.dest.data[idx + 2] = b / a;
        v++;
      }
      if (++u < self.dest.width) {
        return setTimeout(self.process1, 0, self, u);
      } else {
        return setTimeout(self.process2, 0, self);
      }
    };
    thumbnailer.prototype.process2 = function(self) {
      var i, idx, idx2, j;
      self.canvas.width = self.dest.width;
      self.canvas.height = self.dest.height;
      self.ctx.drawImage(self.img, 0, 0);
      self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
      idx = void 0;
      idx2 = void 0;
      i = 0;
      while (i < self.dest.width) {
        j = 0;
        while (j < self.dest.height) {
          idx = (j * self.dest.width + i) * 3;
          idx2 = (j * self.dest.width + i) * 4;
          self.src.data[idx2] = self.dest.data[idx];
          self.src.data[idx2 + 1] = self.dest.data[idx + 1];
          self.src.data[idx2 + 2] = self.dest.data[idx + 2];
          j++;
        }
        i++;
      }
      self.ctx.putImageData(self.src, 0, 0);
      return self.canvas.style.display = "block";
    };
    return {
      lanczosCreate: lanczosCreate,
      thumbnailer: thumbnailer
    };
  }
]);
