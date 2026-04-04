/**
 * ========================================
 * ANIMATION ENHANCEMENTS FOR CAP
 * Rotate Up/Down, Flip/Rotate Vertical, Sort
 * ======================================== */

/**
 * Enhanced animation styles selector
 * Provides different animation options for each action
 */
const AnimationStyles = {
  ROTATE_UP: {
    spiral: 'animate-rotate-up-spiral',
    wave: 'animate-rotate-up-wave',
    bounce: 'animate-rotate-up-bounce',
  },
  ROTATE_DOWN: {
    sink: 'animate-rotate-down-sink',
    ripple: 'animate-rotate-down-ripple',
    drop: 'animate-rotate-down-drop',
  },
  FLIP_VERTICAL: {
    smooth: 'animate-flip-vertical-smooth',
    perspective: 'animate-flip-vertical-perspective',
    cascade: 'animate-flip-vertical-cascade',
    glitch: 'animate-flip-vertical-glitch',
  },
  SORT: {
    float: 'animate-sort-float',
    swirl: 'animate-sort-swirl',
    shuffle: 'animate-sort-shuffle',
    pulseExpand: 'animate-sort-pulse-expand',
    bounceIn: 'animate-sort-bounce-in',
  },
};

/**
 * Configuration for default animations
 * Users can customize these defaults
 */
const AnimationConfig = {
  rotateUp: 'spiral',
  rotateDown: 'sink',
  flipVertical: 'perspective',
  sort: 'float',
  enableStagger: true,
  staggerDelay: 50, // milliseconds
};

/**
 * Enhanced animateAllDeskCells with animation style selection
 * @param {string} animationStyle - Animation class name or style key
 * @param {number} duration - Animation duration in milliseconds
 * @param {Function} filterFn - Optional filter function for cells
 * @param {boolean} useStagger - Whether to apply stagger effect
 */
function animateAllDeskCellsEnhanced(
  animationStyle = 'animate-pulse-highlight',
  duration = 420,
  filterFn = null,
  useStagger = false,
) {
  const cells = document.querySelectorAll('.desk-box');
  let index = 0;

  cells.forEach((cell) => {
    if (!filterFn || filterFn(cell)) {
      if (useStagger && AnimationConfig.enableStagger) {
        setTimeout(() => {
          animateActionFeedback(cell, animationStyle, duration);
        }, index * AnimationConfig.staggerDelay);
        index++;
      } else {
        animateActionFeedback(cell, animationStyle, duration);
      }
    }
  });
}

/**
 * Enhanced rotateClass with animation style selection
 * @param {string} direction - 'up' or 'down'
 * @param {string} style - Animation style key (optional, uses config default)
 */
function rotateClassEnhanced(direction, style = null) {
  const logic = (a, dir) =>
    dir === 'down' ? [a.pop(), ...a] : [...a.slice(1), a[0]];

  // Rotate the data
  leftSideData = logic([...leftSideData], direction);
  rightSideData = logic([...rightSideData], direction);
  renderAll();

  // Select animation
  const animationKey =
    direction === 'down' ? 'rotateDown' : 'rotateUp';
  const selectedStyle =
    style || AnimationConfig[animationKey];
  const animationClass =
    AnimationStyles[
      direction === 'down' ? 'ROTATE_DOWN' : 'ROTATE_UP'
    ][selectedStyle];

  // Apply animation with stagger
  animateAllDeskCellsEnhanced(
    animationClass,
    600,
    null,
    true, // Enable stagger for visual effect
  );

  scheduleImmediateAutoSave('layout-rotate');
}

/**
 * Enhanced flipSeatingVertically with animation style selection
 * @param {string} style - Animation style key (optional, uses config default)
 */
function flipSeatingVerticallyEnhanced(style = null) {
  // Swap left and right sides
  [leftSideData, rightSideData] = [rightSideData, leftSideData];

  // Reverse column order in each row
  const reverseRowColumns = (data) => {
    data.forEach((row) => {
      row.reverse();
    });
  };

  reverseRowColumns(leftSideData);
  reverseRowColumns(rightSideData);

  renderAll();

  // Select animation
  const selectedStyle =
    style || AnimationConfig.flipVertical;
  const animationClass =
    AnimationStyles.FLIP_VERTICAL[selectedStyle];

  // Apply animation with stagger
  animateAllDeskCellsEnhanced(
    animationClass,
    800,
    null,
    true, // Enable stagger for visual effect
  );

  showToast('Đã hoán đổi dãy cửa lớp và dãy bàn giáo viên!');
}

/**
 * Enhanced generateTable with sort animation
 * Wraps the existing generateTable and adds animation
 * @param {string} style - Animation style key (optional, uses config default)
 */
function generateTableEnhanced(style = null) {
  // Call the original generateTable function
  const tbody = document.getElementById('competition-tbody');
  const originalRows = Array.from(tbody.querySelectorAll('tr'));

  // Generate the table (original logic)
  generateTable();

  // Apply sort animation to new/updated rows
  const newRows = Array.from(tbody.querySelectorAll('tr'));
  const selectedStyle = style || AnimationConfig.sort;
  const animationClass = AnimationStyles.SORT[selectedStyle];

  newRows.forEach((row, index) => {
    if (AnimationConfig.enableStagger) {
      row.style.animationDelay = `${index * AnimationConfig.staggerDelay}ms`;
    }
    animateActionFeedback(row, animationClass, 600);
  });
}

/**
 * Set animation configuration
 * @param {Object} config - Configuration object
 */
function setAnimationConfig(config) {
  Object.assign(AnimationConfig, config);
}

/**
 * Get current animation configuration
 * @returns {Object} Current configuration
 */
function getAnimationConfig() {
  return { ...AnimationConfig };
}

/**
 * Get available animation styles for a specific action
 * @param {string} action - Action type: 'rotateUp', 'rotateDown', 'flipVertical', 'sort'
 * @returns {Array} Available styles for the action
 */
function getAvailableAnimationStyles(action) {
  const actionMap = {
    rotateUp: 'ROTATE_UP',
    rotateDown: 'ROTATE_DOWN',
    flipVertical: 'FLIP_VERTICAL',
    sort: 'SORT',
  };

  const key = actionMap[action];
  return key ? Object.keys(AnimationStyles[key]) : [];
}

/**
 * Preview animation on a specific element
 * Useful for testing animations before applying to full layout
 * @param {HTMLElement} element - Element to animate
 * @param {string} animationClass - Animation class name
 * @param {number} duration - Animation duration in milliseconds
 */
function previewAnimation(element, animationClass, duration = 600) {
  if (!element) return;

  element.classList.add(animationClass);
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

/**
 * Batch animate multiple elements with stagger
 * @param {HTMLElement[]} elements - Elements to animate
 * @param {string} animationClass - Animation class name
 * @param {number} duration - Animation duration in milliseconds
 * @param {number} staggerDelay - Delay between each element in milliseconds
 */
function batchAnimateWithStagger(
  elements,
  animationClass,
  duration = 600,
  staggerDelay = 50,
) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      animateActionFeedback(element, animationClass, duration);
    }, index * staggerDelay);
  });
}

// Export for use in HTML onclick handlers (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AnimationStyles,
    AnimationConfig,
    animateAllDeskCellsEnhanced,
    rotateClassEnhanced,
    flipSeatingVerticallyEnhanced,
    generateTableEnhanced,
    setAnimationConfig,
    getAnimationConfig,
    getAvailableAnimationStyles,
    previewAnimation,
    batchAnimateWithStagger,
  };
}
