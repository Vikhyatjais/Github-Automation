document.addEventListener('DOMContentLoaded', () => {
  /**
   * TypeWriter Effect Class
   * Handles typing, erasing, and cycling through text arrays.
   */
  class TypeWriter {
    constructor(element, words, options = {}) {
      this.element = element;
      this.words = words;
      this.typeSpeed = parseInt(options.typeSpeed, 10) || 100;
      this.eraseSpeed = parseInt(options.eraseSpeed, 10) || 50;
      this.delayBetween = parseInt(options.delayBetween, 10) || 2000;
      
      this.wordIndex = 0;
      this.isDeleting = false;
      this.txt = '';
      
      this.init();
    }

    init() {
      // Create a wrapper for the text to separate it from the cursor element
      this.textEl = document.createElement('span');
      this.textEl.className = 'typewriter-text';
      
      this.cursorEl = document.createElement('span');
      this.cursorEl.className = 'typewriter-cursor';
      this.cursorEl.innerHTML = '|';
      this.cursorEl.style.animation = 'blink 1s step-end infinite';

      // Inject cursor styling dynamically if not already present in stylesheets
      if (!document.getElementById('typewriter-styles')) {
        const style = document.createElement('style');
        style.id = 'typewriter-styles';
        style.textContent = `
          @keyframes blink {
            from, to { color: transparent }
            50% { color: currentColor }
          }
          .typewriter-cursor {
            font-weight: 200;
            margin-left: 2px;
            display: inline-block;
          }
        `;
        document.head.appendChild(style);
      }

      this.element.innerHTML = '';
      this.element.appendChild(this.textEl);
      this.element.appendChild(this.cursorEl);

      // Start the loop
      this.tick();
    }

    async tick() {
      const currentWordIndex = this.wordIndex % this.words.length;
      const fullTxt = this.words[currentWordIndex];

      if (this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.textEl.textContent = this.txt;

      let typeDelay = this.typeSpeed;

      // Make erasing faster than typing
      if (this.isDeleting) {
        typeDelay = this.eraseSpeed;
      }

      // If word is complete
      if (!this.isDeleting && this.txt === fullTxt) {
        // Pause at the end of the fully typed word
        typeDelay = this.delayBetween;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to the next word
        this.wordIndex++;
        // Short pause before starting to type the next word
        typeDelay = 500;
      }

      // Recursively call tick with dynamic delay
      setTimeout(() => this.tick(), typeDelay);
    }
  }

  // Self-initialize elements with the [data-typewriter] attribute
  const typewriterElements = document.querySelectorAll('[data-typewriter]');
  
  typewriterElements.forEach(el => {
    try {
      const words = JSON.parse(el.getAttribute('data-typewriter-words')) || [];
      const typeSpeed = el.getAttribute('data-typewriter-speed');
      const eraseSpeed = el.getAttribute('data-typewriter-erase');
      const delayBetween = el.getAttribute('data-typewriter-delay');

      if (words.length > 0) {
        new TypeWriter(el, words, {
          typeSpeed,
          eraseSpeed,
          delayBetween
        });
      }
    } catch (e) {
      console.error('Failed to initialize typewriter effect:', e);
    }
  });
});