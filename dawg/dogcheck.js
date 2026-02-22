var audio;

var dog_frames = [
    document.getElementById("dog0"),
    document.getElementById("dog1")
];
var sleepingdog_frames = [
    document.getElementById("sleepingdog0"),
    document.getElementById("sleepingdog1")
];

var frame = 0;
setInterval(function () {
    frame++;
    dog_frames[0].style.display = frame % 2 === 0 ? "block" : "none";
    dog_frames[1].style.display = frame % 2 === 1 ? "block" : "none";
    sleepingdog_frames[0].style.display = frame % 2 === 0 ? "block" : "none";
    sleepingdog_frames[1].style.display = frame % 2 === 1 ? "block" : "none";
}, 1000 / 4);

if (Math.random() > 0.25) {
    document.getElementById("dog").style.display = "block";
    document.getElementById("sleepingdog").style.display = "none";

    var r = Math.random();
    if (r < 0.2) {
        audio = new Audio("/dawg/dawgassets/sounds/mus_dogsong.ogg");
    } else if (r < 0.3) {
        audio = new Audio("/dawg/dawgassets/sounds/mus_dogroom.ogg");
    } else if (r < 0.4) {
        audio = new Audio("/dawg/dawgassets/sounds/mus_dogshrine_2.ogg");
    } else {
        audio = new Audio("/dawg/dawgassets/sounds/mus_dance_of_dog.ogg");
    }
} else {
    document.getElementById("dog").style.display = "none";
    document.getElementById("sleepingdog").style.display = "block";
    audio = new Audio("/dawg/dawgassets/sounds/dogcheck.ogg");
}

audio.loop = true;

function tryPlayAudio() {
    if (window.localStorage.mute !== "true") {
        audio.play();
    }
    window.removeEventListener("click", tryPlayAudio);
}

window.addEventListener("click", tryPlayAudio);

var urlParams = new URLSearchParams(window.location.search);
document.getElementById("url").href = urlParams.get("url");
document.getElementById("url").innerText = urlParams.get("url");
document.getElementById("status").innerText = urlParams.get("status");

document.getElementById("mutebtn").style.display =
    window.localStorage.mute === "true" ? "none" : "inline";
document.getElementById("unmutebtn").style.display =
    window.localStorage.mute === "true" ? "inline" : "none";

document.getElementById("mutebtn").addEventListener("click", function () {
    window.localStorage.mute = "true";
    audio.pause();
    document.getElementById("mutebtn").style.display = "none";
    document.getElementById("unmutebtn").style.display = "inline";
});

document.getElementById("unmutebtn").addEventListener("click", function () {
    window.localStorage.mute = "false";
    audio.play();
    document.getElementById("mutebtn").style.display = "inline";
    document.getElementById("unmutebtn").style.display = "none";
});
