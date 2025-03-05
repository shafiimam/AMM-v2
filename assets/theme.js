var __typeError = (msg) => {
    throw TypeError(msg);
  },
  __accessCheck = (obj, member, msg) =>
    member.has(obj) || __typeError("Cannot " + msg),
  __privateGet = (obj, member, getter) => (
    __accessCheck(obj, member, "read from private field"),
    getter ? getter.call(obj) : member.get(obj)
  ),
  __privateAdd = (obj, member, value) =>
    member.has(obj)
      ? __typeError("Cannot add the same private member more than once")
      : member instanceof WeakSet
      ? member.add(obj)
      : member.set(obj, value),
  __privateSet = (obj, member, value, setter) => (
    __accessCheck(obj, member, "write to private field"),
    setter ? setter.call(obj, value) : member.set(obj, value),
    value
  ),
  __privateMethod = (obj, member, method) => (
    __accessCheck(obj, member, "access private method"), method
  ),
  ConfirmButton = class extends HTMLElement {
    constructor() {
      super(),
        this.addEventListener("click", (event) => {
          window.confirm(
            this.getAttribute("data-message") ??
              "Once confirmed, this action cannot be undone."
          ) || event.preventDefault();
        });
    }
  };
window.customElements.get("confirm-button") ||
  window.customElements.define("confirm-button", ConfirmButton);
var _CopyButton_instances,
  copyToClipboard_fn,
  CopyButton = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _CopyButton_instances),
        this.addEventListener(
          "click",
          __privateMethod(this, _CopyButton_instances, copyToClipboard_fn)
        );
    }
    get buttonElement() {
      return this.querySelector("button");
    }
  };
(_CopyButton_instances = new WeakSet()),
  (copyToClipboard_fn = async function () {
    if (
      navigator.clipboard &&
      (await navigator.clipboard.writeText(
        this.getAttribute("data-text") ?? ""
      ),
      this.hasAttribute("data-success-message"))
    ) {
      const originalMessage = this.buttonElement.textContent;
      (this.buttonElement.textContent = this.getAttribute(
        "data-success-message"
      )),
        setTimeout(() => {
          this.buttonElement.textContent = originalMessage;
        }, 1500);
    }
  }),
  window.customElements.get("copy-button") ||
    window.customElements.define("copy-button", CopyButton);
var _ShareButton_instances,
  showSystemShare_fn,
  ShareButton = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _ShareButton_instances),
        navigator.share &&
          ((this.querySelector(".share-buttons--native").hidden = !1),
          this.addEventListener(
            "click",
            __privateMethod(this, _ShareButton_instances, showSystemShare_fn)
          ));
    }
  };
(_ShareButton_instances = new WeakSet()),
  (showSystemShare_fn = async function () {
    try {
      await navigator.share({
        title: this.hasAttribute("share-title")
          ? this.getAttribute("share-title")
          : document.title,
        url: this.hasAttribute("share-url")
          ? this.getAttribute("share-url")
          : window.location.href,
      });
    } catch {}
  }),
  window.customElements.get("share-button") ||
    window.customElements.define("share-button", ShareButton);
import { inView, animate } from "vendor";
var _currentAnimation,
  _MarqueeText_instances,
  direction_get,
  scroller_get,
  initialize_fn,
  MarqueeText = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _MarqueeText_instances),
        __privateAdd(this, _currentAnimation),
        inView(
          this,
          __privateMethod(this, _MarqueeText_instances, initialize_fn).bind(
            this
          ),
          { margin: "400px" }
        ),
        this.hasAttribute("pause-on-hover") &&
          (this.addEventListener("pointerenter", () =>
            __privateGet(this, _currentAnimation)?.pause()
          ),
          this.addEventListener("pointerleave", () =>
            __privateGet(this, _currentAnimation)?.play()
          ));
    }
  };
(_currentAnimation = new WeakMap()),
  (_MarqueeText_instances = new WeakSet()),
  (direction_get = function () {
    return this.getAttribute("direction") === "right" ? 1 : -1;
  }),
  (scroller_get = function () {
    return this.shadowRoot.querySelector('[part="scroller"]');
  }),
  (initialize_fn = function () {
    this.attachShadow({ mode: "open" }).appendChild(
      document.createRange().createContextualFragment(`
      <slot part="scroller"></slot>
    `)
    );
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= 5; ++i) {
      const node = this.firstElementChild.cloneNode(!0);
      node.setAttribute("aria-hidden", "true"),
        (node.style.cssText = `position: absolute; inset-inline-start: ${
          100 * i * -__privateGet(this, _MarqueeText_instances, direction_get)
        }%;`),
        fragment.appendChild(node);
    }
    this.append(fragment),
      __privateSet(
        this,
        _currentAnimation,
        animate(
          __privateGet(this, _MarqueeText_instances, scroller_get),
          {
            transform: [
              "translateX(0)",
              `translateX(calc(var(--transform-logical-flip) * ${
                __privateGet(this, _MarqueeText_instances, direction_get) * 100
              }%))`,
            ],
          },
          {
            duration:
              (1 / parseFloat(this.getAttribute("speed"))) *
              (__privateGet(this, _MarqueeText_instances, scroller_get)
                .clientWidth /
                300),
            easing: "linear",
            repeat: 1 / 0,
          }
        )
      );
  }),
  window.customElements.get("marquee-text") ||
    window.customElements.define("marquee-text", MarqueeText);
var _domElement,
  _thresholdDistance,
  _thresholdTime,
  _signal,
  _firstClientX,
  _tracking,
  _start,
  _GestureArea_instances,
  touchStart_fn,
  preventTouch_fn,
  gestureStart_fn,
  gestureMove_fn,
  gestureEnd_fn,
  GestureArea = class {
    constructor(
      domElement,
      { thresholdDistance = 80, thresholdTime = 500, signal = null } = {}
    ) {
      __privateAdd(this, _GestureArea_instances),
        __privateAdd(this, _domElement),
        __privateAdd(this, _thresholdDistance),
        __privateAdd(this, _thresholdTime),
        __privateAdd(this, _signal),
        __privateAdd(this, _firstClientX),
        __privateAdd(this, _tracking, !1),
        __privateAdd(this, _start, {}),
        __privateSet(this, _domElement, domElement),
        __privateSet(this, _thresholdDistance, thresholdDistance),
        __privateSet(this, _thresholdTime, thresholdTime),
        __privateSet(this, _signal, signal ?? new AbortController().signal),
        __privateGet(this, _domElement).addEventListener(
          "touchstart",
          __privateMethod(this, _GestureArea_instances, touchStart_fn).bind(
            this
          ),
          { passive: !0, signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "touchmove",
          __privateMethod(this, _GestureArea_instances, preventTouch_fn).bind(
            this
          ),
          { passive: !1, signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "pointerdown",
          __privateMethod(this, _GestureArea_instances, gestureStart_fn).bind(
            this
          ),
          { signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "pointermove",
          __privateMethod(this, _GestureArea_instances, gestureMove_fn).bind(
            this
          ),
          { passive: !1, signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "pointerup",
          __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(
            this
          ),
          { signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "pointerleave",
          __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(
            this
          ),
          { signal: __privateGet(this, _signal) }
        ),
        __privateGet(this, _domElement).addEventListener(
          "pointercancel",
          __privateMethod(this, _GestureArea_instances, gestureEnd_fn).bind(
            this
          ),
          { signal: __privateGet(this, _signal) }
        );
    }
  };
(_domElement = new WeakMap()),
  (_thresholdDistance = new WeakMap()),
  (_thresholdTime = new WeakMap()),
  (_signal = new WeakMap()),
  (_firstClientX = new WeakMap()),
  (_tracking = new WeakMap()),
  (_start = new WeakMap()),
  (_GestureArea_instances = new WeakSet()),
  (touchStart_fn = function (event) {
    __privateSet(this, _firstClientX, event.touches[0].clientX);
  }),
  (preventTouch_fn = function (event) {
    Math.abs(event.touches[0].clientX - __privateGet(this, _firstClientX)) >
      10 && event.preventDefault();
  }),
  (gestureStart_fn = function (event) {
    __privateSet(this, _tracking, !0),
      __privateSet(this, _start, {
        time: new Date().getTime(),
        x: event.clientX,
        y: event.clientY,
      });
  }),
  (gestureMove_fn = function (event) {
    __privateGet(this, _tracking) && event.preventDefault();
  }),
  (gestureEnd_fn = function (event) {
    if (!__privateGet(this, _tracking)) return;
    __privateSet(this, _tracking, !1);
    const now = new Date().getTime(),
      deltaTime = now - __privateGet(this, _start).time,
      deltaX = event.clientX - __privateGet(this, _start).x,
      deltaY = event.clientY - __privateGet(this, _start).y;
    if (deltaTime > __privateGet(this, _thresholdTime)) return;
    let matchedEvent;
    deltaX === 0 && deltaY === 0
      ? (matchedEvent = "tap")
      : deltaX > __privateGet(this, _thresholdDistance) &&
        Math.abs(deltaY) < __privateGet(this, _thresholdDistance)
      ? (matchedEvent = "swiperight")
      : -deltaX > __privateGet(this, _thresholdDistance) &&
        Math.abs(deltaY) < __privateGet(this, _thresholdDistance)
      ? (matchedEvent = "swipeleft")
      : deltaY > __privateGet(this, _thresholdDistance) &&
        Math.abs(deltaX) < __privateGet(this, _thresholdDistance)
      ? (matchedEvent = "swipedown")
      : -deltaY > __privateGet(this, _thresholdDistance) &&
        Math.abs(deltaX) < __privateGet(this, _thresholdDistance) &&
        (matchedEvent = "swipeup"),
      matchedEvent &&
        __privateGet(this, _domElement).dispatchEvent(
          new CustomEvent(matchedEvent, {
            bubbles: !0,
            composed: !0,
            detail: { originalEvent: event },
          })
        );
  });
var _onCountryChangedListener,
  _CountrySelector_instances,
  onCountryChanged_fn,
  CountrySelector = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CountrySelector_instances),
        __privateAdd(
          this,
          _onCountryChangedListener,
          __privateMethod(
            this,
            _CountrySelector_instances,
            onCountryChanged_fn
          ).bind(this)
        );
    }
    connectedCallback() {
      (this.countryElement = this.querySelector('[name="address[country]"]')),
        (this.provinceElement = this.querySelector(
          '[name="address[province]"]'
        )),
        this.countryElement.addEventListener(
          "change",
          __privateGet(this, _onCountryChangedListener)
        ),
        this.hasAttribute("country") &&
          this.getAttribute("country") !== "" &&
          (this.countryElement.selectedIndex = Math.max(
            0,
            Array.from(this.countryElement.options).findIndex(
              (option) => option.textContent === this.getAttribute("country")
            )
          )),
        this.countryElement.dispatchEvent(new Event("change"));
    }
    disconnectedCallback() {
      this.countryElement.removeEventListener(
        "change",
        __privateGet(this, _onCountryChangedListener)
      );
    }
  };
(_onCountryChangedListener = new WeakMap()),
  (_CountrySelector_instances = new WeakSet()),
  (onCountryChanged_fn = function () {
    const option =
        this.countryElement.options[this.countryElement.selectedIndex],
      provinces = JSON.parse(option.getAttribute("data-provinces"));
    (this.provinceElement.parentElement.hidden = provinces.length === 0),
      provinces.length !== 0 &&
        ((this.provinceElement.innerHTML = ""),
        provinces.forEach((data) => {
          const selected =
            data[1] === this.getAttribute("province") ||
            data[0] === this.getAttribute("province");
          this.provinceElement.options.add(
            new Option(data[1], data[0], selected, selected)
          );
        }));
  }),
  window.customElements.get("country-selector") ||
    window.customElements.define("country-selector", CountrySelector);
var cachedMap = new Map();
function cachedFetch(url, options) {
  const cacheKey = url;
  return cachedMap.has(cacheKey)
    ? Promise.resolve(new Response(new Blob([cachedMap.get(cacheKey)])))
    : fetch(url, options).then((response) => {
        if (response.status === 200) {
          const contentType = response.headers.get("Content-Type");
          contentType &&
            (contentType.match(/application\/json/i) ||
              contentType.match(/text\//i)) &&
            response
              .clone()
              .text()
              .then((content) => {
                cachedMap.set(cacheKey, content);
              });
        }
        return response;
      });
}
function extractSectionId(element) {
  return (
    (element = element.classList.contains("shopify-section")
      ? element
      : element.closest(".shopify-section")),
    element.id.replace("shopify-section-", "")
  );
}
function deepQuerySelector(root, selector) {
  let element = root.querySelector(selector);
  if (element) return element;
  for (const template of root.querySelectorAll("template"))
    if (((element = deepQuerySelector(template.content, selector)), element))
      return element;
  return null;
}
function throttle(callback) {
  let requestId = null,
    lastArgs;
  const later = (context) => () => {
      (requestId = null), callback.apply(context, lastArgs);
    },
    throttled = (...args) => {
      (lastArgs = args),
        requestId === null && (requestId = requestAnimationFrame(later(this)));
    };
  return (
    (throttled.cancel = () => {
      cancelAnimationFrame(requestId), (requestId = null);
    }),
    throttled
  );
}
function debounce(fn, delay) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer),
      (timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay));
  };
}
function waitForEvent(element, eventName) {
  return new Promise((resolve) => {
    const done = (event) => {
      event.target === element &&
        (element.removeEventListener(eventName, done), resolve(event));
    };
    element.addEventListener(eventName, done);
  });
}
function videoLoaded(videoOrArray) {
  return videoOrArray
    ? ((videoOrArray =
        videoOrArray instanceof Element
          ? [videoOrArray]
          : Array.from(videoOrArray)),
      Promise.all(
        videoOrArray.map(
          (video) =>
            new Promise((resolve) => {
              (video.tagName === "VIDEO" &&
                video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) ||
              !video.offsetParent ||
              video.parentNode.hasAttribute("suspended")
                ? resolve()
                : (video.oncanplay = () => resolve());
            })
        )
      ))
    : Promise.resolve();
}
function imageLoaded(imageOrArray) {
  return imageOrArray
    ? ((imageOrArray =
        imageOrArray instanceof Element
          ? [imageOrArray]
          : Array.from(imageOrArray)),
      Promise.all(
        imageOrArray.map(
          (image) =>
            new Promise((resolve) => {
              (image.tagName === "IMG" && image.complete) || !image.offsetParent
                ? resolve()
                : (image.onload = () => resolve());
            })
        )
      ))
    : Promise.resolve();
}
function generateSrcset(imageObjectOrString, widths = []) {
  let imageUrl, maxWidth;
  return (
    typeof imageObjectOrString == "string"
      ? ((imageUrl = new URL(
          imageObjectOrString.startsWith("//")
            ? `https:${imageObjectOrString}`
            : imageObjectOrString
        )),
        (maxWidth = parseInt(imageUrl.searchParams.get("width"))))
      : ((imageUrl = new URL(
          imageObjectOrString.src.startsWith("//")
            ? `https:${imageObjectOrString.src}`
            : imageObjectOrString.src
        )),
        (maxWidth = imageObjectOrString.width)),
    widths
      .filter((width) => width <= maxWidth)
      .map(
        (width) => (
          imageUrl.searchParams.set("width", width.toString()),
          `${imageUrl.href} ${width}w`
        )
      )
      .join(", ")
  );
}
function createMediaImg(media, widths = [], attributes = {}) {
  const image = new Image(
      media.preview_image.width,
      media.preview_image.height
    ),
    src = media.preview_image.src,
    featuredMediaUrl = new URL(src.startsWith("//") ? `https:${src}` : src);
  for (const attributeKey in attributes)
    image.setAttribute(attributeKey, attributes[attributeKey]);
  return (
    (image.alt = media.alt || ""),
    (image.src = featuredMediaUrl.href),
    (image.srcset = generateSrcset(media.preview_image, widths)),
    image
  );
}
function matchesMediaQuery(breakpointName) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName))
    throw `Media query ${breakpointName} does not exist`;
  return window.matchMedia(window.themeVariables.mediaQueries[breakpointName])
    .matches;
}
function mediaQueryListener(breakpointName, func) {
  if (!window.themeVariables.mediaQueries.hasOwnProperty(breakpointName))
    throw `Media query ${breakpointName} does not exist`;
  return window
    .matchMedia(window.themeVariables.mediaQueries[breakpointName])
    .addEventListener("change", func);
}
var _callback,
  _duration,
  _remainingTime,
  _startTime,
  _timer,
  _state,
  _onVisibilityChangeListener,
  _mustResumeOnVisibility,
  _Player_instances,
  onVisibilityChange_fn,
  Player = class extends EventTarget {
    constructor(durationInSec, stopOnVisibility = !0) {
      super(),
        __privateAdd(this, _Player_instances),
        __privateAdd(this, _callback),
        __privateAdd(this, _duration),
        __privateAdd(this, _remainingTime),
        __privateAdd(this, _startTime),
        __privateAdd(this, _timer),
        __privateAdd(this, _state, "paused"),
        __privateAdd(
          this,
          _onVisibilityChangeListener,
          __privateMethod(this, _Player_instances, onVisibilityChange_fn).bind(
            this
          )
        ),
        __privateAdd(this, _mustResumeOnVisibility, !0),
        __privateSet(this, _callback, () =>
          this.dispatchEvent(new CustomEvent("player:end"))
        ),
        __privateSet(
          this,
          _duration,
          __privateSet(this, _remainingTime, durationInSec * 1e3)
        ),
        stopOnVisibility &&
          document.addEventListener(
            "visibilitychange",
            __privateGet(this, _onVisibilityChangeListener)
          );
    }
    pause() {
      __privateGet(this, _state) === "started" &&
        (clearTimeout(__privateGet(this, _timer)),
        __privateSet(this, _state, "paused"),
        __privateSet(
          this,
          _remainingTime,
          __privateGet(this, _remainingTime) -
            (new Date().getTime() - __privateGet(this, _startTime))
        ),
        this.dispatchEvent(new CustomEvent("player:pause")));
    }
    resume(restartTimer = !1) {
      __privateGet(this, _state) !== "stopped" &&
        (restartTimer
          ? this.start()
          : (clearTimeout(__privateGet(this, _timer)),
            __privateSet(this, _startTime, new Date().getTime()),
            __privateSet(this, _state, "started"),
            __privateSet(
              this,
              _timer,
              setTimeout(
                __privateGet(this, _callback),
                __privateGet(this, _remainingTime)
              )
            ),
            this.dispatchEvent(new CustomEvent("player:resume"))));
    }
    start() {
      clearTimeout(__privateGet(this, _timer)),
        __privateSet(this, _startTime, new Date().getTime()),
        __privateSet(this, _state, "started"),
        __privateSet(this, _remainingTime, __privateGet(this, _duration)),
        __privateSet(
          this,
          _timer,
          setTimeout(
            __privateGet(this, _callback),
            __privateGet(this, _remainingTime)
          )
        ),
        this.dispatchEvent(new CustomEvent("player:start"));
    }
    stop() {
      clearTimeout(__privateGet(this, _timer)),
        __privateSet(this, _state, "stopped"),
        this.dispatchEvent(new CustomEvent("player:stop"));
    }
  };
(_callback = new WeakMap()),
  (_duration = new WeakMap()),
  (_remainingTime = new WeakMap()),
  (_startTime = new WeakMap()),
  (_timer = new WeakMap()),
  (_state = new WeakMap()),
  (_onVisibilityChangeListener = new WeakMap()),
  (_mustResumeOnVisibility = new WeakMap()),
  (_Player_instances = new WeakSet()),
  (onVisibilityChange_fn = function () {
    document.visibilityState === "hidden"
      ? (__privateSet(
          this,
          _mustResumeOnVisibility,
          __privateGet(this, _state) === "started"
        ),
        this.pause(),
        this.dispatchEvent(new CustomEvent("player:visibility-pause")))
      : document.visibilityState === "visible" &&
        __privateGet(this, _mustResumeOnVisibility) &&
        (this.resume(),
        this.dispatchEvent(new CustomEvent("player:visibility-resume")));
  });
var QrCode = class extends HTMLElement {
  connectedCallback() {
    new window.QRCode(this, {
      text: this.getAttribute("identifier"),
      width: this.hasAttribute("width")
        ? parseInt(this.getAttribute("width"))
        : 200,
      height: this.hasAttribute("height")
        ? parseInt(this.getAttribute("height"))
        : 200,
    });
  }
};
window.customElements.get("qr-code") ||
  window.customElements.define("qr-code", QrCode);
var _resizeObserver,
  _HeightObserver_instances,
  updateCustomProperties_fn,
  HeightObserver = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _HeightObserver_instances),
        __privateAdd(
          this,
          _resizeObserver,
          new ResizeObserver(
            throttle(
              __privateMethod(
                this,
                _HeightObserver_instances,
                updateCustomProperties_fn
              ).bind(this)
            )
          )
        );
    }
    connectedCallback() {
      __privateGet(this, _resizeObserver).observe(this),
        window.ResizeObserver ||
          document.documentElement.style.setProperty(
            `--${this.getAttribute("variable")}-height`,
            `${this.clientHeight.toFixed(2)}px`
          );
    }
    disconnectedCallback() {
      __privateGet(this, _resizeObserver).unobserve(this);
    }
  };
(_resizeObserver = new WeakMap()),
  (_HeightObserver_instances = new WeakSet()),
  (updateCustomProperties_fn = function (entries) {
    entries.forEach((entry) => {
      if (entry.target === this) {
        const height = entry.borderBoxSize
          ? entry.borderBoxSize.length > 0
            ? entry.borderBoxSize[0].blockSize
            : entry.borderBoxSize.blockSize
          : entry.target.clientHeight;
        document.documentElement.style.setProperty(
          `--${this.getAttribute("variable")}-height`,
          `${height.toFixed(2)}px`
        );
      }
    });
  }),
  window.customElements.get("height-observer") ||
    window.customElements.define("height-observer", HeightObserver);
import { animate as animate2 } from "vendor";
var _LoadingBar_instances,
  onLoadingStart_fn,
  onLoadingEnd_fn,
  LoadingBar = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _LoadingBar_instances),
        document.addEventListener(
          "theme:loading:start",
          __privateMethod(this, _LoadingBar_instances, onLoadingStart_fn).bind(
            this
          )
        ),
        document.addEventListener(
          "theme:loading:end",
          __privateMethod(this, _LoadingBar_instances, onLoadingEnd_fn).bind(
            this
          )
        );
    }
  };
(_LoadingBar_instances = new WeakSet()),
  (onLoadingStart_fn = function () {
    animate2(
      this,
      { opacity: [0, 1], transform: ["scaleX(0)", "scaleX(0.4)"] },
      { duration: 0.25 }
    );
  }),
  (onLoadingEnd_fn = async function () {
    await animate2(this, { transform: [null, "scaleX(1)"] }, { duration: 0.25 })
      .finished,
      animate2(this, { opacity: 0 }, { duration: 0.25 });
  }),
  window.customElements.get("loading-bar") ||
    window.customElements.define("loading-bar", LoadingBar);
import { inView as inView2 } from "vendor";
var _resizeObserver2,
  _checkPositionListener,
  _initialTop,
  _lastKnownY,
  _currentTop,
  _position,
  _SafeSticky_instances,
  recalculateStyles_fn,
  checkPosition_fn,
  SafeSticky = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _SafeSticky_instances),
        __privateAdd(
          this,
          _resizeObserver2,
          new ResizeObserver(
            __privateMethod(
              this,
              _SafeSticky_instances,
              recalculateStyles_fn
            ).bind(this)
          )
        ),
        __privateAdd(
          this,
          _checkPositionListener,
          throttle(
            __privateMethod(this, _SafeSticky_instances, checkPosition_fn).bind(
              this
            )
          )
        ),
        __privateAdd(this, _initialTop, 0),
        __privateAdd(this, _lastKnownY, 0),
        __privateAdd(this, _currentTop, 0),
        __privateAdd(this, _position, "relative");
    }
    connectedCallback() {
      inView2(
        this,
        () => (
          window.addEventListener(
            "scroll",
            __privateGet(this, _checkPositionListener)
          ),
          __privateGet(this, _resizeObserver2).observe(this),
          () => {
            window.removeEventListener(
              "scroll",
              __privateGet(this, _checkPositionListener)
            ),
              __privateGet(this, _resizeObserver2).unobserve(this);
          }
        ),
        { margin: "500px" }
      );
    }
    disconnectedCallback() {
      window.removeEventListener(
        "scroll",
        __privateGet(this, _checkPositionListener)
      ),
        __privateGet(this, _resizeObserver2).unobserve(this);
    }
  };
(_resizeObserver2 = new WeakMap()),
  (_checkPositionListener = new WeakMap()),
  (_initialTop = new WeakMap()),
  (_lastKnownY = new WeakMap()),
  (_currentTop = new WeakMap()),
  (_position = new WeakMap()),
  (_SafeSticky_instances = new WeakSet()),
  (recalculateStyles_fn = function () {
    this.style.removeProperty("top");
    const computedStyles = getComputedStyle(this);
    __privateSet(this, _initialTop, parseInt(computedStyles.top)),
      __privateSet(this, _position, computedStyles.position),
      __privateMethod(this, _SafeSticky_instances, checkPosition_fn).call(this);
  }),
  (checkPosition_fn = function () {
    if (__privateGet(this, _position) !== "sticky")
      return this.style.removeProperty("top");
    let bounds = this.getBoundingClientRect(),
      maxTop =
        bounds.top +
        window.scrollY -
        this.offsetTop +
        __privateGet(this, _initialTop),
      minTop = this.clientHeight - window.innerHeight + 20;
    window.scrollY < __privateGet(this, _lastKnownY)
      ? __privateSet(
          this,
          _currentTop,
          __privateGet(this, _currentTop) -
            (window.scrollY - __privateGet(this, _lastKnownY))
        )
      : __privateSet(
          this,
          _currentTop,
          __privateGet(this, _currentTop) +
            (__privateGet(this, _lastKnownY) - window.scrollY)
        ),
      __privateSet(
        this,
        _currentTop,
        Math.min(
          Math.max(__privateGet(this, _currentTop), -minTop),
          maxTop,
          __privateGet(this, _initialTop)
        )
      ),
      __privateSet(this, _lastKnownY, window.scrollY),
      (this.style.top = `${Math.round(__privateGet(this, _currentTop))}px`);
  }),
  window.customElements.get("safe-sticky") ||
    window.customElements.define("safe-sticky", SafeSticky);
var _abortController,
  _allItems,
  _CarouselNavigation_instances,
  onCarouselFilter_fn,
  CarouselNavigation = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CarouselNavigation_instances),
        __privateAdd(this, _abortController),
        __privateAdd(this, _allItems, []);
    }
    connectedCallback() {
      if (!this.carousel)
        throw "Carousel navigation component requires an aria-controls attribute that refers to the controlled carousel.";
      __privateSet(this, _abortController, new AbortController()),
        __privateSet(
          this,
          _allItems,
          Array.from(this.querySelectorAll("button"))
        ),
        __privateGet(this, _allItems).forEach((button) =>
          button.addEventListener(
            "click",
            () => this.onButtonClicked(this.items.indexOf(button)),
            { signal: __privateGet(this, _abortController).signal }
          )
        ),
        this.carousel.addEventListener(
          "carousel:change",
          (event) => this.onNavigationChange(event.detail.index),
          { signal: __privateGet(this, _abortController).signal }
        ),
        this.carousel.addEventListener(
          "carousel:filter",
          __privateMethod(
            this,
            _CarouselNavigation_instances,
            onCarouselFilter_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController).signal }
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController).abort();
    }
    get items() {
      return __privateGet(this, _allItems).filter(
        (item) => !item.hasAttribute("hidden")
      );
    }
    get carousel() {
      return document.getElementById(this.getAttribute("aria-controls"));
    }
    get selectedIndex() {
      return this.items.findIndex(
        (button) => button.getAttribute("aria-current") === "true"
      );
    }
    onButtonClicked(newIndex) {
      this.carousel.select(newIndex), this.onNavigationChange(newIndex);
    }
    onNavigationChange(newIndex) {
      this.items.forEach((button, index) =>
        button.setAttribute(
          "aria-current",
          newIndex === index ? "true" : "false"
        )
      ),
        this.hasAttribute("align-selected") &&
          (this.scrollWidth !== this.clientWidth ||
            this.scrollHeight !== this.clientHeight) &&
          this.scrollTo({
            left:
              this.items[newIndex].offsetLeft -
              this.clientWidth / 2 +
              this.items[newIndex].clientWidth / 2,
            top:
              this.items[newIndex].offsetTop -
              this.clientHeight / 2 +
              this.items[newIndex].clientHeight / 2,
            behavior: matchesMediaQuery("motion-safe") ? "smooth" : "auto",
          });
    }
  };
(_abortController = new WeakMap()),
  (_allItems = new WeakMap()),
  (_CarouselNavigation_instances = new WeakSet()),
  (onCarouselFilter_fn = function (event) {
    __privateGet(this, _allItems).forEach((item, index) => {
      item.toggleAttribute(
        "hidden",
        (event.detail.filteredIndexes || []).includes(index)
      );
    });
  });
var CarouselPrevButton = class extends HTMLElement {
    #abortController;
    connectedCallback() {
      if (!this.carousel)
        throw "Carousel prev button component requires an aria-controls attribute that refers to the controlled carousel.";
      (this.#abortController = new AbortController()),
        this.addEventListener("click", () => this.carousel.previous(), {
          signal: this.#abortController.signal,
        }),
        this.carousel.addEventListener(
          "scroll:edge-nearing",
          (event) =>
            (this.firstElementChild.disabled =
              event.detail.position === "start"),
          { signal: this.#abortController.signal }
        ),
        this.carousel.addEventListener(
          "scroll:edge-leaving",
          (event) =>
            (this.firstElementChild.disabled =
              event.detail.position === "start"
                ? !1
                : this.firstElementChild.disabled),
          { signal: this.#abortController.signal }
        );
    }
    disconnectedCallback() {
      this.#abortController.abort();
    }
    get carousel() {
      return document.getElementById(this.getAttribute("aria-controls"));
    }
  },
  CarouselNextButton = class extends HTMLElement {
    #abortController;
    connectedCallback() {
      if (!this.carousel)
        throw "Carousel next button component requires an aria-controls attribute that refers to the controlled carousel.";
      (this.#abortController = new AbortController()),
        this.addEventListener("click", () => this.carousel.next(), {
          signal: this.#abortController.signal,
        }),
        this.carousel.addEventListener(
          "scroll:edge-nearing",
          (event) =>
            (this.firstElementChild.disabled = event.detail.position === "end"),
          { signal: this.#abortController.signal }
        ),
        this.carousel.addEventListener(
          "scroll:edge-leaving",
          (event) =>
            (this.firstElementChild.disabled =
              event.detail.position === "end"
                ? !1
                : this.firstElementChild.disabled),
          { signal: this.#abortController.signal }
        );
    }
    disconnectedCallback() {
      this.#abortController.abort();
    }
    get carousel() {
      return document.getElementById(this.getAttribute("aria-controls"));
    }
  };
window.customElements.get("carousel-prev-button") ||
  window.customElements.define("carousel-prev-button", CarouselPrevButton),
  window.customElements.get("carousel-next-button") ||
    window.customElements.define("carousel-next-button", CarouselNextButton),
  window.customElements.get("carousel-navigation") ||
    window.customElements.define("carousel-navigation", CarouselNavigation);
import { animate as animate3, timeline, inView as inView3 } from "vendor";
var _listenersAbortController,
  _gestureArea,
  _player,
  _targetIndex,
  _preventInitialTransition,
  _EffectCarousel_instances,
  setupListeners_fn,
  onKeyboardNavigation_fn,
  preloadImages_fn,
  EffectCarousel = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _EffectCarousel_instances),
        __privateAdd(this, _listenersAbortController),
        __privateAdd(this, _gestureArea),
        __privateAdd(this, _player),
        __privateAdd(this, _targetIndex, 0),
        __privateAdd(this, _preventInitialTransition, !1),
        __privateMethod(
          this,
          _EffectCarousel_instances,
          setupListeners_fn
        ).call(this),
        inView3(this, () => this.onBecameVisible()),
        this.addEventListener("carousel:settle", (event) => {
          this.allCells.forEach((cell) =>
            cell.classList.toggle("is-selected", cell === event.detail.cell)
          );
        });
    }
    connectedCallback() {
      __privateSet(
        this,
        _targetIndex,
        Math.max(
          0,
          this.cells.findIndex((item) => item.classList.contains("is-selected"))
        )
      ),
        inView3(this, () =>
          __privateMethod(
            this,
            _EffectCarousel_instances,
            preloadImages_fn
          ).call(this)
        );
    }
    get allowSwipe() {
      return this.hasAttribute("allow-swipe");
    }
    get cellSelector() {
      return this.hasAttribute("cell-selector")
        ? this.getAttribute("cell-selector")
        : null;
    }
    get allCells() {
      return this.cellSelector
        ? Array.from(this.querySelectorAll(this.cellSelector))
        : Array.from(this.children);
    }
    get cells() {
      return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
    }
    get selectedCell() {
      return this.cells[this.selectedIndex];
    }
    get selectedIndex() {
      return __privateGet(this, _targetIndex);
    }
    get player() {
      return __privateGet(this, _player);
    }
    previous({ instant = !1 } = {}) {
      return this.select(
        (this.selectedIndex - 1 + this.cells.length) % this.cells.length,
        { instant, direction: "previous" }
      );
    }
    next({ instant = !1 } = {}) {
      return this.select(
        (this.selectedIndex + 1 + this.cells.length) % this.cells.length,
        { instant, direction: "next" }
      );
    }
    async select(index, { instant = !1, direction = null } = {}) {
      if (
        !(index in this.cells) ||
        (this.dispatchEvent(
          new CustomEvent("carousel:select", {
            detail: { index, cell: this.cells[index] },
          })
        ),
        index === this.selectedIndex)
      )
        return Promise.resolve();
      __privateGet(this, _player)?.pause();
      const [fromSlide, toSlide] = [this.selectedCell, this.cells[index]];
      (direction ??= index > this.selectedIndex ? "next" : "previous"),
        __privateSet(this, _targetIndex, index),
        this.dispatchEvent(
          new CustomEvent("carousel:change", {
            detail: { index, cell: this.cells[index] },
          })
        );
      const animationControls = this.createOnChangeAnimationControls(
        fromSlide,
        toSlide,
        { direction }
      );
      if (
        "leaveControls" in animationControls &&
        "enterControls" in animationControls
      ) {
        const leaveAnimationControls = animationControls.leaveControls();
        instant && leaveAnimationControls.finish(),
          await leaveAnimationControls.finished,
          __privateGet(this, _player)?.resume(!0),
          fromSlide.classList.remove("is-selected"),
          toSlide.classList.add("is-selected");
        const enterAnimationControls = animationControls.enterControls();
        instant && enterAnimationControls.finish(),
          await enterAnimationControls.finished;
      } else
        instant && animationControls.finish(),
          __privateGet(this, _player)?.resume(!0),
          toSlide.classList.add("is-selected"),
          await animationControls.finished,
          fromSlide.classList.remove("is-selected");
      this.dispatchEvent(
        new CustomEvent("carousel:settle", {
          detail: { index, cell: this.cells[index] },
        })
      );
    }
    filter(indexes = []) {
      this.allCells.forEach((cell, index) => {
        cell.toggleAttribute("hidden", indexes.includes(index));
      }),
        this.dispatchEvent(
          new CustomEvent("carousel:filter", {
            detail: { filteredIndexes: indexes },
          })
        );
    }
    async onBecameVisible() {
      const animationControls =
        await this.createOnBecameVisibleAnimationControls(this.selectedCell);
      return (
        [
          this.selectedCell,
          ...this.selectedCell.querySelectorAll("[reveal-on-scroll]"),
        ].forEach((element) => {
          element.removeAttribute("reveal-on-scroll");
        }),
        __privateGet(this, _preventInitialTransition) &&
          typeof animationControls.finish == "function" &&
          animationControls.finish(),
        animationControls.finished.then(() => {
          __privateGet(this, _player)?.resume(!0),
            this.dispatchEvent(
              new CustomEvent("carousel:settle", {
                detail: { index: this.selectedIndex, cell: this.selectedCell },
              })
            );
        })
      );
    }
    createOnBecameVisibleAnimationControls(toSlide) {
      return animate3(toSlide, {}, { duration: 0 });
    }
    createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
      return timeline([
        [fromSlide, { opacity: [1, 0] }, { duration: 0.3 }],
        [toSlide, { opacity: [0, 1] }, { duration: 0.3, at: "<" }],
      ]);
    }
    cleanUpAnimations() {
      this.allCells.forEach((cell) => {
        cell.style.removeProperty("opacity"),
          cell.style.removeProperty("visibility");
      });
    }
  };
(_listenersAbortController = new WeakMap()),
  (_gestureArea = new WeakMap()),
  (_player = new WeakMap()),
  (_targetIndex = new WeakMap()),
  (_preventInitialTransition = new WeakMap()),
  (_EffectCarousel_instances = new WeakSet()),
  (setupListeners_fn = function () {
    if (
      this.hasAttribute("disabled-on") &&
      (mediaQueryListener(this.getAttribute("disabled-on"), (event) => {
        event.matches
          ? (__privateGet(this, _listenersAbortController)?.abort(),
            this.cleanUpAnimations())
          : __privateMethod(
              this,
              _EffectCarousel_instances,
              setupListeners_fn
            ).call(this);
      }),
      matchesMediaQuery(this.getAttribute("disabled-on")))
    )
      return;
    __privateSet(this, _listenersAbortController, new AbortController());
    const listenerOptions = {
      signal: __privateGet(this, _listenersAbortController).signal,
    };
    Shopify.designMode &&
      this.closest(".shopify-section").addEventListener(
        "shopify:section:select",
        (event) =>
          __privateSet(this, _preventInitialTransition, event.detail.load),
        listenerOptions
      ),
      this.allCells.length > 1 &&
        (this.addEventListener(
          "carousel:change",
          __privateMethod(this, _EffectCarousel_instances, preloadImages_fn)
        ),
        this.allowSwipe &&
          (__privateSet(
            this,
            _gestureArea,
            new GestureArea(this, {
              signal: __privateGet(this, _listenersAbortController).signal,
            })
          ),
          this.addEventListener("swipeleft", this.next, listenerOptions),
          this.addEventListener("swiperight", this.previous, listenerOptions)),
        this.hasAttribute("disable-keyboard-navigation") ||
          ((this.tabIndex = 0),
          this.addEventListener(
            "keydown",
            __privateMethod(
              this,
              _EffectCarousel_instances,
              onKeyboardNavigation_fn
            ),
            listenerOptions
          )),
        Shopify.designMode &&
          this.addEventListener(
            "shopify:block:select",
            (event) =>
              this.select(this.cells.indexOf(event.target), {
                instant: event.detail.load,
              }),
            listenerOptions
          ),
        this.hasAttribute("autoplay") &&
          (__privateGet(this, _player) ??
            __privateSet(
              this,
              _player,
              new Player(this.getAttribute("autoplay") ?? 5)
            ),
          __privateGet(this, _player).addEventListener(
            "player:end",
            this.next.bind(this),
            listenerOptions
          ),
          Shopify.designMode &&
            (this.addEventListener(
              "shopify:block:select",
              () => __privateGet(this, _player).stop(),
              listenerOptions
            ),
            this.addEventListener(
              "shopify:block:deselect",
              () => __privateGet(this, _player).start(),
              listenerOptions
            ))));
  }),
  (onKeyboardNavigation_fn = function (event) {
    event.target === this &&
      (event.code === "ArrowLeft"
        ? this.previous()
        : event.code === "ArrowRight" && this.next());
  }),
  (preloadImages_fn = function () {
    const previousSlide =
        this.cells[
          (this.selectedIndex - 1 + this.cells.length) % this.cells.length
        ],
      nextSlide =
        this.cells[
          (this.selectedIndex + 1 + this.cells.length) % this.cells.length
        ];
    [previousSlide, this.selectedCell, nextSlide].forEach((item) => {
      Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach((img) =>
        img.removeAttribute("loading")
      ),
        Array.from(item.querySelectorAll('video[preload="none"]')).forEach(
          (video) => video.setAttribute("preload", "metadata")
        );
    });
  }),
  window.customElements.get("effect-carousel") ||
    window.customElements.define("effect-carousel", EffectCarousel);
import { inView as inView4 } from "vendor";
var _hasPendingProgrammaticScroll,
  _onMouseDownListener,
  _onMouseMoveListener,
  _onMouseClickListener,
  _onMouseUpListener,
  _targetIndex2,
  _forceChangeEvent,
  _dragPosition,
  _isDragging,
  _dispatchableScrollEvents,
  _scrollTimeout,
  _ScrollCarousel_instances,
  setupListeners_fn2,
  updateTargetIndex_fn,
  onScroll_fn,
  onScrollEnd_fn,
  calculateLeftScroll_fn,
  calculateClosestIndexToAlignment_fn,
  onMouseDown_fn,
  onMouseMove_fn,
  onMouseClick_fn,
  onMouseUp_fn,
  onResize_fn,
  onMutate_fn,
  adaptHeight_fn,
  preloadImages_fn2,
  ScrollCarousel = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _ScrollCarousel_instances),
        __privateAdd(this, _hasPendingProgrammaticScroll, !1),
        __privateAdd(
          this,
          _onMouseDownListener,
          __privateMethod(this, _ScrollCarousel_instances, onMouseDown_fn).bind(
            this
          )
        ),
        __privateAdd(
          this,
          _onMouseMoveListener,
          __privateMethod(this, _ScrollCarousel_instances, onMouseMove_fn).bind(
            this
          )
        ),
        __privateAdd(
          this,
          _onMouseClickListener,
          __privateMethod(
            this,
            _ScrollCarousel_instances,
            onMouseClick_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _onMouseUpListener,
          __privateMethod(this, _ScrollCarousel_instances, onMouseUp_fn).bind(
            this
          )
        ),
        __privateAdd(this, _targetIndex2, 0),
        __privateAdd(this, _forceChangeEvent, !1),
        __privateAdd(this, _dragPosition, {}),
        __privateAdd(this, _isDragging, !1),
        __privateAdd(this, _dispatchableScrollEvents, {
          nearingStart: !0,
          nearingEnd: !0,
          leavingStart: !0,
          leavingEnd: !0,
        }),
        __privateAdd(this, _scrollTimeout),
        __privateMethod(
          this,
          _ScrollCarousel_instances,
          setupListeners_fn2
        ).call(this),
        new ResizeObserver(
          __privateMethod(this, _ScrollCarousel_instances, onResize_fn).bind(
            this
          )
        ).observe(this),
        new MutationObserver(
          __privateMethod(this, _ScrollCarousel_instances, onMutate_fn).bind(
            this
          )
        ).observe(this, {
          subtree: !0,
          attributes: !0,
          attributeFilter: ["hidden"],
        });
    }
    connectedCallback() {
      __privateSet(
        this,
        _targetIndex2,
        Math.max(
          0,
          this.cells.findIndex((item) => item.classList.contains("is-initial"))
        )
      ),
        __privateGet(this, _targetIndex2) > 0 &&
          this.select(__privateGet(this, _targetIndex2), { instant: !0 }),
        this.adaptiveHeight &&
          __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(
            this
          ),
        inView4(this, () =>
          __privateMethod(
            this,
            _ScrollCarousel_instances,
            preloadImages_fn2
          ).call(this)
        );
    }
    disconnectedCallback() {
      this.removeEventListener(
        "mousemove",
        __privateGet(this, _onMouseMoveListener)
      ),
        document.removeEventListener(
          "mouseup",
          __privateGet(this, _onMouseUpListener)
        );
    }
    get cellSelector() {
      return this.hasAttribute("cell-selector")
        ? this.getAttribute("cell-selector")
        : null;
    }
    get allCells() {
      return this.cellSelector
        ? Array.from(this.querySelectorAll(this.cellSelector))
        : Array.from(this.children);
    }
    get cells() {
      return this.allCells.filter((cell) => !cell.hasAttribute("hidden"));
    }
    get selectedCell() {
      return this.cells[this.selectedIndex];
    }
    get selectedIndex() {
      return __privateGet(this, _targetIndex2);
    }
    get cellAlign() {
      const scrollSnapAlign = getComputedStyle(this.cells[0]).scrollSnapAlign;
      return scrollSnapAlign === "none" ? "center" : scrollSnapAlign;
    }
    get groupCells() {
      if (this.hasAttribute("group-cells")) {
        const number = parseInt(this.getAttribute("group-cells"));
        return isNaN(number)
          ? Math.floor(this.clientWidth / this.cells[0].clientWidth)
          : number;
      } else return 1;
    }
    get adaptiveHeight() {
      return this.hasAttribute("adaptive-height");
    }
    get isScrollable() {
      const differenceWidth = this.scrollWidth - this.clientWidth,
        differenceHeight = this.scrollHeight - this.clientHeight;
      return differenceWidth > 1 || differenceHeight > 1;
    }
    previous({ instant = !1 } = {}) {
      this.select(
        Math.max(__privateGet(this, _targetIndex2) - this.groupCells, 0),
        { instant }
      );
    }
    next({ instant = !1 } = {}) {
      this.select(
        Math.min(
          __privateGet(this, _targetIndex2) + this.groupCells,
          this.cells.length - 1
        ),
        { instant }
      );
    }
    select(index, { instant = !1 } = {}) {
      if (index in this.cells)
        if (
          (this.dispatchEvent(
            new CustomEvent("carousel:select", {
              detail: { index, cell: this.cells[index] },
            })
          ),
          ("checkVisibility" in this && this.checkVisibility()) ||
            (this.offsetWidth > 0 && this.offsetHeight > 0))
        ) {
          const targetScrollLeft = __privateMethod(
            this,
            _ScrollCarousel_instances,
            calculateLeftScroll_fn
          ).call(this, this.cells[index]);
          this.scrollLeft !== targetScrollLeft
            ? (__privateMethod(
                this,
                _ScrollCarousel_instances,
                updateTargetIndex_fn
              ).call(this, index),
              __privateSet(this, _hasPendingProgrammaticScroll, !0),
              this.scrollTo({
                left: targetScrollLeft,
                behavior: instant ? "auto" : "smooth",
              }))
            : __privateMethod(
                this,
                _ScrollCarousel_instances,
                updateTargetIndex_fn
              ).call(
                this,
                __privateMethod(
                  this,
                  _ScrollCarousel_instances,
                  calculateClosestIndexToAlignment_fn
                ).call(this)
              );
        } else
          __privateSet(this, _targetIndex2, index),
            __privateSet(this, _forceChangeEvent, !0);
    }
    filter(indexes = []) {
      this.allCells.forEach((cell, index) => {
        cell.toggleAttribute("hidden", indexes.includes(index));
      }),
        __privateSet(this, _forceChangeEvent, !0),
        this.dispatchEvent(
          new CustomEvent("carousel:filter", {
            detail: { filteredIndexes: indexes },
          })
        );
    }
  };
(_hasPendingProgrammaticScroll = new WeakMap()),
  (_onMouseDownListener = new WeakMap()),
  (_onMouseMoveListener = new WeakMap()),
  (_onMouseClickListener = new WeakMap()),
  (_onMouseUpListener = new WeakMap()),
  (_targetIndex2 = new WeakMap()),
  (_forceChangeEvent = new WeakMap()),
  (_dragPosition = new WeakMap()),
  (_isDragging = new WeakMap()),
  (_dispatchableScrollEvents = new WeakMap()),
  (_scrollTimeout = new WeakMap()),
  (_ScrollCarousel_instances = new WeakSet()),
  (setupListeners_fn2 = function () {
    if (this.allCells.length > 1) {
      if (
        (this.addEventListener(
          "carousel:change",
          __privateMethod(this, _ScrollCarousel_instances, preloadImages_fn2)
        ),
        this.addEventListener(
          "scroll",
          throttle(
            __privateMethod(this, _ScrollCarousel_instances, onScroll_fn).bind(
              this
            )
          )
        ),
        this.addEventListener(
          "scrollend",
          __privateMethod(this, _ScrollCarousel_instances, onScrollEnd_fn)
        ),
        this.hasAttribute("allow-drag"))
      ) {
        const mediaQuery = window.matchMedia("screen and (pointer: fine)");
        mediaQuery.addEventListener("change", (event) => {
          event.matches
            ? this.addEventListener(
                "mousedown",
                __privateGet(this, _onMouseDownListener)
              )
            : this.removeEventListener(
                "mousedown",
                __privateGet(this, _onMouseDownListener)
              );
        }),
          mediaQuery.matches &&
            this.addEventListener(
              "mousedown",
              __privateGet(this, _onMouseDownListener)
            );
      }
      this.adaptiveHeight &&
        this.addEventListener(
          "carousel:settle",
          __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn)
        ),
        Shopify.designMode &&
          this.addEventListener("shopify:block:select", (event) =>
            this.select(this.cells.indexOf(event.target), {
              instant: event.detail.load,
            })
          );
    }
  }),
  (updateTargetIndex_fn = function (newValue) {
    (newValue === __privateGet(this, _targetIndex2) &&
      !__privateGet(this, _forceChangeEvent)) ||
      (__privateSet(this, _targetIndex2, newValue),
      __privateSet(this, _forceChangeEvent, !1),
      this.dispatchEvent(
        new CustomEvent("carousel:change", {
          detail: { index: newValue, cell: this.cells[newValue] },
        })
      ));
  }),
  (onScroll_fn = function () {
    const normalizedScrollLeft = Math.round(Math.abs(this.scrollLeft));
    normalizedScrollLeft < 100 &&
      __privateGet(this, _dispatchableScrollEvents).nearingStart &&
      (this.dispatchEvent(
        new CustomEvent("scroll:edge-nearing", {
          detail: { position: "start" },
        })
      ),
      (__privateGet(this, _dispatchableScrollEvents).nearingStart = !1),
      (__privateGet(this, _dispatchableScrollEvents).leavingStart = !0)),
      normalizedScrollLeft >= 100 &&
        __privateGet(this, _dispatchableScrollEvents).leavingStart &&
        (this.dispatchEvent(
          new CustomEvent("scroll:edge-leaving", {
            detail: { position: "start" },
          })
        ),
        (__privateGet(this, _dispatchableScrollEvents).leavingStart = !1),
        (__privateGet(this, _dispatchableScrollEvents).nearingStart = !0)),
      this.scrollWidth - this.clientWidth < normalizedScrollLeft + 100 &&
        __privateGet(this, _dispatchableScrollEvents).nearingEnd &&
        (this.dispatchEvent(
          new CustomEvent("scroll:edge-nearing", {
            detail: { position: "end" },
          })
        ),
        (__privateGet(this, _dispatchableScrollEvents).nearingEnd = !1),
        (__privateGet(this, _dispatchableScrollEvents).leavingEnd = !0)),
      this.scrollWidth - this.clientWidth >= normalizedScrollLeft + 100 &&
        __privateGet(this, _dispatchableScrollEvents).leavingEnd &&
        (this.dispatchEvent(
          new CustomEvent("scroll:edge-leaving", {
            detail: { position: "end" },
          })
        ),
        (__privateGet(this, _dispatchableScrollEvents).leavingEnd = !1),
        (__privateGet(this, _dispatchableScrollEvents).nearingEnd = !0)),
      "onscrollend" in window ||
        (clearTimeout(__privateGet(this, _scrollTimeout)),
        __privateSet(
          this,
          _scrollTimeout,
          setTimeout(() => {
            this.dispatchEvent(new CustomEvent("scrollend", { bubbles: !0 }));
          }, 75)
        )),
      !__privateGet(this, _hasPendingProgrammaticScroll) &&
        __privateMethod(
          this,
          _ScrollCarousel_instances,
          updateTargetIndex_fn
        ).call(
          this,
          __privateMethod(
            this,
            _ScrollCarousel_instances,
            calculateClosestIndexToAlignment_fn
          ).call(this)
        );
  }),
  (onScrollEnd_fn = function () {
    __privateSet(this, _hasPendingProgrammaticScroll, !1),
      __privateGet(this, _isDragging) ||
        this.style.removeProperty("scroll-snap-type"),
      __privateMethod(
        this,
        _ScrollCarousel_instances,
        updateTargetIndex_fn
      ).call(
        this,
        __privateMethod(
          this,
          _ScrollCarousel_instances,
          calculateClosestIndexToAlignment_fn
        ).call(this)
      ),
      this.dispatchEvent(
        new CustomEvent("carousel:settle", {
          detail: { index: this.selectedIndex, cell: this.selectedCell },
        })
      );
  }),
  (calculateLeftScroll_fn = function (cell) {
    let scrollLeft;
    switch (this.cellAlign) {
      case "start":
        scrollLeft =
          document.dir === "ltr"
            ? cell.offsetLeft -
              (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0)
            : cell.offsetLeft +
              cell.offsetWidth -
              this.clientWidth +
              (parseInt(getComputedStyle(this).scrollPaddingInlineStart) || 0);
        break;
      case "center":
        scrollLeft = Math.round(
          cell.offsetLeft - this.clientWidth / 2 + cell.clientWidth / 2
        );
        break;
      case "end":
        scrollLeft =
          document.dir === "ltr"
            ? cell.offsetLeft +
              cell.offsetWidth -
              this.clientWidth +
              (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0)
            : cell.offsetLeft -
              (parseInt(getComputedStyle(this).scrollPaddingInlineEnd) || 0);
        break;
    }
    return document.dir === "ltr"
      ? Math.min(Math.max(scrollLeft, 0), this.scrollWidth - this.clientWidth)
      : Math.min(Math.max(scrollLeft, this.clientWidth - this.scrollWidth), 0);
  }),
  (calculateClosestIndexToAlignment_fn = function () {
    let cellAlign = this.cellAlign,
      offsetAccumulators,
      targetPoint;
    return (
      cellAlign === "center"
        ? ((offsetAccumulators = this.cells.map((cell) =>
            Math.round(cell.offsetLeft + cell.clientWidth / 2)
          )),
          (targetPoint = Math.round(this.scrollLeft + this.clientWidth / 2)))
        : (cellAlign === "start" && document.dir === "ltr") ||
          (cellAlign === "end" && document.dir === "rtl")
        ? ((offsetAccumulators = this.cells.map((cell) => cell.offsetLeft)),
          (targetPoint = this.scrollLeft))
        : ((offsetAccumulators = this.cells.map(
            (cell) => cell.offsetLeft + cell.clientWidth
          )),
          (targetPoint = this.scrollLeft + this.clientWidth)),
      offsetAccumulators.indexOf(
        offsetAccumulators.reduce((prev, curr) =>
          Math.abs(curr - targetPoint) < Math.abs(prev - targetPoint)
            ? curr
            : prev
        )
      )
    );
  }),
  (onMouseDown_fn = function (event) {
    __privateSet(this, _dragPosition, {
      left: this.scrollLeft,
      top: this.scrollTop,
      x: event.clientX,
      y: event.clientY,
    }),
      __privateSet(this, _isDragging, !0),
      this.style.setProperty("scroll-snap-type", "none"),
      this.addEventListener(
        "mousemove",
        __privateGet(this, _onMouseMoveListener)
      ),
      this.addEventListener(
        "click",
        __privateGet(this, _onMouseClickListener),
        { once: !0 }
      ),
      document.addEventListener(
        "mouseup",
        __privateGet(this, _onMouseUpListener)
      );
  }),
  (onMouseMove_fn = function (event) {
    event.preventDefault();
    const [dx, dy] = [
      event.clientX - __privateGet(this, _dragPosition).x,
      event.clientY - __privateGet(this, _dragPosition).y,
    ];
    (this.scrollTop = __privateGet(this, _dragPosition).top - dy),
      (this.scrollLeft = __privateGet(this, _dragPosition).left - dx);
  }),
  (onMouseClick_fn = function (event) {
    event.clientX - __privateGet(this, _dragPosition).x !== 0 &&
      event.preventDefault();
  }),
  (onMouseUp_fn = function (event) {
    __privateSet(this, _isDragging, !1),
      event.clientX - __privateGet(this, _dragPosition).x === 0
        ? this.style.removeProperty("scroll-snap-type")
        : __privateGet(this, _hasPendingProgrammaticScroll) ||
          this.scrollTo({
            left: __privateMethod(
              this,
              _ScrollCarousel_instances,
              calculateLeftScroll_fn
            ).call(this, this.selectedCell),
            behavior: "smooth",
          }),
      this.removeEventListener(
        "mousemove",
        __privateGet(this, _onMouseMoveListener)
      ),
      document.removeEventListener(
        "mouseup",
        __privateGet(this, _onMouseUpListener)
      );
  }),
  (onResize_fn = function () {
    this.selectedIndex !==
      __privateMethod(
        this,
        _ScrollCarousel_instances,
        calculateClosestIndexToAlignment_fn
      ).call(this) && this.select(this.selectedIndex, { instant: !0 }),
      this.adaptiveHeight &&
        __privateMethod(this, _ScrollCarousel_instances, adaptHeight_fn).call(
          this
        ),
      this.classList.toggle(
        "is-scrollable",
        this.scrollWidth > this.clientWidth
      );
  }),
  (onMutate_fn = function () {
    __privateSet(this, _forceChangeEvent, !0);
  }),
  (adaptHeight_fn = function () {
    this.clientHeight !== this.selectedCell.clientHeight &&
      ((this.style.maxHeight = null),
      this.isScrollable &&
        (this.style.maxHeight = `${this.selectedCell.clientHeight}px`));
  }),
  (preloadImages_fn2 = function () {
    requestAnimationFrame(() => {
      const previousSlide = this.cells[Math.max(this.selectedIndex - 1, 0)],
        nextSlide =
          this.cells[Math.min(this.selectedIndex + 1, this.cells.length - 1)];
      [previousSlide, this.selectedCell, nextSlide]
        .filter((item) => item !== null)
        .forEach((item) => {
          Array.from(item.querySelectorAll('img[loading="lazy"]')).forEach(
            (img) => img.removeAttribute("loading")
          ),
            Array.from(item.querySelectorAll('video[preload="none"]')).forEach(
              (video) => video.setAttribute("preload", "metadata")
            );
        });
    });
  }),
  window.customElements.get("scroll-carousel") ||
    window.customElements.define("scroll-carousel", ScrollCarousel);
var createCartPromise = () =>
    new Promise(async (resolve) => {
      resolve(await (await fetch(`${Shopify.routes.root}cart.js`)).json());
    }),
  fetchCart = createCartPromise();
document.addEventListener("cart:change", (event) => {
  fetchCart = event.detail.cart;
}),
  window.addEventListener("pageshow", (event) => {
    event.persisted && (fetchCart = createCartPromise());
  }),
  document.addEventListener("cart:refresh", () => {
    fetchCart = createCartPromise();
  });
var _abortController2,
  _CartCount_instances,
  updateFromServer_fn,
  CartCount = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CartCount_instances),
        __privateAdd(this, _abortController2);
    }
    connectedCallback() {
      __privateSet(this, _abortController2, new AbortController()),
        document.addEventListener(
          "cart:change",
          (event) => (this.itemCount = event.detail.cart.item_count),
          { signal: __privateGet(this, _abortController2).signal }
        ),
        document.addEventListener(
          "cart:refresh",
          __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(
            this
          ),
          { signal: __privateGet(this, _abortController2).signal }
        ),
        window.addEventListener(
          "pageshow",
          __privateMethod(this, _CartCount_instances, updateFromServer_fn).bind(
            this
          ),
          { signal: __privateGet(this, _abortController2).signal }
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController2).abort();
    }
    set itemCount(count) {
      this.innerText = count;
    }
  };
(_abortController2 = new WeakMap()),
  (_CartCount_instances = new WeakSet()),
  (updateFromServer_fn = async function () {
    this.itemCount = (await fetchCart).item_count;
  }),
  window.customElements.get("cart-count") ||
    window.customElements.define("cart-count", CartCount);
var _abortController3,
  _CartDot_instances,
  updateFromServer_fn2,
  CartDot = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CartDot_instances),
        __privateAdd(this, _abortController3);
    }
    connectedCallback() {
      __privateSet(this, _abortController3, new AbortController()),
        document.addEventListener(
          "cart:change",
          (event) =>
            this.classList.toggle(
              "is-visible",
              event.detail.cart.item_count > 0
            ),
          { signal: __privateGet(this, _abortController3).signal }
        ),
        document.addEventListener(
          "cart:refresh",
          __privateMethod(this, _CartDot_instances, updateFromServer_fn2).bind(
            this
          ),
          { signal: __privateGet(this, _abortController3).signal }
        ),
        window.addEventListener(
          "pageshow",
          __privateMethod(this, _CartDot_instances, updateFromServer_fn2).bind(
            this
          ),
          { signal: __privateGet(this, _abortController3).signal }
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController3).abort();
    }
  };
(_abortController3 = new WeakMap()),
  (_CartDot_instances = new WeakSet()),
  (updateFromServer_fn2 = async function () {
    this.classList.toggle("is-visible", (await fetchCart).item_count > 0);
  }),
  window.customElements.get("cart-dot") ||
    window.customElements.define("cart-dot", CartDot);
var _CartNote_instances,
  onNoteChanged_fn,
  CartNote = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _CartNote_instances),
        this.addEventListener(
          "change",
          __privateMethod(this, _CartNote_instances, onNoteChanged_fn)
        );
    }
  };
(_CartNote_instances = new WeakSet()),
  (onNoteChanged_fn = function (event) {
    event.target.getAttribute("name") === "note" &&
      fetch(`${Shopify.routes.root}cart/update.js`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: event.target.value }),
        keepalive: !0,
      });
  }),
  window.customElements.get("cart-note") ||
    window.customElements.define("cart-note", CartNote);
var _onCartChangedListener,
  _currencyFormatter,
  _threshold,
  _FreeShippingBar_instances,
  updateMessage_fn,
  onCartChanged_fn,
  FreeShippingBar = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _FreeShippingBar_instances),
        __privateAdd(
          this,
          _onCartChangedListener,
          __privateMethod(
            this,
            _FreeShippingBar_instances,
            onCartChanged_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _currencyFormatter,
          new Intl.NumberFormat(Shopify.locale, {
            style: "currency",
            currency: Shopify.currency.active,
          })
        ),
        __privateAdd(this, _threshold),
        __privateSet(
          this,
          _threshold,
          parseFloat(this.getAttribute("threshold").replace(/[^0-9.]/g, "")) *
            100
        ),
        this.setAttribute("threshold", __privateGet(this, _threshold));
    }
    static get observedAttributes() {
      return ["threshold", "total-price"];
    }
    connectedCallback() {
      document.addEventListener(
        "cart:change",
        __privateGet(this, _onCartChangedListener)
      );
    }
    disconnectedCallback() {
      document.removeEventListener(
        "cart:change",
        __privateGet(this, _onCartChangedListener)
      );
    }
    get totalPrice() {
      return parseFloat(this.getAttribute("total-price"));
    }
    set totalPrice(value) {
      this.setAttribute("total-price", value);
    }
    attributeChangedCallback() {
      __privateMethod(this, _FreeShippingBar_instances, updateMessage_fn).call(
        this
      );
    }
  };
(_onCartChangedListener = new WeakMap()),
  (_currencyFormatter = new WeakMap()),
  (_threshold = new WeakMap()),
  (_FreeShippingBar_instances = new WeakSet()),
  (updateMessage_fn = function () {
    const messageElement = this.querySelector("span");
    if (this.totalPrice >= __privateGet(this, _threshold))
      messageElement.innerHTML = this.getAttribute("reached-message");
    else {
      const replacement = `${__privateGet(this, _currencyFormatter)
        .format((__privateGet(this, _threshold) - this.totalPrice) / 100)
        .replace(/\$/g, "$$$$")}`;
      messageElement.innerHTML = this.getAttribute("unreached-message").replace(
        new RegExp("({{.*}})", "g"),
        replacement
      );
    }
  }),
  (onCartChanged_fn = function (event) {
    const priceForItems = event.detail.cart.items
        .filter((item) => item.requires_shipping)
        .reduce((sum, item) => sum + item.final_line_price, 0),
      cartDiscount = event.detail.cart.cart_level_discount_applications.reduce(
        (sum, discountAllocation) =>
          sum + discountAllocation.total_allocated_amount,
        0
      );
    this.totalPrice = priceForItems - cartDiscount;
  }),
  window.customElements.get("free-shipping-bar") ||
    window.customElements.define("free-shipping-bar", FreeShippingBar);
import { Delegate } from "vendor";
var _delegate,
  _LineItemQuantity_instances,
  onQuantityChanged_fn,
  onChangeLinkClicked_fn,
  changeLineItemQuantity_fn,
  LineItemQuantity = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _LineItemQuantity_instances),
        __privateAdd(this, _delegate, new Delegate(this)),
        __privateGet(this, _delegate).on(
          "change",
          "[data-line-key]",
          __privateMethod(
            this,
            _LineItemQuantity_instances,
            onQuantityChanged_fn
          ).bind(this)
        ),
        __privateGet(this, _delegate).on(
          "click",
          '[href*="/cart/change"]',
          __privateMethod(
            this,
            _LineItemQuantity_instances,
            onChangeLinkClicked_fn
          ).bind(this)
        );
    }
  };
(_delegate = new WeakMap()),
  (_LineItemQuantity_instances = new WeakSet()),
  (onQuantityChanged_fn = function (event, target) {
    __privateMethod(
      this,
      _LineItemQuantity_instances,
      changeLineItemQuantity_fn
    ).call(this, target.getAttribute("data-line-key"), parseInt(target.value));
  }),
  (onChangeLinkClicked_fn = function (event, target) {
    event.preventDefault();
    const url = new URL(target.href);
    __privateMethod(
      this,
      _LineItemQuantity_instances,
      changeLineItemQuantity_fn
    ).call(
      this,
      url.searchParams.get("id"),
      parseInt(url.searchParams.get("quantity"))
    );
  }),
  (changeLineItemQuantity_fn = async function (lineKey, targetQuantity) {
    if (window.themeVariables.settings.pageType === "cart")
      window.location.href = `${Shopify.routes.root}cart/change?id=${lineKey}&quantity=${targetQuantity}`;
    else {
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:start", { bubbles: !0 })
      );
      const lineItem = this.closest("line-item");
      lineItem?.dispatchEvent(
        new CustomEvent("line-item:will-change", {
          bubbles: !0,
          detail: { targetQuantity },
        })
      );
      let sectionsToBundle = [];
      document.documentElement.dispatchEvent(
        new CustomEvent("cart:prepare-bundled-sections", {
          bubbles: !0,
          detail: { sections: sectionsToBundle },
        })
      );
      const cartContent = await (
        await fetch(`${Shopify.routes.root}cart/change.js`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: lineKey,
            quantity: targetQuantity,
            sections: sectionsToBundle.join(","),
          }),
        })
      ).json();
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      );
      const lineItemAfterChange = cartContent.items.filter(
        (lineItem2) => lineItem2.key === lineKey
      );
      lineItem?.dispatchEvent(
        new CustomEvent("line-item:change", {
          bubbles: !0,
          detail: {
            quantity:
              lineItemAfterChange.length === 0
                ? 0
                : lineItemAfterChange[0].quantity,
            cart: cartContent,
          },
        })
      ),
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:change", {
            bubbles: !0,
            detail: { baseEvent: "line-item:change", cart: cartContent },
          })
        );
    }
  }),
  window.customElements.get("line-item-quantity") ||
    window.customElements.define("line-item-quantity", LineItemQuantity);
var _estimateShippingListener,
  _ShippingEstimator_instances,
  estimateShipping_fn,
  getAsyncShippingRates_fn,
  formatShippingRates_fn,
  formatError_fn,
  ShippingEstimator = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ShippingEstimator_instances),
        __privateAdd(
          this,
          _estimateShippingListener,
          __privateMethod(
            this,
            _ShippingEstimator_instances,
            estimateShipping_fn
          ).bind(this)
        );
    }
    connectedCallback() {
      (this.submitButton = this.querySelector('[type="button"]')),
        (this.resultsElement = this.querySelector('[aria-live="polite"]')),
        this.submitButton.addEventListener(
          "click",
          __privateGet(this, _estimateShippingListener)
        );
    }
    disconnectedCallback() {
      this.submitButton.removeEventListener(
        "click",
        __privateGet(this, _estimateShippingListener)
      );
    }
  };
(_estimateShippingListener = new WeakMap()),
  (_ShippingEstimator_instances = new WeakSet()),
  (estimateShipping_fn = async function (event) {
    event.preventDefault();
    const zip = this.querySelector('[name="address[zip]"]').value,
      country = this.querySelector('[name="address[country]"]').value,
      province = this.querySelector('[name="address[province]"]').value;
    this.submitButton.setAttribute("aria-busy", "true"),
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:start", { bubbles: !0 })
      );
    const prepareResponse = await fetch(
      `${Shopify.routes.root}cart/prepare_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`,
      { method: "POST" }
    );
    if (
      (document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      ),
      prepareResponse.ok)
    ) {
      const shippingRates = await __privateMethod(
        this,
        _ShippingEstimator_instances,
        getAsyncShippingRates_fn
      ).call(this, zip, country, province);
      __privateMethod(
        this,
        _ShippingEstimator_instances,
        formatShippingRates_fn
      ).call(this, shippingRates);
    } else {
      const jsonError = await prepareResponse.json();
      __privateMethod(this, _ShippingEstimator_instances, formatError_fn).call(
        this,
        jsonError
      );
    }
    (this.resultsElement.hidden = !1),
      this.submitButton.removeAttribute("aria-busy");
  }),
  (getAsyncShippingRates_fn = async function (zip, country, province) {
    const responseAsText = await (
      await fetch(
        `${Shopify.routes.root}cart/async_shipping_rates.json?shipping_address[zip]=${zip}&shipping_address[country]=${country}&shipping_address[province]=${province}`
      )
    ).text();
    return responseAsText === "null"
      ? __privateMethod(
          this,
          _ShippingEstimator_instances,
          getAsyncShippingRates_fn
        ).call(this, zip, country, province)
      : JSON.parse(responseAsText).shipping_rates;
  }),
  (formatShippingRates_fn = function (shippingRates) {
    let formattedShippingRates = shippingRates.map(
      (shippingRate) =>
        `<li>${shippingRate.presentment_name}: ${shippingRate.currency} ${shippingRate.price}</li>`
    );
    this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${
          shippingRates.length === 0
            ? window.themeVariables.strings.shippingEstimatorNoResults
            : shippingRates.length === 1
            ? window.themeVariables.strings.shippingEstimatorOneResult
            : window.themeVariables.strings.shippingEstimatorMultipleResults
        }</p>
        ${
          formattedShippingRates === ""
            ? ""
            : `<ul class="list-disc" role="list">${formattedShippingRates}</ul>`
        }
      </div>
    `;
  }),
  (formatError_fn = function (errors) {
    let formattedShippingRates = Object.keys(errors)
      .map((errorKey) => `<li>${errors[errorKey]}</li>`)
      .join("");
    this.resultsElement.innerHTML = `
      <div class="v-stack gap-2">
        <p>${window.themeVariables.strings.shippingEstimatorError}</p>
        <ul class="list-disc" role="list">${formattedShippingRates}</ul>
      </div>
    `;
  }),
  window.customElements.get("shipping-estimator") ||
    window.customElements.define("shipping-estimator", ShippingEstimator);
var _isDirty,
  _FacetsForm_instances,
  form_get,
  buildUrl_fn,
  onFormChanged_fn,
  onFormSubmitted_fn,
  FacetsForm = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _FacetsForm_instances),
        __privateAdd(this, _isDirty, !1),
        this.addEventListener(
          "change",
          __privateMethod(this, _FacetsForm_instances, onFormChanged_fn)
        ),
        this.addEventListener(
          "submit",
          __privateMethod(this, _FacetsForm_instances, onFormSubmitted_fn)
        );
    }
  };
(_isDirty = new WeakMap()),
  (_FacetsForm_instances = new WeakSet()),
  (form_get = function () {
    return this.querySelector("form");
  }),
  (buildUrl_fn = function () {
    const searchParams = new URLSearchParams(
        new FormData(__privateGet(this, _FacetsForm_instances, form_get))
      ),
      url = new URL(__privateGet(this, _FacetsForm_instances, form_get).action);
    return (
      (url.search = ""),
      searchParams.forEach((value, key) => url.searchParams.append(key, value)),
      ["page", "filter.v.price.gte", "filter.v.price.lte"].forEach(
        (optionToClear) => {
          url.searchParams.get(optionToClear) === "" &&
            url.searchParams.delete(optionToClear);
        }
      ),
      url.searchParams.set("section_id", this.getAttribute("section-id")),
      url
    );
  }),
  (onFormChanged_fn = function () {
    __privateSet(this, _isDirty, !0),
      this.hasAttribute("update-on-change")
        ? HTMLFormElement.prototype.requestSubmit
          ? __privateGet(this, _FacetsForm_instances, form_get).requestSubmit()
          : __privateGet(this, _FacetsForm_instances, form_get).dispatchEvent(
              new Event("submit", { cancelable: !0 })
            )
        : cachedFetch(
            __privateMethod(this, _FacetsForm_instances, buildUrl_fn)
              .call(this)
              .toString()
          );
  }),
  (onFormSubmitted_fn = function (event) {
    event.preventDefault(),
      __privateGet(this, _isDirty) &&
        (this.dispatchEvent(
          new CustomEvent("facet:update", {
            bubbles: !0,
            detail: {
              url: __privateMethod(
                this,
                _FacetsForm_instances,
                buildUrl_fn
              ).call(this),
            },
          })
        ),
        __privateSet(this, _isDirty, !1));
  }),
  window.customElements.get("facets-form") ||
    window.customElements.define("facets-form", FacetsForm);
import { animate as animate4, FocusTrap, Delegate as Delegate2 } from "vendor";
var lockLayerCount = 0,
  _isLocked,
  _delegate2,
  _abortController4,
  _focusTrap,
  _originalParentBeforeAppend,
  _DialogElement_instances,
  allowOutsideClick_fn,
  allowOutsideClickTouch_fn,
  allowOutsideClickMouse_fn,
  onToggleClicked_fn,
  updateSlotVisibility_fn,
  DialogElement = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _DialogElement_instances),
        __privateAdd(this, _isLocked, !1),
        __privateAdd(this, _delegate2, new Delegate2(document.body)),
        __privateAdd(this, _abortController4),
        __privateAdd(this, _focusTrap),
        __privateAdd(this, _originalParentBeforeAppend),
        this.shadowDomTemplate &&
          (this.attachShadow({ mode: "open" }).appendChild(
            document
              .getElementById(this.shadowDomTemplate)
              .content.cloneNode(!0)
          ),
          this.shadowRoot.addEventListener("slotchange", (event) =>
            __privateMethod(
              this,
              _DialogElement_instances,
              updateSlotVisibility_fn
            ).call(this, event.target)
          )),
        this.addEventListener("dialog:force-close", (event) => {
          this.hide(), event.stopPropagation();
        });
    }
    static get observedAttributes() {
      return ["id", "open"];
    }
    connectedCallback() {
      this.id &&
        __privateGet(this, _delegate2)
          .off()
          .on(
            "click",
            `[aria-controls="${this.id}"]`,
            __privateMethod(
              this,
              _DialogElement_instances,
              onToggleClicked_fn
            ).bind(this)
          ),
        __privateSet(this, _abortController4, new AbortController()),
        this.setAttribute("role", "dialog"),
        this.shadowDomTemplate &&
          (this.getShadowPartByName("overlay")?.addEventListener(
            "click",
            this.hide.bind(this),
            { signal: this.abortController.signal }
          ),
          Array.from(this.shadowRoot.querySelectorAll("slot")).forEach((slot) =>
            __privateMethod(
              this,
              _DialogElement_instances,
              updateSlotVisibility_fn
            ).call(this, slot)
          )),
        Shopify.designMode &&
          (this.addEventListener(
            "shopify:block:select",
            (event) => this.show(!event.detail.load),
            { signal: this.abortController.signal }
          ),
          this.addEventListener("shopify:block:deselect", this.hide, {
            signal: this.abortController.signal,
          }),
          (this._shopifySection =
            this._shopifySection || this.closest(".shopify-section")),
          this._shopifySection &&
            (this.hasAttribute("handle-editor-events") &&
              (this._shopifySection.addEventListener(
                "shopify:section:select",
                (event) => this.show(!event.detail.load),
                { signal: this.abortController.signal }
              ),
              this._shopifySection.addEventListener(
                "shopify:section:deselect",
                this.hide.bind(this),
                { signal: this.abortController.signal }
              )),
            this._shopifySection.addEventListener(
              "shopify:section:unload",
              () => this.remove(),
              { signal: this.abortController.signal }
            )));
    }
    disconnectedCallback() {
      __privateGet(this, _delegate2).off(),
        this.abortController.abort(),
        this.focusTrap?.deactivate({ onDeactivate: () => {} }),
        __privateGet(this, _isLocked) &&
          (__privateSet(this, _isLocked, !1),
          document.documentElement.classList.toggle(
            "lock",
            --lockLayerCount > 0
          ));
    }
    show(animate26 = !0) {
      return this.open
        ? Promise.resolve()
        : (this.setAttribute("open", animate26 ? "" : "immediate"),
          waitForEvent(this, "dialog:after-show"));
    }
    hide() {
      return this.open
        ? (this.removeAttribute("open"),
          waitForEvent(this, "dialog:after-hide"))
        : Promise.resolve();
    }
    get abortController() {
      return __privateGet(this, _abortController4);
    }
    get controls() {
      return Array.from(
        this.getRootNode().querySelectorAll(`[aria-controls="${this.id}"]`)
      );
    }
    get open() {
      return this.hasAttribute("open");
    }
    get shouldTrapFocus() {
      return !0;
    }
    get shouldLock() {
      return !1;
    }
    get clickOutsideDeactivates() {
      return !0;
    }
    get shouldAppendToBody() {
      return !1;
    }
    get initialFocus() {
      return this.hasAttribute("initial-focus")
        ? this.getAttribute("initial-focus") === "false"
          ? !1
          : this.querySelector(this.getAttribute("initial-focus"))
        : this.hasAttribute("tabindex")
        ? this
        : this.querySelector('input:not([type="hidden"])') || !1;
    }
    get preventScrollWhenTrapped() {
      return !0;
    }
    get focusTrap() {
      return __privateSet(
        this,
        _focusTrap,
        __privateGet(this, _focusTrap) ||
          new FocusTrap.createFocusTrap(this, {
            onDeactivate: this.hide.bind(this),
            allowOutsideClick: this.clickOutsideDeactivates
              ? __privateMethod(
                  this,
                  _DialogElement_instances,
                  allowOutsideClick_fn
                ).bind(this)
              : !1,
            initialFocus: matchesMediaQuery("supports-hover")
              ? this.initialFocus
              : !1,
            fallbackFocus: this,
            tabbableOptions: { getShadowRoot: !0 },
            preventScroll: this.preventScrollWhenTrapped,
          })
      );
    }
    get shadowDomTemplate() {
      return this.getAttribute("template");
    }
    getShadowPartByName(name) {
      return this.shadowRoot?.querySelector(`[part="${name}"]`);
    }
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "open":
          if (
            (this.controls.forEach((toggle) =>
              toggle.setAttribute(
                "aria-expanded",
                newValue === null ? "false" : "true"
              )
            ),
            oldValue === null && (newValue === "" || newValue === "immediate"))
          ) {
            __privateSet(this, _originalParentBeforeAppend, null),
              this.style.setProperty("display", "block"),
              this.dispatchEvent(new CustomEvent("dialog:before-show")),
              this.shouldAppendToBody &&
                this.parentElement !== document.body &&
                (__privateSet(
                  this,
                  _originalParentBeforeAppend,
                  this.parentElement
                ),
                document.body.append(this));
            const animationControls = this.createEnterAnimationControls();
            newValue === "immediate" && animationControls.finish(),
              animationControls.finished.then(() => {
                this.dispatchEvent(new CustomEvent("dialog:after-show"));
              }),
              this.shouldTrapFocus &&
                this.focusTrap.activate({
                  checkCanFocusTrap: () => animationControls.finished,
                }),
              this.shouldLock &&
                ((lockLayerCount += 1),
                __privateSet(this, _isLocked, !0),
                document.documentElement.classList.add("lock"));
          } else if (oldValue !== null && newValue === null) {
            this.dispatchEvent(new CustomEvent("dialog:before-hide"));
            const hideTransitionPromise =
              this.createLeaveAnimationControls().finished;
            hideTransitionPromise.then(() => {
              this.style.setProperty("display", "none"),
                this.parentElement === document.body &&
                  __privateGet(this, _originalParentBeforeAppend) &&
                  (__privateGet(this, _originalParentBeforeAppend).appendChild(
                    this
                  ),
                  __privateSet(this, _originalParentBeforeAppend, null)),
                this.dispatchEvent(new CustomEvent("dialog:after-hide"));
            }),
              this.focusTrap?.deactivate({
                checkCanReturnFocus: () => hideTransitionPromise,
              }),
              this.shouldLock &&
                (__privateSet(this, _isLocked, !1),
                document.documentElement.classList.toggle(
                  "lock",
                  --lockLayerCount > 0
                ));
          }
          this.dispatchEvent(new CustomEvent("toggle", { bubbles: !0 }));
          break;
      }
    }
    createEnterAnimationControls() {
      return animate4(this, {}, { duration: 0 });
    }
    createLeaveAnimationControls() {
      return animate4(this, {}, { duration: 0 });
    }
    hideForOutsideClickTarget(target) {
      return !this.contains(target);
    }
    allowOutsideClickForTarget(target) {
      return !1;
    }
  };
(_isLocked = new WeakMap()),
  (_delegate2 = new WeakMap()),
  (_abortController4 = new WeakMap()),
  (_focusTrap = new WeakMap()),
  (_originalParentBeforeAppend = new WeakMap()),
  (_DialogElement_instances = new WeakSet()),
  (allowOutsideClick_fn = function (event) {
    return "TouchEvent" in window && event instanceof TouchEvent
      ? __privateMethod(
          this,
          _DialogElement_instances,
          allowOutsideClickTouch_fn
        ).call(this, event)
      : __privateMethod(
          this,
          _DialogElement_instances,
          allowOutsideClickMouse_fn
        ).call(this, event);
  }),
  (allowOutsideClickTouch_fn = function (event) {
    return (
      event.target.addEventListener(
        "touchend",
        (subEvent) => {
          const endTarget = document.elementFromPoint(
            subEvent.changedTouches.item(0).clientX,
            subEvent.changedTouches.item(0).clientY
          );
          this.hideForOutsideClickTarget(endTarget) && this.hide();
        },
        { once: !0, signal: this.abortController.signal }
      ),
      this.allowOutsideClickForTarget(event.target)
    );
  }),
  (allowOutsideClickMouse_fn = function (event) {
    if (event.type !== "click") return !1;
    if (
      (this.hideForOutsideClickTarget(event.target) && this.hide(),
      this.allowOutsideClickForTarget(event.target))
    )
      return !0;
    let target = event.target,
      closestControl = event.target.closest("[aria-controls]");
    return (
      closestControl &&
        closestControl.getAttribute("aria-controls") === this.id &&
        (target = closestControl),
      this.id !== target.getAttribute("aria-controls")
    );
  }),
  (onToggleClicked_fn = function (event) {
    event?.preventDefault(), this.open ? this.hide() : this.show();
  }),
  (updateSlotVisibility_fn = function (slot) {
    ["header", "footer"].includes(slot.name) &&
      (slot.parentElement.hidden =
        slot.assignedElements({ flatten: !0 }).length === 0);
  });
var DialogCloseButton = class extends HTMLElement {
  constructor() {
    super(),
      this.addEventListener("click", () =>
        this.dispatchEvent(
          new CustomEvent("dialog:force-close", {
            bubbles: !0,
            cancelable: !0,
            composed: !0,
          })
        )
      );
  }
};
window.customElements.get("dialog-element") ||
  window.customElements.define("dialog-element", DialogElement),
  window.customElements.get("dialog-close-button") ||
    window.customElements.define("dialog-close-button", DialogCloseButton);
import { timeline as timeline3 } from "vendor";
import { animate as animate5, timeline as timeline2 } from "vendor";
var Modal = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback(), this.setAttribute("aria-modal", "true");
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "modal-default-template";
  }
  get shouldLock() {
    return !0;
  }
  get shouldAppendToBody() {
    return !0;
  }
  createEnterAnimationControls() {
    return matchesMediaQuery("sm")
      ? animate5(this, { opacity: [0, 1] }, { duration: 0.2 })
      : timeline2([
          [
            this.getShadowPartByName("overlay"),
            { opacity: [0, 1] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
          ],
          [
            this.getShadowPartByName("content"),
            { transform: ["translateY(100%)", "translateY(0)"] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
          ],
        ]);
  }
  createLeaveAnimationControls() {
    return matchesMediaQuery("sm")
      ? animate5(this, { opacity: [1, 0] }, { duration: 0.2 })
      : timeline2([
          [
            this.getShadowPartByName("overlay"),
            { opacity: [1, 0] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
          ],
          [
            this.getShadowPartByName("content"),
            { transform: ["translateY(0)", "translateY(100%)"] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
          ],
        ]);
  }
};
window.customElements.get("x-modal") ||
  window.customElements.define("x-modal", Modal);
var Drawer = class extends Modal {
  get shadowDomTemplate() {
    return this.getAttribute("template") || "drawer-default-template";
  }
  get openFrom() {
    return this.getAttribute("open-from") || "right";
  }
  createEnterAnimationControls() {
    return (
      (this.getShadowPartByName("content").style.marginInlineStart =
        this.openFrom === "right" ? "auto" : 0),
      timeline3([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [0, 1] },
          { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          {
            transform: [
              `translateX(calc(var(--transform-logical-flip) * ${
                this.openFrom === "right" ? "100%" : "-100%"
              }))`,
              "translateX(0)",
            ],
          },
          { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] },
        ],
      ])
    );
  }
  createLeaveAnimationControls() {
    return timeline3([
      [
        this.getShadowPartByName("overlay"),
        { opacity: [1, 0] },
        { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        this.getShadowPartByName("content"),
        {
          transform: [
            "translateX(0)",
            `translateX(calc(var(--transform-logical-flip) * ${
              this.openFrom === "right" ? "100%" : "-100%"
            }))`,
          ],
        },
        { duration: 0.3, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
    ]);
  }
};
window.customElements.get("x-drawer") ||
  window.customElements.define("x-drawer", Drawer);
import { animate as animate6 } from "vendor";
var PopIn = class extends DialogElement {
  get shouldTrapFocus() {
    return !1;
  }
  createEnterAnimationControls() {
    return animate6(
      this,
      { opacity: [0, 1], transform: ["translateY(25px)", "translateY(0)"] },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    );
  }
  createLeaveAnimationControls() {
    return animate6(
      this,
      { opacity: [1, 0], transform: ["translateY(0)", "translateY(25px)"] },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    );
  }
};
window.customElements.get("pop-in") ||
  window.customElements.define("pop-in", PopIn);
import { animate as animate7, timeline as timeline4 } from "vendor";
var Popover = class extends DialogElement {
  connectedCallback() {
    super.connectedCallback(),
      this.controls.forEach((control) =>
        control.setAttribute("aria-haspopup", "dialog")
      ),
      this.hasAttribute("close-on-listbox-select") &&
        this.addEventListener("listbox:select", this.hide, {
          signal: this.abortController.signal,
        }),
      this.hasAttribute("close-on-listbox-change") &&
        this.addEventListener("change", this.hide, {
          signal: this.abortController.signal,
        });
  }
  get shadowDomTemplate() {
    return this.getAttribute("template") || "popover-default-template";
  }
  get shouldLock() {
    return matchesMediaQuery("md-max");
  }
  get shouldAppendToBody() {
    return matchesMediaQuery("md-max");
  }
  get preventScrollWhenTrapped() {
    return !0;
  }
  createEnterAnimationControls() {
    return matchesMediaQuery("md")
      ? animate7(this, { opacity: [0, 1] }, { duration: 0.2 })
      : timeline4([
          [
            this.getShadowPartByName("overlay"),
            { opacity: [0, 1] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
          ],
          [
            this.getShadowPartByName("content"),
            { transform: ["translateY(100%)", "translateY(0)"] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
          ],
        ]);
  }
  createLeaveAnimationControls() {
    return matchesMediaQuery("md")
      ? animate7(this, { opacity: [1, 0] }, { duration: 0.2 })
      : timeline4([
          [
            this.getShadowPartByName("overlay"),
            { opacity: [1, 0] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1] },
          ],
          [
            this.getShadowPartByName("content"),
            { transform: ["translateY(0)", "translateY(100%)"] },
            { duration: 0.3, easing: [0.645, 0.045, 0.355, 1], at: "<" },
          ],
        ]);
  }
};
window.customElements.get("x-popover") ||
  window.customElements.define("x-popover", Popover);
var _FacetsDrawer_instances,
  updateFacets_fn,
  FacetsDrawer = class extends Drawer {
    constructor() {
      super(),
        __privateAdd(this, _FacetsDrawer_instances),
        this.addEventListener(
          "dialog:after-hide",
          __privateMethod(this, _FacetsDrawer_instances, updateFacets_fn)
        );
    }
  };
(_FacetsDrawer_instances = new WeakSet()),
  (updateFacets_fn = function () {
    const form = this.querySelector("facets-form form");
    HTMLFormElement.prototype.requestSubmit
      ? form?.requestSubmit()
      : form?.dispatchEvent(
          new Event("submit", { bubbles: !0, cancelable: !0 })
        );
  }),
  window.customElements.get("facets-drawer") ||
    window.customElements.define("facets-drawer", FacetsDrawer);
var _FacetLink_instances,
  onFacetUpdate_fn,
  FacetLink = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _FacetLink_instances),
        this.addEventListener(
          "click",
          __privateMethod(this, _FacetLink_instances, onFacetUpdate_fn).bind(
            this
          )
        );
    }
  };
(_FacetLink_instances = new WeakSet()),
  (onFacetUpdate_fn = function (event) {
    event.preventDefault();
    const sectionId = extractSectionId(event.target),
      url = new URL(this.firstElementChild.href);
    url.searchParams.set("section_id", sectionId),
      this.dispatchEvent(
        new CustomEvent("facet:update", { bubbles: !0, detail: { url } })
      );
  }),
  window.customElements.get("facet-link") ||
    window.customElements.define("facet-link", FacetLink);
var _FacetsSortPopover_instances,
  onSortChange_fn,
  FacetsSortPopover = class extends Popover {
    constructor() {
      super(),
        __privateAdd(this, _FacetsSortPopover_instances),
        this.addEventListener(
          "listbox:change",
          __privateMethod(this, _FacetsSortPopover_instances, onSortChange_fn)
        );
    }
  };
(_FacetsSortPopover_instances = new WeakSet()),
  (onSortChange_fn = function (event) {
    const url = new URL(window.location.href);
    url.searchParams.set("sort_by", event.detail.value),
      url.searchParams.delete("page"),
      url.searchParams.set("section_id", this.getAttribute("section-id")),
      this.dispatchEvent(
        new CustomEvent("facet:update", { bubbles: !0, detail: { url } })
      );
  }),
  window.customElements.get("facets-sort-popover") ||
    window.customElements.define("facets-sort-popover", FacetsSortPopover);
import { Delegate as Delegate3 } from "vendor";
var abortController = null,
  delegate = new Delegate3(document.body),
  openDetailsValues = new Set(
    Array.from(
      document.querySelectorAll(
        'facets-form details[open] input[name*="filter."]'
      ),
      (item) => item.name
    )
  );
delegate.on(
  "toggle",
  "facets-form details",
  (event, detailsElement) => {
    [
      ...new Set(
        Array.from(
          detailsElement.querySelectorAll('input[name*="filter."]'),
          (item) => item.name
        )
      ),
    ].forEach((inputName) => {
      detailsElement.open
        ? openDetailsValues.add(inputName)
        : openDetailsValues.delete(inputName);
    });
  },
  !0
),
  document.addEventListener("facet:update", async (event) => {
    abortController && abortController.abort(),
      (abortController = new AbortController());
    const url = event.detail.url,
      shopifySection = document.getElementById(
        `shopify-section-${url.searchParams.get("section_id")}`
      ),
      clonedUrl = new URL(url);
    clonedUrl.searchParams.delete("section_id"),
      history.replaceState({}, "", clonedUrl.toString());
    try {
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:start", { bubbles: !0 })
      );
      const tempContent = new DOMParser().parseFromString(
        await (
          await cachedFetch(url.toString(), { signal: abortController.signal })
        ).text(),
        "text/html"
      );
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      ),
        tempContent
          .querySelector(".shopify-section")
          .querySelectorAll("facets-form details")
          .forEach((detailsElement) => {
            [
              ...new Set(
                Array.from(
                  detailsElement.querySelectorAll('input[name*="filter."]'),
                  (item) => item.name
                )
              ),
            ].forEach((inputName) => {
              detailsElement.open = openDetailsValues.has(inputName);
            });
          });
      const focusedElement = document.activeElement;
      shopifySection.replaceChildren(
        ...document.importNode(
          tempContent.querySelector(".shopify-section"),
          !0
        ).childNodes
      ),
        focusedElement?.id &&
          document.getElementById(focusedElement.id) &&
          document.getElementById(focusedElement.id).focus();
      const scrollToProductList = () =>
        shopifySection
          .querySelector(".collection")
          .scrollIntoView({ block: "start", behavior: "smooth" });
      "requestIdleCallback" in window
        ? requestIdleCallback(scrollToProductList, { timeout: 500 })
        : requestAnimationFrame(scrollToProductList);
    } catch {}
  });
import { inView as inView5 } from "vendor";
var _allowUpdatingProgress,
  _ProgressBar_instances,
  calculateProgressBar_fn,
  ProgressBar = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ProgressBar_instances),
        __privateAdd(
          this,
          _allowUpdatingProgress,
          !this.hasAttribute("animate-on-scroll")
        );
    }
    static get observedAttributes() {
      return ["aria-valuenow", "aria-valuemax"];
    }
    connectedCallback() {
      this.hasAttribute("animate-on-scroll") &&
        inView5(this, () => {
          __privateSet(this, _allowUpdatingProgress, !0),
            __privateMethod(
              this,
              _ProgressBar_instances,
              calculateProgressBar_fn
            ).call(this);
        });
    }
    get progress() {
      return Math.min(
        1,
        this.getAttribute("aria-valuenow") / this.getAttribute("aria-valuemax")
      );
    }
    set valueMax(value) {
      this.setAttribute("aria-valuemax", value);
    }
    set valueNow(value) {
      this.setAttribute("aria-valuenow", value);
    }
    attributeChangedCallback() {
      __privateGet(this, _allowUpdatingProgress) &&
        __privateMethod(
          this,
          _ProgressBar_instances,
          calculateProgressBar_fn
        ).call(this);
    }
  };
(_allowUpdatingProgress = new WeakMap()),
  (_ProgressBar_instances = new WeakSet()),
  (calculateProgressBar_fn = function () {
    this.style.setProperty("--progress", `${this.progress}`);
  }),
  window.customElements.get("progress-bar") ||
    window.customElements.define("progress-bar", ProgressBar);
var PriceRange = class extends HTMLElement {
  #abortController;
  connectedCallback() {
    this.#abortController = new AbortController();
    const rangeLowerBound = this.querySelector(
        'input[type="range"]:first-child'
      ),
      rangeHigherBound = this.querySelector('input[type="range"]:last-child'),
      textInputLowerBound = this.querySelector(
        'input[name="filter.v.price.gte"]'
      ),
      textInputHigherBound = this.querySelector(
        'input[name="filter.v.price.lte"]'
      );
    textInputLowerBound.addEventListener(
      "focus",
      () => textInputLowerBound.select(),
      { signal: this.#abortController.signal }
    ),
      textInputHigherBound.addEventListener(
        "focus",
        () => textInputHigherBound.select(),
        { signal: this.#abortController.signal }
      ),
      textInputLowerBound.addEventListener(
        "change",
        (event) => {
          event.preventDefault(),
            (event.target.value = Math.max(
              Math.min(
                parseInt(event.target.value),
                parseInt(textInputHigherBound.value || event.target.max) - 1
              ),
              event.target.min
            )),
            (rangeLowerBound.value = event.target.value),
            rangeLowerBound.parentElement.style.setProperty(
              "--range-min",
              `${
                (parseInt(rangeLowerBound.value) /
                  parseInt(rangeLowerBound.max)) *
                100
              }%`
            );
        },
        { signal: this.#abortController.signal }
      ),
      textInputHigherBound.addEventListener(
        "change",
        (event) => {
          event.preventDefault(),
            (event.target.value = Math.min(
              Math.max(
                parseInt(event.target.value),
                parseInt(textInputLowerBound.value || event.target.min) + 1
              ),
              event.target.max
            )),
            (rangeHigherBound.value = event.target.value),
            rangeHigherBound.parentElement.style.setProperty(
              "--range-max",
              `${
                (parseInt(rangeHigherBound.value) /
                  parseInt(rangeHigherBound.max)) *
                100
              }%`
            );
        },
        { signal: this.#abortController.signal }
      ),
      rangeLowerBound.addEventListener(
        "change",
        (event) => {
          event.stopPropagation(),
            (textInputLowerBound.value = event.target.value),
            textInputLowerBound.dispatchEvent(
              new Event("change", { bubbles: !0 })
            );
        },
        { signal: this.#abortController.signal }
      ),
      rangeHigherBound.addEventListener(
        "change",
        (event) => {
          event.stopPropagation(),
            (textInputHigherBound.value = event.target.value),
            textInputHigherBound.dispatchEvent(
              new Event("change", { bubbles: !0 })
            );
        },
        { signal: this.#abortController.signal }
      ),
      rangeLowerBound.addEventListener(
        "input",
        (event) => {
          (event.target.value = Math.min(
            parseInt(event.target.value),
            parseInt(textInputHigherBound.value || event.target.max) - 1
          )),
            event.target.parentElement.style.setProperty(
              "--range-min",
              `${
                (parseInt(event.target.value) / parseInt(event.target.max)) *
                100
              }%`
            ),
            (textInputLowerBound.value = event.target.value);
        },
        { signal: this.#abortController.signal }
      ),
      rangeHigherBound.addEventListener(
        "input",
        (event) => {
          (event.target.value = Math.max(
            parseInt(event.target.value),
            parseInt(textInputLowerBound.value || event.target.min) + 1
          )),
            event.target.parentElement.style.setProperty(
              "--range-max",
              `${
                (parseInt(event.target.value) / parseInt(event.target.max)) *
                100
              }%`
            ),
            (textInputHigherBound.value = event.target.value);
        },
        { signal: this.#abortController.signal }
      );
  }
  disconnectedCallback() {
    this.#abortController.abort();
  }
};
window.customElements.get("price-range") ||
  window.customElements.define("price-range", PriceRange);
var _abortController5,
  _decreaseButton,
  _increaseButton,
  _inputElement,
  _QuantitySelector_instances,
  onDecreaseQuantity_fn,
  onIncreaseQuantity_fn,
  updateUI_fn,
  QuantitySelector = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _QuantitySelector_instances),
        __privateAdd(this, _abortController5),
        __privateAdd(this, _decreaseButton),
        __privateAdd(this, _increaseButton),
        __privateAdd(this, _inputElement);
    }
    connectedCallback() {
      __privateSet(this, _abortController5, new AbortController()),
        __privateSet(
          this,
          _decreaseButton,
          this.querySelector("button:first-of-type")
        ),
        __privateSet(
          this,
          _increaseButton,
          this.querySelector("button:last-of-type")
        ),
        __privateSet(this, _inputElement, this.querySelector("input")),
        __privateGet(this, _decreaseButton)?.addEventListener(
          "click",
          __privateMethod(
            this,
            _QuantitySelector_instances,
            onDecreaseQuantity_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController5).signal }
        ),
        __privateGet(this, _increaseButton)?.addEventListener(
          "click",
          __privateMethod(
            this,
            _QuantitySelector_instances,
            onIncreaseQuantity_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController5).signal }
        ),
        __privateGet(this, _inputElement)?.addEventListener(
          "input",
          () =>
            __privateMethod(
              this,
              _QuantitySelector_instances,
              updateUI_fn
            ).call(this),
          { signal: __privateGet(this, _abortController5).signal }
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController5).abort();
    }
    get quantity() {
      return __privateGet(this, _inputElement).value;
    }
    set quantity(quantity) {
      (__privateGet(this, _inputElement).value = quantity),
        __privateGet(this, _inputElement).dispatchEvent(new Event("change")),
        __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(
          this
        );
    }
  };
(_abortController5 = new WeakMap()),
  (_decreaseButton = new WeakMap()),
  (_increaseButton = new WeakMap()),
  (_inputElement = new WeakMap()),
  (_QuantitySelector_instances = new WeakSet()),
  (onDecreaseQuantity_fn = function () {
    __privateGet(this, _inputElement).stepDown(),
      __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(
        this
      );
  }),
  (onIncreaseQuantity_fn = function () {
    __privateGet(this, _inputElement).stepUp(),
      __privateMethod(this, _QuantitySelector_instances, updateUI_fn).call(
        this
      );
  }),
  (updateUI_fn = function () {
    (__privateGet(this, _decreaseButton).disabled =
      parseInt(__privateGet(this, _inputElement).value) <=
      parseInt(__privateGet(this, _inputElement).min)),
      (__privateGet(this, _increaseButton).disabled = __privateGet(
        this,
        _inputElement
      ).hasAttribute("max")
        ? parseInt(__privateGet(this, _inputElement).value) >=
          parseInt(__privateGet(this, _inputElement).max)
        : !1);
  });
var _QuantityInput_instances,
  inputElement_get,
  onValueInput_fn,
  onValueChange_fn,
  QuantityInput = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _QuantityInput_instances),
        __privateGet(
          this,
          _QuantityInput_instances,
          inputElement_get
        ).addEventListener(
          "input",
          __privateMethod(this, _QuantityInput_instances, onValueInput_fn).bind(
            this
          )
        ),
        __privateGet(
          this,
          _QuantityInput_instances,
          inputElement_get
        ).addEventListener(
          "change",
          __privateMethod(
            this,
            _QuantityInput_instances,
            onValueChange_fn
          ).bind(this)
        ),
        __privateGet(
          this,
          _QuantityInput_instances,
          inputElement_get
        ).addEventListener("focus", () =>
          __privateGet(
            this,
            _QuantityInput_instances,
            inputElement_get
          ).select()
        );
    }
    connectedCallback() {
      this.style.setProperty(
        "--quantity-selector-character-count",
        `${
          __privateGet(this, _QuantityInput_instances, inputElement_get).value
            .length
        }ch`
      );
    }
    get quantity() {
      return parseInt(
        __privateGet(this, _QuantityInput_instances, inputElement_get).value
      );
    }
  };
(_QuantityInput_instances = new WeakSet()),
  (inputElement_get = function () {
    return this.firstElementChild;
  }),
  (onValueInput_fn = function () {
    __privateGet(this, _QuantityInput_instances, inputElement_get).value ===
      "" &&
      (__privateGet(this, _QuantityInput_instances, inputElement_get).value =
        __privateGet(this, _QuantityInput_instances, inputElement_get).min ||
        1),
      this.style.setProperty(
        "--quantity-selector-character-count",
        `${
          __privateGet(this, _QuantityInput_instances, inputElement_get).value
            .length
        }ch`
      );
  }),
  (onValueChange_fn = function () {
    __privateGet(
      this,
      _QuantityInput_instances,
      inputElement_get
    ).checkValidity() ||
      __privateGet(this, _QuantityInput_instances, inputElement_get).stepDown();
  }),
  window.customElements.get("quantity-selector") ||
    window.customElements.define("quantity-selector", QuantitySelector),
  window.customElements.get("quantity-input") ||
    window.customElements.define("quantity-input", QuantityInput);
var _accessibilityInitialized,
  _hiddenInput,
  _Listbox_instances,
  setupAccessibility_fn,
  onOptionClicked_fn,
  onInputChanged_fn,
  onKeyDown_fn,
  Listbox = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _Listbox_instances),
        __privateAdd(this, _accessibilityInitialized, !1),
        __privateAdd(this, _hiddenInput),
        this.addEventListener(
          "keydown",
          __privateMethod(this, _Listbox_instances, onKeyDown_fn)
        );
    }
    static get observedAttributes() {
      return ["aria-activedescendant"];
    }
    connectedCallback() {
      __privateSet(
        this,
        _hiddenInput,
        this.querySelector('input[type="hidden"]')
      ),
        __privateGet(this, _hiddenInput)?.addEventListener(
          "change",
          __privateMethod(this, _Listbox_instances, onInputChanged_fn).bind(
            this
          )
        ),
        __privateGet(this, _accessibilityInitialized) ||
          requestAnimationFrame(
            __privateMethod(
              this,
              _Listbox_instances,
              setupAccessibility_fn
            ).bind(this)
          );
    }
    attributeChangedCallback(name, oldValue, newValue) {
      name === "aria-activedescendant" &&
        oldValue !== null &&
        newValue !== oldValue &&
        Array.from(this.querySelectorAll('[role="option"]')).forEach(
          (option) => {
            option.id === newValue
              ? (option.setAttribute("aria-selected", "true"),
                __privateGet(this, _hiddenInput) &&
                  __privateGet(this, _hiddenInput).value !== option.value &&
                  ((__privateGet(this, _hiddenInput).value = option.value),
                  __privateGet(this, _hiddenInput).dispatchEvent(
                    new Event("change", { bubbles: !0 })
                  )),
                this.hasAttribute("aria-owns") &&
                  this.getAttribute("aria-owns")
                    .split(" ")
                    .forEach((boundId) => {
                      document.getElementById(boundId).textContent =
                        option.getAttribute("title") ||
                        option.innerText ||
                        option.value;
                    }),
                option.dispatchEvent(
                  new CustomEvent("listbox:change", {
                    bubbles: !0,
                    detail: { value: option.value },
                  })
                ))
              : option.setAttribute("aria-selected", "false");
          }
        );
    }
  };
(_accessibilityInitialized = new WeakMap()),
  (_hiddenInput = new WeakMap()),
  (_Listbox_instances = new WeakSet()),
  (setupAccessibility_fn = function () {
    this.setAttribute("role", "listbox"),
      Array.from(this.querySelectorAll('[role="option"]')).forEach((option) => {
        option.addEventListener(
          "click",
          __privateMethod(this, _Listbox_instances, onOptionClicked_fn).bind(
            this
          )
        ),
          (option.id =
            "option-" +
            (crypto.randomUUID
              ? crypto.randomUUID()
              : Math.floor(Math.random() * 1e4))),
          option.getAttribute("aria-selected") === "true" &&
            this.setAttribute("aria-activedescendant", option.id);
      }),
      __privateSet(this, _accessibilityInitialized, !0);
  }),
  (onOptionClicked_fn = function (event) {
    event.currentTarget.getAttribute("type") !== "submit" &&
      (this.setAttribute("aria-activedescendant", event.currentTarget.id),
      event.currentTarget.dispatchEvent(
        new CustomEvent("listbox:select", {
          bubbles: !0,
          detail: { value: event.currentTarget.value },
        })
      ));
  }),
  (onInputChanged_fn = function (event) {
    this.setAttribute(
      "aria-activedescendant",
      this.querySelector(
        `[role="option"][value="${CSS.escape(event.target.value)}"]`
      ).id
    );
  }),
  (onKeyDown_fn = function (event) {
    event.key === "ArrowUp"
      ? (event.target.previousElementSibling?.focus(), event.preventDefault())
      : event.key === "ArrowDown" &&
        (event.target.nextElementSibling?.focus(), event.preventDefault());
  }),
  window.customElements.get("x-listbox") ||
    window.customElements.define("x-listbox", Listbox);
import { scroll, animate as animate8 } from "vendor";
var _ImageParallax_instances,
  setupParallax_fn,
  ImageParallax = class extends HTMLElement {
    constructor() {
      super(...arguments), __privateAdd(this, _ImageParallax_instances);
    }
    connectedCallback() {
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
        __privateMethod(this, _ImageParallax_instances, setupParallax_fn).call(
          this
        );
    }
  };
(_ImageParallax_instances = new WeakSet()),
  (setupParallax_fn = function () {
    const [scale, translate] = [1.3, 11.538461538461538],
      isFirstSection = this.closest(".shopify-section").matches(":first-child");
    scroll(
      animate8(
        this.querySelector("img"),
        {
          transform: [
            `scale(${scale}) translateY(-${translate}%)`,
            `scale(${scale}) translateY(${translate}%)`,
          ],
        },
        { easing: "linear" }
      ),
      {
        target: this.querySelector("img"),
        offset: [isFirstSection ? "start start" : "start end", "end start"],
      }
    );
  }),
  window.customElements.get("image-parallax") ||
    window.customElements.define("image-parallax", ImageParallax);
var _recipientCheckbox,
  _recipientOtherProperties,
  _recipientSendOnProperty,
  _offsetProperty,
  _recipientFieldsContainer,
  _GiftCardRecipient_instances,
  synchronizeProperties_fn,
  formatDate_fn,
  GiftCardRecipient = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _GiftCardRecipient_instances),
        __privateAdd(this, _recipientCheckbox),
        __privateAdd(this, _recipientOtherProperties, []),
        __privateAdd(this, _recipientSendOnProperty),
        __privateAdd(this, _offsetProperty),
        __privateAdd(this, _recipientFieldsContainer);
    }
    connectedCallback() {
      const properties = Array.from(
          this.querySelectorAll('[name*="properties"]')
        ),
        checkboxPropertyName =
          "properties[__shopify_send_gift_card_to_recipient]";
      __privateSet(
        this,
        _recipientCheckbox,
        properties.find((input) => input.name === checkboxPropertyName)
      ),
        __privateSet(
          this,
          _recipientOtherProperties,
          properties.filter((input) => input.name !== checkboxPropertyName)
        ),
        __privateSet(
          this,
          _recipientFieldsContainer,
          this.querySelector(".gift-card-recipient__fields")
        ),
        __privateSet(
          this,
          _offsetProperty,
          this.querySelector('[name="properties[__shopify_offset]"]')
        ),
        __privateGet(this, _offsetProperty) &&
          (__privateGet(this, _offsetProperty).value = new Date()
            .getTimezoneOffset()
            .toString()),
        __privateSet(
          this,
          _recipientSendOnProperty,
          this.querySelector('[name="properties[Send on]"]')
        );
      const minDate = new Date(),
        maxDate = new Date();
      maxDate.setDate(minDate.getDate() + 90),
        __privateGet(this, _recipientSendOnProperty)?.setAttribute(
          "min",
          __privateMethod(
            this,
            _GiftCardRecipient_instances,
            formatDate_fn
          ).call(this, minDate)
        ),
        __privateGet(this, _recipientSendOnProperty)?.setAttribute(
          "max",
          __privateMethod(
            this,
            _GiftCardRecipient_instances,
            formatDate_fn
          ).call(this, maxDate)
        ),
        __privateGet(this, _recipientCheckbox)?.addEventListener(
          "change",
          __privateMethod(
            this,
            _GiftCardRecipient_instances,
            synchronizeProperties_fn
          ).bind(this)
        ),
        __privateMethod(
          this,
          _GiftCardRecipient_instances,
          synchronizeProperties_fn
        ).call(this);
    }
  };
(_recipientCheckbox = new WeakMap()),
  (_recipientOtherProperties = new WeakMap()),
  (_recipientSendOnProperty = new WeakMap()),
  (_offsetProperty = new WeakMap()),
  (_recipientFieldsContainer = new WeakMap()),
  (_GiftCardRecipient_instances = new WeakSet()),
  (synchronizeProperties_fn = function () {
    __privateGet(this, _recipientOtherProperties).forEach(
      (property) =>
        (property.disabled = !__privateGet(this, _recipientCheckbox).checked)
    ),
      __privateGet(this, _recipientFieldsContainer).toggleAttribute(
        "hidden",
        !__privateGet(this, _recipientCheckbox).checked
      );
  }),
  (formatDate_fn = function (date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60 * 1e3)
      .toISOString()
      .split("T")[0];
  }),
  window.customElements.get("gift-card-recipient") ||
    window.customElements.define("gift-card-recipient", GiftCardRecipient);
import { Delegate as Delegate4 } from "vendor";
var _delegate3,
  _ProductCard_instances,
  onSwatchHovered_fn,
  onSwatchChanged_fn,
  createMediaImg_fn,
  ProductCard = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ProductCard_instances),
        __privateAdd(this, _delegate3, new Delegate4(this));
    }
    connectedCallback() {
      __privateGet(this, _delegate3).on(
        "change",
        '.product-card__info [type="radio"]',
        __privateMethod(this, _ProductCard_instances, onSwatchChanged_fn).bind(
          this
        )
      ),
        __privateGet(this, _delegate3).on(
          "pointerover",
          '.product-card__info [type="radio"] + label',
          __privateMethod(
            this,
            _ProductCard_instances,
            onSwatchHovered_fn
          ).bind(this),
          !0
        );
    }
    disconnectedCallback() {
      __privateGet(this, _delegate3).off();
    }
  };
(_delegate3 = new WeakMap()),
  (_ProductCard_instances = new WeakSet()),
  (onSwatchHovered_fn = async function (event, target) {
    const control = target.control,
      primaryMediaElement = this.querySelector(".product-card__image--primary");
    control.hasAttribute("data-variant-media") &&
      __privateMethod(this, _ProductCard_instances, createMediaImg_fn).call(
        this,
        JSON.parse(control.getAttribute("data-variant-media")),
        primaryMediaElement.className,
        primaryMediaElement.sizes
      );
  }),
  (onSwatchChanged_fn = async function (event, target) {
    if (
      (target.hasAttribute("data-product-url")
        ? this.querySelectorAll(
            `a[href^="${Shopify.routes.root}products/"`
          ).forEach((link) => {
            link.href = target.getAttribute("data-product-url");
          })
        : target.hasAttribute("data-variant-id") &&
          this.querySelectorAll(
            `a[href^="${Shopify.routes.root}products/"`
          ).forEach((link) => {
            const url = new URL(link.href);
            url.searchParams.set(
              "variant",
              target.getAttribute("data-variant-id")
            ),
              (link.href = `${url.pathname}${url.search}${url.hash}`);
          }),
      !target.hasAttribute("data-variant-media"))
    )
      return;
    let newMedia = JSON.parse(target.getAttribute("data-variant-media")),
      primaryMediaElement = this.querySelector(".product-card__image--primary"),
      secondaryMediaElement = this.querySelector(
        ".product-card__image--secondary"
      ),
      newPrimaryMediaElement = __privateMethod(
        this,
        _ProductCard_instances,
        createMediaImg_fn
      ).call(
        this,
        newMedia,
        primaryMediaElement.className,
        primaryMediaElement.sizes
      ),
      newSecondaryMediaElement = null;
    if (
      secondaryMediaElement &&
      target.hasAttribute("data-variant-secondary-media")
    ) {
      let newSecondaryMedia = JSON.parse(
        target.getAttribute("data-variant-secondary-media")
      );
      newSecondaryMediaElement = __privateMethod(
        this,
        _ProductCard_instances,
        createMediaImg_fn
      ).call(
        this,
        newSecondaryMedia,
        secondaryMediaElement.className,
        secondaryMediaElement.sizes
      );
    }
    primaryMediaElement.src !== newPrimaryMediaElement.src &&
      (secondaryMediaElement &&
        newSecondaryMediaElement &&
        secondaryMediaElement.replaceWith(newSecondaryMediaElement),
      await primaryMediaElement.animate(
        { opacity: [1, 0] },
        { duration: 150, easing: "ease-in", fill: "forwards" }
      ).finished,
      await new Promise((resolve) =>
        newPrimaryMediaElement.complete
          ? resolve()
          : (newPrimaryMediaElement.onload = () => resolve())
      ),
      primaryMediaElement.replaceWith(newPrimaryMediaElement),
      newPrimaryMediaElement.animate(
        { opacity: [0, 1] },
        { duration: 150, easing: "ease-in" }
      ));
  }),
  (createMediaImg_fn = function (media, className, sizes) {
    return createMediaImg(
      media,
      [200, 300, 400, 500, 600, 700, 800, 1e3, 1200, 1400, 1600, 1800],
      { class: className, sizes }
    );
  }),
  window.customElements.get("product-card") ||
    window.customElements.define("product-card", ProductCard);
var _ProductForm_instances,
  form_get2,
  onSubmit_fn,
  ProductForm = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _ProductForm_instances),
        this.addEventListener(
          "submit",
          __privateMethod(this, _ProductForm_instances, onSubmit_fn)
        );
    }
    connectedCallback() {
      __privateGet(this, _ProductForm_instances, form_get2).id.disabled = !1;
    }
  };
(_ProductForm_instances = new WeakSet()),
  (form_get2 = function () {
    return this.querySelector("form");
  }),
  (onSubmit_fn = async function (event) {
    if (
      (event.preventDefault(),
      event.submitter?.getAttribute("aria-busy") === "true")
    )
      return;
    if (
      !__privateGet(this, _ProductForm_instances, form_get2).checkValidity()
    ) {
      __privateGet(this, _ProductForm_instances, form_get2).reportValidity();
      return;
    }
    const submitButtons = Array.from(
      __privateGet(this, _ProductForm_instances, form_get2).elements
    ).filter((button) => button.type === "submit");
    submitButtons.forEach((submitButton) => {
      submitButton.setAttribute("aria-busy", "true");
    }),
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:start", { bubbles: !0 })
      );
    let sectionsToBundle = [];
    document.documentElement.dispatchEvent(
      new CustomEvent("cart:prepare-bundled-sections", {
        bubbles: !0,
        detail: { sections: sectionsToBundle },
      })
    );
    const formData = new FormData(
      __privateGet(this, _ProductForm_instances, form_get2)
    );
    formData.set("sections", sectionsToBundle.join(",")),
      formData.set(
        "sections_url",
        `${Shopify.routes.root}variants/${
          __privateGet(this, _ProductForm_instances, form_get2).id.value
        }`
      );
    const response = await fetch(`${Shopify.routes.root}cart/add.js`, {
      body: formData,
      method: "POST",
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    submitButtons.forEach((submitButton) => {
      submitButton.removeAttribute("aria-busy");
    });
    const responseJson = await response.json();
    if (
      (document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      ),
      response.ok)
    ) {
      if (
        window.themeVariables.settings.cartType === "page" ||
        window.themeVariables.settings.pageType === "cart"
      )
        return (window.location.href = `${Shopify.routes.root}cart`);
      const cartContent = await (
        await fetch(`${Shopify.routes.root}cart.js`)
      ).json();
      (cartContent.sections = responseJson.sections),
        __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(
          new CustomEvent("variant:add", {
            bubbles: !0,
            detail: {
              items: responseJson.hasOwnProperty("items")
                ? responseJson.items
                : [responseJson],
              cart: cartContent,
              onSuccessDo: formData.get("on_success"),
            },
          })
        ),
        document.documentElement.dispatchEvent(
          new CustomEvent("cart:change", {
            bubbles: !0,
            detail: {
              baseEvent: "variant:add",
              onSuccessDo: formData.get("on_success"),
              cart: cartContent,
            },
          })
        );
    } else
      __privateGet(this, _ProductForm_instances, form_get2).dispatchEvent(
        new CustomEvent("cart:error", {
          bubbles: !0,
          detail: { error: responseJson.description },
        })
      ),
        document.dispatchEvent(new CustomEvent("cart:refresh"));
  }),
  window.customElements.get("product-form") ||
    window.customElements.define("product-form", ProductForm);
var _abortController6,
  _BuyButtons_instances,
  onVariantAdded_fn,
  onCartError_fn,
  BuyButtons = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _BuyButtons_instances),
        __privateAdd(this, _abortController6);
    }
    connectedCallback() {
      __privateSet(this, _abortController6, new AbortController()),
        document.forms[this.getAttribute("form")]?.addEventListener(
          "cart:error",
          __privateMethod(this, _BuyButtons_instances, onCartError_fn).bind(
            this
          ),
          { signal: __privateGet(this, _abortController6).signal }
        ),
        window.themeVariables.settings.cartType === "message" &&
          document.forms[this.getAttribute("form")]?.addEventListener(
            "variant:add",
            __privateMethod(
              this,
              _BuyButtons_instances,
              onVariantAdded_fn
            ).bind(this),
            { signal: __privateGet(this, _abortController6).signal }
          );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController6).abort();
    }
  };
(_abortController6 = new WeakMap()),
  (_BuyButtons_instances = new WeakSet()),
  (onVariantAdded_fn = function (event) {
    const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--success" role="alert">
        ${window.themeVariables.strings.addedToCart}
      </div>
    `).firstElementChild;
    this.prepend(bannerElement),
      setTimeout(() => {
        bannerElement.remove();
      }, 2500);
  }),
  (onCartError_fn = function (event) {
    const bannerElement = document.createRange().createContextualFragment(`
      <div class="banner banner--error" role="alert">
        ${event.detail.error}
      </div>
    `).firstElementChild;
    this.prepend(bannerElement),
      setTimeout(() => {
        bannerElement.remove();
      }, 2500);
  }),
  window.customElements.get("buy-buttons") ||
    window.customElements.define("buy-buttons", BuyButtons);
import { PhotoSwipeLightbox } from "vendor";
var _abortController7,
  _photoSwipeInstance,
  _onGestureChangedListener,
  _settledMedia,
  _ProductGallery_instances,
  registerLightboxUi_fn,
  onSectionRerender_fn,
  onVariantChange_fn,
  onMediaChange_fn,
  onMediaSettle_fn,
  onCarouselClick_fn,
  onGestureStart_fn,
  onGestureChanged_fn,
  ProductGallery = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _ProductGallery_instances),
        __privateAdd(this, _abortController7),
        __privateAdd(this, _photoSwipeInstance),
        __privateAdd(
          this,
          _onGestureChangedListener,
          __privateMethod(
            this,
            _ProductGallery_instances,
            onGestureChanged_fn
          ).bind(this)
        ),
        __privateAdd(this, _settledMedia),
        this.addEventListener("lightbox:open", (event) =>
          this.openLightBox(event?.detail?.index)
        );
    }
    connectedCallback() {
      if (
        (__privateSet(this, _abortController7, new AbortController()),
        !this.carousel)
      )
        return;
      const form = document.forms[this.getAttribute("form")];
      form.addEventListener(
        "product:rerender",
        __privateMethod(
          this,
          _ProductGallery_instances,
          onSectionRerender_fn
        ).bind(this),
        { signal: __privateGet(this, _abortController7).signal }
      ),
        form.addEventListener(
          "variant:change",
          __privateMethod(
            this,
            _ProductGallery_instances,
            onVariantChange_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController7).signal }
        ),
        this.carousel.addEventListener(
          "carousel:change",
          __privateMethod(
            this,
            _ProductGallery_instances,
            onMediaChange_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController7).signal }
        ),
        this.carousel.addEventListener(
          "carousel:settle",
          __privateMethod(
            this,
            _ProductGallery_instances,
            onMediaSettle_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController7).signal }
        ),
        this.carousel.addEventListener(
          "click",
          __privateMethod(
            this,
            _ProductGallery_instances,
            onCarouselClick_fn
          ).bind(this),
          { signal: __privateGet(this, _abortController7).signal }
        ),
        this.hasAttribute("allow-zoom") &&
          this.carousel.addEventListener(
            "gesturestart",
            __privateMethod(
              this,
              _ProductGallery_instances,
              onGestureStart_fn
            ).bind(this),
            {
              capture: !1,
              signal: __privateGet(this, _abortController7).signal,
            }
          ),
        __privateMethod(this, _ProductGallery_instances, onMediaChange_fn).call(
          this
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController7).abort();
    }
    get viewInSpaceButton() {
      return this.querySelector("[data-shopify-xr]");
    }
    get carousel() {
      return this.querySelector(".product-gallery__carousel");
    }
    get lightBox() {
      return __privateGet(this, _photoSwipeInstance)
        ? __privateGet(this, _photoSwipeInstance)
        : (__privateSet(
            this,
            _photoSwipeInstance,
            new PhotoSwipeLightbox({
              pswpModule: () => import("photoswipe"),
              bgOpacity: 1,
              maxZoomLevel: parseInt(this.getAttribute("allow-zoom")) || 3,
              closeTitle: window.themeVariables.strings.closeGallery,
              zoomTitle: window.themeVariables.strings.zoomGallery,
              errorMsg: window.themeVariables.strings.errorGallery,
              arrowPrev: !1,
              arrowNext: !1,
              counter: !1,
              close: !1,
              zoom: !1,
            })
          ),
          __privateGet(this, _photoSwipeInstance).on(
            "uiRegister",
            __privateMethod(
              this,
              _ProductGallery_instances,
              registerLightboxUi_fn
            ).bind(this)
          ),
          __privateGet(this, _photoSwipeInstance).addFilter(
            "thumbEl",
            (thumbEl, data) => data.thumbnailElement
          ),
          __privateGet(this, _photoSwipeInstance).init(),
          __privateGet(this, _photoSwipeInstance));
    }
    get filteredIndexes() {
      return JSON.parse(this.getAttribute("filtered-indexes")).map(
        (index) => parseInt(index) - 1
      );
    }
    openLightBox(index) {
      const dataSource = this.carousel.cells
          .flatMap((cell) => Array.from(cell.querySelectorAll(":scope > img")))
          .map((image) => ({
            thumbnailElement: image,
            src: image.src,
            srcset: image.srcset,
            msrc: image.currentSrc || image.src,
            width: parseInt(image.getAttribute("width")),
            height: parseInt(image.getAttribute("height")),
            alt: image.alt,
            thumbCropped: !0,
          })),
        imageCells = this.carousel.cells.filter(
          (cell) => cell.getAttribute("data-media-type") === "image"
        );
      this.lightBox.loadAndOpen(
        index ?? imageCells.indexOf(this.carousel.selectedCell),
        dataSource
      );
    }
  };
(_abortController7 = new WeakMap()),
  (_photoSwipeInstance = new WeakMap()),
  (_onGestureChangedListener = new WeakMap()),
  (_settledMedia = new WeakMap()),
  (_ProductGallery_instances = new WeakSet()),
  (registerLightboxUi_fn = function () {
    __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
      name: "close-button",
      className: "circle-button circle-button--xl hover:animate-icon-block",
      ariaLabel: window.themeVariables.strings.closeGallery,
      order: 2,
      isButton: !0,
      html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon" viewBox="0 0 16 16">
          <path d="m1 1 14 14M1 15 15 1" stroke="currentColor" stroke-width="1"/>
        </svg>
      `,
      onClick: () => {
        __privateGet(this, _photoSwipeInstance).pswp.close();
      },
    }),
      __privateGet(this, _photoSwipeInstance).pswp.options.dataSource.length >
        1 &&
        (__privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
          name: "previous-button",
          className: "circle-button hover:animate-icon-inline",
          ariaLabel: window.themeVariables.strings.previous,
          order: 1,
          isButton: !0,
          html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="M11 1 3 9l8 8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
          onClick: () => {
            __privateGet(this, _photoSwipeInstance).pswp.prev();
          },
        }),
        __privateGet(this, _photoSwipeInstance).pswp.ui.registerElement({
          name: "next-button",
          className: "circle-button hover:animate-icon-inline",
          ariaLabel: window.themeVariables.strings.next,
          order: 3,
          isButton: !0,
          html: `
        <svg aria-hidden="true" focusable="false" fill="none" width="16" class="icon icon--direction-aware" viewBox="0 0 16 18">
          <path d="m5 17 8-8-8-8" stroke="currentColor" stroke-linecap="square"/>
        </svg>
      `,
          onClick: () => {
            __privateGet(this, _photoSwipeInstance).pswp.next();
          },
        }));
  }),
  (onSectionRerender_fn = function (event) {
    const galleryMarkup = deepQuerySelector(
      event.detail.htmlFragment,
      `${this.tagName}[form="${this.getAttribute("form")}"]`
    );
    galleryMarkup &&
      galleryMarkup.filteredIndex !== this.filteredIndexes &&
      (this.carousel.filter(galleryMarkup.filteredIndexes),
      this.setAttribute(
        "filtered-indexes",
        galleryMarkup.getAttribute("filtered-indexes")
      ));
  }),
  (onVariantChange_fn = function (event) {
    if (
      event.detail.variant &&
      event.detail.variant.featured_media &&
      event.detail.previousVariant?.featured_media?.id !==
        event.detail.variant.featured_media.id
    ) {
      const position = event.detail.variant.featured_media.position - 1,
        filteredIndexBelowPosition = this.filteredIndexes.filter(
          (filteredIndex) => filteredIndex < position
        );
      this.carousel.isScrollable
        ? this.carousel.select(position - filteredIndexBelowPosition.length, {
            instant: !0,
          })
        : this.querySelector(
            `[data-media-id="${event.detail.variant.featured_media.id}"]`
          )?.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }),
  (onMediaChange_fn = function () {
    if (__privateGet(this, _settledMedia))
      switch (
        __privateGet(this, _settledMedia).getAttribute("data-media-type")
      ) {
        case "external_video":
        case "video":
        case "model":
          __privateGet(this, _settledMedia).firstElementChild.pause();
      }
  }),
  (onMediaSettle_fn = function (event) {
    const media = event ? event.detail.cell : this.carousel.selectedCell,
      zoomButton = this.querySelector(".product-gallery__zoom-button");
    switch (media.getAttribute("data-media-type")) {
      case "image":
        this.viewInSpaceButton?.setAttribute(
          "data-shopify-model3d-id",
          this.viewInSpaceButton?.getAttribute(
            "data-shopify-model3d-default-id"
          )
        ),
          zoomButton?.classList.remove("product-gallery__zoom-button--hidden");
        break;
      case "external_video":
      case "video":
        this.viewInSpaceButton?.setAttribute(
          "data-shopify-model3d-id",
          this.viewInSpaceButton?.getAttribute(
            "data-shopify-model3d-default-id"
          )
        ),
          zoomButton?.classList.add("product-gallery__zoom-button--hidden"),
          this.hasAttribute("autoplay-media") && media.firstElementChild.play();
        break;
      case "model":
        matchesMediaQuery("md") && media.firstElementChild.play(),
          this.viewInSpaceButton?.setAttribute(
            "data-shopify-model3d-id",
            event.detail.cell.getAttribute("data-media-id")
          ),
          zoomButton?.classList.add("product-gallery__zoom-button--hidden");
        break;
    }
    __privateSet(this, _settledMedia, media);
  }),
  (onCarouselClick_fn = function (event) {
    if (
      !this.hasAttribute("allow-zoom") ||
      !matchesMediaQuery("md") ||
      event.target.tagName !== "IMG"
    )
      return;
    const media = event.target.closest(".product-gallery__media");
    if (media.getAttribute("data-media-type") !== "image") return;
    const imageCells = this.carousel.cells.filter(
      (cell) => cell.getAttribute("data-media-type") === "image"
    );
    this.dispatchEvent(
      new CustomEvent("lightbox:open", {
        bubbles: !0,
        detail: { index: imageCells.indexOf(media) },
      })
    );
  }),
  (onGestureStart_fn = function (event) {
    event.preventDefault(),
      this.carousel.addEventListener(
        "gesturechange",
        __privateGet(this, _onGestureChangedListener),
        { capture: !1, signal: __privateGet(this, _abortController7).signal }
      );
  }),
  (onGestureChanged_fn = function (event) {
    event.preventDefault(),
      event.scale > 1.5 &&
        (this.dispatchEvent(
          new CustomEvent("lightbox:open", {
            bubbles: !0,
            detail: { index: this.carousel.selectedIndex },
          })
        ),
        this.removeEventListener(
          "gesturechange",
          __privateGet(this, _onGestureChangedListener)
        ));
  });
var _intersectionObserver,
  _hasProgrammaticScroll,
  _scrollDirection,
  _lastScrollPosition,
  _ProductGalleryNavigation_instances,
  onMediaObserve_fn,
  ProductGalleryNavigation = class extends CarouselNavigation {
    constructor() {
      super(),
        __privateAdd(this, _ProductGalleryNavigation_instances),
        __privateAdd(
          this,
          _intersectionObserver,
          new IntersectionObserver(
            __privateMethod(
              this,
              _ProductGalleryNavigation_instances,
              onMediaObserve_fn
            ).bind(this),
            { threshold: [0, 0.5, 1] }
          )
        ),
        __privateAdd(this, _hasProgrammaticScroll, !1),
        __privateAdd(this, _scrollDirection, "bottom"),
        __privateAdd(this, _lastScrollPosition),
        window.addEventListener("scroll", () => {
          window.scrollY > __privateGet(this, _lastScrollPosition)
            ? __privateSet(this, _scrollDirection, "bottom")
            : __privateSet(this, _scrollDirection, "top"),
            __privateSet(this, _lastScrollPosition, window.scrollY);
        });
    }
    connectedCallback() {
      super.connectedCallback(),
        this.carousel.allCells.forEach((cell) =>
          __privateGet(this, _intersectionObserver).observe(cell)
        );
    }
    onButtonClicked(newIndex) {
      this.carousel.isScrollable
        ? super.onButtonClicked(newIndex)
        : (this.carousel.cells[newIndex]?.scrollIntoView({
            block: "start",
            behavior: "smooth",
          }),
          this.onNavigationChange(newIndex),
          __privateSet(this, _hasProgrammaticScroll, !0),
          "onscrollend" in window
            ? window.addEventListener(
                "scrollend",
                () => {
                  __privateSet(this, _hasProgrammaticScroll, !1);
                },
                { once: !0 }
              )
            : setTimeout(() => {
                __privateSet(this, _hasProgrammaticScroll, !1);
              }, 1e3));
    }
  };
(_intersectionObserver = new WeakMap()),
  (_hasProgrammaticScroll = new WeakMap()),
  (_scrollDirection = new WeakMap()),
  (_lastScrollPosition = new WeakMap()),
  (_ProductGalleryNavigation_instances = new WeakSet()),
  (onMediaObserve_fn = function (entries) {
    if (this.carousel.isScrollable) return;
    const firstEntry = entries.find(
      (entry) => entry.isIntersecting && entry.intersectionRatio >= 0.5
    );
    if (!firstEntry || __privateGet(this, _hasProgrammaticScroll)) return;
    const selectedItem = this.items.find(
        (item) => item.getAttribute("aria-current") === "true"
      ),
      candidateItem = this.items.find(
        (item) =>
          item.getAttribute("data-media-id") ===
          firstEntry.target.getAttribute("data-media-id")
      );
    ((__privateGet(this, _scrollDirection) === "bottom" &&
      parseInt(candidateItem.getAttribute("data-media-position")) >
        parseInt(selectedItem.getAttribute("data-media-position"))) ||
      (__privateGet(this, _scrollDirection) === "top" &&
        parseInt(candidateItem.getAttribute("data-media-position")) <
          parseInt(selectedItem.getAttribute("data-media-position")))) &&
      (selectedItem.setAttribute("aria-current", "false"),
      candidateItem.setAttribute("aria-current", "true"));
  });
var OpenLightBoxButton = class extends HTMLElement {
  constructor() {
    super(),
      this.addEventListener("click", () =>
        this.dispatchEvent(new CustomEvent("lightbox:open", { bubbles: !0 }))
      );
  }
};
window.customElements.get("product-gallery") ||
  window.customElements.define("product-gallery", ProductGallery),
  window.customElements.get("product-gallery-navigation") ||
    window.customElements.define(
      "product-gallery-navigation",
      ProductGalleryNavigation
    ),
  window.customElements.get("open-lightbox-button") ||
    window.customElements.define("open-lightbox-button", OpenLightBoxButton);
import { inView as inView6, animate as animate9, stagger } from "vendor";
var ProductList = class extends HTMLElement {
  connectedCallback() {
    matchesMediaQuery("motion-safe") &&
      this.querySelectorAll('product-card[reveal-on-scroll="true"]').length >
        0 &&
      inView6(this, this.reveal.bind(this));
  }
  reveal() {
    animate9(
      this.querySelectorAll('product-card[reveal-on-scroll="true"]'),
      { opacity: [0, 1], transform: ["translateY(20px)", "translateY(0)"] },
      {
        duration: 0.2,
        easing: "ease-in-out",
        delay: stagger(0.05, { start: 0.4, easing: "ease-out" }),
      }
    );
  }
};
window.customElements.get("product-list") ||
  window.customElements.define("product-list", ProductList);
var loadedProducts = {},
  ProductLoader = class {
    static load(productHandle) {
      if (productHandle)
        return (
          loadedProducts[productHandle] ||
            (loadedProducts[productHandle] = new Promise(
              async (resolve, reject) => {
                const response = await fetch(
                  `${Shopify.routes.root}products/${productHandle}.js`
                );
                if (response.ok) {
                  const responseAsJson = await response.json();
                  resolve(responseAsJson);
                } else
                  reject(`
          Attempted to load information for product with handle ${productHandle}, but this product is in "draft" mode. You won't be able to
          switch between variants or access to per-variant information. To fully preview this product, change temporarily its status
          to "active".
        `);
              }
            )),
          loadedProducts[productHandle]
        );
    }
  },
  _abortController8,
  _ProductRerender_instances,
  onRerender_fn,
  ProductRerender = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ProductRerender_instances),
        __privateAdd(this, _abortController8);
    }
    connectedCallback() {
      __privateSet(this, _abortController8, new AbortController()),
        (!this.id || !this.hasAttribute("observe-form")) &&
          console.warn(
            'The <product-rerender> requires an ID to identify the element to re-render, and an "observe-form" attribute referencing to the form to monitor.'
          ),
        document.forms[this.getAttribute("observe-form")].addEventListener(
          "product:rerender",
          __privateMethod(this, _ProductRerender_instances, onRerender_fn).bind(
            this
          ),
          { signal: __privateGet(this, _abortController8).signal }
        );
    }
    disconnectedCallback() {
      __privateGet(this, _abortController8).abort();
    }
  };
(_abortController8 = new WeakMap()),
  (_ProductRerender_instances = new WeakSet()),
  (onRerender_fn = function (event) {
    const matchingElement = deepQuerySelector(
      event.detail.htmlFragment,
      `#${this.id}`
    );
    if (!matchingElement) return;
    const focusedElement = document.activeElement;
    if (
      (!this.hasAttribute("allow-partial-rerender") ||
      event.detail.productChange
        ? this.replaceWith(matchingElement)
        : [
            "sku",
            "badges",
            "quantity-selector",
            "volume-pricing",
            "price",
            "payment-terms",
            "variant-picker",
            "inventory",
            "buy-buttons",
            "pickup-availability",
            "liquid",
          ].forEach((blockType) => {
            this.querySelectorAll(`[data-block-type="${blockType}"]`).forEach(
              (element) => {
                const matchingBlock = matchingElement.querySelector(
                  `[data-block-type="${blockType}"][data-block-id="${element.getAttribute(
                    "data-block-id"
                  )}"]`
                );
                if (matchingBlock)
                  if (blockType === "buy-buttons")
                    element
                      .querySelector("buy-buttons")
                      .replaceWith(matchingBlock.querySelector("buy-buttons"));
                  else if (blockType === "quantity-selector") {
                    const quantitySelectorElement =
                      element.querySelector("quantity-selector");
                    if (quantitySelectorElement) {
                      const existingQuantity = quantitySelectorElement.quantity;
                      element.replaceWith(matchingBlock),
                        (matchingBlock.querySelector(
                          "quantity-selector"
                        ).quantity = existingQuantity);
                    }
                  } else element.replaceWith(matchingBlock);
              }
            );
          }),
      focusedElement.id)
    ) {
      const element = document.getElementById(focusedElement.id);
      this.contains(element) && element.focus();
    }
  }),
  window.customElements.get("product-rerender") ||
    window.customElements.define("product-rerender", ProductRerender);
var _QuickBuyModal_instances,
  onAfterHide_fn,
  QuickBuyModal = class extends Modal {
    constructor() {
      super(),
        __privateAdd(this, _QuickBuyModal_instances),
        window.themeVariables.settings.cartType === "drawer" &&
          document.addEventListener("variant:add", this.hide.bind(this)),
        this.addEventListener(
          "dialog:after-hide",
          __privateMethod(this, _QuickBuyModal_instances, onAfterHide_fn).bind(
            this
          )
        );
    }
    async show() {
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:start", { bubbles: !0 })
      );
      const responseContent = await (
        await cachedFetch(
          `${window.Shopify.routes.root}products/${this.getAttribute("handle")}`
        )
      ).text();
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      );
      const quickBuyContent = new DOMParser()
        .parseFromString(responseContent, "text/html")
        .getElementById("quick-buy-content").content;
      return (
        Array.from(quickBuyContent.querySelectorAll("noscript")).forEach(
          (noScript) => noScript.remove()
        ),
        this.replaceChildren(quickBuyContent),
        Shopify?.PaymentButton?.init(),
        super.show()
      );
    }
  };
(_QuickBuyModal_instances = new WeakSet()),
  (onAfterHide_fn = function () {
    this.innerHTML = "";
  }),
  window.customElements.get("quick-buy-modal") ||
    window.customElements.define("quick-buy-modal", QuickBuyModal);
import { Delegate as Delegate5 } from "vendor";
var CACHE_EVICTION_TIME = 1e3 * 60 * 5,
  _preloadedHtml,
  _delegate4,
  _intersectionObserver2,
  _form,
  _selectedVariant,
  _VariantPicker_instances,
  getActiveOptionValues_fn,
  getOptionValuesFromOption_fn,
  onOptionChanged_fn,
  onOptionPreload_fn,
  onIntersection_fn,
  renderForCombination_fn,
  createHashKeyForHtml_fn,
  _VariantPicker = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _VariantPicker_instances),
        __privateAdd(this, _delegate4, new Delegate5(document.body)),
        __privateAdd(
          this,
          _intersectionObserver2,
          new IntersectionObserver(
            __privateMethod(
              this,
              _VariantPicker_instances,
              onIntersection_fn
            ).bind(this)
          )
        ),
        __privateAdd(this, _form),
        __privateAdd(this, _selectedVariant);
    }
    async connectedCallback() {
      __privateSet(
        this,
        _selectedVariant,
        JSON.parse(
          this.querySelector("script[data-variant]")?.textContent || "{}"
        )
      ),
        __privateSet(this, _form, document.forms[this.getAttribute("form-id")]),
        __privateGet(this, _delegate4).on(
          "change",
          `input[data-option-position][form="${this.getAttribute("form-id")}"]`,
          __privateMethod(
            this,
            _VariantPicker_instances,
            onOptionChanged_fn
          ).bind(this)
        ),
        __privateGet(this, _delegate4).on(
          "pointerenter",
          `input[data-option-position][form="${this.getAttribute(
            "form-id"
          )}"]:not(:checked) + label`,
          __privateMethod(
            this,
            _VariantPicker_instances,
            onOptionPreload_fn
          ).bind(this),
          !0
        ),
        __privateGet(this, _delegate4).on(
          "touchstart",
          `input[data-option-position][form="${this.getAttribute(
            "form-id"
          )}"]:not(:checked) + label`,
          __privateMethod(
            this,
            _VariantPicker_instances,
            onOptionPreload_fn
          ).bind(this),
          !0
        ),
        __privateGet(this, _intersectionObserver2).observe(this);
    }
    disconnectedCallback() {
      __privateGet(this, _delegate4).off(),
        __privateGet(this, _intersectionObserver2).unobserve(this);
    }
    get selectedVariant() {
      return __privateGet(this, _selectedVariant);
    }
    get productHandle() {
      return this.getAttribute("handle");
    }
    get updateUrl() {
      return this.hasAttribute("update-url");
    }
    async selectCombination({ optionValues, productChange }) {
      const previousVariant = this.selectedVariant,
        newContent = document
          .createRange()
          .createContextualFragment(
            await __privateMethod(
              this,
              _VariantPicker_instances,
              renderForCombination_fn
            ).call(this, optionValues)
          );
      if (!productChange) {
        const newVariantPicker = deepQuerySelector(
            newContent,
            `${this.tagName}[form-id="${this.getAttribute("form-id")}"]`
          ),
          newVariant = JSON.parse(
            newVariantPicker.querySelector("script[data-variant]")
              ?.textContent || "{}"
          );
        if (
          (__privateSet(this, _selectedVariant, newVariant),
          (__privateGet(this, _form).id.value = __privateGet(
            this,
            _selectedVariant
          )?.id),
          __privateGet(this, _form).id.dispatchEvent(
            new Event("change", { bubbles: !0 })
          ),
          this.updateUrl && __privateGet(this, _selectedVariant)?.id)
        ) {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.set(
            "variant",
            __privateGet(this, _selectedVariant).id
          ),
            window.history.replaceState(
              { path: newUrl.toString() },
              "",
              newUrl.toString()
            );
        }
      }
      __privateGet(this, _form).dispatchEvent(
        new CustomEvent("product:rerender", {
          detail: { htmlFragment: newContent, productChange },
        })
      ),
        productChange ||
          __privateGet(this, _form).dispatchEvent(
            new CustomEvent("variant:change", {
              bubbles: !0,
              detail: {
                formId: __privateGet(this, _form).id,
                variant: __privateGet(this, _selectedVariant),
                previousVariant,
              },
            })
          ),
        Shopify?.PaymentButton?.init();
    }
  };
(_preloadedHtml = new WeakMap()),
  (_delegate4 = new WeakMap()),
  (_intersectionObserver2 = new WeakMap()),
  (_form = new WeakMap()),
  (_selectedVariant = new WeakMap()),
  (_VariantPicker_instances = new WeakSet()),
  (getActiveOptionValues_fn = function () {
    return Array.from(__privateGet(this, _form).elements)
      .filter((item) => item.matches("input[data-option-position]:checked"))
      .sort(
        (a, b) =>
          parseInt(a.getAttribute("data-option-position")) -
          parseInt(b.getAttribute("data-option-position"))
      )
      .map((input) => input.value);
  }),
  (getOptionValuesFromOption_fn = function (input) {
    return [
      input,
      ...Array.from(__privateGet(this, _form).elements).filter((item) =>
        item.matches(
          `input[data-option-position]:not([name="${input.name}"]):checked`
        )
      ),
    ]
      .sort(
        (a, b) =>
          parseInt(a.getAttribute("data-option-position")) -
          parseInt(b.getAttribute("data-option-position"))
      )
      .map((input2) => input2.value);
  }),
  (onOptionChanged_fn = async function (event) {
    event.target.name.includes("option") &&
      this.selectCombination({
        optionValues: __privateMethod(
          this,
          _VariantPicker_instances,
          getActiveOptionValues_fn
        ).call(this),
        productChange: event.target.hasAttribute("data-product-url"),
      });
  }),
  (onOptionPreload_fn = function (event, target) {
    __privateMethod(
      this,
      _VariantPicker_instances,
      renderForCombination_fn
    ).call(
      this,
      __privateMethod(
        this,
        _VariantPicker_instances,
        getOptionValuesFromOption_fn
      ).call(this, target.control)
    );
  }),
  (onIntersection_fn = function (entries) {
    const prerenderOptions = () => {
      Array.from(__privateGet(this, _form).elements)
        .filter((item) =>
          item.matches("input[data-option-position]:not(:checked)")
        )
        .forEach((input) => {
          __privateMethod(
            this,
            _VariantPicker_instances,
            renderForCombination_fn
          ).call(
            this,
            __privateMethod(
              this,
              _VariantPicker_instances,
              getOptionValuesFromOption_fn
            ).call(this, input)
          );
        });
    };
    entries[0].isIntersecting &&
      (window.requestIdleCallback
        ? window.requestIdleCallback(prerenderOptions, { timeout: 2e3 })
        : prerenderOptions());
  }),
  (renderForCombination_fn = async function (optionValues) {
    const optionValuesAsString = optionValues.join(","),
      hashKey = __privateMethod(
        this,
        _VariantPicker_instances,
        createHashKeyForHtml_fn
      ).call(this, optionValuesAsString);
    let productUrl = `${Shopify.routes.root}products/${this.productHandle}`;
    for (const optionValue of optionValues) {
      const inputForOptionValue = Array.from(
        __privateGet(this, _form).elements
      ).find((item) => item.matches(`input[value="${optionValue}"]`));
      if (inputForOptionValue?.dataset.productUrl) {
        productUrl = inputForOptionValue.dataset.productUrl;
        break;
      }
    }
    if (!__privateGet(_VariantPicker, _preloadedHtml).has(hashKey)) {
      const sectionQueryParam =
          this.getAttribute("context") === "quick_buy"
            ? ""
            : `&section_id=${this.getAttribute("section-id")}`,
        promise = new Promise(async (resolve) => {
          resolve(
            await (
              await fetch(
                `${productUrl}?option_values=${optionValuesAsString}${sectionQueryParam}`
              )
            ).text()
          );
        });
      __privateGet(_VariantPicker, _preloadedHtml).set(hashKey, {
        htmlPromise: promise,
        timestamp: Date.now(),
      }),
        __privateGet(_VariantPicker, _preloadedHtml).size > 100 &&
          __privateGet(_VariantPicker, _preloadedHtml).delete(
            Array.from(__privateGet(_VariantPicker, _preloadedHtml).keys())[0]
          );
    }
    return __privateGet(_VariantPicker, _preloadedHtml).get(hashKey)
      .htmlPromise;
  }),
  (createHashKeyForHtml_fn = function (optionValuesAsString) {
    return `${optionValuesAsString}-${this.getAttribute("section-id")}`;
  }),
  __privateAdd(_VariantPicker, _preloadedHtml, new Map());
var VariantPicker = _VariantPicker;
window.customElements.get("variant-picker") ||
  window.customElements.define("variant-picker", VariantPicker);
import { inView as inView7 } from "vendor";
var BaseMedia = class extends HTMLElement {
    static get observedAttributes() {
      return ["playing"];
    }
    connectedCallback() {
      (this._abortController = new AbortController()),
        this.hasAttribute("autoplay") &&
          inView7(this, this.play.bind(this), { margin: "0px 0px 0px 0px" });
    }
    disconnectedCallback() {
      this._abortController.abort();
    }
    get playing() {
      return this.hasAttribute("playing");
    }
    get player() {
      return (this._playerProxy =
        this._playerProxy ||
        new Proxy(this._playerTarget(), {
          get: (target, prop) => async () => {
            (target = await target), this._playerHandler(target, prop);
          },
        }));
    }
    play() {
      this.playing || this.player.play();
    }
    pause() {
      this.playing && this.player.pause();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      name === "playing" &&
        (oldValue === null && newValue === ""
          ? (this.dispatchEvent(new CustomEvent("media:play", { bubbles: !0 })),
            this.hasAttribute("group") &&
              Array.from(
                document.querySelectorAll(
                  `[group="${this.getAttribute("group")}"]`
                )
              )
                .filter((item) => item !== this)
                .forEach((itemToPause) => {
                  itemToPause.pause();
                }))
          : newValue === null &&
            this.dispatchEvent(
              new CustomEvent("media:pause", { bubbles: !0 })
            ));
    }
  },
  ModelMedia = class extends BaseMedia {
    connectedCallback() {
      super.connectedCallback(), this.player;
    }
    _playerTarget() {
      return new Promise((resolve) => {
        this.setAttribute("loaded", ""),
          window.Shopify.loadFeatures([
            {
              name: "shopify-xr",
              version: "1.0",
              onLoad: this._setupShopifyXr.bind(this),
            },
            {
              name: "model-viewer-ui",
              version: "1.0",
              onLoad: () => {
                const modelViewer = this.querySelector("model-viewer");
                modelViewer.addEventListener(
                  "shopify_model_viewer_ui_toggle_play",
                  () => this.setAttribute("playing", "")
                ),
                  modelViewer.addEventListener(
                    "shopify_model_viewer_ui_toggle_pause",
                    () => this.removeAttribute("playing")
                  ),
                  resolve(
                    new window.Shopify.ModelViewerUI(modelViewer, {
                      focusOnPlay: !0,
                    })
                  );
              },
            },
          ]);
      });
    }
    _playerHandler(target, prop) {
      target[prop]();
    }
    async _setupShopifyXr() {
      if (!window.ShopifyXR)
        document.addEventListener(
          "shopify_xr_initialized",
          this._setupShopifyXr.bind(this)
        );
      else {
        const models = (
          await ProductLoader.load(this.getAttribute("handle"))
        ).media.filter((media) => media.media_type === "model");
        window.ShopifyXR.addModels(models), window.ShopifyXR.setupXRElements();
      }
    }
  };
window.customElements.get("model-media") ||
  window.customElements.define("model-media", ModelMedia);
import { inView as inView8 } from "vendor";
var onYouTubePromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => resolve();
  }),
  VideoMedia = class extends BaseMedia {
    #mustRemoveControlsAfterSuspend = !1;
    connectedCallback() {
      super.connectedCallback(),
        this.hasAttribute("autoplay") ||
          this.addEventListener("click", this.play, {
            once: !0,
            signal: this._abortController.signal,
          }),
        this.hasAttribute("show-play-button") &&
          !this.shadowRoot &&
          this.attachShadow({ mode: "open" }).appendChild(
            document
              .getElementById("video-media-default-template")
              .content.cloneNode(!0)
          ),
        this.getAttribute("type") === "video" &&
          inView8(
            this,
            () => {
              this.querySelector("video")?.setAttribute("preload", "metadata");
            },
            { margin: "800px" }
          );
    }
    _playerTarget() {
      if (this.hasAttribute("host"))
        return (
          this.setAttribute("loaded", ""),
          new Promise(async (resolve) => {
            const templateElement = this.querySelector("template");
            templateElement &&
              templateElement.replaceWith(
                templateElement.content.firstElementChild.cloneNode(!0)
              );
            const muteVideo =
                this.hasAttribute("autoplay") || matchesMediaQuery("md-max"),
              script = document.createElement("script");
            if (
              ((script.type = "text/javascript"),
              this.getAttribute("host") === "youtube")
            ) {
              (!window.YT || !window.YT.Player) &&
                ((script.src = "https://www.youtube.com/iframe_api"),
                document.head.appendChild(script),
                await new Promise((resolve2) => {
                  script.onload = resolve2;
                })),
                await onYouTubePromise;
              const player = new YT.Player(this.querySelector("iframe"), {
                events: {
                  onReady: () => {
                    muteVideo && player.mute(), resolve(player);
                  },
                  onStateChange: (event) => {
                    event.data === YT.PlayerState.PLAYING
                      ? this.setAttribute("playing", "")
                      : (event.data === YT.PlayerState.ENDED ||
                          event.data === YT.PlayerState.PAUSED) &&
                        this.removeAttribute("playing");
                  },
                },
              });
            }
            if (this.getAttribute("host") === "vimeo") {
              (!window.Vimeo || !window.Vimeo.Player) &&
                ((script.src = "https://player.vimeo.com/api/player.js"),
                document.head.appendChild(script),
                await new Promise((resolve2) => {
                  script.onload = resolve2;
                }));
              const player = new Vimeo.Player(this.querySelector("iframe"));
              muteVideo && player.setMuted(!0),
                player.on("play", () => {
                  this.setAttribute("playing", "");
                }),
                player.on("pause", () => this.removeAttribute("playing")),
                player.on("ended", () => this.removeAttribute("playing")),
                resolve(player);
            }
          })
        );
      {
        const videoElement = this.querySelector("video");
        return (
          this.setAttribute("loaded", ""),
          videoElement.addEventListener("play", () => {
            this.setAttribute("playing", ""),
              this.removeAttribute("suspended"),
              this.#mustRemoveControlsAfterSuspend &&
                (videoElement.controls = !1);
          }),
          videoElement.addEventListener("pause", () => {
            !videoElement.seeking &&
              videoElement.paused &&
              this.removeAttribute("playing");
          }),
          videoElement
        );
      }
    }
    _playerHandler(target, prop) {
      this.getAttribute("host") === "youtube"
        ? prop === "play"
          ? target.playVideo()
          : target.pauseVideo()
        : prop === "play" && !this.hasAttribute("host")
        ? target.play().catch((error) => {
            error.name === "NotAllowedError" &&
              (this.setAttribute("suspended", ""),
              this.hasAttribute("controls") ||
                ((this.#mustRemoveControlsAfterSuspend = !0),
                (target.controls = !0)));
          })
        : target[prop]();
    }
  };
window.customElements.get("video-media") ||
  window.customElements.define("video-media", VideoMedia);
import { timeline as timeline5 } from "vendor";
var _onSummaryClickedListener,
  _CustomDetails_instances,
  onSummaryClicked_fn,
  CustomDetails = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _CustomDetails_instances),
        __privateAdd(
          this,
          _onSummaryClickedListener,
          __privateMethod(
            this,
            _CustomDetails_instances,
            onSummaryClicked_fn
          ).bind(this)
        ),
        Shopify.designMode &&
          (this.addEventListener("shopify:block:select", (event) =>
            this.toggle(!0, !event.detail.load)
          ),
          this.addEventListener("shopify:block:deselect", (event) =>
            this.toggle(!1, !event.detail.load)
          ));
    }
    static get observedAttributes() {
      return ["open", "aria-expanded"];
    }
    connectedCallback() {
      this.disclosureElement.setAttribute(
        "aria-expanded",
        this.disclosureElement.open ? "true" : "false"
      ),
        this.summaryElement.addEventListener(
          "click",
          __privateGet(this, _onSummaryClickedListener)
        );
    }
    disconnectedCallback() {
      this.summaryElement.removeEventListener(
        "click",
        __privateGet(this, _onSummaryClickedListener)
      );
    }
    get disclosureElement() {
      return this.querySelector("details");
    }
    get summaryElement() {
      return this.disclosureElement.firstElementChild;
    }
    get contentElement() {
      return this.disclosureElement.lastElementChild;
    }
    toggle(force = void 0, animate26 = !0) {
      (
        typeof force == "boolean"
          ? force
          : this.disclosureElement.getAttribute("aria-expanded") !== "true"
      )
        ? this.open({ instant: !animate26 })
        : this.close();
    }
    async open({ instant = !1 } = {}) {
      if (this.disclosureElement.getAttribute("aria-expanded") === "true")
        return;
      (this.disclosureElement.open = !0),
        this.disclosureElement.setAttribute("aria-expanded", "true");
      const controls = this.createShowAnimationControls();
      instant && controls.finish();
    }
    async close() {
      this.disclosureElement.setAttribute("aria-expanded", "false"),
        this.disclosureElement.open &&
          this.createHideAnimationControls()?.finished.then((event) => {
            event !== void 0 && this.disclosureElement.removeAttribute("open");
          });
    }
    createShowAnimationControls() {}
    createHideAnimationControls() {}
  };
(_onSummaryClickedListener = new WeakMap()),
  (_CustomDetails_instances = new WeakSet()),
  (onSummaryClicked_fn = function (event) {
    if (
      (event.preventDefault(),
      this.disclosureElement.open &&
        this.summaryElement.hasAttribute("data-follow-link"))
    )
      return (window.location.href =
        this.summaryElement.getAttribute("data-follow-link"));
    this.toggle();
  });
var AccordionDisclosure = class extends CustomDetails {
  createShowAnimationControls() {
    this.disclosureElement.style.overflow = "hidden";
    const animationControls = timeline5([
      [
        this.disclosureElement,
        {
          height: [
            `${this.summaryElement.clientHeight}px`,
            `${this.disclosureElement.scrollHeight}px`,
          ],
        },
        { duration: 0.25, easing: "ease" },
      ],
      [
        this.contentElement,
        { opacity: [0, 1], transform: ["translateY(4px)", "translateY(0)"] },
        { duration: 0.15, at: "-0.1" },
      ],
    ]);
    return (
      animationControls.finished.then(() => {
        (this.disclosureElement.style.height = null),
          (this.disclosureElement.style.overflow = null);
      }),
      animationControls
    );
  }
  createHideAnimationControls() {
    const animationControls = timeline5([
      [this.contentElement, { opacity: 0 }, { duration: 0.15 }],
      [
        this.disclosureElement,
        {
          height: [
            `${this.disclosureElement.clientHeight}px`,
            `${this.summaryElement.clientHeight}px`,
          ],
        },
        { duration: 0.25, at: "<", easing: "ease" },
      ],
    ]);
    return (
      animationControls.finished.then(() => {
        this.disclosureElement.style.height = null;
      }),
      animationControls
    );
  }
};
window.customElements.get("accordion-disclosure") ||
  window.customElements.define("accordion-disclosure", AccordionDisclosure);
var _hoverTimer,
  _detectClickOutsideListener,
  _detectEscKeyboardListener,
  _detectFocusOutListener,
  _detectHoverOutsideListener,
  _detectHoverListener,
  _MenuDisclosure_instances,
  detectClickOutside_fn,
  detectHover_fn,
  detectHoverOutside_fn,
  detectEscKeyboard_fn,
  detectFocusOut_fn,
  _MenuDisclosure = class extends CustomDetails {
    constructor() {
      super(),
        __privateAdd(this, _MenuDisclosure_instances),
        __privateAdd(this, _hoverTimer),
        __privateAdd(
          this,
          _detectClickOutsideListener,
          __privateMethod(
            this,
            _MenuDisclosure_instances,
            detectClickOutside_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _detectEscKeyboardListener,
          __privateMethod(
            this,
            _MenuDisclosure_instances,
            detectEscKeyboard_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _detectFocusOutListener,
          __privateMethod(
            this,
            _MenuDisclosure_instances,
            detectFocusOut_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _detectHoverOutsideListener,
          __privateMethod(
            this,
            _MenuDisclosure_instances,
            detectHoverOutside_fn
          ).bind(this)
        ),
        __privateAdd(
          this,
          _detectHoverListener,
          __privateMethod(this, _MenuDisclosure_instances, detectHover_fn).bind(
            this
          )
        ),
        this.disclosureElement.addEventListener(
          "mouseover",
          __privateGet(this, _detectHoverListener).bind(this)
        ),
        this.disclosureElement.addEventListener(
          "mouseout",
          __privateGet(this, _detectHoverListener).bind(this)
        );
    }
    get trigger() {
      return window.matchMedia("screen and (pointer: fine)").matches
        ? this.getAttribute("trigger")
        : "click";
    }
    get mouseOverDelayTolerance() {
      return 250;
    }
    async open({ instant = !1 } = {}) {
      super.open({ instant }),
        document.addEventListener(
          "click",
          __privateGet(this, _detectClickOutsideListener)
        ),
        document.addEventListener(
          "keydown",
          __privateGet(this, _detectEscKeyboardListener)
        ),
        document.addEventListener(
          "focusout",
          __privateGet(this, _detectFocusOutListener)
        ),
        document.addEventListener(
          "mouseover",
          __privateGet(this, _detectHoverOutsideListener)
        );
    }
    async close() {
      super.close(),
        document.removeEventListener(
          "click",
          __privateGet(this, _detectClickOutsideListener)
        ),
        document.removeEventListener(
          "keydown",
          __privateGet(this, _detectEscKeyboardListener)
        ),
        document.removeEventListener(
          "focusout",
          __privateGet(this, _detectFocusOutListener)
        ),
        document.removeEventListener(
          "mouseover",
          __privateGet(this, _detectHoverOutsideListener)
        );
    }
  };
(_hoverTimer = new WeakMap()),
  (_detectClickOutsideListener = new WeakMap()),
  (_detectEscKeyboardListener = new WeakMap()),
  (_detectFocusOutListener = new WeakMap()),
  (_detectHoverOutsideListener = new WeakMap()),
  (_detectHoverListener = new WeakMap()),
  (_MenuDisclosure_instances = new WeakSet()),
  (detectClickOutside_fn = function (event) {
    this.trigger === "click" &&
      !this.contains(event.target) &&
      !(event.target.closest("details") instanceof _MenuDisclosure) &&
      this.toggle(!1);
  }),
  (detectHover_fn = function (event) {
    this.trigger === "hover" &&
      (event.type === "mouseover"
        ? (clearTimeout(__privateGet(this, _hoverTimer)), this.toggle(!0))
        : event.type === "mouseout" &&
          __privateSet(
            this,
            _hoverTimer,
            setTimeout(() => this.toggle(!1), this.mouseOverDelayTolerance)
          ));
  }),
  (detectHoverOutside_fn = function (event) {
    if (this.trigger !== "hover") return;
    const closestDetails = event.target.closest("details");
    closestDetails instanceof _MenuDisclosure &&
      closestDetails !== this &&
      !closestDetails.contains(this) &&
      !this.contains(closestDetails) &&
      (clearTimeout(__privateGet(this, _hoverTimer)), this.toggle(!1));
  }),
  (detectEscKeyboard_fn = function (event) {
    if (event.code === "Escape") {
      const targetMenu = event.target.closest("details[open]");
      targetMenu &&
        targetMenu instanceof _MenuDisclosure &&
        (targetMenu.toggle(!1), event.stopPropagation());
    }
  }),
  (detectFocusOut_fn = function (event) {
    event.relatedTarget &&
      !this.contains(event.relatedTarget) &&
      this.toggle(!1);
  });
var MenuDisclosure = _MenuDisclosure;
import {
  Delegate as Delegate6,
  animate as animate10,
  timeline as timeline6,
} from "vendor";
var _componentID,
  _buttons,
  _panels,
  _delegate5,
  _Tabs_instances,
  setupComponent_fn,
  onButtonClicked_fn,
  onSlotChange_fn,
  handleKeyboard_fn,
  Tabs = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _Tabs_instances),
        __privateAdd(
          this,
          _componentID,
          crypto.randomUUID
            ? crypto.randomUUID()
            : Math.floor(Math.random() * 1e4)
        ),
        __privateAdd(this, _buttons, []),
        __privateAdd(this, _panels, []),
        __privateAdd(this, _delegate5, new Delegate6(this)),
        this.shadowRoot ||
          this.attachShadow({ mode: "open" }).appendChild(
            this.querySelector("template").content.cloneNode(!0)
          ),
        Shopify.designMode &&
          this.addEventListener(
            "shopify:block:select",
            (event) =>
              (this.selectedIndex = __privateGet(this, _buttons).indexOf(
                event.target
              ))
          ),
        __privateGet(this, _delegate5).on(
          "click",
          'button[role="tab"]',
          __privateMethod(this, _Tabs_instances, onButtonClicked_fn).bind(this)
        ),
        this.shadowRoot.addEventListener(
          "slotchange",
          __privateMethod(this, _Tabs_instances, onSlotChange_fn).bind(this)
        ),
        this.addEventListener(
          "keydown",
          __privateMethod(this, _Tabs_instances, handleKeyboard_fn)
        );
    }
    static get observedAttributes() {
      return ["selected-index"];
    }
    connectedCallback() {
      __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this),
        (this.selectedIndex = this.selectedIndex);
    }
    disconnectedCallback() {
      __privateGet(this, _delegate5).destroy();
    }
    get animationDuration() {
      return this.hasAttribute("animation-duration")
        ? parseFloat(this.getAttribute("animation-duration"))
        : 0.3;
    }
    get selectedIndex() {
      return parseInt(this.getAttribute("selected-index")) || 0;
    }
    set selectedIndex(index) {
      this.setAttribute(
        "selected-index",
        Math.min(
          Math.max(index, 0),
          __privateGet(this, _buttons).length - 1
        ).toString()
      ),
        this.style.setProperty(
          "--selected-index",
          this.selectedIndex.toString()
        );
    }
    attributeChangedCallback(name, oldValue, newValue) {
      __privateGet(this, _buttons).forEach((button, index) =>
        button.setAttribute(
          "aria-selected",
          index === parseInt(newValue) ? "true" : "false"
        )
      ),
        name === "selected-index" &&
          oldValue !== null &&
          oldValue !== newValue &&
          this.transition(
            __privateGet(this, _panels)[parseInt(oldValue)],
            __privateGet(this, _panels)[parseInt(newValue)]
          );
    }
    async transition(fromPanel, toPanel) {
      const beforeHeight = this.clientHeight;
      await animate10(
        fromPanel,
        { transform: ["translateY(0px)", "translateY(10px)"], opacity: [1, 0] },
        { duration: this.animationDuration }
      ).finished,
        (fromPanel.hidden = !0),
        (toPanel.hidden = !1),
        await timeline6([
          [
            this,
            {
              height: [`${beforeHeight}px`, `${this.clientHeight}px`],
              overflow: ["hidden", "visible"],
            },
            { duration: 0.15, easing: [0.85, 0, 0.15, 1] },
          ],
          [
            toPanel,
            {
              transform: ["translateY(10px)", "translateY(0px)"],
              opacity: [0, 1],
            },
            { duration: this.animationDuration, at: "+0.1" },
          ],
        ]).finished,
        this.style.removeProperty("height");
    }
  };
(_componentID = new WeakMap()),
  (_buttons = new WeakMap()),
  (_panels = new WeakMap()),
  (_delegate5 = new WeakMap()),
  (_Tabs_instances = new WeakSet()),
  (setupComponent_fn = function () {
    __privateSet(
      this,
      _buttons,
      Array.from(
        this.shadowRoot.querySelector('slot[name="title"]').assignedNodes(),
        (item) =>
          (item.matches("button") && item) || item.querySelector("button")
      )
    ),
      __privateSet(
        this,
        _panels,
        Array.from(
          this.shadowRoot.querySelector('slot[name="content"]').assignedNodes()
        )
      ),
      __privateGet(this, _buttons).forEach((button, index) => {
        button.setAttribute("role", "tab"),
          button.setAttribute(
            "aria-controls",
            `tab-panel-${__privateGet(this, _componentID)}-${index}`
          ),
          (button.id = `tab-${__privateGet(this, _componentID)}-${index}`);
      }),
      __privateGet(this, _panels).forEach((panel, index) => {
        panel.setAttribute("role", "tabpanel"),
          panel.setAttribute(
            "aria-labelledby",
            `tab-${__privateGet(this, _componentID)}-${index}`
          ),
          (panel.id = `tab-panel-${__privateGet(this, _componentID)}-${index}`),
          (panel.hidden = index !== this.selectedIndex);
      }),
      this.style.setProperty(
        "--item-count",
        __privateGet(this, _buttons).length.toString()
      );
  }),
  (onButtonClicked_fn = function (event, button) {
    this.selectedIndex = __privateGet(this, _buttons).indexOf(button);
  }),
  (onSlotChange_fn = function () {
    __privateMethod(this, _Tabs_instances, setupComponent_fn).call(this);
  }),
  (handleKeyboard_fn = function (event) {
    __privateGet(this, _buttons).indexOf(document.activeElement) === -1 ||
      !["ArrowLeft", "ArrowRight"].includes(event.key) ||
      (event.key === "ArrowLeft"
        ? (this.selectedIndex =
            (this.selectedIndex - 1 + __privateGet(this, _buttons).length) %
            __privateGet(this, _buttons).length)
        : (this.selectedIndex =
            (this.selectedIndex + 1 + __privateGet(this, _buttons).length) %
            __privateGet(this, _buttons).length),
      __privateGet(this, _buttons)[this.selectedIndex].focus());
  }),
  window.customElements.get("x-tabs") ||
    window.customElements.define("x-tabs", Tabs);
var _listenersAbortController2,
  _fetchAbortController,
  _searchForm,
  _queryInput,
  _PredictiveSearch_instances,
  onInputChanged_fn2,
  onFormSubmitted_fn2,
  doPredictiveSearch_fn,
  onSearchCleared_fn,
  PredictiveSearch = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _PredictiveSearch_instances),
        __privateAdd(this, _listenersAbortController2),
        __privateAdd(this, _fetchAbortController),
        __privateAdd(this, _searchForm),
        __privateAdd(this, _queryInput),
        this.attachShadow({ mode: "open" }),
        this.shadowRoot.appendChild(
          document
            .createRange()
            .createContextualFragment('<slot name="results"></slot>')
        );
    }
    connectedCallback() {
      __privateSet(this, _listenersAbortController2, new AbortController()),
        __privateSet(
          this,
          _searchForm,
          document.querySelector(`[aria-owns="${this.id}"]`)
        ),
        __privateSet(
          this,
          _queryInput,
          __privateGet(this, _searchForm).elements.q
        ),
        __privateGet(this, _searchForm).addEventListener(
          "submit",
          __privateMethod(
            this,
            _PredictiveSearch_instances,
            onFormSubmitted_fn2
          ).bind(this),
          { signal: __privateGet(this, _listenersAbortController2).signal }
        ),
        __privateGet(this, _searchForm).addEventListener(
          "reset",
          __privateMethod(
            this,
            _PredictiveSearch_instances,
            onSearchCleared_fn
          ).bind(this),
          { signal: __privateGet(this, _listenersAbortController2).signal }
        ),
        __privateGet(this, _queryInput).addEventListener(
          "input",
          debounce(
            __privateMethod(
              this,
              _PredictiveSearch_instances,
              onInputChanged_fn2
            ).bind(this),
            this.autoCompleteDelay,
            { signal: __privateGet(this, _listenersAbortController2).signal }
          )
        );
    }
    disconnectedCallback() {
      __privateGet(this, _listenersAbortController2).abort();
    }
    get autoCompleteDelay() {
      return 280;
    }
    supportsPredictiveApi() {
      return JSON.parse(document.getElementById("shopify-features").innerHTML)
        .predictiveSearch;
    }
  };
(_listenersAbortController2 = new WeakMap()),
  (_fetchAbortController = new WeakMap()),
  (_searchForm = new WeakMap()),
  (_queryInput = new WeakMap()),
  (_PredictiveSearch_instances = new WeakSet()),
  (onInputChanged_fn2 = function () {
    if (__privateGet(this, _queryInput).value === "")
      return __privateMethod(
        this,
        _PredictiveSearch_instances,
        onSearchCleared_fn
      ).call(this);
    __privateGet(this, _fetchAbortController)?.abort(),
      __privateSet(this, _fetchAbortController, new AbortController());
    try {
      return __privateMethod(
        this,
        _PredictiveSearch_instances,
        doPredictiveSearch_fn
      ).call(this);
    } catch (e) {
      if (e.name !== "AbortError") throw e;
    }
  }),
  (onFormSubmitted_fn2 = function (event) {
    if (__privateGet(this, _queryInput).value === "")
      return event.preventDefault();
  }),
  (doPredictiveSearch_fn = async function () {
    document.documentElement.dispatchEvent(
      new CustomEvent("theme:loading:start", { bubbles: !0 })
    );
    const url = `${window.Shopify.routes.root}search${
        this.supportsPredictiveApi() ? "/suggest" : ""
      }`,
      queryParams = `q=${encodeURIComponent(
        __privateGet(this, _queryInput).value
      )}&section_id=predictive-search&resources[limit]=10&resources[limit_scope]=each&resources[options][fields]=title,variants.sku,product_type,variants.title`,
      tempDoc = new DOMParser().parseFromString(
        await (
          await cachedFetch(`${url}?${queryParams}`, {
            signal: __privateGet(this, _fetchAbortController).signal,
          })
        ).text(),
        "text/html"
      );
    this.querySelector('[slot="results"]').replaceChildren(
      ...document.importNode(tempDoc.querySelector(".shopify-section"), !0)
        .children
    ),
      document.documentElement.dispatchEvent(
        new CustomEvent("theme:loading:end", { bubbles: !0 })
      );
  }),
  (onSearchCleared_fn = function () {
    __privateGet(this, _fetchAbortController)?.abort(),
      __privateGet(this, _queryInput).focus(),
      (this.querySelector('[slot="results"]').innerHTML = "");
  }),
  window.customElements.get("predictive-search") ||
    window.customElements.define("predictive-search", PredictiveSearch);
import { animate as animate11 } from "vendor";
var AnnouncementBarCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate11(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-10px)"],
          },
          { duration: 0.25, easing: [0.55, 0.055, 0.675, 0.19] }
        ),
      enterControls: () =>
        animate11(
          toSlide,
          {
            opacity: [0, 1],
            transform: ["translateY(10px)", "translateY(0px)"],
          },
          { duration: 0.4, easing: [0.215, 0.61, 0.355, 1] }
        ),
    };
  }
};
window.customElements.get("announcement-bar-carousel") ||
  window.customElements.define(
    "announcement-bar-carousel",
    AnnouncementBarCarousel
  );
import { animate as animate12, inView as inView9 } from "vendor";
var _onPointerMoveListener,
  _touchStartTimestamp,
  _BeforeAfter_instances,
  onPointerDown_fn,
  onPointerMove_fn,
  onTouchStart_fn,
  onPointerUp_fn,
  onKeyboardNavigation_fn2,
  calculatePosition_fn,
  animateInitialPosition_fn,
  BeforeAfter = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _BeforeAfter_instances),
        __privateAdd(
          this,
          _onPointerMoveListener,
          __privateMethod(this, _BeforeAfter_instances, onPointerMove_fn).bind(
            this
          )
        ),
        __privateAdd(this, _touchStartTimestamp, 0),
        this.addEventListener(
          "pointerdown",
          __privateMethod(this, _BeforeAfter_instances, onPointerDown_fn)
        ),
        this.addEventListener(
          "keydown",
          __privateMethod(
            this,
            _BeforeAfter_instances,
            onKeyboardNavigation_fn2
          )
        ),
        this.addEventListener(
          "touchstart",
          __privateMethod(this, _BeforeAfter_instances, onTouchStart_fn),
          { passive: !1 }
        );
    }
    connectedCallback() {
      inView9(
        this,
        __privateMethod(
          this,
          _BeforeAfter_instances,
          animateInitialPosition_fn
        ).bind(this)
      );
    }
  };
(_onPointerMoveListener = new WeakMap()),
  (_touchStartTimestamp = new WeakMap()),
  (_BeforeAfter_instances = new WeakSet()),
  (onPointerDown_fn = function (event) {
    event.target.tagName !== "A" &&
      (document.addEventListener(
        "pointerup",
        __privateMethod(this, _BeforeAfter_instances, onPointerUp_fn).bind(
          this
        ),
        { once: !0 }
      ),
      matchesMediaQuery("supports-hover") &&
        (document.addEventListener(
          "pointermove",
          __privateGet(this, _onPointerMoveListener)
        ),
        __privateMethod(
          this,
          _BeforeAfter_instances,
          calculatePosition_fn
        ).call(this, event)));
  }),
  (onPointerMove_fn = function (event) {
    __privateMethod(this, _BeforeAfter_instances, calculatePosition_fn).call(
      this,
      event
    );
  }),
  (onTouchStart_fn = function (event) {
    const cursor = this.querySelector(".before-after__cursor");
    event.target === cursor || cursor.contains(event.target)
      ? (event.preventDefault(),
        document.addEventListener(
          "pointermove",
          __privateGet(this, _onPointerMoveListener)
        ))
      : __privateSet(this, _touchStartTimestamp, event.timeStamp);
  }),
  (onPointerUp_fn = function (event) {
    document.removeEventListener(
      "pointermove",
      __privateGet(this, _onPointerMoveListener)
    ),
      matchesMediaQuery("supports-hover") ||
        (event.timeStamp - __privateGet(this, _touchStartTimestamp) <= 250 &&
          __privateMethod(
            this,
            _BeforeAfter_instances,
            calculatePosition_fn
          ).call(this, event));
  }),
  (onKeyboardNavigation_fn2 = function (event) {
    if (
      !event.target.classList.contains("before-after__cursor") ||
      (!this.hasAttribute("vertical") &&
        event.code !== "ArrowLeft" &&
        event.code !== "ArrowRight") ||
      (this.hasAttribute("vertical") &&
        event.code !== "ArrowUp" &&
        event.code !== "ArrowDown")
    )
      return;
    event.preventDefault();
    let currentPosition = parseInt(
      this.style.getPropertyValue("--before-after-cursor-position")
    );
    Number.isNaN(currentPosition) &&
      (currentPosition = parseInt(
        getComputedStyle(this).getPropertyValue(
          "--before-after-initial-cursor-position"
        )
      ));
    let newPosition;
    this.hasAttribute("vertical")
      ? (newPosition =
          event.code === "ArrowUp" ? currentPosition - 1 : currentPosition + 1)
      : (newPosition =
          event.code === "ArrowLeft"
            ? currentPosition - 1
            : currentPosition + 1),
      this.style.setProperty(
        "--before-after-cursor-position",
        `${Math.min(Math.max(newPosition, 0), 100)}%`
      );
  }),
  (calculatePosition_fn = function (event) {
    let rectangle = this.getBoundingClientRect(),
      percentage;
    this.hasAttribute("vertical")
      ? (percentage =
          ((event.clientY - rectangle.top) / this.clientHeight) * 100)
      : ((percentage =
          ((event.clientX - rectangle.left) / this.clientWidth) * 100),
        (percentage = document.dir === "rtl" ? 100 - percentage : percentage)),
      this.style.setProperty(
        "--before-after-cursor-position",
        `${Math.min(Math.max(percentage, 0), 100)}%`
      );
  }),
  (animateInitialPosition_fn = function () {
    animate12(
      (progress) => {
        this.style.setProperty(
          "--before-after-cursor-position",
          `calc(var(--before-after-initial-cursor-position) * ${progress})`
        );
      },
      { duration: 0.6, easing: [0.85, 0, 0.15, 1] }
    );
  }),
  window.customElements.get("before-after") ||
    window.customElements.define("before-after", BeforeAfter);
import {
  animate as animate13,
  stagger as stagger2,
  inView as inView10,
} from "vendor";
var _BlogPosts_instances,
  reveal_fn,
  BlogPosts = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _BlogPosts_instances),
        this.hasAttribute("reveal-on-scroll") &&
          matchesMediaQuery("motion-safe") &&
          inView10(
            this,
            __privateMethod(this, _BlogPosts_instances, reveal_fn).bind(this),
            { margin: "-50px 0px" }
          );
    }
  };
(_BlogPosts_instances = new WeakSet()),
  (reveal_fn = function () {
    (this.style.opacity = "1"),
      animate13(
        this.children,
        { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
        {
          duration: 0.25,
          delay: stagger2(0.1, { easing: "ease-out" }),
          easing: "ease",
        }
      );
  }),
  window.customElements.get("blog-posts") ||
    window.customElements.define("blog-posts", BlogPosts);
import { animate as animate14, timeline as timeline7 } from "vendor";
var _sectionId,
  _CartDrawer_instances,
  onBundleSection_fn,
  onCartChange_fn,
  onBeforeShow_fn,
  onPageShow_fn,
  refreshCart_fn,
  replaceContent_fn,
  CartDrawer = class extends Drawer {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CartDrawer_instances),
        __privateAdd(this, _sectionId);
    }
    connectedCallback() {
      super.connectedCallback(),
        __privateGet(this, _sectionId) ??
          __privateSet(this, _sectionId, extractSectionId(this)),
        document.addEventListener(
          "cart:prepare-bundled-sections",
          __privateMethod(this, _CartDrawer_instances, onBundleSection_fn).bind(
            this
          ),
          { signal: this.abortController.signal }
        ),
        document.addEventListener(
          "cart:change",
          __privateMethod(this, _CartDrawer_instances, onCartChange_fn).bind(
            this
          ),
          { signal: this.abortController.signal }
        ),
        document.addEventListener(
          "cart:refresh",
          __privateMethod(this, _CartDrawer_instances, refreshCart_fn).bind(
            this
          ),
          { signal: this.abortController.signal }
        ),
        window.addEventListener(
          "pageshow",
          __privateMethod(this, _CartDrawer_instances, onPageShow_fn).bind(
            this
          ),
          { signal: this.abortController.signal }
        ),
        this.addEventListener(
          "dialog:before-show",
          __privateMethod(this, _CartDrawer_instances, onBeforeShow_fn)
        );
    }
  };
(_sectionId = new WeakMap()),
  (_CartDrawer_instances = new WeakSet()),
  (onBundleSection_fn = function (event) {
    event.detail.sections.push(__privateGet(this, _sectionId));
  }),
  (onCartChange_fn = async function (event) {
    __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(
      this,
      event.detail.cart.sections[__privateGet(this, _sectionId)]
    ),
      (window.themeVariables.settings.cartType === "drawer" ||
        event.detail.onSuccessDo === "force_open_drawer") &&
        event.detail.baseEvent === "variant:add" &&
        this.show();
  }),
  (onBeforeShow_fn = async function () {
    const drawerFooter = this.shadowRoot.querySelector('[part="footer"]');
    drawerFooter &&
      ((drawerFooter.style.opacity = "0"),
      await waitForEvent(this, "dialog:after-show"),
      animate14(
        drawerFooter,
        { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
        { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] }
      ));
  }),
  (onPageShow_fn = async function (event) {
    event.persisted &&
      __privateMethod(this, _CartDrawer_instances, refreshCart_fn).call(this);
  }),
  (refreshCart_fn = async function () {
    __privateMethod(this, _CartDrawer_instances, replaceContent_fn).call(
      this,
      await (
        await fetch(
          `${Shopify.routes.root}?section_id=${__privateGet(this, _sectionId)}`
        )
      ).text()
    );
  }),
  (replaceContent_fn = async function (html) {
    const domElement = new DOMParser().parseFromString(html, "text/html"),
      newCartDrawer = document
        .createRange()
        .createContextualFragment(
          domElement
            .getElementById(`shopify-section-${__privateGet(this, _sectionId)}`)
            .querySelector("cart-drawer").innerHTML
        ),
      itemCount = (await fetchCart).item_count;
    itemCount === 0
      ? (await timeline7([
          [
            this.getShadowPartByName("body"),
            { opacity: [1, 0] },
            { duration: 0.15, easing: "ease-in" },
          ],
          [
            this.getShadowPartByName("footer"),
            {
              opacity: [1, 0],
              transform: ["translateY(0)", "translateY(30px)"],
            },
            { duration: 0.15, at: "<", easing: "ease-in" },
          ],
        ]).finished,
        this.replaceChildren(...newCartDrawer.children),
        animate14(
          this.getShadowPartByName("body"),
          { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
          { duration: 0.25, easing: [0.25, 0.46, 0.45, 0.94] }
        ))
      : this.replaceChildren(...newCartDrawer.children),
      this.classList.toggle("drawer--center-body", itemCount === 0),
      this.dispatchEvent(
        new CustomEvent("cart-drawer:refreshed", { bubbles: !0 })
      );
  });
var CartNoteDialog = class extends DialogElement {
  createEnterAnimationControls() {
    return animate14(
      this,
      { transform: ["translateY(100%)", "translateY(0)"] },
      { duration: 0.2, easing: "ease-in" }
    );
  }
  createLeaveAnimationControls() {
    return animate14(
      this,
      { transform: ["translateY(0)", "translateY(100%)"] },
      { duration: 0.2, easing: "ease-in" }
    );
  }
};
window.customElements.get("cart-drawer") ||
  window.customElements.define("cart-drawer", CartDrawer),
  window.customElements.get("cart-note-dialog") ||
    window.customElements.define("cart-note-dialog", CartNoteDialog);
import {
  timeline as timeline8,
  inView as inView11,
  Delegate as Delegate7,
} from "vendor";
var _CollectionBanner_instances,
  reveal_fn2,
  CollectionBanner = class extends HTMLElement {
    constructor() {
      super(...arguments), __privateAdd(this, _CollectionBanner_instances);
    }
    connectedCallback() {
      this.hasAttribute("reveal-on-scroll") &&
        matchesMediaQuery("motion-safe") &&
        inView11(
          this,
          __privateMethod(this, _CollectionBanner_instances, reveal_fn2).bind(
            this
          )
        );
    }
  };
(_CollectionBanner_instances = new WeakSet()),
  (reveal_fn2 = async function () {
    const image = this.querySelector(
        ".content-over-media > picture img, .content-over-media > image-parallax img"
      ),
      hasParallax =
        this.querySelector(".content-over-media image-parallax") !== null,
      content = this.querySelector(".content-over-media > .prose");
    await imageLoaded(image);
    const transformEffect = (0.15 * 100) / 1.3,
      imageTransform = hasParallax
        ? [
            `scale(1.5) translateY(-${transformEffect}%)`,
            `scale(1.3) translateY(-${transformEffect}%)`,
          ]
        : ["scale(1.2)", "scale(1)"];
    return timeline8([
      [this, { opacity: 1 }, { duration: 0, easing: [0.25, 0.46, 0.45, 0.94] }],
      [
        image,
        { opacity: [0, 1], transform: imageTransform },
        {
          duration: 0.8,
          delay: 0.25,
          at: "<",
          easing: [0.25, 0.46, 0.45, 0.94],
        },
      ],
      [
        content,
        { opacity: [0, 1], transform: ["translateY(30px)", "translateY(0)"] },
        { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
      ],
    ]);
  });
var _delegate6,
  _CollectionLayoutSwitch_instances,
  onLayoutSwitch_fn,
  setCartAttribute_fn,
  CollectionLayoutSwitch = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CollectionLayoutSwitch_instances),
        __privateAdd(this, _delegate6, new Delegate7(this));
    }
    connectedCallback() {
      __privateGet(this, _delegate6).on(
        "click",
        'button[type="button"]',
        __privateMethod(
          this,
          _CollectionLayoutSwitch_instances,
          onLayoutSwitch_fn
        ).bind(this)
      );
    }
    get controlledList() {
      return document.getElementById(this.getAttribute("aria-controls"));
    }
  };
(_delegate6 = new WeakMap()),
  (_CollectionLayoutSwitch_instances = new WeakSet()),
  (onLayoutSwitch_fn = function (event, target) {
    target.classList.contains("is-active") ||
      (this.controlledList.setAttribute(
        `collection-${this.getAttribute("device")}-layout`,
        target.value
      ),
      Array.from(this.querySelectorAll("button")).forEach((item) =>
        item.classList.toggle("is-active", item === target)
      ),
      this.controlledList.reveal(),
      __privateMethod(
        this,
        _CollectionLayoutSwitch_instances,
        setCartAttribute_fn
      ).call(this, target.value));
  }),
  (setCartAttribute_fn = function (newLayout) {
    const attributeProperty = `products_${this.getAttribute(
      "device"
    )}_grid_mode`;
    fetch(`${Shopify.routes.root}cart/update.js`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attributes: { [attributeProperty]: newLayout } }),
      keepalive: !0,
    });
  }),
  window.customElements.get("collection-banner") ||
    window.customElements.define("collection-banner", CollectionBanner),
  window.customElements.get("collection-layout-switch") ||
    window.customElements.define(
      "collection-layout-switch",
      CollectionLayoutSwitch
    );
import { animate as animate15, inView as inView12 } from "vendor";
var _flips,
  _expirationDate,
  _interval,
  _isVisible,
  _CountdownTimer_instances,
  recalculateFlips_fn,
  CountdownTimer = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _CountdownTimer_instances),
        __privateAdd(this, _flips),
        __privateAdd(this, _expirationDate),
        __privateAdd(this, _interval),
        __privateAdd(this, _isVisible);
    }
    connectedCallback() {
      __privateSet(
        this,
        _flips,
        Array.from(this.querySelectorAll("countdown-timer-flip"))
      );
      const expiresAt = this.getAttribute("expires-at");
      expiresAt !== "" &&
        (__privateSet(this, _expirationDate, new Date(expiresAt)),
        __privateSet(
          this,
          _interval,
          setInterval(
            __privateMethod(
              this,
              _CountdownTimer_instances,
              recalculateFlips_fn
            ).bind(this),
            1e3
          )
        ),
        __privateMethod(
          this,
          _CountdownTimer_instances,
          recalculateFlips_fn
        ).call(this)),
        inView12(
          this,
          () => (
            __privateSet(this, _isVisible, !0),
            () => __privateSet(this, _isVisible, !1)
          ),
          { margin: "500px" }
        );
    }
    disconnectedCallback() {
      clearInterval(__privateGet(this, _interval));
    }
    get daysFlip() {
      return __privateGet(this, _flips).find(
        (flip) => flip.getAttribute("type") === "days"
      );
    }
    get hoursFlip() {
      return __privateGet(this, _flips).find(
        (flip) => flip.getAttribute("type") === "hours"
      );
    }
    get minutesFlip() {
      return __privateGet(this, _flips).find(
        (flip) => flip.getAttribute("type") === "minutes"
      );
    }
    get secondsFlip() {
      return __privateGet(this, _flips).find(
        (flip) => flip.getAttribute("type") === "seconds"
      );
    }
  };
(_flips = new WeakMap()),
  (_expirationDate = new WeakMap()),
  (_interval = new WeakMap()),
  (_isVisible = new WeakMap()),
  (_CountdownTimer_instances = new WeakSet()),
  (recalculateFlips_fn = function () {
    const dateNow = new Date();
    if (__privateGet(this, _expirationDate) < dateNow)
      if (this.getAttribute("expiration-behavior") === "hide")
        this.closest(".shopify-section").remove();
      else return clearInterval(__privateGet(this, _interval));
    if (!__privateGet(this, _isVisible)) return;
    let delta = Math.abs(__privateGet(this, _expirationDate) - dateNow) / 1e3;
    const days = Math.floor(delta / 86400);
    delta -= days * 86400;
    const hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    const minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    const seconds = Math.floor(delta % 60);
    this.daysFlip?.updateValue(days),
      this.hoursFlip?.updateValue(hours),
      this.minutesFlip?.updateValue(minutes),
      this.secondsFlip?.updateValue(seconds);
  });
var CountdownTimerFlip = class extends HTMLElement {
    constructor() {
      super(), this.attachShadow({ mode: "open" });
      let flipHtml = [...this.textContent].map(
        () =>
          `<countdown-timer-flip-digit part="digit" ${
            this.hasAttribute("animate") ? "animate" : ""
          } style="display: inline-block">0</countdown-timer-flip-digit>`
      );
      this.shadowRoot.appendChild(
        document.createRange().createContextualFragment(flipHtml.join(""))
      );
    }
    updateValue(value) {
      [...Math.min(99, value).toString().padStart(2, "0")].forEach(
        (digit, index) => {
          this.shadowRoot.children[index].setAttribute("number", digit);
        }
      );
    }
  },
  CountdownTimerFlipDigit = class extends HTMLElement {
    static observedAttributes = ["number"];
    constructor() {
      super(),
        this.attachShadow({ mode: "open" }).appendChild(
          document
            .createRange()
            .createContextualFragment("<div><slot></slot></div>")
        );
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (
        oldValue === null ||
        oldValue === newValue ||
        !this.hasAttribute("animate")
      )
        return (this.textContent = newValue);
      await animate15(
        this.shadowRoot.firstElementChild,
        { opacity: [1, 0], transform: ["translateY(0)", "translateY(-8px)"] },
        { duration: 0.3, easing: [0.64, 0, 0.78, 0] }
      ).finished,
        (this.textContent = newValue),
        animate15(
          this.shadowRoot.firstElementChild,
          {
            opacity: [0, 1],
            transform: ["translateY(8px)", "translateY(0px)"],
          },
          { duration: 0.3, easing: [0.22, 1, 0.36, 1] }
        );
    }
  };
window.customElements.get("countdown-timer") ||
  window.customElements.define("countdown-timer", CountdownTimer),
  window.customElements.get("countdown-timer-flip") ||
    window.customElements.define("countdown-timer-flip", CountdownTimerFlip),
  window.customElements.get("countdown-timer-flip-digit") ||
    window.customElements.define(
      "countdown-timer-flip-digit",
      CountdownTimerFlipDigit
    );
import { animate as animate16 } from "vendor";
var _AccountLogin_instances,
  loginForm_get,
  recoverForm_get,
  switchForm_fn,
  AccountLogin = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _AccountLogin_instances),
        window.addEventListener(
          "hashchange",
          __privateMethod(this, _AccountLogin_instances, switchForm_fn).bind(
            this
          )
        ),
        window.location.hash === "#recover" &&
          ((__privateGet(this, _AccountLogin_instances, loginForm_get).hidden =
            !0),
          (__privateGet(this, _AccountLogin_instances, recoverForm_get).hidden =
            !1));
    }
  };
(_AccountLogin_instances = new WeakSet()),
  (loginForm_get = function () {
    return this.querySelector("#login");
  }),
  (recoverForm_get = function () {
    return this.querySelector("#recover");
  }),
  (switchForm_fn = async function () {
    const fromForm =
        window.location.hash === "#recover"
          ? __privateGet(this, _AccountLogin_instances, loginForm_get)
          : __privateGet(this, _AccountLogin_instances, recoverForm_get),
      toForm =
        window.location.hash === "#recover"
          ? __privateGet(this, _AccountLogin_instances, recoverForm_get)
          : __privateGet(this, _AccountLogin_instances, loginForm_get);
    await animate16(
      fromForm,
      { transform: ["translateY(0)", "translateY(30px)"], opacity: [1, 0] },
      { duration: 0.6, easing: "ease" }
    ).finished,
      (fromForm.hidden = !0),
      (toForm.hidden = !1),
      await animate16(
        toForm,
        { transform: ["translateY(30px)", "translateY(0)"], opacity: [0, 1] },
        { duration: 0.6, easing: "ease" }
      );
  }),
  window.customElements.get("account-login") ||
    window.customElements.define("account-login", AccountLogin);
var _observer,
  _FaqToc_instances,
  onObserve_fn,
  FaqToc = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _FaqToc_instances),
        __privateAdd(
          this,
          _observer,
          new IntersectionObserver(
            __privateMethod(this, _FaqToc_instances, onObserve_fn).bind(this),
            { rootMargin: "0px 0px -70% 0px" }
          )
        );
    }
    connectedCallback() {
      this.anchoredElements.forEach((anchoredElement) =>
        __privateGet(this, _observer).observe(anchoredElement)
      );
    }
    disconnectedCallback() {
      __privateGet(this, _observer).disconnect();
    }
    get anchorLinks() {
      return Array.from(this.querySelectorAll('a[href^="#"]'));
    }
    get anchoredElements() {
      return this.anchorLinks.map((anchor) =>
        document.querySelector(anchor.getAttribute("href"))
      );
    }
  };
(_observer = new WeakMap()),
  (_FaqToc_instances = new WeakSet()),
  (onObserve_fn = function (entries) {
    for (const entry of entries) {
      const anchorLink = this.anchorLinks.find(
        (anchor) => anchor.getAttribute("href") === `#${entry.target.id}`
      );
      (!entry.isIntersecting && anchorLink.classList.contains("is-active")) ||
        (entry.isIntersecting &&
          this.anchorLinks.forEach((link) =>
            link.classList.toggle("is-active", link === anchorLink)
          ));
    }
  }),
  window.customElements.get("faq-toc") ||
    window.customElements.define("faq-toc", FaqToc);
import { animate as animate17 } from "vendor";
var FeaturedCollectionsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate17(
          fromSlide,
          { opacity: [1, 0], transform: ["translateY(0)", "translateY(15px)"] },
          { duration: 0.3, easing: "ease-in" }
        ),
      enterControls: () =>
        animate17(
          toSlide,
          { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] },
          { duration: 0.2, delay: 0.2, easing: "ease-out" }
        ),
    };
  }
};
window.customElements.get("featured-collections-carousel") ||
  window.customElements.define(
    "featured-collections-carousel",
    FeaturedCollectionsCarousel
  );
import {
  animate as animate18,
  timeline as timeline9,
  stagger as stagger3,
  Delegate as Delegate8,
} from "vendor";
var _headerTrackerIntersectionObserver,
  _abortController9,
  _scrollYTrackingPosition,
  _isVisible2,
  _Header_instances,
  onHeaderTrackerIntersection_fn,
  detectMousePosition_fn,
  detectScrollDirection_fn,
  setVisibility_fn,
  Header = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _Header_instances),
        __privateAdd(
          this,
          _headerTrackerIntersectionObserver,
          new IntersectionObserver(
            __privateMethod(
              this,
              _Header_instances,
              onHeaderTrackerIntersection_fn
            ).bind(this)
          )
        ),
        __privateAdd(this, _abortController9),
        __privateAdd(this, _scrollYTrackingPosition, 0),
        __privateAdd(this, _isVisible2, !0);
    }
    connectedCallback() {
      __privateSet(this, _abortController9, new AbortController()),
        __privateGet(this, _headerTrackerIntersectionObserver).observe(
          document.getElementById("header-scroll-tracker")
        ),
        this.hasAttribute("hide-on-scroll") &&
          (window.addEventListener(
            "scroll",
            __privateMethod(
              this,
              _Header_instances,
              detectScrollDirection_fn
            ).bind(this),
            { signal: __privateGet(this, _abortController9).signal }
          ),
          window.addEventListener(
            "pointermove",
            __privateMethod(
              this,
              _Header_instances,
              detectMousePosition_fn
            ).bind(this),
            { signal: __privateGet(this, _abortController9).signal }
          ));
    }
    disconnectedCallback() {
      __privateGet(this, _abortController9).abort();
    }
  };
(_headerTrackerIntersectionObserver = new WeakMap()),
  (_abortController9 = new WeakMap()),
  (_scrollYTrackingPosition = new WeakMap()),
  (_isVisible2 = new WeakMap()),
  (_Header_instances = new WeakSet()),
  (onHeaderTrackerIntersection_fn = function (entries) {
    this.classList.toggle("is-solid", !entries[0].isIntersecting);
  }),
  (detectMousePosition_fn = function (event) {
    event.clientY < 100 &&
      window.matchMedia("screen and (pointer: fine)").matches &&
      (__privateMethod(this, _Header_instances, setVisibility_fn).call(
        this,
        !0
      ),
      __privateSet(this, _scrollYTrackingPosition, 0));
  }),
  (detectScrollDirection_fn = function () {
    let isVisible;
    window.scrollY > __privateGet(this, _scrollYTrackingPosition) &&
    window.scrollY - __privateGet(this, _scrollYTrackingPosition) > 100
      ? ((isVisible = !1),
        __privateSet(this, _scrollYTrackingPosition, window.scrollY))
      : window.scrollY < __privateGet(this, _scrollYTrackingPosition) &&
        (__privateSet(this, _scrollYTrackingPosition, window.scrollY),
        (isVisible = !0)),
      isVisible !== void 0 &&
        __privateMethod(this, _Header_instances, setVisibility_fn).call(
          this,
          isVisible
        );
  }),
  (setVisibility_fn = function (isVisible) {
    if (isVisible !== __privateGet(this, _isVisible2)) {
      if (!isVisible && this.querySelectorAll("[open]").length > 0) return;
      __privateSet(this, _isVisible2, isVisible),
        document.documentElement.style.setProperty(
          "--header-is-visible",
          isVisible ? "1" : "0"
        ),
        this.classList.toggle("is-hidden", !isVisible);
    }
  });
var DropdownMenuDisclosure = class extends MenuDisclosure {
    createShowAnimationControls() {
      let menuItemsSequence = [];
      return (
        window.themeVariables.settings.staggerMenuApparition &&
          (menuItemsSequence = [
            this.contentElement.querySelectorAll(":scope > li"),
            {
              opacity: [0, 1],
              transform: ["translateY(8px)", "translateY(0)"],
            },
            { duration: 0.15, at: "-0.15", delay: stagger3(0.1) },
          ]),
        timeline9([
          [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
          menuItemsSequence,
        ])
      );
    }
    createHideAnimationControls() {
      return timeline9([
        [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }],
      ]);
    }
  },
  MegaMenuDisclosure = class extends MenuDisclosure {
    createShowAnimationControls() {
      const linklists = Array.from(
        this.contentElement.querySelectorAll(".mega-menu__linklist > li")
      );
      let menuItemsSequence = [];
      return (
        window.themeVariables.settings.staggerMenuApparition &&
          (menuItemsSequence = [
            { name: "content", at: "-0.5" },
            [
              linklists,
              {
                opacity: [0, 1],
                transform: ["translateY(8px)", "translateY(0)"],
              },
              { duration: 0.3, at: "content", delay: stagger3(0.1) },
            ],
            [
              this.contentElement.querySelector(".mega-menu__promo"),
              { opacity: [0, 1] },
              { duration: 0.3, at: "-0.15" },
            ],
          ]),
        timeline9([
          [this.contentElement, { opacity: [0, 1] }, { duration: 0.25 }],
          ...menuItemsSequence,
        ])
      );
    }
    createHideAnimationControls() {
      return timeline9([
        [this.contentElement, { opacity: [1, 0] }, { duration: 0.4 }],
      ]);
    }
  },
  _HeaderSearch_instances,
  calculateMaxHeight_fn,
  HeaderSearch = class extends DialogElement {
    constructor() {
      super(),
        __privateAdd(this, _HeaderSearch_instances),
        this.addEventListener(
          "dialog:before-show",
          __privateMethod(
            this,
            _HeaderSearch_instances,
            calculateMaxHeight_fn
          ).bind(this)
        );
    }
    get shadowDomTemplate() {
      return "header-search-default-template";
    }
    get shouldLock() {
      return !0;
    }
    createEnterAnimationControls() {
      return timeline9([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [0, 1] },
          { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          {
            opacity: [0, 1],
            transform: [
              "translateY(calc(-1 * var(--header-height)))",
              "translateY(0)",
            ],
          },
          { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] },
        ],
      ]);
    }
    createLeaveAnimationControls() {
      return timeline9([
        [
          this.getShadowPartByName("overlay"),
          { opacity: [1, 0] },
          { duration: 0.2, easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          this.getShadowPartByName("content"),
          {
            opacity: [1, 0],
            transform: [
              "translateY(0)",
              "translateY(calc(-1 * var(--header-height)))",
            ],
          },
          { duration: 0.2, at: "<", easing: [0.645, 0.045, 0.355, 1] },
        ],
      ]);
    }
  };
(_HeaderSearch_instances = new WeakSet()),
  (calculateMaxHeight_fn = function () {
    const boundingRect = this.getBoundingClientRect(),
      maxHeight = window.innerHeight - boundingRect.top;
    this.style.setProperty("--header-search-max-height", `${maxHeight}px`);
  });
var _collapsiblePanel,
  _buttonElements,
  _HeaderSidebar_instances,
  openCollapsiblePanel_fn,
  onSidebarBeforeShow_fn,
  onSidebarAfterShow_fn,
  onSidebarBeforeHide_fn,
  onSidebarAfterHide_fn,
  HeaderSidebar = class extends Drawer {
    constructor() {
      super(),
        __privateAdd(this, _HeaderSidebar_instances),
        __privateAdd(this, _collapsiblePanel),
        __privateAdd(this, _buttonElements),
        this.addEventListener(
          "dialog:before-show",
          __privateMethod(
            this,
            _HeaderSidebar_instances,
            onSidebarBeforeShow_fn
          )
        ),
        this.addEventListener(
          "dialog:after-show",
          __privateMethod(this, _HeaderSidebar_instances, onSidebarAfterShow_fn)
        ),
        this.addEventListener(
          "dialog:before-hide",
          __privateMethod(
            this,
            _HeaderSidebar_instances,
            onSidebarBeforeHide_fn
          )
        ),
        this.addEventListener(
          "dialog:after-hide",
          __privateMethod(this, _HeaderSidebar_instances, onSidebarAfterHide_fn)
        );
    }
    connectedCallback() {
      super.connectedCallback(),
        __privateSet(
          this,
          _collapsiblePanel,
          this.querySelector('[slot="collapsible-panel"]')
        ),
        __privateSet(
          this,
          _buttonElements,
          Array.from(
            this.querySelectorAll(
              ".header-sidebar__main-panel .header-sidebar__linklist [aria-controls]"
            )
          )
        ),
        __privateGet(this, _buttonElements).forEach((button) =>
          button.addEventListener(
            "click",
            __privateMethod(
              this,
              _HeaderSidebar_instances,
              openCollapsiblePanel_fn
            ).bind(this),
            { signal: this.abortController.signal }
          )
        );
    }
    revealItems(withDelay = !1) {
      return timeline9([
        [
          this.querySelector(".header-sidebar__main-panel"),
          { opacity: 1, transform: "translateX(0)" },
          { duration: 0, delay: withDelay ? 0.5 : 0 },
        ],
        [
          this.querySelectorAll(
            ".header-sidebar__main-panel .header-sidebar__linklist li"
          ),
          { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
          {
            duration: 0.15,
            at: "-0.15",
            delay: window.themeVariables.settings.staggerMenuApparition
              ? stagger3(0.1)
              : 0,
          },
        ],
        [
          this.querySelector(".header-sidebar__footer"),
          { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
          { duration: 0.3 },
        ],
      ]);
    }
  };
(_collapsiblePanel = new WeakMap()),
  (_buttonElements = new WeakMap()),
  (_HeaderSidebar_instances = new WeakSet()),
  (openCollapsiblePanel_fn = function (event) {
    __privateGet(this, _buttonElements).forEach((button) =>
      button.setAttribute(
        "aria-expanded",
        button === event.currentTarget ? "true" : "false"
      )
    ),
      __privateGet(this, _collapsiblePanel)?.setAttribute(
        "aria-activedescendant",
        event.currentTarget.getAttribute("aria-controls")
      ),
      matchesMediaQuery("md-max") &&
        animate18(
          this.querySelector(".header-sidebar__main-panel"),
          {
            opacity: [1, 0],
            transform: ["translateX(0)", "translateX(-10px)"],
          },
          { duration: 0.25 }
        );
  }),
  (onSidebarBeforeShow_fn = function () {
    animate18(
      this.querySelector(".header-sidebar__main-panel"),
      { opacity: 0, transform: "translateX(0)" },
      { duration: 0 }
    );
  }),
  (onSidebarAfterShow_fn = function () {
    this.revealItems();
  }),
  (onSidebarBeforeHide_fn = function () {
    matchesMediaQuery("md") &&
      (__privateGet(this, _collapsiblePanel)?.removeAttribute(
        "aria-activedescendant"
      ),
      __privateGet(this, _buttonElements).forEach((button) =>
        button.setAttribute("aria-expanded", "false")
      ));
  }),
  (onSidebarAfterHide_fn = function () {
    matchesMediaQuery("md-max") &&
      (__privateGet(this, _collapsiblePanel)?.removeAttribute(
        "aria-activedescendant"
      ),
      __privateGet(this, _buttonElements).forEach((button) =>
        button.setAttribute("aria-expanded", "false")
      )),
      Array.from(this.querySelectorAll("details")).forEach(
        (detail) => (detail.open = !1)
      );
  });
var _sidebarDelegate,
  _HeaderSidebarCollapsiblePanel_instances,
  closePanel_fn,
  switchPanel_fn,
  HeaderSidebarCollapsiblePanel = class extends DialogElement {
    constructor() {
      super(),
        __privateAdd(this, _HeaderSidebarCollapsiblePanel_instances),
        __privateAdd(this, _sidebarDelegate, new Delegate8(this)),
        __privateGet(this, _sidebarDelegate).on(
          "click",
          '[data-action="close-panel"]',
          __privateMethod(
            this,
            _HeaderSidebarCollapsiblePanel_instances,
            closePanel_fn
          ).bind(this)
        );
    }
    static get observedAttributes() {
      return [...super.observedAttributes, "aria-activedescendant"];
    }
    hideForOutsideClickTarget(target) {
      return !1;
    }
    allowOutsideClickForTarget(target) {
      return target.closest(".header-sidebar") !== void 0;
    }
    createEnterAnimationControls() {
      return matchesMediaQuery("md-max")
        ? timeline9([
            [
              this,
              { opacity: [0, 1], transform: "translateX(0)" },
              { duration: 0.3 },
            ],
          ])
        : timeline9([
            [
              this,
              {
                opacity: [0, 1],
                transform: [
                  "translateX(0)",
                  "translateX(calc(var(--transform-logical-flip) * 100%)",
                ],
              },
              { duration: 0.3 },
            ],
          ]);
    }
    createLeaveAnimationControls() {
      return matchesMediaQuery("md-max")
        ? timeline9([
            [
              this,
              {
                opacity: [1, 0],
                transform: ["translateX(0)", "translateX(10px)"],
              },
              { duration: 0.3 },
            ],
          ])
        : timeline9([
            [
              this,
              {
                opacity: [1, 0],
                transform: [
                  "translateX(calc(var(--transform-logical-flip) * 100%))",
                  "translateX(0)",
                ],
              },
              { duration: 0.3 },
            ],
          ]);
    }
    async attributeChangedCallback(name, oldValue, newValue) {
      if (
        (super.attributeChangedCallback(name, oldValue, newValue),
        name === "aria-activedescendant")
      ) {
        if (oldValue === newValue) return;
        newValue !== null
          ? __privateMethod(
              this,
              _HeaderSidebarCollapsiblePanel_instances,
              switchPanel_fn
            ).call(
              this,
              this.querySelector(`#${oldValue}`),
              this.querySelector(`#${newValue}`)
            )
          : (await this.hide(),
            Array.from(
              this.querySelectorAll(".header-sidebar__sub-panel")
            ).forEach((subPanel) => (subPanel.hidden = !0)));
      }
    }
  };
(_sidebarDelegate = new WeakMap()),
  (_HeaderSidebarCollapsiblePanel_instances = new WeakSet()),
  (closePanel_fn = function () {
    this.removeAttribute("aria-activedescendant"),
      this.closest("header-sidebar").revealItems(!0);
  }),
  (switchPanel_fn = async function (fromPanel, toPanel) {
    this.open || (await this.show()),
      fromPanel &&
        (await animate18(fromPanel, { opacity: [1, 0] }, { duration: 0.15 })
          .finished,
        (fromPanel.hidden = !0),
        Array.from(fromPanel.querySelectorAll("details")).forEach(
          (detail) => (detail.open = !1)
        )),
      (toPanel.hidden = !1);
    const listSelector = matchesMediaQuery("md-max")
      ? ".header-sidebar__back-button, .header-sidebar__linklist li"
      : ".header-sidebar__linklist li";
    timeline9([
      [toPanel, { opacity: 1 }, { duration: 0 }],
      [
        toPanel.querySelectorAll(listSelector),
        { opacity: [0, 1], transform: ["translateY(8px)", "translateY(0)"] },
        {
          duration: 0.15,
          at: "-0.15",
          delay: window.themeVariables.settings.staggerMenuApparition
            ? stagger3(0.1)
            : 0,
        },
      ],
      [
        toPanel.querySelector(".header-sidebar__promo"),
        { opacity: [0, 1] },
        { duration: 0.45 },
      ],
    ]);
  }),
  window.customElements.get("x-header") ||
    window.customElements.define("x-header", Header),
  window.customElements.get("dropdown-menu-disclosure") ||
    window.customElements.define(
      "dropdown-menu-disclosure",
      DropdownMenuDisclosure
    ),
  window.customElements.get("mega-menu-disclosure") ||
    window.customElements.define("mega-menu-disclosure", MegaMenuDisclosure),
  window.customElements.get("header-search") ||
    window.customElements.define("header-search", HeaderSearch),
  window.customElements.get("header-sidebar") ||
    window.customElements.define("header-sidebar", HeaderSidebar),
  window.customElements.get("header-sidebar-collapsible-panel") ||
    window.customElements.define(
      "header-sidebar-collapsible-panel",
      HeaderSidebarCollapsiblePanel
    );
import { animate as animate19, inView as inView13 } from "vendor";
var _ImageWithText_instances,
  onBecameVisible_fn,
  ImageWithText = class extends HTMLElement {
    constructor() {
      super(...arguments), __privateAdd(this, _ImageWithText_instances);
    }
    connectedCallback() {
      matchesMediaQuery("motion-safe") &&
        inView13(
          this.querySelector('[reveal-on-scroll="true"]'),
          ({ target }) =>
            __privateMethod(
              this,
              _ImageWithText_instances,
              onBecameVisible_fn
            ).call(this, target),
          { margin: "-200px 0px 0px 0px" }
        );
    }
  };
(_ImageWithText_instances = new WeakSet()),
  (onBecameVisible_fn = async function (target) {
    await imageLoaded(target);
    const fromValue =
      (window.direction === "rtl" ? -1 : 1) *
      (matchesMediaQuery("md-max") ? 0.6 : 1) *
      (this.classList.contains("image-with-text--reverse") ? 25 : -25);
    animate19(
      target,
      {
        opacity: 1,
        transform: [`translateX(${fromValue}px)`, "translateX(0)"],
      },
      { easing: [0.215, 0.61, 0.355, 1] },
      { duration: 0.8 }
    );
  }),
  window.customElements.get("image-with-text") ||
    window.customElements.define("image-with-text", ImageWithText);
import { timeline as timeline10, inView as inView14 } from "vendor";
var _preventInitialTransition2,
  _ImageWithTextOverlay_instances,
  onBecameVisible_fn2,
  ImageWithTextOverlay = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _ImageWithTextOverlay_instances),
        __privateAdd(this, _preventInitialTransition2, !1),
        Shopify.designMode &&
          this.closest(".shopify-section").addEventListener(
            "shopify:section:select",
            (event) =>
              __privateSet(this, _preventInitialTransition2, event.detail.load)
          );
    }
    connectedCallback() {
      matchesMediaQuery("motion-safe") &&
        this.getAttribute("reveal-on-scroll") === "true" &&
        inView14(
          this,
          ({ target }) =>
            __privateMethod(
              this,
              _ImageWithTextOverlay_instances,
              onBecameVisible_fn2
            ).call(this, target),
          { amount: 0.05 }
        );
    }
  };
(_preventInitialTransition2 = new WeakMap()),
  (_ImageWithTextOverlay_instances = new WeakSet()),
  (onBecameVisible_fn2 = async function (target) {
    const media = target.querySelector(
        ".content-over-media > picture img, .content-over-media > svg"
      ),
      content = target.querySelector(
        ".content-over-media > :not(picture, svg)"
      );
    await imageLoaded(media);
    const animationControls = timeline10([
      [target, { opacity: 1 }],
      [
        media,
        {
          opacity: [0, 1],
          scale: [1.1, 1],
          easing: [0.215, 0.61, 0.355, 1],
          duration: 0.8,
        },
      ],
      [content, { opacity: [0, 1], duration: 0.8 }],
    ]);
    __privateGet(this, _preventInitialTransition2) &&
      animationControls.finish();
  }),
  window.customElements.get("image-with-text-overlay") ||
    window.customElements.define(
      "image-with-text-overlay",
      ImageWithTextOverlay
    );
import {
  timeline as timeline11,
  animate as animate20,
  inView as inView15,
  scroll as scroll2,
  ScrollOffset,
} from "vendor";
var _itemElements,
  _imageElements,
  _textElements,
  _visibleImageElement,
  _ImagesWithTextScroll_instances,
  setupScrollObservers_fn,
  onBreakpointChanged_fn,
  ImagesWithTextScroll = class extends EffectCarousel {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ImagesWithTextScroll_instances),
        __privateAdd(this, _itemElements),
        __privateAdd(this, _imageElements),
        __privateAdd(this, _textElements),
        __privateAdd(this, _visibleImageElement);
    }
    connectedCallback() {
      super.connectedCallback(),
        __privateSet(
          this,
          _itemElements,
          Array.from(this.querySelectorAll(".images-with-text-scroll__item"))
        ),
        __privateSet(
          this,
          _imageElements,
          Array.from(this.querySelectorAll(".images-with-text-scroll__image"))
        ),
        __privateSet(
          this,
          _textElements,
          Array.from(this.querySelectorAll(".images-with-text-scroll__text"))
        ),
        __privateSet(
          this,
          _visibleImageElement,
          __privateGet(this, _imageElements)[0]
        ),
        inView15(this, () => {
          __privateGet(this, _imageElements).forEach((imageElement) =>
            imageElement.removeAttribute("loading")
          );
        }),
        matchesMediaQuery("md") &&
          __privateMethod(
            this,
            _ImagesWithTextScroll_instances,
            setupScrollObservers_fn
          ).call(this),
        mediaQueryListener(
          "md",
          __privateMethod(
            this,
            _ImagesWithTextScroll_instances,
            onBreakpointChanged_fn
          ).bind(this)
        );
    }
    get cellSelector() {
      return ".images-with-text-scroll__item";
    }
    get allowSwipe() {
      return matchesMediaQuery("md-max");
    }
    createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
      let imageAnimationSequence = [],
        toSlideImage = toSlide.querySelector(".images-with-text-scroll__image");
      return (
        toSlideImage &&
          toSlideImage !== __privateGet(this, _visibleImageElement) &&
          (imageAnimationSequence.push(
            [
              __privateGet(this, _visibleImageElement),
              { opacity: [1, 0] },
              { duration: 0.8, delay: 0.4 },
            ],
            [
              toSlideImage,
              { opacity: [0, 1] },
              { duration: 0.8, at: "<", delay: 0.4 },
            ]
          ),
          __privateSet(this, _visibleImageElement, toSlideImage)),
        timeline11([
          ...imageAnimationSequence,
          [
            fromSlide.querySelector(".images-with-text-scroll__text"),
            {
              opacity: [1, 0],
              transform: ["translateY(0)", "translateY(-15px)"],
            },
            { duration: 0.4, at: "<", easing: [0.55, 0.055, 0.675, 0.19] },
          ],
          [
            toSlide.querySelector(".images-with-text-scroll__text"),
            {
              opacity: [0, 1],
              transform: ["translateY(15px)", "translateY(0)"],
            },
            { duration: 0.4, at: "+0.4", easing: [0.25, 0.46, 0.45, 0.94] },
          ],
        ])
      );
    }
  };
(_itemElements = new WeakMap()),
  (_imageElements = new WeakMap()),
  (_textElements = new WeakMap()),
  (_visibleImageElement = new WeakMap()),
  (_ImagesWithTextScroll_instances = new WeakSet()),
  (setupScrollObservers_fn = function () {
    __privateGet(this, _textElements).forEach((textElement) => {
      scroll2(animate20(textElement, { opacity: [0, 0.25, 1, 0.25, 0] }), {
        target: textElement,
        offset: ScrollOffset.Any,
      });
    }),
      scroll2(
        (info) => {
          const index = Math.min(
              Math.floor(
                info.y.progress / (1 / __privateGet(this, _itemElements).length)
              ),
              __privateGet(this, _itemElements).length - 1
            ),
            toImage = __privateGet(this, _itemElements)[index].querySelector(
              ".images-with-text-scroll__image"
            );
          toImage &&
            toImage !== __privateGet(this, _visibleImageElement) &&
            (timeline11([
              [
                __privateGet(this, _visibleImageElement),
                { opacity: [1, 0] },
                { duration: 0.25 },
              ],
              [toImage, { opacity: [0, 1] }, { duration: 0.25, at: "<" }],
            ]),
            __privateSet(this, _visibleImageElement, toImage));
        },
        { target: this, offset: ["start center", "end center"] }
      );
  }),
  (onBreakpointChanged_fn = function (event) {
    event.matches
      ? (__privateGet(this, _imageElements).forEach(
          (image) => (image.style = null)
        ),
        __privateGet(this, _textElements).forEach(
          (text) => (text.style = null)
        ),
        __privateMethod(
          this,
          _ImagesWithTextScroll_instances,
          setupScrollObservers_fn
        ).call(this))
      : this.getAnimations({ subtree: !0 }).forEach((animation) =>
          animation.cancel()
        );
  }),
  window.customElements.get("images-with-text-scroll") ||
    window.customElements.define(
      "images-with-text-scroll",
      ImagesWithTextScroll
    );
import { scroll as scroll3 } from "vendor";
var ArticleToolbar = class extends HTMLElement {
  connectedCallback() {
    window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
      scroll3(
        (info) => {
          this.classList.toggle(
            "is-visible",
            info.y.progress > 0 && info.y.progress < 1
          );
        },
        {
          target: this.closest(".shopify-section"),
          offset: ["100px start", "end start"],
        }
      );
  }
};
window.customElements.get("article-toolbar") ||
  window.customElements.define("article-toolbar", ArticleToolbar);
import { animate as animate21, inView as inView16 } from "vendor";
var _MediaGrid_instances,
  onReveal_fn,
  MediaGrid = class extends HTMLElement {
    constructor() {
      super(...arguments), __privateAdd(this, _MediaGrid_instances);
    }
    connectedCallback() {
      matchesMediaQuery("motion-safe") &&
        inView16(
          this.querySelectorAll('[reveal-on-scroll="true"]'),
          __privateMethod(this, _MediaGrid_instances, onReveal_fn).bind(this),
          { margin: "-200px 0px 0px 0px" }
        );
    }
  };
(_MediaGrid_instances = new WeakSet()),
  (onReveal_fn = async function (entry) {
    await imageLoaded(entry.target.querySelector(":scope > img")),
      animate21(
        entry.target,
        { opacity: [0, 1] },
        { duration: 0.35, easing: "ease" }
      );
  }),
  window.customElements.get("media-grid") ||
    window.customElements.define("media-grid", MediaGrid);
var MultiColumn = class extends HTMLElement {
  constructor() {
    super(),
      Shopify.designMode &&
        this.addEventListener("shopify:block:select", (event) => {
          event.target.scrollIntoView({
            inline: "center",
            block: "nearest",
            behavior: event.detail.load ? "auto" : "smooth",
          });
        });
  }
};
window.customElements.get("multi-column") ||
  window.customElements.define("multi-column", MultiColumn);
import { timeline as timeline12, inView as inView17 } from "vendor";
var _preventInitialTransition3,
  _MultipleMediaWithText_instances,
  onBecameVisible_fn3,
  MultipleMediaWithText = class extends HTMLElement {
    constructor() {
      super(),
        __privateAdd(this, _MultipleMediaWithText_instances),
        __privateAdd(this, _preventInitialTransition3, !1),
        Shopify.designMode &&
          this.closest(".shopify-section").addEventListener(
            "shopify:section:select",
            (event) =>
              __privateSet(this, _preventInitialTransition3, event.detail.load)
          );
    }
    connectedCallback() {
      matchesMediaQuery("motion-safe") &&
        this.hasAttribute("reveal-on-scroll") &&
        inView17(
          this,
          __privateMethod(
            this,
            _MultipleMediaWithText_instances,
            onBecameVisible_fn3
          ).bind(this),
          { margin: "-10% 0px" }
        );
    }
  };
(_preventInitialTransition3 = new WeakMap()),
  (_MultipleMediaWithText_instances = new WeakSet()),
  (onBecameVisible_fn3 = function () {
    const timelineSequence = timeline12([
      [this, { opacity: 1 }, { duration: 0 }],
      "media",
      ...Array.from(
        this.querySelectorAll(".multiple-media-with-text__media-wrapper > *"),
        (media) => [
          media,
          {
            opacity: [0, 1],
            transform: [
              "rotate(0deg)",
              `rotate(${media.style.getPropertyValue("--media-rotate")})`,
            ],
          },
          { duration: 0.5, at: "media" },
        ]
      ),
      [
        this.querySelector(".multiple-media-with-text__content-wrapper"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.5 },
      ],
    ]);
    __privateGet(this, _preventInitialTransition3) && timelineSequence.finish();
  }),
  window.customElements.get("multiple-media-with-text") ||
    window.customElements.define(
      "multiple-media-with-text",
      MultipleMediaWithText
    );
var NewsletterPopup = class extends PopIn {
  connectedCallback() {
    super.connectedCallback(),
      this.shouldAppearAutomatically &&
        setTimeout(() => this.show(), this.apparitionDelay);
  }
  get apparitionDelay() {
    return parseInt(this.getAttribute("apparition-delay") || 0) * 1e3;
  }
  get shouldAppearAutomatically() {
    return !(
      localStorage.getItem("theme:popup-filled") === "true" ||
      (this.hasAttribute("only-once") &&
        localStorage.getItem("theme:popup-appeared") === "true")
    );
  }
  attributeChangedCallback(name, oldValue, newValue) {
    super.attributeChangedCallback(name, oldValue, newValue),
      name === "open" &&
        this.open &&
        localStorage.setItem("theme:popup-appeared", "true");
  }
};
window.customElements.get("newsletter-popup") ||
  window.customElements.define("newsletter-popup", NewsletterPopup);
import { Delegate as Delegate9 } from "vendor";
var _delegate7,
  _PrivacyBanner_instances,
  onConsentLibraryLoaded_fn,
  acceptPolicy_fn,
  declinePolicy_fn,
  PrivacyBanner = class extends PopIn {
    constructor() {
      super(),
        __privateAdd(this, _PrivacyBanner_instances),
        __privateAdd(this, _delegate7, new Delegate9(this)),
        window.Shopify.loadFeatures([
          {
            name: "consent-tracking-api",
            version: "0.1",
            onLoad: __privateMethod(
              this,
              _PrivacyBanner_instances,
              onConsentLibraryLoaded_fn
            ).bind(this),
          },
        ]);
    }
    connectedCallback() {
      super.connectedCallback(),
        __privateGet(this, _delegate7).on(
          "click",
          '[data-action="accept"]',
          __privateMethod(this, _PrivacyBanner_instances, acceptPolicy_fn).bind(
            this
          )
        ),
        __privateGet(this, _delegate7).on(
          "click",
          '[data-action="decline"]',
          __privateMethod(
            this,
            _PrivacyBanner_instances,
            declinePolicy_fn
          ).bind(this)
        );
    }
    disconnectedCallback() {
      __privateGet(this, _delegate7).off();
    }
  };
(_delegate7 = new WeakMap()),
  (_PrivacyBanner_instances = new WeakSet()),
  (onConsentLibraryLoaded_fn = function () {
    window.Shopify.customerPrivacy?.shouldShowBanner() && this.show();
  }),
  (acceptPolicy_fn = function () {
    window.Shopify.customerPrivacy?.setTrackingConsent(
      !0,
      this.hide.bind(this)
    );
  }),
  (declinePolicy_fn = function () {
    window.Shopify.customerPrivacy?.setTrackingConsent(
      !1,
      this.hide.bind(this)
    );
  }),
  window.customElements.get("privacy-banner") ||
    window.customElements.define("privacy-banner", PrivacyBanner);
var _intersectionObserver3,
  _formElement,
  _footerElement,
  _latestFooterCondition,
  _latestFormCondition,
  _ProductStickyBar_instances,
  onFormVisibilityChange_fn,
  ProductStickyBar = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ProductStickyBar_instances),
        __privateAdd(
          this,
          _intersectionObserver3,
          new IntersectionObserver(
            __privateMethod(
              this,
              _ProductStickyBar_instances,
              onFormVisibilityChange_fn
            ).bind(this)
          )
        ),
        __privateAdd(this, _formElement),
        __privateAdd(this, _footerElement),
        __privateAdd(this, _latestFooterCondition, !1),
        __privateAdd(this, _latestFormCondition, !1);
    }
    connectedCallback() {
      __privateSet(
        this,
        _formElement,
        document.forms[this.getAttribute("form")]
      ),
        __privateSet(
          this,
          _footerElement,
          document.querySelector(".shopify-section--footer")
        ),
        __privateGet(this, _formElement) &&
          (__privateGet(this, _intersectionObserver3).observe(
            __privateGet(this, _formElement)
          ),
          __privateGet(this, _intersectionObserver3).observe(
            __privateGet(this, _footerElement)
          ));
    }
    disconnectedCallback() {
      __privateGet(this, _intersectionObserver3).disconnect();
    }
  };
(_intersectionObserver3 = new WeakMap()),
  (_formElement = new WeakMap()),
  (_footerElement = new WeakMap()),
  (_latestFooterCondition = new WeakMap()),
  (_latestFormCondition = new WeakMap()),
  (_ProductStickyBar_instances = new WeakSet()),
  (onFormVisibilityChange_fn = function (entries) {
    const [formEntry, footerEntry] = [
      entries.find(
        (entry) => entry.target === __privateGet(this, _formElement)
      ),
      entries.find(
        (entry) => entry.target === __privateGet(this, _footerElement)
      ),
    ];
    formEntry &&
      __privateSet(
        this,
        _latestFormCondition,
        !formEntry.isIntersecting && formEntry.boundingClientRect.bottom < 0
      ),
      footerEntry &&
        __privateSet(this, _latestFooterCondition, !footerEntry.isIntersecting),
      this.classList.toggle(
        "is-visible",
        __privateGet(this, _latestFooterCondition) &&
          __privateGet(this, _latestFormCondition)
      );
  }),
  window.customElements.get("product-sticky-bar") ||
    window.customElements.define("product-sticky-bar", ProductStickyBar);
var _isLoaded,
  _ProductRecommendations_instances,
  loadRecommendations_fn,
  ProductRecommendations = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _ProductRecommendations_instances),
        __privateAdd(this, _isLoaded, !1);
    }
    connectedCallback() {
      __privateMethod(
        this,
        _ProductRecommendations_instances,
        loadRecommendations_fn
      ).call(this);
    }
  };
(_isLoaded = new WeakMap()),
  (_ProductRecommendations_instances = new WeakSet()),
  (loadRecommendations_fn = async function () {
    if (__privateGet(this, _isLoaded)) return;
    __privateSet(this, _isLoaded, !0);
    const section = this.closest(".shopify-section"),
      intent = this.getAttribute("intent") || "related",
      url = `${
        Shopify.routes.root
      }recommendations/products?product_id=${this.getAttribute(
        "product"
      )}&limit=${this.getAttribute("limit") || 4}&section_id=${extractSectionId(
        section
      )}&intent=${intent}`,
      response = await fetch(url, {
        priority: intent === "related" ? "low" : "auto",
      }),
      tempDiv = new DOMParser().parseFromString(
        await response.text(),
        "text/html"
      ),
      productRecommendationsElement = tempDiv.querySelector(
        "product-recommendations"
      );
    productRecommendationsElement.childElementCount > 0
      ? (this.replaceChildren(
          ...document.importNode(productRecommendationsElement, !0).childNodes
        ),
        (this.hidden = !1))
      : this.remove();
  }),
  window.customElements.get("product-recommendations") ||
    window.customElements.define(
      "product-recommendations",
      ProductRecommendations
    );
var _isLoaded2,
  _RecentlyViewedProducts_instances,
  searchQueryString_get,
  loadProducts_fn,
  RecentlyViewedProducts = class extends HTMLElement {
    constructor() {
      super(...arguments),
        __privateAdd(this, _RecentlyViewedProducts_instances),
        __privateAdd(this, _isLoaded2, !1);
    }
    connectedCallback() {
      __privateMethod(
        this,
        _RecentlyViewedProducts_instances,
        loadProducts_fn
      ).call(this);
    }
  };
(_isLoaded2 = new WeakMap()),
  (_RecentlyViewedProducts_instances = new WeakSet()),
  (searchQueryString_get = function () {
    const items = new Set(
      JSON.parse(localStorage.getItem("theme:recently-viewed-products") || "[]")
    );
    return (
      this.hasAttribute("exclude-id") &&
        items.delete(parseInt(this.getAttribute("exclude-id"))),
      Array.from(items.values(), (item) => `id:${item}`)
        .slice(0, parseInt(this.getAttribute("products-count")))
        .join(" OR ")
    );
  }),
  (loadProducts_fn = async function () {
    if (__privateGet(this, _isLoaded2)) return;
    __privateSet(this, _isLoaded2, !0);
    const section = this.closest(".shopify-section"),
      url = `${Shopify.routes.root}search?type=product&q=${__privateGet(
        this,
        _RecentlyViewedProducts_instances,
        searchQueryString_get
      )}&section_id=${extractSectionId(section)}`,
      response = await fetch(url, { priority: "low" }),
      tempDiv = new DOMParser().parseFromString(
        await response.text(),
        "text/html"
      ),
      recentlyViewedProductsElement = tempDiv.querySelector(
        "recently-viewed-products"
      );
    recentlyViewedProductsElement.childElementCount > 0
      ? this.replaceChildren(
          ...document.importNode(recentlyViewedProductsElement, !0).childNodes
        )
      : section.remove();
  }),
  window.customElements.get("recently-viewed-products") ||
    window.customElements.define(
      "recently-viewed-products",
      RecentlyViewedProducts
    );
import { animate as animate22, timeline as timeline13 } from "vendor";
var _controlledPopover,
  _selectedHotSpot,
  _ShopTheLookMobileCarousel_instances,
  setInitialPosition_fn,
  onSpotSelected_fn,
  onUpdateHotSpotPosition_fn,
  onLookChanged_fn,
  changeLookFocalPoint_fn,
  restorePosition_fn,
  ShopTheLookMobileCarousel = class extends ScrollCarousel {
    constructor() {
      super(),
        __privateAdd(this, _ShopTheLookMobileCarousel_instances),
        __privateAdd(this, _controlledPopover),
        __privateAdd(this, _selectedHotSpot),
        this.addEventListener(
          "carousel:change",
          __privateMethod(
            this,
            _ShopTheLookMobileCarousel_instances,
            onLookChanged_fn
          )
        ),
        Array.from(
          this.querySelectorAll(".shop-the-look__hot-spot-list")
        ).forEach((list) => {
          list.carousel.addEventListener(
            "carousel:select",
            __privateMethod(
              this,
              _ShopTheLookMobileCarousel_instances,
              onSpotSelected_fn
            ).bind(this)
          ),
            list.carousel.addEventListener("carousel:change", () =>
              __privateMethod(
                this,
                _ShopTheLookMobileCarousel_instances,
                onUpdateHotSpotPosition_fn
              ).call(this, list)
            );
        }),
        Array.from(this.querySelectorAll(".shop-the-look__popover")).forEach(
          (popover) => {
            popover.addEventListener(
              "dialog:before-show",
              __privateMethod(
                this,
                _ShopTheLookMobileCarousel_instances,
                changeLookFocalPoint_fn
              ).bind(this)
            ),
              popover.addEventListener(
                "dialog:before-hide",
                __privateMethod(
                  this,
                  _ShopTheLookMobileCarousel_instances,
                  restorePosition_fn
                ).bind(this)
              );
          }
        );
    }
    connectedCallback() {
      super.connectedCallback(),
        __privateMethod(
          this,
          _ShopTheLookMobileCarousel_instances,
          setInitialPosition_fn
        ).call(this);
    }
    get isExpanded() {
      return this.classList.contains("is-expanded");
    }
  };
(_controlledPopover = new WeakMap()),
  (_selectedHotSpot = new WeakMap()),
  (_ShopTheLookMobileCarousel_instances = new WeakSet()),
  (setInitialPosition_fn = function () {
    __privateSet(
      this,
      _selectedHotSpot,
      this.selectedCell.querySelector(
        '.shop-the-look__hot-spot[aria-current="true"]'
      )
    ),
      __privateMethod(
        this,
        _ShopTheLookMobileCarousel_instances,
        onLookChanged_fn
      ).call(this);
  }),
  (onSpotSelected_fn = function () {
    this.isExpanded ||
      document
        .getElementById(this.selectedCell.getAttribute("data-popover-id"))
        .show();
  }),
  (onUpdateHotSpotPosition_fn = function (list) {
    __privateSet(
      this,
      _selectedHotSpot,
      list.querySelector('.shop-the-look__hot-spot[aria-current="true"]')
    ),
      this.isExpanded &&
        __privateMethod(
          this,
          _ShopTheLookMobileCarousel_instances,
          changeLookFocalPoint_fn
        ).call(this);
  }),
  (onLookChanged_fn = function () {
    const popoverId = this.selectedCell.getAttribute("data-popover-id");
    __privateSet(this, _controlledPopover, document.getElementById(popoverId)),
      this.nextElementSibling.setAttribute("aria-controls", popoverId);
  }),
  (changeLookFocalPoint_fn = function () {
    const scale = window.innerWidth / this.selectedCell.clientWidth,
      remainingSpace =
        window.innerHeight -
        __privateGet(this, _controlledPopover).shadowRoot.querySelector(
          '[part="base"]'
        ).clientHeight,
      imageHeightAfterScale = Math.round(
        this.selectedCell.querySelector(".shop-the-look__image-wrapper")
          .clientHeight * scale
      ),
      outsideViewportImageHeight = Math.max(
        imageHeightAfterScale - remainingSpace,
        0
      ),
      insideViewportImageHeight =
        imageHeightAfterScale - outsideViewportImageHeight,
      hotSpotFocalPoint = Math.round(
        (__privateGet(this, _selectedHotSpot).offsetTop +
          __privateGet(this, _selectedHotSpot).clientHeight / 2) *
          scale
      ),
      offsetToMove = Math.round(
        hotSpotFocalPoint - insideViewportImageHeight / 2
      ),
      minTranslateY = Math.round(
        -(
          this.parentElement.getBoundingClientRect().top -
          (imageHeightAfterScale - this.selectedCell.offsetHeight) / 2
        )
      ),
      maxTranslateY = Math.round(minTranslateY - outsideViewportImageHeight),
      translateY = Math.min(
        Math.max(minTranslateY - offsetToMove, maxTranslateY),
        minTranslateY
      );
    this.isExpanded
      ? animate22(
          this,
          { transform: `translateY(${translateY}px) scale(${scale})` },
          { duration: 0.4, easing: "ease-in-out" }
        )
      : (animate22(
          this,
          {
            transform: [
              "translateY(0) scale(1)",
              `translateY(${translateY}px) scale(${scale})`,
            ],
          },
          { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
        ),
        document.documentElement.style.setProperty("--hide-header-group", "1")),
      this.classList.add("is-expanded");
  }),
  (restorePosition_fn = function () {
    animate22(
      this,
      { transform: "translateY(0) scale(1)" },
      { duration: 0.4, easing: [0.645, 0.045, 0.355, 1] }
    ).finished.then(() => {
      this.style.transform = null;
    }),
      this.classList.remove("is-expanded"),
      document.documentElement.style.removeProperty("--hide-header-group");
  });
var _ShopTheLookProductListCarousel_instances,
  updateButtonLink_fn,
  ShopTheLookProductListCarousel = class extends EffectCarousel {
    constructor() {
      super(),
        __privateAdd(this, _ShopTheLookProductListCarousel_instances),
        this.addEventListener(
          "carousel:change",
          __privateMethod(
            this,
            _ShopTheLookProductListCarousel_instances,
            updateButtonLink_fn
          ).bind(this)
        );
    }
  };
(_ShopTheLookProductListCarousel_instances = new WeakSet()),
  (updateButtonLink_fn = function (event) {
    const productCard = event.detail.cell.querySelector(".product-card");
    productCard.hasAttribute("handle") &&
      (this.nextElementSibling.href = `${
        Shopify.routes.root
      }products/${productCard.getAttribute("handle")}`);
  });
var ShopTheLookDesktopCarousel = class extends EffectCarousel {
    createOnBecameVisibleAnimationControls(toSlide) {
      return animate22(
        toSlide.querySelectorAll(".shop-the-look__item-content"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.5 }
      );
    }
    createOnChangeAnimationControls(fromSlide, toSlide) {
      return timeline13([
        [
          fromSlide.querySelectorAll(".shop-the-look__item-content"),
          { opacity: [1, 0] },
          { duration: 0.3 },
        ],
        [
          fromSlide.querySelectorAll(".shop-the-look__image-wrapper > *"),
          {
            opacity: [1, 0],
            transform: ["translateX(0)", "translateX(-15px)"],
          },
          { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] },
        ],
        [
          toSlide.querySelectorAll(".shop-the-look__image-wrapper > *"),
          {
            opacity: [0, 1],
            transform: ["translateX(-15px)", "translateX(0)"],
          },
          { duration: 0.5, at: "<" },
        ],
        [
          toSlide.querySelectorAll(".shop-the-look__item-content"),
          { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
          { duration: 0.5, at: "-0.1" },
        ],
      ]);
    }
  },
  ShopTheLookPopover = class extends Popover {
    hideForOutsideClickTarget(target) {
      return !1;
    }
    allowOutsideClickForTarget(target) {
      return target.classList.contains("shop-the-look__hot-spot");
    }
  };
window.customElements.get("shop-the-look-mobile-carousel") ||
  window.customElements.define(
    "shop-the-look-mobile-carousel",
    ShopTheLookMobileCarousel
  ),
  window.customElements.get("shop-the-look-product-list-carousel") ||
    window.customElements.define(
      "shop-the-look-product-list-carousel",
      ShopTheLookProductListCarousel
    ),
  window.customElements.get("shop-the-look-desktop-carousel") ||
    window.customElements.define(
      "shop-the-look-desktop-carousel",
      ShopTheLookDesktopCarousel
    ),
  window.customElements.get("shop-the-look-popover") ||
    window.customElements.define("shop-the-look-popover", ShopTheLookPopover);
import { timeline as timeline14, Delegate as Delegate10 } from "vendor";
var _delegate8,
  _onVideoEndedListener,
  _SlideshowCarousel_instances,
  autoplayPauseOnVideo_get,
  getSlideEnteringSequence_fn,
  getSlideLeavingSequence_fn,
  muteVideo_fn,
  unmuteVideo_fn,
  onVolumeChange_fn,
  onSlideSettle_fn,
  onVideoEnded_fn,
  onNextButtonClicked_fn,
  handleAutoplayProgress_fn,
  SlideshowCarousel = class extends EffectCarousel {
    constructor() {
      super(),
        __privateAdd(this, _SlideshowCarousel_instances),
        __privateAdd(this, _delegate8, new Delegate10(this)),
        __privateAdd(
          this,
          _onVideoEndedListener,
          __privateMethod(
            this,
            _SlideshowCarousel_instances,
            onVideoEnded_fn
          ).bind(this)
        ),
        __privateGet(this, _delegate8).on(
          "click",
          '[data-action="navigate-next"]',
          __privateMethod(
            this,
            _SlideshowCarousel_instances,
            onNextButtonClicked_fn
          ).bind(this)
        ),
        __privateGet(this, _delegate8).on(
          "click",
          '[data-action="unmute"]',
          __privateMethod(
            this,
            _SlideshowCarousel_instances,
            unmuteVideo_fn
          ).bind(this)
        ),
        __privateGet(this, _delegate8).on(
          "click",
          '[data-action="mute"]',
          __privateMethod(
            this,
            _SlideshowCarousel_instances,
            muteVideo_fn
          ).bind(this)
        ),
        this.addEventListener(
          "volumechange",
          __privateMethod(
            this,
            _SlideshowCarousel_instances,
            onVolumeChange_fn
          ),
          { capture: !0 }
        ),
        this.addEventListener(
          "carousel:settle",
          __privateMethod(this, _SlideshowCarousel_instances, onSlideSettle_fn)
        ),
        this.hasAttribute("autoplay") &&
          this.player &&
          (this.player.addEventListener(
            "player:start",
            __privateMethod(
              this,
              _SlideshowCarousel_instances,
              handleAutoplayProgress_fn
            ).bind(this)
          ),
          this.player.addEventListener(
            "player:stop",
            __privateMethod(
              this,
              _SlideshowCarousel_instances,
              handleAutoplayProgress_fn
            ).bind(this)
          ),
          this.player.addEventListener(
            "player:visibility-pause",
            __privateMethod(
              this,
              _SlideshowCarousel_instances,
              handleAutoplayProgress_fn
            ).bind(this)
          ),
          this.player.addEventListener(
            "player:visibility-resume",
            __privateMethod(
              this,
              _SlideshowCarousel_instances,
              handleAutoplayProgress_fn
            ).bind(this)
          ));
    }
    disconnectedCallback() {
      __privateGet(this, _delegate8).destroy();
    }
    async createOnBecameVisibleAnimationControls(toSlide) {
      return (
        toSlide.getAttribute("media-type") === "image"
          ? await imageLoaded(toSlide.querySelectorAll("img"))
          : await videoLoaded(toSlide.querySelectorAll("video")),
        toSlide.hasAttribute("reveal-on-scroll")
          ? timeline14([
              ...__privateMethod(
                this,
                _SlideshowCarousel_instances,
                getSlideEnteringSequence_fn
              ).call(this, toSlide),
            ])
          : { finished: Promise.resolve() }
      );
    }
    createOnChangeAnimationControls(fromSlide, toSlide, { direction } = {}) {
      const fromVideo = Array.from(fromSlide.querySelectorAll("video")),
        toVideo = Array.from(toSlide.querySelectorAll("video")).filter(
          (video) => video.offsetParent
        );
      return (
        fromSlide.removeEventListener(
          "ended",
          __privateGet(this, _onVideoEndedListener),
          { capture: !0 }
        ),
        fromVideo.forEach((video) => {
          (video.muted = !0), video.pause();
        }),
        toVideo.forEach((video) => {
          (video.muted = !0), (video.currentTime = 0), video.play();
        }),
        {
          leaveControls: () =>
            timeline14(
              __privateMethod(
                this,
                _SlideshowCarousel_instances,
                getSlideLeavingSequence_fn
              ).call(this, fromSlide)
            ),
          enterControls: () =>
            timeline14(
              __privateMethod(
                this,
                _SlideshowCarousel_instances,
                getSlideEnteringSequence_fn
              ).call(this, toSlide)
            ),
        }
      );
    }
  };
(_delegate8 = new WeakMap()),
  (_onVideoEndedListener = new WeakMap()),
  (_SlideshowCarousel_instances = new WeakSet()),
  (autoplayPauseOnVideo_get = function () {
    return this.hasAttribute("autoplay-pause-on-video");
  }),
  (getSlideEnteringSequence_fn = function (slide) {
    const slideContent = slide.querySelector(".slideshow__slide-content");
    return slideContent.classList.contains("slideshow__slide-content--boxed")
      ? [
          [
            slide,
            { opacity: [0, 1] },
            { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] },
          ],
          [
            slide.querySelectorAll(
              ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
            ),
            { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] },
            { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] },
          ],
          [
            slideContent,
            {
              opacity: [0, 1],
              transform: ["translateY(30px)", "translateY(0)"],
            },
            { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
          ],
        ]
      : [
          [
            slide,
            { opacity: [0, 1] },
            { duration: 0.8, easing: [0.25, 0.46, 0.45, 0.94] },
          ],
          [
            slide.querySelectorAll(
              ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
            ),
            { opacity: [0, 1], transform: ["scale(1.2)", "scale(1)"] },
            { duration: 0.8, at: "<", easing: [0.25, 0.46, 0.45, 0.94] },
          ],
          [
            slideContent.querySelector(".prose"),
            {
              opacity: [0, 1],
              transform: ["translateY(30px)", "translateY(0)"],
            },
            { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
          ],
          [
            slideContent.querySelector(".button-group"),
            {
              opacity: [0, 1],
              transform: ["translateY(20px)", "translateY(0)"],
            },
            { duration: 0.6, at: "-0.4", easing: [0.215, 0.61, 0.355, 1] },
          ],
        ];
  }),
  (getSlideLeavingSequence_fn = function (slide) {
    const slideContent = slide.querySelector(".slideshow__slide-content");
    return slideContent.classList.contains("slideshow__slide-content--boxed")
      ? [
          [
            slideContent,
            {
              opacity: [1, 0],
              transform: ["translateY(0)", "translateY(20px)"],
            },
            {
              duration: 0.25,
              at: "leaving",
              easing: [0.55, 0.055, 0.675, 0.19],
            },
          ],
          [
            slide.querySelectorAll(
              ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
            ),
            { opacity: [1, 0] },
            { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] },
          ],
        ]
      : [
          [
            slideContent.querySelector(".prose"),
            {
              opacity: [1, 0],
              transform: ["translateY(0)", "translateY(10px)"],
            },
            {
              duration: 0.25,
              at: "leaving",
              easing: [0.55, 0.055, 0.675, 0.19],
            },
          ],
          [
            slideContent.querySelector(".button-group"),
            {
              opacity: [1, 0],
              transform: ["translateY(0)", "translateY(20px)"],
            },
            { duration: 0.25, at: "<", easing: [0.55, 0.055, 0.675, 0.19] },
          ],
          [
            slide.querySelectorAll(
              ".content-over-media > :is(video-media, svg), .content-over-media > picture img"
            ),
            { opacity: [1, 0] },
            { duration: 0.2, at: "-0.1", easing: [0.55, 0.055, 0.675, 0.19] },
          ],
        ];
  }),
  (muteVideo_fn = function (event) {
    event.preventDefault(),
      Array.from(this.selectedCell.querySelectorAll("video"))
        .filter((video) => video.offsetParent)
        .forEach((video) => (video.muted = !0));
  }),
  (unmuteVideo_fn = function (event) {
    event.preventDefault(),
      Array.from(this.selectedCell.querySelectorAll("video"))
        .filter((video) => video.offsetParent)
        .forEach((video) => (video.muted = !1));
  }),
  (onVolumeChange_fn = function (event) {
    const volumeControl = event.target
      .closest(".slideshow__slide")
      .querySelector(".slideshow__volume-control");
    volumeControl &&
      ((volumeControl.querySelector('[data-action="unmute"]').hidden =
        !event.target.muted),
      (volumeControl.querySelector('[data-action="mute"]').hidden =
        event.target.muted));
  }),
  (onSlideSettle_fn = function (event) {
    const videoList = Array.from(event.detail.cell.querySelectorAll("video"));
    __privateGet(
      this,
      _SlideshowCarousel_instances,
      autoplayPauseOnVideo_get
    ) &&
      this.cells.length > 1 &&
      videoList.length > 0 &&
      (this.player?.pause(),
      event.detail.cell.addEventListener(
        "ended",
        __privateGet(this, _onVideoEndedListener),
        { capture: !0, once: !0 }
      ));
  }),
  (onVideoEnded_fn = function () {
    this.next();
  }),
  (onNextButtonClicked_fn = function () {
    this.closest(".shopify-section").nextElementSibling?.scrollIntoView({
      block: "start",
      behavior: "smooth",
    });
  }),
  (handleAutoplayProgress_fn = async function (event) {
    switch (event.type) {
      case "player:start":
        let autoplayDuration = this.getAttribute("autoplay");
        if (
          __privateGet(
            this,
            _SlideshowCarousel_instances,
            autoplayPauseOnVideo_get
          ) &&
          this.selectedCell.getAttribute("media-type") === "video"
        ) {
          const video = Array.from(this.selectedCell.querySelectorAll("video"))
            .filter((video2) => video2.offsetParent)
            .pop();
          isNaN(video.duration) &&
            (await new Promise((resolve) => {
              video.onloadedmetadata = () => resolve();
            })),
            (autoplayDuration = video.duration);
        }
        this.style.setProperty(
          "--slideshow-progress-duration",
          `${autoplayDuration}s`
        ),
          this.style.setProperty("--slideshow-progress-play-state", "running");
        break;
      case "player:stop":
        this.style.setProperty("--slideshow-progress-duration", "0s"),
          this.style.setProperty("--slideshow-progress-play-state", "paused");
        break;
      case "player:visibility-pause":
        this.style.setProperty("--slideshow-progress-play-state", "paused");
        break;
      case "player:visibility-resume":
        this.style.setProperty("--slideshow-progress-play-state", "running");
        break;
    }
  }),
  window.customElements.get("slideshow-carousel") ||
    window.customElements.define("slideshow-carousel", SlideshowCarousel);
import { animate as animate23 } from "vendor";
var TestimonialCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide, { direction }) {
    return {
      leaveControls: () =>
        animate23(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-15px)"],
          },
          { duration: 0.4, easing: [0.55, 0.055, 0.675, 0.19] }
        ),
      enterControls: () =>
        animate23(
          toSlide,
          { opacity: [0, 1], transform: ["translateY(15px)", "translateY(0)"] },
          { duration: 0.4, delay: 0, easing: [0.25, 0.46, 0.45, 0.94] }
        ),
    };
  }
};
window.customElements.get("testimonial-carousel") ||
  window.customElements.define("testimonial-carousel", TestimonialCarousel);
import { animate as animate24 } from "vendor";
var TextWithIconsCarousel = class extends EffectCarousel {
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return {
      leaveControls: () =>
        animate24(
          fromSlide,
          {
            opacity: [1, 0],
            transform: ["translateY(0)", "translateY(-10px)"],
          },
          { duration: 0.3, easing: "ease-in" }
        ),
      enterControls: () =>
        animate24(
          toSlide,
          {
            opacity: [0, 1],
            transform: ["translateY(10px)", "translateY(0px)"],
          },
          { duration: 0.3, delay: 0.2, easing: "ease-out" }
        ),
    };
  }
};
window.customElements.get("text-with-icons-carousel") ||
  window.customElements.define(
    "text-with-icons-carousel",
    TextWithIconsCarousel
  );
import { animate as animate25, timeline as timeline15 } from "vendor";
var TimelineCarousel = class extends EffectCarousel {
  createOnBecameVisibleAnimationControls(toSlide) {
    return animate25(
      toSlide.querySelectorAll(".timeline__item-content"),
      { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
      { duration: 0.5 }
    );
  }
  createOnChangeAnimationControls(fromSlide, toSlide) {
    return timeline15([
      [
        fromSlide.querySelectorAll(".timeline__item-content"),
        { opacity: [1, 0] },
        { duration: 0.3 },
      ],
      [
        fromSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"),
        { opacity: [1, 0], transform: ["translateX(0)", "translateX(-15px)"] },
        { duration: 0.5, at: "<", easing: [0.645, 0.045, 0.355, 1] },
      ],
      [
        toSlide.querySelector(".timeline__item-image-wrapper :is(img, svg)"),
        { opacity: [0, 1], transform: ["translateX(-15px)", "translateX(0)"] },
        { duration: 0.5, at: "<" },
      ],
      [
        toSlide.querySelectorAll(".timeline__item-content"),
        { opacity: [0, 1], transform: ["translateY(10px)", "translateY(0)"] },
        { duration: 0.5, at: "-0.1" },
      ],
    ]);
  }
};
window.customElements.get("timeline-carousel") ||
  window.customElements.define("timeline-carousel", TimelineCarousel);
import { Delegate as Delegate11 } from "vendor";
new Delegate11(document.documentElement).on(
  "click",
  'a[href*="#"]',
  (event, target) => {
    if (
      event.defaultPrevented ||
      target.matches("[allow-hash-change]") ||
      target.pathname !== window.location.pathname ||
      target.search !== window.location.search
    )
      return;
    const url = new URL(target.href);
    if (url.hash === "") return;
    const anchorElement = document.querySelector(url.hash);
    anchorElement &&
      (event.preventDefault(),
      anchorElement.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: no-preference)")
          .matches
          ? "smooth"
          : "auto",
      }),
      document.documentElement.dispatchEvent(
        new CustomEvent("hashchange:simulate", {
          bubbles: !0,
          detail: { hash: url.hash },
        })
      ));
  }
),
  Array.from(document.querySelectorAll(".prose table")).forEach((table) => {
    table.outerHTML =
      '<div class="table-scroller">' + table.outerHTML + "</div>";
  });
export {
  AccordionDisclosure,
  AccountLogin,
  AnnouncementBarCarousel,
  ArticleToolbar,
  BeforeAfter,
  BlogPosts,
  BuyButtons,
  CarouselNavigation,
  CarouselNextButton,
  CarouselPrevButton,
  CartCount,
  CartDot,
  CartDrawer,
  CartNote,
  CollectionBanner,
  CollectionLayoutSwitch,
  ConfirmButton,
  CopyButton,
  CountdownTimer,
  CountdownTimerFlip,
  CountdownTimerFlipDigit,
  CountrySelector,
  CustomDetails,
  DialogCloseButton,
  DialogElement,
  Drawer,
  EffectCarousel,
  FacetLink,
  FacetsDrawer,
  FacetsForm,
  FacetsSortPopover,
  FaqToc,
  FeaturedCollectionsCarousel,
  FreeShippingBar,
  GestureArea,
  GiftCardRecipient,
  Header,
  HeightObserver,
  ImageParallax,
  ImageWithText,
  ImageWithTextOverlay,
  ImagesWithTextScroll,
  LineItemQuantity,
  Listbox,
  LoadingBar,
  MarqueeText,
  MediaGrid,
  MenuDisclosure,
  Modal,
  ModelMedia,
  MultiColumn,
  MultipleMediaWithText,
  NewsletterPopup,
  OpenLightBoxButton,
  Player,
  PopIn,
  Popover,
  PredictiveSearch,
  PriceRange,
  PrivacyBanner,
  ProductCard,
  ProductForm,
  ProductGallery,
  ProductGalleryNavigation,
  ProductList,
  ProductLoader,
  ProductRecommendations,
  ProductRerender,
  ProductStickyBar,
  ProgressBar,
  QrCode,
  QuantityInput,
  QuantitySelector,
  QuickBuyModal,
  RecentlyViewedProducts,
  SafeSticky,
  ScrollCarousel,
  ShareButton,
  ShippingEstimator,
  ShopTheLookDesktopCarousel,
  ShopTheLookMobileCarousel,
  ShopTheLookPopover,
  ShopTheLookProductListCarousel,
  SlideshowCarousel,
  Tabs,
  TestimonialCarousel,
  TextWithIconsCarousel,
  TimelineCarousel,
  VariantPicker,
  VideoMedia,
  cachedFetch,
  createMediaImg,
  debounce,
  deepQuerySelector,
  extractSectionId,
  fetchCart,
  generateSrcset,
  imageLoaded,
  matchesMediaQuery,
  mediaQueryListener,
  throttle,
  videoLoaded,
  waitForEvent,
};
//# sourceMappingURL=/s/files/1/0626/9065/t/123/assets/theme.js.map?v=1734850638
