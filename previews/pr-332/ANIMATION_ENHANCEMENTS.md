# Animation Enhancements for CAP Classroom Management System

## Overview

This document describes the creative and professional animation enhancements added to the CAP system for three key operations: **Rotate Up/Down**, **Flip/Rotate Vertical**, and **Sort**.

## Features

### 1. Rotate Up Animation

Three distinct animation styles for rotating the classroom layout upward:

#### **Spiral Style** (`animate-rotate-up-spiral`)
- **Effect**: Elements spiral upward with 3D rotation and scaling
- **Duration**: 0.6s
- **Easing**: Cubic bezier with bounce effect
- **Use Case**: Modern, dynamic feel for layout rotation
- **Characteristics**:
  - Starts with opacity 0 and scale 0.85
  - Rotates on X and Z axes
  - Ends with full opacity and scale 1

#### **Wave Style** (`animate-rotate-up-wave`)
- **Effect**: Elements move up with a wave-like skew motion
- **Duration**: 0.55s
- **Easing**: Smooth cubic bezier
- **Use Case**: Elegant, flowing animation
- **Characteristics**:
  - Skew transformation creates wave effect
  - Smooth opacity transition
  - Subtle and professional

#### **Bounce Style** (`animate-rotate-up-bounce`)
- **Effect**: Elements bounce up with overshoot
- **Duration**: 0.65s
- **Easing**: Bounce easing function
- **Use Case**: Playful, energetic feel
- **Characteristics**:
  - Overshoots at 60% of animation
  - Scale reaches 1.05 at peak
  - Returns smoothly to original position

### 2. Rotate Down Animation

Three distinct animation styles for rotating the classroom layout downward:

#### **Sink Style** (`animate-rotate-down-sink`)
- **Effect**: Elements sink downward with 3D rotation
- **Duration**: 0.6s
- **Easing**: Cubic bezier with bounce
- **Use Case**: Heavy, grounded feel
- **Characteristics**:
  - Starts from above with rotateX(-90deg)
  - Sinks into position
  - Opposite of spiral style

#### **Ripple Style** (`animate-rotate-down-ripple`)
- **Effect**: Elements expand vertically like a ripple
- **Duration**: 0.55s
- **Easing**: Smooth cubic bezier
- **Use Case**: Wave-like, organic motion
- **Characteristics**:
  - ScaleY transformation creates ripple effect
  - Reaches 1.1 scale at midpoint
  - Smooth return to normal

#### **Drop Style** (`animate-rotate-down-drop`)
- **Effect**: Elements drop down with rotation
- **Duration**: 0.65s
- **Easing**: Bounce easing
- **Use Case**: Gravity-based, natural feel
- **Characteristics**:
  - Starts from above with 3D rotation
  - Bounces slightly on landing
  - Scale overshoots to 1.05

### 3. Flip Vertical Animation

Four distinct animation styles for flipping the classroom layout vertically:

#### **Smooth Style** (`animate-flip-vertical-smooth`)
- **Effect**: Classic 3D flip on X axis
- **Duration**: 0.7s
- **Easing**: Bounce easing
- **Use Case**: Traditional, professional flip
- **Characteristics**:
  - Pure rotateX transformation
  - Opacity dips at midpoint (0.4)
  - Smooth, predictable motion

#### **Perspective Style** (`animate-flip-vertical-perspective`)
- **Effect**: 3D flip with perspective depth
- **Duration**: 0.75s
- **Easing**: Smooth cubic bezier
- **Use Case**: Advanced 3D effect
- **Characteristics**:
  - Uses CSS perspective (1200px)
  - TranslateZ creates depth
  - More sophisticated visual effect

#### **Cascade Style** (`animate-flip-vertical-cascade`)
- **Effect**: Flip with rotation and scaling cascade
- **Duration**: 0.8s
- **Easing**: Bounce easing
- **Use Case**: Dynamic, flowing effect
- **Characteristics**:
  - Combines rotateX with rotateZ
  - Scale changes during animation
  - Creates cascading visual effect

#### **Glitch Style** (`animate-flip-vertical-glitch`)
- **Effect**: Flip with glitch-like skew effect
- **Duration**: 0.9s
- **Easing**: Smooth cubic bezier
- **Use Case**: Modern, trendy effect
- **Characteristics**:
  - Multiple keyframes (0%, 25%, 50%, 75%, 100%)
  - Skew transformation adds glitch feel
  - Opacity varies throughout animation

### 4. Sort Animation

Five distinct animation styles for sorting/reordering elements:

#### **Float Style** (`animate-sort-float`)
- **Effect**: Elements float up gently
- **Duration**: 0.5s
- **Easing**: Bounce easing
- **Use Case**: Light, airy feel
- **Characteristics**:
  - Moves up 12px at peak
  - Scale reaches 1.02
  - Smooth return to position

#### **Swirl Style** (`animate-sort-swirl`)
- **Effect**: Elements swirl while moving up
- **Duration**: 0.7s
- **Easing**: Bounce easing
- **Use Case**: Playful, energetic sorting
- **Characteristics**:
  - Full 360-degree rotation
  - Scale reaches 1.05
  - Creates spinning effect

#### **Shuffle Style** (`animate-sort-shuffle`)
- **Effect**: Elements shuffle horizontally then settle
- **Duration**: 0.55s
- **Easing**: Smooth cubic bezier
- **Use Case**: Lateral movement, card shuffling feel
- **Characteristics**:
  - Moves left 20px initially
  - Moves right 10px at midpoint
  - Returns to original position

#### **Pulse Expand Style** (`animate-sort-pulse-expand`)
- **Effect**: Elements pulse and expand with blur
- **Duration**: 0.6s
- **Easing**: Bounce easing
- **Use Case**: Attention-grabbing, modern effect
- **Characteristics**:
  - Starts with blur(4px)
  - Scales to 1.1 at midpoint
  - Blur clears as animation progresses

#### **Bounce In Style** (`animate-sort-bounce-in`)
- **Effect**: Elements bounce into position
- **Duration**: 0.65s
- **Easing**: Bounce easing
- **Use Case**: Energetic, playful effect
- **Characteristics**:
  - Starts from 30px below
  - Scale starts at 0.3
  - Bounces to 1.1 at 60%

## Usage

### Basic Usage (Original Functions)

The original functions still work as before:

```javascript
// Rotate up with default animation
rotateClass('up');

// Rotate down with default animation
rotateClass('down');

// Flip vertically with default animation
flipSeatingVertically();

// Generate sorted table with default animation
generateTable();
```

### Enhanced Usage (New Functions)

Use the enhanced functions to select specific animation styles:

```javascript
// Rotate up with spiral animation
rotateClassEnhanced('up', 'spiral');

// Rotate down with drop animation
rotateClassEnhanced('down', 'drop');

// Flip vertically with glitch animation
flipSeatingVerticallyEnhanced('glitch');

// Generate table with swirl animation
generateTableEnhanced('swirl');
```

### Configuration

Customize default animations globally:

```javascript
// Set default animations
setAnimationConfig({
  rotateUp: 'bounce',
  rotateDown: 'drop',
  flipVertical: 'cascade',
  sort: 'swirl',
  enableStagger: true,
  staggerDelay: 50, // milliseconds
});

// Get current configuration
const config = getAnimationConfig();
console.log(config);
```

### Stagger Effect

Apply staggered animation to multiple elements:

```javascript
// Animate all desk cells with stagger
animateAllDeskCellsEnhanced(
  'animate-sort-float',
  600,
  null,
  true // Enable stagger
);
```

### Preview Animation

Test animations on specific elements:

```javascript
const element = document.querySelector('.desk-box');
previewAnimation(element, 'animate-rotate-up-spiral', 600);
```

### Batch Animation

Animate multiple elements with custom stagger:

```javascript
const elements = document.querySelectorAll('.desk-box');
batchAnimateWithStagger(
  elements,
  'animate-sort-bounce-in',
  600,
  75 // Stagger delay in milliseconds
);
```

## Animation Classes Reference

### Rotate Up Classes
- `.animate-rotate-up-spiral`
- `.animate-rotate-up-wave`
- `.animate-rotate-up-bounce`

### Rotate Down Classes
- `.animate-rotate-down-sink`
- `.animate-rotate-down-ripple`
- `.animate-rotate-down-drop`

### Flip Vertical Classes
- `.animate-flip-vertical-smooth`
- `.animate-flip-vertical-perspective`
- `.animate-flip-vertical-cascade`
- `.animate-flip-vertical-glitch`

### Sort Classes
- `.animate-sort-float`
- `.animate-sort-swirl`
- `.animate-sort-shuffle`
- `.animate-sort-pulse-expand`
- `.animate-sort-bounce-in`

### Stagger Delay Classes
- `.stagger-1` through `.stagger-10`
- Each adds 50ms delay (0.05s - 0.5s)

## Accessibility

All animations respect the `prefers-reduced-motion` media query. Users who have enabled motion reduction in their system preferences will see no animations.

```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

## Performance Considerations

1. **Stagger Effect**: The stagger effect uses `setTimeout` for sequential animation. For large numbers of elements, consider adjusting `staggerDelay`.

2. **3D Transforms**: 3D animations (flip, rotate) use `transform-style: preserve-3d` for better performance.

3. **GPU Acceleration**: Animations use `transform` and `opacity` properties for GPU acceleration.

4. **Animation Duration**: Shorter durations (0.5s) are better for frequent operations, longer durations (0.9s) for special effects.

## Browser Compatibility

- **Chrome/Edge**: Full support for all animations
- **Firefox**: Full support for all animations
- **Safari**: Full support for all animations
- **Mobile Browsers**: Full support with GPU acceleration

## Customization

### Creating Custom Animations

To add new animation styles:

1. Add CSS keyframes to `animation-enhancements.css`:
```css
@keyframes customRotateUp {
  0% { /* start state */ }
  100% { /* end state */ }
}

.animate-custom-rotate-up {
  animation: customRotateUp 0.6s ease;
}
```

2. Add to `AnimationStyles` in `animation-enhancements.js`:
```javascript
ROTATE_UP: {
  spiral: 'animate-rotate-up-spiral',
  wave: 'animate-rotate-up-wave',
  bounce: 'animate-rotate-up-bounce',
  custom: 'animate-custom-rotate-up', // New
}
```

3. Use in code:
```javascript
rotateClassEnhanced('up', 'custom');
```

## Integration with Existing Code

The enhancements are fully backward compatible. The original functions (`rotateClass`, `flipSeatingVertically`, `generateTable`) continue to work as before, using default animations.

To integrate enhanced animations into the UI:

1. Update button onclick handlers:
```html
<!-- Original -->
<button onclick="rotateClass('up')">Rotate Up</button>

<!-- Enhanced -->
<button onclick="rotateClassEnhanced('up', 'spiral')">Rotate Up</button>
```

2. Or use configuration to change defaults:
```javascript
setAnimationConfig({ rotateUp: 'spiral' });
// Now rotateClass('up') uses spiral animation
```

## Future Enhancements

Potential improvements:

1. **Animation Presets**: Save and load animation preference profiles
2. **UI Settings Panel**: Add animation selection to settings modal
3. **Custom Easing**: Allow users to define custom easing functions
4. **Animation Sequencing**: Chain multiple animations together
5. **Sound Effects**: Add optional audio feedback with animations

## Files

- `animation-enhancements.css`: All animation keyframes and classes
- `animation-enhancements.js`: JavaScript functions and configuration
- `ANIMATION_ENHANCEMENTS.md`: This documentation

## Version

- Version: 1.0.0
- Last Updated: 2026-04-04
- Compatible with CAP v2026-04-03-01 and later
