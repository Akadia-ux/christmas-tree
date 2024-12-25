// 定义颜色
const COLORS = [
  [255, 0, 0], // 红色
  [255, 255, 0], // 黄色
  [0, 191, 255], // 蓝色
  [255, 255, 255], // 白色
  [255, 105, 180], // 浅粉色
  [0, 255, 0], // 绿色
  [255, 165, 0], // 橙色
  [138, 43, 226], // 紫色
];

// 雪花类
class Snowflake {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = random(0, width);
    this.y = random(-height, 0);
    this.speed = random(1, 4);
    this.size = random(2, 6);
    this.angle = random(TWO_PI);
    this.angularSpeed = random(-0.02, 0.02);
  }

  fall() {
    this.y += this.speed;
    this.x += sin(this.angle) * 0.5; // 轻微左右摆动
    this.angle += this.angularSpeed;

    if (this.y > height) {
      this.reset();
      this.y = 0;
    }
  }

  display() {
    noStroke();
    fill(255);
    ellipse(this.x, this.y, this.size);
  }
}

// 灯光类
class Light {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.visible = true;
    this.timer = int(random(0, 60));
    this.flashInterval = int(random(30, 90));
  }

  update() {
    this.timer += 1;
    if (this.timer >= this.flashInterval) {
      this.visible = !this.visible;
      this.timer = 0;
      this.flashInterval = int(random(30, 90));
    }
  }

  display() {
    if (this.visible) {
      noStroke();
      fill(this.color[0], this.color[1], this.color[2], 200); // 半透明
      ellipse(this.x, this.y, 10);
      // 添加光晕效果
      noFill();
      stroke(this.color[0], this.color[1], this.color[2], 100);
      strokeWeight(2);
      ellipse(this.x, this.y, 20);
    }
  }
}

// 彩球类
class Ornament {
  constructor(x, y, color, size, shape = "circle") {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.shape = shape;
  }

  display() {
    noStroke();
    fill(this.color);
    if (this.shape === "circle") {
      ellipse(this.x, this.y, this.size);
    } else if (this.shape === "star") {
      drawStar(this.x, this.y, this.size / 2, this.size, 5);
    } else if (this.shape === "heart") {
      drawHeart(this.x, this.y, this.size);
    }
  }
}

// 动态文字类
class Message {
  constructor(x, y, msg, size, color) {
    this.x = x;
    this.y = y;
    this.msg = msg;
    this.size = size;
    this.color = color;
    this.alpha = 0; // 初始透明度
    this.fadeDirection = 1; // 1为淡入，-1为淡出
    this.glowRadius = 0; // 光晕半径
    this.glowDirection = 1; // 光晕扩展方向
  }

  update() {
    // 控制透明度变化，创建淡入淡出效果
    this.alpha += this.fadeDirection * 2;
    if (this.alpha > 255) {
      this.alpha = 255;
      this.fadeDirection = -1;
    } else if (this.alpha < 150) {
      this.alpha = 150;
      this.fadeDirection = 1;
    }

    // 控制光晕半径变化，创建脉动效果
    this.glowRadius += this.glowDirection * 0.5;
    if (this.glowRadius > 15 || this.glowRadius < 5) {
      this.glowDirection *= -1;
    }
  }

  display() {
    push();
    textFont("Arial"); // 使用内置字体
    textSize(this.size);
    textAlign(CENTER, CENTER);

    // 添加光晕效果
    drawingContext.shadowBlur = this.glowRadius;
    // 将 p5.js color 对象转换为 rgba() 字符串
    let c = color(this.color[0], this.color[1], this.color[2], this.alpha);
    let r = red(c);
    let g = green(c);
    let b = blue(c);
    let a = alpha(c) / 255;
    drawingContext.shadowColor = `rgba(${r},${g},${b},${a})`;

    // 添加文字描边
    stroke(0, this.alpha); // 黑色描边
    strokeWeight(2);
    fill(this.color[0], this.color[1], this.color[2], this.alpha);
    text(this.msg, this.x, this.y);
    pop();
  }
}

// 绘制星形
function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius1;
    let sy = y + sin(a) * radius1;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius2;
    sy = y + sin(a + halfAngle) * radius2;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

// 绘制心形
function drawHeart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x, y - size / 2, x - size, y - size / 2, x - size, y);
  bezierVertex(x - size, y + size / 1.5, x, y + size * 1.5, x, y + size * 2);
  bezierVertex(x, y + size * 1.5, x + size, y + size / 1.5, x + size, y);
  bezierVertex(x + size, y - size / 2, x, y - size / 2, x, y);
  endShape(CLOSE);
}

// 背景元素类（例如星星、月亮等）
class BackgroundElement {
  constructor(x, y, type = "star") {
    this.x = x;
    this.y = y;
    this.type = type;
    this.size = random(5, 15);
    this.alpha = random(100, 255);
    this.speed = random(0.5, 2);
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(0, width);
    }
  }

  display() {
    noStroke();
    if (this.type === "star") {
      fill(255, 255, 255, this.alpha);
      drawStar(this.x, this.y, this.size / 2, this.size, 5);
    } else if (this.type === "moon") {
      fill(255, 255, 224, this.alpha);
      ellipse(this.x, this.y, this.size * 2, this.size * 2);
      fill(0);
      ellipse(
        this.x + this.size / 3,
        this.y - this.size / 3,
        this.size * 2,
        this.size * 2
      );
    }
  }
}

let snowflakes = [];
const NUM_SNOWFLAKES = 200;

let lights = [];
const NUM_LIGHTS = 50;

let ornaments = [];
const NUM_ORNAMENTS = 30;

let backgroundElements = [];
const NUM_BACKGROUND_ELEMENTS = 50;

let treeBase;
const TREE_WIDTH = 400; // 增加树的宽度
const TREE_HEIGHT = 500; // 增加树的高度

let message; // 全局变量，用于存储 Message 对象

function setup() {
  createCanvas(windowWidth, windowHeight);
  treeBase = height - 100;

  // 初始化雪花
  for (let i = 0; i < NUM_SNOWFLAKES; i++) {
    snowflakes.push(new Snowflake());
  }

  // 初始化灯光
  for (let i = 0; i < NUM_LIGHTS; i++) {
    let x = random(
      width / 2 - TREE_WIDTH / 2 + 20,
      width / 2 + TREE_WIDTH / 2 - 20
    );
    let y = random(treeBase - TREE_HEIGHT, treeBase);
    let color = random(COLORS);
    lights.push(new Light(x, y, color));
  }

  // 初始化彩球
  for (let i = 0; i < NUM_ORNAMENTS; i++) {
    let x = random(
      width / 2 - TREE_WIDTH / 2 + 30,
      width / 2 + TREE_WIDTH / 2 - 30
    );
    let y = random(treeBase - TREE_HEIGHT + 20, treeBase - 20);
    let color = random(COLORS);
    let size = random(8, 14);
    let shapeRand = random();
    let shape = "circle";
    if (shapeRand < 0.33) {
      shape = "circle";
    } else if (shapeRand < 0.66) {
      shape = "star";
    } else {
      shape = "heart";
    }
    ornaments.push(new Ornament(x, y, color, size, shape));
  }

  // 初始化背景元素
  for (let i = 0; i < NUM_BACKGROUND_ELEMENTS; i++) {
    let x = random(0, width);
    let y = random(0, height / 2);
    let type = random(["star", "moon"]);
    backgroundElements.push(new BackgroundElement(x, y, type));
  }

  // 初始化动态文字
  message = new Message(
    width / 2, // x 坐标居中
    treeBase - TREE_HEIGHT - 100, // y 坐标在星星上方
    "祝你圣诞节快乐", // 文字内容
    48, // 字体大小，增大以更醒目
    [255, 215, 0] // 金色
  );
}

function draw() {
  background(10, 10, 30); // 深蓝色夜空

  // 绘制和更新背景元素
  for (let elem of backgroundElements) {
    elem.update();
    elem.display();
  }

  // 更新并绘制雪花
  for (let snowflake of snowflakes) {
    snowflake.fall();
    snowflake.display();
  }

  // 绘制圣诞树
  drawTree();

  // 更新并绘制灯光
  for (let light of lights) {
    light.update();
    light.display();
  }

  // 绘制彩球
  for (let ornament of ornaments) {
    ornament.display();
  }

  // 绘制缎带
  drawRibbon();

  // 绘制礼物
  drawGifts();

  // 更新并绘制动态文字
  message.update();
  message.display();
}

// 绘制圣诞树
function drawTree() {
  // 绘制树干
  fill(101, 67, 33); // 深棕色
  noStroke();
  rect(width / 2 - 25, treeBase, 50, 80); // 调整树干尺寸

  // 绘制树叶（多个三角形）
  fill(34, 139, 34); // 绿色
  const layers = 10; // 增加层数
  for (let i = 0; i < layers; i++) {
    // 每层逐渐变宽，顶部更尖
    let currentWidth = TREE_WIDTH - (i * (TREE_WIDTH * 0.9)) / layers; // 非线性缩减
    let currentHeight = TREE_HEIGHT / layers;
    let y1 = treeBase - i * currentHeight; // 当前层的基座 y 坐标
    let y2 = y1 - currentHeight; // 当前层的顶点 y 坐标
    triangle(
      width / 2,
      y2, // 顶点
      width / 2 - currentWidth / 2,
      y1, // 左基座
      width / 2 + currentWidth / 2,
      y1 // 右基座
    );
  }

  // 绘制星星
  drawStar(width / 2, treeBase - TREE_HEIGHT - 40, 30, 15, 5); // 调整星星位置和大小
}

// 绘制缎带
function drawRibbon() {
  fill(255, 0, 0); // 红色
  noStroke();
  // 绘制横向缎带
  rect(width / 2 - 75, treeBase + 30, 150, 15); // 调整缎带尺寸
  // 绘制竖向缎带
  rect(width / 2 - 7.5, treeBase + 30, 15, 45); // 调整缎带尺寸

  // 添加缎带装饰
  fill(255, 215, 0); // 金色
  ellipse(width / 2, treeBase + 37.5, 20, 20); // 调整装饰尺寸
}

// 绘制礼物
function drawGifts() {
  fill(178, 34, 34); // 深红色
  noStroke();
  // 礼物盒
  rect(width / 2 - 150, treeBase + 80, 75, 75); // 调整礼物位置和尺寸
  rect(width / 2 + 75, treeBase + 80, 75, 75); // 调整礼物位置和尺寸
  // 添加包装纸的蝴蝶结
  fill(255, 255, 0); // 黄色
  triangle(
    width / 2 - 112.5,
    treeBase + 80,
    width / 2 - 75,
    treeBase + 50,
    width / 2 - 37.5,
    treeBase + 80
  );
  triangle(
    width / 2 + 112.5,
    treeBase + 80,
    width / 2 + 75,
    treeBase + 50,
    width / 2 + 37.5,
    treeBase + 80
  );
  // 添加蝴蝶结中心
  fill(255, 215, 0); // 金色
  ellipse(width / 2 - 112.5, treeBase + 80, 15, 15);
  ellipse(width / 2 + 112.5, treeBase + 80, 15, 15);
}

// 响应窗口大小变化
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  treeBase = height - 100;
  // 更新动态文字的位置
  message.x = width / 2;
  message.y = treeBase - TREE_HEIGHT - 60;
}

// 添加装饰品的交互
function mousePressed() {
  // 在点击位置添加一个装饰品
  if (
    mouseX > width / 2 - TREE_WIDTH / 2 &&
    mouseX < width / 2 + TREE_WIDTH / 2 &&
    mouseY > treeBase - TREE_HEIGHT &&
    mouseY < treeBase
  ) {
    let color = random(COLORS);
    let size = random(8, 14);
    let shapeRand = random();
    let shape = "circle";
    if (shapeRand < 0.33) {
      shape = "circle";
    } else if (shapeRand < 0.66) {
      shape = "star";
    } else {
      shape = "heart";
    }
    ornaments.push(new Ornament(mouseX, mouseY, color, size, shape));
  }
}
