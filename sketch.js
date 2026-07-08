let mode;
let ballX;
let ballY;
let ballSpeedX;
let ballSpeedY;
let ballRadius;
let paddleX;
let paddleY;
let paddleSpeed;
let paddleWidth;
let paddleHeight;
function setup() {
    createCanvas(600, 400);

mode = 0;
ballX = width / 2;
ballY = height / 2;
ballSpeedX = 5;
ballSpeedY = -5;
ballRadius = 15;
paddleX = width / 2;
paddleY = height - 30;
paddleSpeed = 15;
paddleWidth = 150;
paddleHeight = 15;
}

function draw() {
    background(0);

    if (mode == 0) {
        // スタート画面の表示 (03)
    fill("white") ;
    textAlign(CENTER);
    text("クリックしてスタート",width/2,height/2);    
    }
    
    if (mode == 1) {
        // ボールを動かす (04)
        ballX=ballX+ballSpeedX;
        ballY=ballY+ballSpeedY;

        // パドルを動かす (04)
        if(keyIsDown(LEFT_ARROW)){
            paddleX=paddleX-paddleSpeed;
        }
        if(keyIsDown(RIGHT_ARROW)){
            paddleX=paddleX+paddleSpeed;
        }

        // 上に当たったら跳ね返る (05)
        if(ballY-ballRadius<0){
            ballSpeedY=-ballSpeedY;
        }

        // 右に当たったら跳ね返る (05)
        if(width<ballX+ballRadius){
            ballSpeedX=-ballSpeedX;
        }
        // 左に当たったら跳ね返る (05)
        if(ballX-ballRadius<0){
            ballSpeedX=-ballSpeedX;
        }
        // 下に当たったらゲームオーバー (07)
        if(ballY+ballRadius>height){
            mode=2;
        }
        // パドルに当たったら跳ね返る (06)
        if(
            paddleX<ballX&&
            ballX<paddleX+paddleWidth&&
            paddleY-ballRadius<ballY&&
            ballY<paddleY
        ){
            ballSpeedY=-ballSpeedY;
        }
    }

    if (mode == 2) {
        // ゲームオーバー画面の表示 (07)
        ballSpeedX=0;
        ballSpeedY=0;
        fill("white");
        textAlign(CENTER);
        text("GAME OVER",width/2,height/2);
        text("クリックしてもう一度プレイ,width/2,height/2+30")
    }

    // ボールとパドルを表示する (02)
circle(ballX, ballY, ballRadius * 2);
rect(paddleX, paddleY, paddleWidth, paddleHeight);

}

function mousePressed() {
    // スタート画面でマウスクリックされたらゲーム開始 (03)
if(mode==0){
    mode=1;
}
    // ゲームオーバー画面でマウスクリックされたらスタート画面に戻る (07)
if(mode==2) {
    setup();
}   
}