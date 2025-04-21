const knob = document.getElementById("knob");
const sliderArea = document.getElementById("sliderArea");

let totalFrames = document.querySelectorAll(".angle-view li").length;
let currentPercent = 50;
let lastStep = null;

function updateKnobPosition(percent) {
  const sliderRect = sliderArea.getBoundingClientRect();
  const knobWidth = knob.offsetWidth;
  const maxLeft = sliderRect.width - knobWidth;
  const left = (percent / 100) * maxLeft;
  knob.style.left = `${left}px`;
  const step = Math.floor((percent / 100) * totalFrames * 2);
  let bottom = 5;
  const windowWidth = window.innerWidth;
  if (percent > 50) {
    if (windowWidth > 500) {
      bottom = 9 + (percent - 65) * 0.25;
    } else {
      bottom = 9 + (percent - 65) * 0.2;
    }
  }
  if (percent < 50) {
    const updatedPercent = 100 - percent;
    if (windowWidth > 500) {
      bottom = 9 + (updatedPercent - 65) * 0.25;
    } else {
      bottom = 9 + (updatedPercent - 65) * 0.2;
    }
  }
  knob.style.bottom = `${bottom}px`;
  if (lastStep === null) {
    lastStep = step;
    return;
  }

  if (step > lastStep && window.angleViewer?.next) {
    const currentImageIndex = parseInt(
      document.querySelector(".angle-view").getAttribute("data-current")
    );
    const nextImageIndex = currentImageIndex + 1;
    console.log("nextImageIndex", nextImageIndex);
    window.angleViewer.goTo(nextImageIndex);
  } else if (step < lastStep && window.angleViewer?.prev) {
    const currentImageIndex = parseInt(
      document.querySelector(".angle-view").getAttribute("data-current")
    );
    const prevImageIndex = currentImageIndex - 1;
    console.log("prevImageIndex", prevImageIndex);
    window.angleViewer.goTo(prevImageIndex);
  }

  lastStep = step;
}

function getPercentFromX(x) {
  const rect = sliderArea.getBoundingClientRect();
  const clampedX = Math.max(0, Math.min(x - rect.left, rect.width));
  const percent = (clampedX / rect.width) * 100;
  return Math.max(0, Math.min(100, percent));
}

function startDrag(e) {
  e.preventDefault();

  const moveHandler = (eMove) => {
    const clientX = eMove.touches ? eMove.touches[0].clientX : eMove.clientX;
    currentPercent = getPercentFromX(clientX);
    updateKnobPosition(currentPercent);
  };

  const endHandler = () => {
    window.removeEventListener("mousemove", moveHandler);
    window.removeEventListener("touchmove", moveHandler);
    window.removeEventListener("mouseup", endHandler);
    window.removeEventListener("touchend", endHandler);
  };

  window.addEventListener("mousemove", moveHandler);
  window.addEventListener("touchmove", moveHandler);
  window.addEventListener("mouseup", endHandler);
  window.addEventListener("touchend", endHandler);
}

function initSliderKnob() {
  const images = document.querySelectorAll(".angle-image");
  if (images.length) {
    totalFrames = images.length;
  }

  updateKnobPosition(currentPercent);

  window.addEventListener("resize", () => {
    updateKnobPosition(currentPercent);
  });

  knob.addEventListener("mousedown", startDrag);
  knob.addEventListener("touchstart", startDrag, { passive: false });

  sliderArea.addEventListener("click", (e) => {
    const percent = getPercentFromX(e.clientX);
    currentPercent = percent;
    updateKnobPosition(currentPercent);
  });
}

const angleReadyInterval = setInterval(() => {
  if (window.angleViewer) {
    clearInterval(angleReadyInterval);
    initSliderKnob();
  }
}, 300);
