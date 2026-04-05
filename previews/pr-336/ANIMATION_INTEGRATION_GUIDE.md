# Animation Integration Guide for CAP

## Quick Start

### Step 1: Verify Files Are Loaded

Check that these files are included in your `index.html`:

```html
<link rel="stylesheet" href="./animation-enhancements.css" />
<!-- ... -->
<script src="./animation-enhancements.js"></script>
```

### Step 2: Use Enhanced Functions

Replace existing function calls with enhanced versions:

**Before:**
```javascript
rotateClass('up');
flipSeatingVertically();
generateTable();
```

**After:**
```javascript
rotateClassEnhanced('up', 'spiral');
flipSeatingVerticallyEnhanced('perspective');
generateTableEnhanced('swirl');
```

### Step 3: Update HTML Buttons

Update button onclick attributes to use enhanced functions:

```html
<!-- Rotate Up Button -->
<button onclick="rotateClassEnhanced('up', 'spiral')" 
        class="btn-3d btn-3d-blue"
        title="Xoay lên">
  <i class="fas fa-rotate-up"></i>
</button>

<!-- Rotate Down Button -->
<button onclick="rotateClassEnhanced('down', 'drop')" 
        class="btn-3d btn-3d-blue"
        title="Xoay xuống">
  <i class="fas fa-rotate-down"></i>
</button>

<!-- Flip Vertical Button -->
<button onclick="flipSeatingVerticallyEnhanced('cascade')" 
        class="btn-3d btn-3d-purple"
        title="Lật/Xoay dọc">
  <i class="fas fa-arrows-alt-v"></i>
</button>

<!-- Sort Button -->
<button onclick="generateTableEnhanced('swirl')" 
        class="btn-3d btn-3d-green"
        title="Sắp xếp A-Z">
  <i class="fas fa-sort-alpha-down"></i>
</button>
```

## Animation Selection Guide

### For Rotate Up

| Style | Feel | Best For |
|-------|------|----------|
| `spiral` | Modern, dynamic | Professional, modern UI |
| `wave` | Elegant, flowing | Smooth, refined feel |
| `bounce` | Playful, energetic | Engaging, interactive feel |

**Recommendation**: Start with `spiral` for a professional look.

### For Rotate Down

| Style | Feel | Best For |
|-------|------|----------|
| `sink` | Heavy, grounded | Serious, formal operations |
| `ripple` | Organic, wave-like | Natural, flowing feel |
| `drop` | Gravity-based, natural | Intuitive, physical feel |

**Recommendation**: Use `drop` for a natural, intuitive feel.

### For Flip Vertical

| Style | Feel | Best For |
|-------|------|----------|
| `smooth` | Traditional, professional | Classic 3D effect |
| `perspective` | Advanced, sophisticated | Modern, advanced feel |
| `cascade` | Dynamic, flowing | Energetic, engaging feel |
| `glitch` | Modern, trendy | Contemporary, cutting-edge feel |

**Recommendation**: Use `perspective` for a professional, modern look.

### For Sort

| Style | Feel | Best For |
|-------|------|----------|
| `float` | Light, airy | Gentle, non-intrusive |
| `swirl` | Playful, energetic | Engaging, fun feel |
| `shuffle` | Card-like, lateral | Familiar, card-based UI |
| `pulseExpand` | Attention-grabbing, modern | Highlighting changes |
| `bounceIn` | Energetic, playful | Dynamic, interactive feel |

**Recommendation**: Use `float` for subtle, professional sorting.

## Configuration Presets

### Professional Preset
```javascript
setAnimationConfig({
  rotateUp: 'wave',
  rotateDown: 'ripple',
  flipVertical: 'smooth',
  sort: 'float',
  enableStagger: true,
  staggerDelay: 40,
});
```

### Modern Preset
```javascript
setAnimationConfig({
  rotateUp: 'spiral',
  rotateDown: 'drop',
  flipVertical: 'perspective',
  sort: 'swirl',
  enableStagger: true,
  staggerDelay: 50,
});
```

### Playful Preset
```javascript
setAnimationConfig({
  rotateUp: 'bounce',
  rotateDown: 'drop',
  flipVertical: 'cascade',
  sort: 'bounceIn',
  enableStagger: true,
  staggerDelay: 60,
});
```

### Minimal Preset (Fast)
```javascript
setAnimationConfig({
  rotateUp: 'wave',
  rotateDown: 'ripple',
  flipVertical: 'smooth',
  sort: 'float',
  enableStagger: false, // No stagger for speed
  staggerDelay: 0,
});
```

## Implementation Examples

### Example 1: Update Rotate Buttons

Find the rotate buttons in `index.html` (around line 1194-1201):

**Current:**
```html
<button onclick="rotateClass('up')" class="btn-3d btn-3d-blue">
  <i class="fas fa-rotate-up"></i>
</button>
```

**Updated:**
```html
<button onclick="rotateClassEnhanced('up', 'spiral')" class="btn-3d btn-3d-blue">
  <i class="fas fa-rotate-up"></i>
</button>
```

### Example 2: Update Flip Button

Find the flip button in `index.html` (around line 1208):

**Current:**
```html
<button onclick="flipSeatingVertically()" class="btn-3d btn-3d-purple">
  <i class="fas fa-arrows-alt-v"></i>
</button>
```

**Updated:**
```html
<button onclick="flipSeatingVerticallyEnhanced('perspective')" class="btn-3d btn-3d-purple">
  <i class="fas fa-arrows-alt-v"></i>
</button>
```

### Example 3: Update Sort Button

Find the sort button in `index.html` (around line 1406-1413):

**Current:**
```html
<button onclick="generateTable()" class="btn-3d btn-3d-green">
  <i class="fas fa-sort-alpha-down"></i>
</button>
```

**Updated:**
```html
<button onclick="generateTableEnhanced('swirl')" class="btn-3d btn-3d-green">
  <i class="fas fa-sort-alpha-down"></i>
</button>
```

## Advanced Usage

### Custom Animation Sequence

Create a custom function that chains animations:

```javascript
function customLayoutTransform() {
  // First rotate up with spiral
  rotateClassEnhanced('up', 'spiral');
  
  // Then after 1 second, flip with cascade
  setTimeout(() => {
    flipSeatingVerticallyEnhanced('cascade');
  }, 1000);
}
```

### Animation with User Feedback

Add toast notifications with animations:

```javascript
function rotateWithFeedback(direction) {
  const style = direction === 'up' ? 'spiral' : 'drop';
  rotateClassEnhanced(direction, style);
  
  const message = direction === 'up' ? 
    'Xoay lên lớp học' : 'Xoay xuống lớp học';
  showToast(message);
}
```

### Conditional Animation

Use different animations based on conditions:

```javascript
function smartRotate(direction) {
  const studentCount = getAllStudentNames().length;
  
  // Use fast animation for large classes
  const style = studentCount > 30 ? 'wave' : 'spiral';
  
  rotateClassEnhanced(direction, style);
}
```

## Testing Animations

### Test Individual Animation

```javascript
// Test in browser console
const testElement = document.querySelector('.desk-box');
previewAnimation(testElement, 'animate-rotate-up-spiral', 600);
```

### Test All Animations

```javascript
// Create a test function
function testAllAnimations() {
  const styles = getAvailableAnimationStyles('rotateUp');
  styles.forEach(style => {
    setTimeout(() => {
      console.log(`Testing: ${style}`);
      const elem = document.querySelector('.desk-box');
      previewAnimation(elem, `animate-rotate-up-${style}`, 600);
    }, 700);
  });
}

// Run test
testAllAnimations();
```

### Performance Testing

Monitor animation performance:

```javascript
function testAnimationPerformance() {
  const start = performance.now();
  
  animateAllDeskCellsEnhanced(
    'animate-sort-float',
    600,
    null,
    true
  );
  
  setTimeout(() => {
    const end = performance.now();
    console.log(`Animation completed in ${end - start}ms`);
  }, 700);
}
```

## Troubleshooting

### Animations Not Playing

**Check:**
1. CSS file is loaded: `<link rel="stylesheet" href="./animation-enhancements.css" />`
2. JS file is loaded: `<script src="./animation-enhancements.js"></script>`
3. Browser console for errors: Open DevTools → Console

### Animations Too Fast/Slow

**Adjust duration in function calls:**
```javascript
// Slower animation (800ms instead of 600ms)
animateAllDeskCellsEnhanced('animate-rotate-up-spiral', 800);
```

### Animations Not Staggering

**Check stagger configuration:**
```javascript
// Verify stagger is enabled
const config = getAnimationConfig();
console.log(config.enableStagger); // Should be true
```

### Performance Issues

**Solutions:**
1. Disable stagger: `setAnimationConfig({ enableStagger: false })`
2. Use faster animations: `setAnimationConfig({ staggerDelay: 20 })`
3. Use simpler animations: `wave` instead of `glitch`

## Browser DevTools Tips

### View Animation Timeline

1. Open DevTools (F12)
2. Go to Animations tab
3. Perform an action to trigger animation
4. View animation timeline and adjust if needed

### Modify Animation Speed

```javascript
// Slow down all animations for testing
document.querySelectorAll('[style*="animation"]').forEach(el => {
  el.style.animationPlayState = 'paused';
  el.style.animationPlayState = 'running';
});
```

### Disable Animations Temporarily

```javascript
// Disable all animations
document.querySelectorAll('[class*="animate-"]').forEach(el => {
  el.style.animation = 'none';
});

// Re-enable
location.reload();
```

## Next Steps

1. **Test**: Try different animation styles and find your preference
2. **Configure**: Set default animations using `setAnimationConfig()`
3. **Customize**: Create custom animations by adding new keyframes
4. **Monitor**: Track user feedback and adjust animations accordingly
5. **Optimize**: Fine-tune stagger delays and durations for your use case

## Support

For issues or questions:
1. Check browser console for errors
2. Review `ANIMATION_ENHANCEMENTS.md` for detailed documentation
3. Test animations in isolation using `previewAnimation()`
4. Check browser compatibility (all modern browsers supported)

## Version History

- **v1.0.0** (2026-04-04): Initial release with 12 animation styles
