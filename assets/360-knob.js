class KnobController {
  constructor(options = {}) {
    this.knob = document.getElementById(options.knobId || "knob");
    this.sliderArea = document.getElementById(
      options.sliderAreaId || "sliderArea"
    );
    this.angleViewer = options.angleViewer;
    this.angleView = document.getElementById(
      options.angleViewId || "angle-view"
    );
    this.totalFrames = document.querySelectorAll(".angle-view li").length;
    this.currentPercent = 50;
    this.lastStep = null;
    this.isInitialized = false;
  }

  updateKnobPosition(percent) {
    const sliderRect = this.sliderArea.getBoundingClientRect();
    const knobWidth = this.knob.offsetWidth;
    const maxLeft = sliderRect.width - knobWidth;
    const left = (percent / 100) * maxLeft;
    this.knob.style.left = `${left}px`;

    const step = Math.floor((percent / 100) * this.totalFrames * 2);
    let bottom = this.calculateBottomPosition(percent);
    this.knob.style.bottom = `${bottom}px`;

    if (this.lastStep === null) {
      this.lastStep = step;
      return;
    }

    this.handleStepChange(step);
    this.lastStep = step;
  }

  calculateBottomPosition(percent) {
    const windowWidth = window.innerWidth;
    let bottom = 5;

    if (percent > 50) {
      bottom = 9 + (percent - 65) * (windowWidth > 500 ? 0.25 : 0.2);
    } else {
      const updatedPercent = 100 - percent;
      bottom = 9 + (updatedPercent - 65) * (windowWidth > 500 ? 0.25 : 0.2);
    }

    return bottom;
  }

  handleStepChange(step) {
    if (step > this.lastStep && this.angleViewer?.next) {
      const currentImageIndex = parseInt(
        this.angleView.getAttribute("data-current")
      );
      this.angleViewer.goTo(currentImageIndex + 1);
    } else if (step < this.lastStep && this.angleViewer?.prev) {
      const currentImageIndex = parseInt(
        this.angleView.getAttribute("data-current")
      );
      this.angleViewer.goTo(currentImageIndex - 1);
    }
  }

  getPercentFromX(x) {
    const rect = this.sliderArea.getBoundingClientRect();
    const clampedX = Math.max(0, Math.min(x - rect.left, rect.width));
    const percent = (clampedX / rect.width) * 100;
    return Math.max(0, Math.min(100, percent));
  }

  startDrag(e) {
    e.preventDefault();

    const moveHandler = (eMove) => {
      const clientX = eMove.touches ? eMove.touches[0].clientX : eMove.clientX;
      this.currentPercent = this.getPercentFromX(clientX);
      this.updateKnobPosition(this.currentPercent);
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

  init() {
    if (this.isInitialized) return;

    const images = document.querySelectorAll(".angle-image");
    if (images.length) {
      this.totalFrames = images.length;
    }

    this.updateKnobPosition(this.currentPercent);

    window.addEventListener("resize", () => {
      this.updateKnobPosition(this.currentPercent);
    });

    this.knob.addEventListener("mousedown", this.startDrag.bind(this));
    this.knob.addEventListener("touchstart", this.startDrag.bind(this), {
      passive: false,
    });

    this.sliderArea.addEventListener("click", (e) => {
      const percent = this.getPercentFromX(e.clientX);
      this.currentPercent = percent;
      this.updateKnobPosition(this.currentPercent);
    });

    this.isInitialized = true;
  }
}

class AngleViewer {
  constructor(sectionId) {
    this.sectionId = sectionId;
    this.instance = null;
    this.init();
  }

  init() {
    console.log("init", this);
    let loadInterval = setInterval(() => {
      if (window.$) {
        clearInterval(loadInterval);
        this.instance = $(`#angle-view-${this.sectionId}`).angle({
          speed: 2,
          previous: ".prev-image",
          next: ".next-image",
          drag: true,
          current: 1,
        });
        $(`#angle-view-${this.sectionId}`).addClass("ready");
        const instanceData = {
          instance: this.instance,
          sectionId: this.sectionId
        }
        window.angleViewerInstances = window.angleViewerInstances || [];
        window.angleViewerInstances.push(instanceData);
      }
    }, 500);
  }

  getInstance() {
    return this.instance;
  }
}
