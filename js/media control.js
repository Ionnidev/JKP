// Steuert Videos innerhalb von .video-frame:
// – nur Play/Pause über den eigenen Button
// – kein natives Suchen, kein Vollbild, kein Entstummen
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".video-frame").forEach(function (frame) {
    const video = frame.querySelector("video");
    const toggle = frame.querySelector(".play-toggle");
    const icon = frame.querySelector(".play-icon");
    if (!video || !toggle || !icon) return;

    // Keine nativen Controls, immer stumm
    video.removeAttribute("controls");
    video.muted = true;
    video.defaultMuted = true;
    video.disablePictureInPicture = true;
    video.setAttribute("controlsList", "nofullscreen nodownload noremoteplayback");
    video.setAttribute("playsinline", "");

    let lastAllowedTime = 0;

    function updateIcon() {
      icon.textContent = video.paused ? "▶" : "❚❚";
      toggle.setAttribute("aria-label", video.paused ? "Video abspielen" : "Video pausieren");
    }

    toggle.addEventListener("click", function () {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });

    // Ton lässt sich nicht aktivieren
    video.addEventListener("volumechange", function () {
      video.muted = true;
    });

    // Kein Vor-/Zurückspulen
    video.addEventListener("seeking", function () {
      if (Math.abs(video.currentTime - lastAllowedTime) > 0.5) {
        video.currentTime = lastAllowedTime;
      }
    });
    video.addEventListener("timeupdate", function () {
      lastAllowedTime = video.currentTime;
    });

    // Kein Vollbild per Doppelklick
    video.addEventListener("dblclick", function (e) { e.preventDefault(); });
    frame.addEventListener("contextmenu", function (e) { e.preventDefault(); });

    video.addEventListener("play", updateIcon);
    video.addEventListener("pause", updateIcon);
    video.addEventListener("ended", updateIcon);

    updateIcon();
  });
});