(() => {
  const canvas = document.getElementById("gl");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL nu este disponibil în acest browser.");
    return;
  }

  const vsSource = `
    attribute vec3 aPos;
    attribute vec3 aCol;
    uniform mat4 uMVP;
    varying vec3 vCol;
    void main() {
      vCol = aCol;
      gl_Position = uMVP * vec4(aPos, 1.0);
    }
  `;

  const fsSource = `
    precision mediump float;
    varying vec3 vCol;
    void main() {
      gl_FragColor = vec4(vCol, 1.0);
    }
  `;

  function compileShader(type, source) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error(msg || "Shader compile error");
    }
    return sh;
  }

  function createProgram(vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const msg = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error(msg || "Program link error");
    }
    return p;
  }

  try {
    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = createProgram(vs, fs);
    gl.useProgram(program);

    const verts = new Float32Array([
      // Front (red)
      -1, -1, 1, 1, 0, 0, 1, -1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, -1, -1, 1, 1, 0,
      0, 1, 1, 1, 1, 0, 0, -1, 1, 1, 1, 0, 0,

      // Back (green)
      -1, -1, -1, 0, 1, 0, -1, 1, -1, 0, 1, 0, 1, 1, -1, 0, 1, 0, -1, -1, -1, 0,
      1, 0, 1, 1, -1, 0, 1, 0, 1, -1, -1, 0, 1, 0,

      // Left (blue)
      -1, -1, -1, 0, 0, 1, -1, -1, 1, 0, 0, 1, -1, 1, 1, 0, 0, 1, -1, -1, -1, 0,
      0, 1, -1, 1, 1, 0, 0, 1, -1, 1, -1, 0, 0, 1,

      // Right (yellow)
      1, -1, -1, 1, 1, 0, 1, 1, -1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, -1, -1, 1, 1,
      0, 1, 1, 1, 1, 1, 0, 1, -1, 1, 1, 1, 0,

      // Top (cyan)
      -1, 1, -1, 0, 1, 1, -1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, -1, 1, -1, 0, 1,
      1, 1, 1, 1, 0, 1, 1, 1, 1, -1, 0, 1, 1,

      // Bottom (magenta)
      -1, -1, -1, 1, 0, 1, 1, -1, -1, 1, 0, 1, 1, -1, 1, 1, 0, 1, -1, -1, -1, 1,
      0, 1, 1, -1, 1, 1, 0, 1, -1, -1, 1, 1, 0, 1,
    ]);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const stride = 6 * 4;
    const aPos = gl.getAttribLocation(program, "aPos");
    const aCol = gl.getAttribLocation(program, "aCol");

    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(aCol);
    gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, stride, 3 * 4);

    const uMVP = gl.getUniformLocation(program, "uMVP");

    function mat4Identity() {
      return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
    }

    function mat4Mul(a, b) {
      const out = new Float32Array(16);

      const a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3];
      const a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];
      const a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];
      const a30 = a[12],
        a31 = a[13],
        a32 = a[14],
        a33 = a[15];

      let b0, b1, b2, b3;

      b0 = b[0];
      b1 = b[1];
      b2 = b[2];
      b3 = b[3];
      out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[4];
      b1 = b[5];
      b2 = b[6];
      b3 = b[7];
      out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[8];
      b1 = b[9];
      b2 = b[10];
      b3 = b[11];
      out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      b0 = b[12];
      b1 = b[13];
      b2 = b[14];
      b3 = b[15];
      out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
      out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
      out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
      out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

      return out;
    }

    function mat4Perspective(fovy, aspect, near, far) {
      const f = 1.0 / Math.tan(fovy / 2);
      const nf = 1 / (near - far);
      return new Float32Array([
        f / aspect,
        0,
        0,
        0,
        0,
        f,
        0,
        0,
        0,
        0,
        (far + near) * nf,
        -1,
        0,
        0,
        2 * far * near * nf,
        0,
      ]);
    }

    function mat4Translate(z) {
      const m = mat4Identity();
      m[14] = z;
      return m;
    }

    function mat4RotateY(a) {
      const c = Math.cos(a),
        s = Math.sin(a);
      return new Float32Array([
        c,
        0,
        s,
        0,
        0,
        1,
        0,
        0,
        -s,
        0,
        c,
        0,
        0,
        0,
        0,
        1,
      ]);
    }

    function mat4RotateX(a) {
      const c = Math.cos(a),
        s = Math.sin(a);
      return new Float32Array([
        1,
        0,
        0,
        0,
        0,
        c,
        -s,
        0,
        0,
        s,
        c,
        0,
        0,
        0,
        0,
        1,
      ]);
    }

    gl.enable(gl.DEPTH_TEST);

    let angle = 0;
    let last = performance.now();

    function render(now) {
      const dt = (now - last) / 1000;
      last = now;
      angle += dt;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.04, 0.06, 0.12, 1);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const aspect = canvas.width / canvas.height;
      const P = mat4Perspective(Math.PI / 4, aspect, 0.1, 50);
      const V = mat4Translate(-6);
      const R = mat4Mul(mat4RotateY(angle), mat4RotateX(angle * 0.7));
      const MVP = mat4Mul(P, mat4Mul(V, R));

      gl.uniformMatrix4fv(uMVP, false, MVP);
      gl.drawArrays(gl.TRIANGLES, 0, verts.length / 6);

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  } catch (err) {
    console.error(err);
    alert("Eroare WebGL: " + (err?.message ?? err));
  }
})();
