let stopSheet; // 儲存角色1的原地動畫精靈圖
let walkSheet; // 儲存角色1的走路動畫精靈圖
let magicSheet; // 儲存角色1的一次性施法動畫精靈圖
let effectSheet; // 儲存魔法飛行特效的精靈圖
let isWalking = false; // 記錄角色是否已切換為走路動畫
let isCasting = false; // 記錄角色是否正在播放施法動畫
let castStartFrame = 0; // 記錄施法動畫開始時的畫面影格
let facingDirection = 1; // 記錄角色朝向，1為右方，-1為左方
let characterX; // 儲存角色圖片左緣的畫布座標
let effectActive = false; // 記錄畫面上是否有飛行中的魔法特效
let effectX = 0; // 儲存魔法特效左緣的畫布座標
let effectDirection = 1; // 記錄魔法特效的移動方向
const stopFrameCount = 10; // 設定原地動畫的影格總數
const stopFrameWidth = 1395 / stopFrameCount; // 計算原地動畫每格寬度
const stopFrameHeight = 196; // 設定原地動畫每格高度
const walkFrameCount = 9; // 設定走路動畫的影格總數
const walkFrameWidth = 1246 / walkFrameCount; // 計算走路動畫每格寬度
const walkFrameHeight = 198; // 設定走路動畫每格高度
const magicFrameCount = 4; // 設定施法動畫的影格總數
const magicFrameWidth = 1039 / magicFrameCount; // 計算施法動畫每格寬度
const magicFrameHeight = 146; // 設定施法動畫每格高度
const effectFrameCount = 5; // 設定魔法特效的影格總數
const effectFrameWidth = 740 / effectFrameCount; // 計算魔法特效每格寬度
const effectFrameHeight = 19; // 設定魔法特效每格高度
const animationSpeed = 8; // 設定每格動畫維持的繪圖影格數
function preload() { // 在畫布建立前載入角色圖片
  stopSheet = loadImage('1/stop/stop.png'); // 載入角色1的十格原地動畫精靈圖
  walkSheet = loadImage('1/walk/walk.png'); // 載入角色1的九格走路動畫精靈圖
  magicSheet = loadImage('1/magic/magic.png'); // 載入角色1的四格施法動畫精靈圖
  effectSheet = loadImage('1/magic1/magic1.png'); // 載入五格魔法飛行特效精靈圖
} // 結束圖片預載函式
function setup() { // 設定畫布與動畫播放環境
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布
  frameRate(60); // 將繪圖更新速率設定為每秒60次
  imageMode(CORNER); // 使用圖片左上角作為繪製座標
} // 結束畫布設定函式
function draw() { // 每次更新畫面時繪製背景與角色
  background(135, 206, 235); // 使用天空藍作為畫布背景
  if (isCasting && frameCount - castStartFrame >= magicFrameCount * animationSpeed) { // 判斷施法動畫是否已播放完畢
    isCasting = false; // 結束施法狀態並切回一般角色動畫
    effectActive = true; // 啟動施法完成後的飛行特效
  } // 結束施法動畫完成判斷
  const movingRight = keyIsDown(RIGHT_ARROW); // 記錄目前是否按住向右鍵
  const movingLeft = keyIsDown(LEFT_ARROW); // 記錄目前是否按住向左鍵
  isWalking = !isCasting && (movingRight || movingLeft); // 施法時停止移動，其他時候按方向鍵才播放走路動畫
  const activeSheet = isCasting ? magicSheet : isWalking ? walkSheet : stopSheet; // 依目前動作選擇施法、走路或原地精靈圖
  const frameCountTotal = isCasting ? magicFrameCount : isWalking ? walkFrameCount : stopFrameCount; // 取得目前精靈圖的影格總數
  const frameWidth = isCasting ? magicFrameWidth : isWalking ? walkFrameWidth : stopFrameWidth; // 取得目前精靈圖每格的寬度
  const frameHeight = isCasting ? magicFrameHeight : isWalking ? walkFrameHeight : stopFrameHeight; // 取得目前精靈圖每格的高度
  const characterScale = min(width / 3 / frameWidth, height / frameHeight, 2); // 依畫布可用寬高等比例縮放，最大放大兩倍
  const characterDisplayWidth = frameWidth * characterScale; // 計算角色目前的顯示寬度
  const characterDisplayHeight = frameHeight * characterScale; // 計算角色目前的顯示高度
  if (characterX === undefined) characterX = width * 2 / 3 - characterDisplayWidth / 2; // 首次繪製時將角色中心放在畫布寬度的三分之二處
  if (!isCasting && movingRight) { // 未施法且按住向右鍵時持續向右移動
    facingDirection = 1; // 設定角色朝向右方
    characterX += max(2, width * 0.005); // 依畫布寬度調整向右移動速度
  } else if (!isCasting && movingLeft) { // 未施法且按住向左鍵時持續向左移動
    facingDirection = -1; // 設定角色朝向左方
    characterX -= max(2, width * 0.005); // 依畫布寬度調整向左移動速度
  } // 結束方向鍵移動判斷
  characterX = constrain(characterX, 0, width - characterDisplayWidth); // 限制角色位置在畫布左右邊界內
  const castFrame = floor((frameCount - castStartFrame) / animationSpeed); // 計算施法動畫目前播放的影格
  const currentFrame = isCasting ? castFrame : floor(frameCount / animationSpeed) % frameCountTotal; // 計算目前動作應播放的影格
  const characterY = height - characterDisplayHeight; // 將縮放後角色圖片的底端對齊畫布底端
  if (facingDirection === -1) { // 角色朝左時執行水平翻轉繪製
    push(); // 儲存目前畫布轉換狀態
    translate(characterX + characterDisplayWidth, 0); // 將翻轉基準移至角色右側
    scale(-1, 1); // 水平翻轉畫布座標
    image(activeSheet, 0, characterY, characterDisplayWidth, characterDisplayHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); // 繪製朝左的動畫影格
    pop(); // 還原畫布轉換狀態
  } else { // 角色朝右時維持原始圖片方向
    image(activeSheet, characterX, characterY, characterDisplayWidth, characterDisplayHeight, currentFrame * frameWidth, 0, frameWidth, frameHeight); // 繪製朝右的動畫影格
  } // 結束角色方向繪製判斷
  const effectScale = characterScale; // 使用角色縮放比例維持魔法特效的響應式尺寸
  const effectDisplayWidth = effectFrameWidth * effectScale; // 計算魔法特效目前的顯示寬度
  const effectDisplayHeight = effectFrameHeight * effectScale; // 計算魔法特效目前的顯示高度
  if (effectActive && effectX === 0) effectX = effectDirection === 1 ? characterX + characterDisplayWidth - effectDisplayWidth * 0.55 : characterX - effectDisplayWidth * 0.55; // 特效從角色朝向一側附近發射並與角色銜接
  if (effectActive) { // 更新並繪製正在飛行的魔法特效
    effectX += effectDirection * max(4, width * 0.01); // 依畫布寬度調整特效移動速度
    const effectY = height - characterDisplayHeight * 0.72 - effectDisplayHeight / 2; // 將特效放在角色身體前方的高度
    const effectFrame = floor(frameCount / animationSpeed) % effectFrameCount; // 循環播放特效的五個影格
    if (effectX > width || effectX + effectDisplayWidth < 0) { // 判斷特效是否已移出畫布邊界
      effectActive = false; // 特效離開畫布後將其清除
      effectX = 0; // 重設特效位置以供下次施法使用
    } else if (effectDirection === -1) { // 特效朝左移動時水平翻轉繪製
      push(); // 儲存目前畫布轉換狀態
      translate(effectX + effectDisplayWidth, 0); // 將翻轉基準移至特效右側
      scale(-1, 1); // 水平翻轉特效方向
      image(effectSheet, 0, effectY, effectDisplayWidth, effectDisplayHeight, effectFrame * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight); // 繪製朝左移動的特效影格
      pop(); // 還原畫布轉換狀態
    } else { // 特效朝右移動時維持原始圖片方向
      image(effectSheet, effectX, effectY, effectDisplayWidth, effectDisplayHeight, effectFrame * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight); // 繪製朝右移動的特效影格
    } // 結束特效方向繪製判斷
  } // 結束魔法特效更新與繪製
} // 結束畫面繪製函式
function keyPressed() { // 偵測左右方向鍵並避免瀏覽器捲動畫面
  if (keyCode === 32) { // 判斷是否按下空白鍵
    if (!isCasting && !effectActive) { // 僅在沒有施法或飛行特效時開始新的施法
      isCasting = true; // 啟動一次性的施法動畫
      castStartFrame = frameCount; // 記錄施法動畫開始影格
      effectDirection = facingDirection; // 記錄施法當下角色面向作為特效方向
    } // 結束施法啟動判斷
    return false; // 阻止空白鍵觸發瀏覽器預設行為
  } // 結束空白鍵判斷
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) { // 判斷是否按下左右方向鍵
    isWalking = true; // 按下任一方向鍵後切換至走路動畫
    facingDirection = keyCode === RIGHT_ARROW ? 1 : -1; // 依按鍵方向設定角色朝向
    return false; // 停止方向鍵的瀏覽器預設捲動行為
  } // 結束方向鍵判斷
} // 結束按鍵事件函式
function windowResized() { // 瀏覽器視窗尺寸改變時重新調整畫布
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿整個視窗
} // 結束視窗尺寸調整函式
