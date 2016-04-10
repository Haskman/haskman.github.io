/**
 * Created by Victor on 4/10/2016.
 */
var clickCount = 0;
var intro = new Audio("audio/The Descent.mp3");
var outro = new Audio("audio/Air Horn-SoundBible.com-964603082.wav");
intro.play();

function start(){
    document.getElementById("body").addEventListener("click", death);
    document.getElementById("playbutton").style.visibility = "hidden";
    clickCount += 1;
}

function death(){
    clickCount += 1;
    if (clickCount > 2) {
        $('#body').css('background-image', 'url("img/loser.jpg")');
        intro.pause();
        outro.play();
    }
}