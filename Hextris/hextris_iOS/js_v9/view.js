// t: current time, b: begInnIng value, c: change In value, d: duration
function easeOutCubic(t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
}

function renderText(x, y, fontSize, color, text, font) {
    ctx.save();
    if (!font) {
        font = 'px/0 Roboto';
    }

    fontSize *= settings.scale;
    ctx.font = fontSize + font;
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(text, x, y + (fontSize / 2) - 9 * settings.scale);
    ctx.restore();
}

function drawScoreboard() {
    if (scoreOpacity < 1) {
        scoreOpacity += 0.01;
        textOpacity += 0.01;
    }

    ctx.globalAlpha = textOpacity;
    var scoreSize = 50;
    var scoreString = String(score);
    if (scoreString.length == 6) {
        scoreSize = 43;
    } else if (scoreString.length == 7) {
        scoreSize = 35;
    } else if (scoreString.length == 8) {
        scoreSize = 31;
    } else if (scoreString.length == 9) {
        scoreSize = 27;
    }
    if (rush ==1){
        var color = "rgb(236, 240, 241)";
    }
    else{
        var color = "#e74c3c";
    }
    
    if (Math.abs(window.orientation) === 90) {
        // Landscape
        var yPoint = trueCanvas.height / 2 + gdy - 240 * settings.scale;
    } else {
        // Portrait
        var yPoint = trueCanvas.height / 2 + gdy - 300 * settings.scale;
    }
    
    if (gameState === 0) {
        renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
        renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, yPoint, 120, "#2c3e50", "Hextelor");
    } else if (gameState != 0 && textOpacity > 0) {
        textOpacity -= 0.05;
        renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, trueCanvas.height / 2 + gdy, 60, "rgb(236, 240, 241)", String.fromCharCode("0xf04b"), 'px FontAwesome');
        renderText(trueCanvas.width / 2 + gdx + 6 * settings.scale, yPoint, 120, "#2c3e50", "Hextelor");
        ctx.globalAlpha = scoreOpacity;
        renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
    } else {
        ctx.globalAlpha = scoreOpacity;
        renderText(trueCanvas.width / 2 + gdx, trueCanvas.height / 2 + gdy, scoreSize, color, score);
    }

    ctx.globalAlpha = 1;
}

function clearGameBoard() {
    drawPolygon(trueCanvas.width / 2, trueCanvas.height / 2, 6, trueCanvas.width / 2, 30, hexagonBackgroundColor, 0, 'rgba(0,0,0,0)');
}

function drawPolygon(x, y, sides, radius, theta, fillColor, lineWidth, lineColor) {
    ctx.fillStyle = fillColor;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;

    ctx.beginPath();
    var coords = rotatePoint(0, radius, theta);
    ctx.moveTo(coords.x + x, coords.y + y);
    var oldX = coords.x;
    var oldY = coords.y;
    for (var i = 0; i < sides; i++) {
        coords = rotatePoint(oldX, oldY, 360 / sides);
        ctx.lineTo(coords.x + x, coords.y + y);
        oldX = coords.x;
        oldY = coords.y;
    }

    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0)';
}

function toggleClass(element, active) {
    if ($(element).hasClass(active)) {
        $(element).removeClass(active);
    } else {
        $(element).addClass(active);
    }
}

function showText(text) {
    var messages = {
        'paused': "<div class='centeredTop unselectable'><span class='label label-danger'>Paused</span></div><br><div style='height:100px;line-height:100px;cursor:pointer;'></div>",
        'pausedAndroid': "<div class='centeredTop unselectable'><span class='label label-danger'>Paused</span></div><br><div style='height:100px;line-height:100px;cursor:pointer;'></div>",
        'start': "<div class='centeredHeader unselectable' style='line-height:80px;'>Press enter to start</div>",
        'gameover': "<div class='modal fade' id='gameOver'><div class='modal-dialog'><div class='modal-content'><div class='modal-header'>"+
            "<button type='button' class='close' data-dismiss='modal'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button>" +
            "<h2 class='centeredHeader unselectable'> Game Over </h2></div>" +
            "<div class='modal-body'>" +
            "<span class = 'label label-success' style = 'font-size:4rem'>" + score + " pts</span>"
    };

    if (text == 'paused') {
        if (settings.os == 'android') {
            text = 'pausedAndroid';
        }
    }

    if (text == 'gameover') {
        var allZ = 1;
        var i;

        if (settings.platform == 'mobile') {
            $('#overlay').css('margin-top', '-10rem');
            messages['gameover'] = "<div class='centeredHeader unselectable label label-danger' style = 'font-size: 2rem;margin-top: -2rem'> Game Over <span class = 'label label-success' style = 'font-size:3rem;margin-top: -2rem'>" + score + " pts</span></div>";
        }

        messages['gameover'] += "" +
            "<div class='panel-group' id='accordion' style='max-width: 20rem; margin-top: 2rem; margin-left: auto; margin-right: auto'>" +
                "<div class='panel panel-primary'>" +
                    "<div class='panel-heading'>" +
                        "<h1 class='panel-title'>High Scores</h1>" +
                    "</div>" +
                    "<div id='highscore'>" +
                        "<div class='panel-body'>";

        for (i = 0; i < 3; i++) {
            if (highscores.length > i) {
                if(i != 0) {
                    messages['gameover'] += "<br syle='height: .2em;'/>";
                }
                messages['gameover'] += "" +
                            "<div class='row'>" +
                                "<span class='tg-031e label label-info'>" + highscores[i] + " pts</span>" +
                            "</div>";
            }
        }

        messages['gameover'] += "" +
                        "</div>" +
                    "</div>" +
                "</div>" +
            "</div>";

        var restartText;
        if (settings.platform == 'mobile') {
            restartText = 'Tap anywhere to restart!';
        }
        
        if (settings.platform == 'mobile') {


            messages['gameover'] += "" +
                                        "<br>" +
                                        "<div class='fltrt' id='tweetStuff' style='margin-top: -2rem'>" +
                                        //restartText +
                                        //"<a class='btn btn-primary btn-lg tweet' href='https://twitter.com/intent/tweet?text=Can you beat my score of "+ score +" points at&button_hashtag=hextris ? http://hextris.github.io/hextris' data-lang='en' data-related='hextris:hextris'>Share Your Score on Twitter</a autofocus>" +
                                        "</div>";
        }
        if (allZ) {
            for (i = 0; i < highscores.length; i++) {
                if (highscores[i] !== 0) {
                    allZ = 0;
                }
            }
        }
    }

    $(".overlay").html(messages[text]);
    $(".overlay").fadeIn("1000", "swing");

    if (text == 'gameover') {
        if (settings.platform == 'mobile') {
            $('.tg').css('margin-top', '6px');
            $("#tapToRestart").css('margin-top','-19px')
            //Append text after 1000 duration
            setTimeout(function() {
                $('#tweetStuff').text(restartText);
            }, 1000);
        }
    }
}

function setMainMenu() {
    gameState = 4;
    canRestart = false;
    setTimeout(function() {
        canRestart = 's';
    }, 500);
    $('#restartBtn').hide();
    if ($($("#pauseBtn").children()[0]).attr('class').indexOf('pause') == -1) {
        $("#pauseBtnInner").html('<i class="fa fa-pause fa-2x"></i>');
    } else {
        $("#pauseBtnInner").html('<i class="fa fa-play fa-2x"></i>');
    }
}

function hideText() {
    $('#gameOver').modal('hide');
    $(".overlay").fadeOut("1000", function() {
        $(".overlay").html("");
    });
}

function gameOverDisplay() {
    $("#attributions").show();
    var c = document.getElementById("canvas");
    c.className = "blur";
    showText('gameover');
    $('#gameOver').modal('show');
    window.location = "iosgameover://";
}

function pause(o) {
    writeHighScores();
    var message;
    if (o) {
        message = '';
    } else {
        message = 'paused';
    }

    var c = document.getElementById("canvas");
    if (gameState == -1) {
        $('#restartBtn').fadeOut(150, "linear");
        if ($('#helpScreen').is(':visible')) {
            $('#helpScreen').fadeOut(150, "linear");
        }

        $("#pauseBtnInner").html('<i class="fa fa-pause fa-2x"></i>');
        $('.helpText').fadeOut(200, 'linear');
        hideText();
        hidebottombar();
        setTimeout(function() {
            gameState = prevGameState;
        }, 200)
    } else if (gameState != -2 && gameState !== 0 && gameState !== 2) {
        $('#restartBtn').fadeIn(150, "linear");
        $('.helpText').fadeIn(200, 'linear');
        showbottombar();
        if (message == 'paused') {
            showText(message);
        }

        $("#pauseBtnInner").html('<i class="fa fa-play fa-2x"></i>');
        prevGameState = gameState;
        gameState = -1;
    }
}
