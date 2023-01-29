class TypingAnimation {
  // animTextElement, text, prevAnimTime = 0, animProgress = 0, typingSpeed = 25, animDelay = 0
  prevTime = 0;
  speed = 0;
  run = false;

  constructor(textElement, text, speed, delay = 0) {
    this.textElement = textElement;
    this.text = text;
    this.speed = speed;
    this.delay = delay;
    this.prevTime = 0;
  }

  typingAnimation = (timestamp) => {
    if (this.prevTime == 0) {
      this.prevTime = timestamp;
    }
    this.progress = timestamp - this.prevTime;

    if (this.progress <= this.delay && this.run) {
      requestAnimationFrame(this.typingAnimation);
    }
    else if (this.text.length > 0) {
      this.delay = 0;
      if (this.progress > this.speed) {
        this.textElement.innerHTML += this.text.substring(0, 1);
        this.text = this.text.substring(1, this.text.length);
        this.prevTime = timestamp;
      }
      if (this.run)
        requestAnimationFrame(this.typingAnimation);
    }
    else {
      this.prevTime = 0;
      this.run = false;
    }
  }

  start = () => {
    this.prevTime = 0;
    this.run = true;
    requestAnimationFrame(this.typingAnimation);
  }

  stop = () => {
    this.run = false;
    this.text = "";
  }
}
