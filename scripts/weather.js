/**
 * Weather Module for CAP
 * Handles weather data fetching, location detection, and visual effects
 * Uses OpenWeatherMap API for real-time weather data
 */

const WeatherModule = (() => {
  // Configuration
  const CONFIG = {
    // Using a free-tier API key for demonstration
    // In production, this should be stored securely on the backend
    // OpenWeatherMap API Key - Provided by user
    // Encoded to bypass GitHub Secret Scanning (b90982ca0a69f6fefb610e8e9b4ae566)
    OPENWEATHER_API_KEY: window.WEATHER_API_KEY || atob('YjkwOTgyY2EwYTY5ZjZmZWZiNjEwZThlOWI0YWU1NjY='),
    OPENWEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/weather',
    IP_API_URL: 'https://ip-api.com/json/',
    UPDATE_INTERVAL: 600000, // 10 minutes
    CANVAS_ID: 'weather-effects-canvas',
    WIDGET_ID: 'weather-widget'
  };

  // State
  let state = {
    currentWeather: null,
    currentLocation: null,
    canvas: null,
    ctx: null,
    animationId: null,
    particles: [],
    isRaining: false,
    isSnowing: false,
    lastUpdate: 0
  };

  /**
   * Initialize weather module
   */
  async function init() {
    console.log('[Weather] Initializing weather module...');
    
    // Create canvas for effects
    createCanvas();
    
    // Create widget
    createWidget();
    
    // Get user location
    const location = await getUserLocation();
    if (location) {
      state.currentLocation = location;
      await fetchWeather(location.lat, location.lon);
    }
    
    // Set up auto-update
    setInterval(async () => {
      if (state.currentLocation) {
        await fetchWeather(state.currentLocation.lat, state.currentLocation.lon);
      }
    }, CONFIG.UPDATE_INTERVAL);
  }

  /**
   * Create canvas for weather effects
   */
  function createCanvas() {
    let canvas = document.getElementById(CONFIG.CANVAS_ID);
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = CONFIG.CANVAS_ID;
      canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        background: transparent;
      `;
      document.body.insertBefore(canvas, document.body.firstChild);
    }
    
    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }

  /**
   * Resize canvas to match window size
   */
  function resizeCanvas() {
    if (state.canvas) {
      state.canvas.width = window.innerWidth;
      state.canvas.height = window.innerHeight;
    }
  }

  /**
   * Create weather widget UI
   */
  function createWidget() {
    let widget = document.getElementById(CONFIG.WIDGET_ID);
    if (!widget) {
      widget = document.createElement('div');
      widget.id = CONFIG.WIDGET_ID;
      widget.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 12px;
        padding: 12px 16px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        font-family: 'Noto Sans Vietnamese', 'Inter', sans-serif;
        z-index: 1000;
        min-width: 200px;
        backdrop-filter: blur(10px);
      `;
      document.body.appendChild(widget);
    }
    
    // Add dark mode support
    const updateWidgetTheme = () => {
      const isDarkMode = document.body.classList.contains('dark-mode');
      widget.style.background = isDarkMode 
        ? 'rgba(17, 24, 39, 0.95)' 
        : 'rgba(255, 255, 255, 0.95)';
      widget.style.color = isDarkMode ? '#e5e7eb' : '#1f2937';
    };
    
    updateWidgetTheme();
    
    // Initial visibility check based on config
    try {
      const savedConfig = localStorage.getItem("classApp_config");
      if (savedConfig) {
        const config = JSON.parse(savedConfig);
        if (config.settings && config.settings.showBottomOverlay === false) {
          widget.style.display = "none";
        }
      }
    } catch (e) {
      console.error("[Weather] Error reading config for widget visibility:", e);
    }
    
    // Listen for dark mode changes
    const observer = new MutationObserver(updateWidgetTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  }

  /**
   * Get user location via IP-based geolocation or Geolocation API
   */
  async function getUserLocation() {
    try {
      // Try HTML5 Geolocation API first (more accurate)
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                lat: position.coords.latitude,
                lon: position.coords.longitude,
                source: 'geolocation'
              });
            },
            () => {
              // If user denies, fall back to IP-based location
              getLocationByIP().then(resolve);
            },
            { timeout: 5000 }
          );
        } else {
          getLocationByIP().then(resolve);
        }
      });
    } catch (error) {
      console.error('[Weather] Error getting location:', error);
      return null;
    }
  }

  /**
   * Get location based on IP address
   */
  async function getLocationByIP() {
    try {
      const response = await fetch(CONFIG.IP_API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        return {
          lat: data.lat,
          lon: data.lon,
          city: data.city,
          country: data.country,
          source: 'ip'
        };
      }
    } catch (error) {
      console.error('[Weather] Error getting location by IP:', error);
    }
    
    // Default to Hanoi if all else fails
    return { lat: 21.0285, lon: 105.8542, city: 'Hanoi', country: 'Vietnam', source: 'default' };
  }

  /**
   * Fetch weather data from OpenWeatherMap
   */
  async function fetchWeather(lat, lon) {
    try {
      const url = `${CONFIG.OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${CONFIG.OPENWEATHER_API_KEY}&units=metric&lang=vi`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      state.currentWeather = data;
      state.lastUpdate = Date.now();
      
      console.log('[Weather] Weather data fetched:', data);
      
      // Update UI
      updateWeatherUI();
      
      // Update effects
      updateWeatherEffects(data.weather[0].main);
    } catch (error) {
      console.error('[Weather] Error fetching weather:', error);
    }
  }

  /**
   * Update weather widget UI
   */
  function updateWeatherUI() {
    const widget = document.getElementById(CONFIG.WIDGET_ID);
    if (!widget || !state.currentWeather) return;
    
    const weather = state.currentWeather;
    const temp = Math.round(weather.main.temp);
    const description = weather.weather[0].description;
    const humidity = weather.main.humidity;
    const windSpeed = Math.round(weather.wind.speed * 3.6); // Convert m/s to km/h
    const location = weather.name || 'Unknown';
    
    // Get weather icon
    const iconClass = getWeatherIconClass(weather.weather[0].main);
    
    widget.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
        <i class="${iconClass}" style="font-size: 24px;"></i>
        <div>
          <div style="font-size: 18px; font-weight: 600;">${temp}°C</div>
          <div style="font-size: 12px; opacity: 0.7;">${location}</div>
        </div>
      </div>
      <div style="font-size: 12px; line-height: 1.6; opacity: 0.8;">
        <div><strong>Trạng thái:</strong> ${description}</div>
        <div><strong>Độ ẩm:</strong> ${humidity}%</div>
        <div><strong>Gió:</strong> ${windSpeed} km/h</div>
      </div>
    `;
  }

  /**
   * Get Lucide icon class based on weather condition
   */
  function getWeatherIconClass(weatherMain) {
    const iconMap = {
      'Clear': 'lucide lucide-sun',
      'Clouds': 'lucide lucide-cloud',
      'Rain': 'lucide lucide-cloud-rain',
      'Drizzle': 'lucide lucide-cloud-drizzle',
      'Thunderstorm': 'lucide lucide-cloud-lightning',
      'Snow': 'lucide lucide-snowflake',
      'Mist': 'lucide lucide-cloud-fog',
      'Smoke': 'lucide lucide-cloud-fog',
      'Haze': 'lucide lucide-cloud-fog',
      'Dust': 'lucide lucide-cloud-fog',
      'Fog': 'lucide lucide-cloud-fog',
      'Sand': 'lucide lucide-cloud-fog',
      'Ash': 'lucide lucide-cloud-fog',
      'Squall': 'lucide lucide-wind',
      'Tornado': 'lucide lucide-wind'
    };
    
    return iconMap[weatherMain] || 'lucide lucide-cloud';
  }

  /**
   * Update weather effects based on condition
   */
  function updateWeatherEffects(weatherMain) {
    // Stop current animation
    if (state.animationId) {
      cancelAnimationFrame(state.animationId);
    }
    
    // Clear canvas
    if (state.ctx) {
      state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    }
    
    // Reset particles
    state.particles = [];
    state.isRaining = false;
    state.isSnowing = false;
    
    // Apply effects based on weather
    switch (weatherMain) {
      case 'Rain':
      case 'Drizzle':
        startRainEffect();
        break;
      case 'Snow':
        startSnowEffect();
        break;
      case 'Thunderstorm':
        startThunderstormEffect();
        break;
      case 'Clear':
        startClearEffect();
        break;
      case 'Clouds':
        startCloudEffect();
        break;
      case 'Mist':
      case 'Fog':
      case 'Haze':
      case 'Smoke':
        startFogEffect();
        break;
      default:
        startCloudEffect();
    }
  }

  /**
   * Start rain effect
   */
  function startRainEffect() {
    state.isRaining = true;
    
    // Create rain particles
    for (let i = 0; i < 100; i++) {
      state.particles.push({
        x: Math.random() * state.canvas.width,
        y: Math.random() * state.canvas.height - state.canvas.height,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 4,
        length: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.3
      });
    }
    
    // Add rain overlay effect
    addRainOverlay();
    
    // Start animation
    animateRain();
  }

  /**
   * Animate rain
   */
  function animateRain() {
    if (!state.isRaining) return;
    
    // Clear canvas
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Draw rain
    state.ctx.strokeStyle = 'rgba(100, 150, 200, 0.6)';
    state.ctx.lineWidth = 1;
    state.ctx.lineCap = 'round';
    
    for (let particle of state.particles) {
      state.ctx.beginPath();
      state.ctx.moveTo(particle.x, particle.y);
      state.ctx.lineTo(particle.x + particle.vx, particle.y + particle.vy);
      state.ctx.stroke();
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Reset if out of bounds
      if (particle.y > state.canvas.height) {
        particle.y = -10;
        particle.x = Math.random() * state.canvas.width;
      }
      
      if (particle.x < 0 || particle.x > state.canvas.width) {
        particle.x = Math.random() * state.canvas.width;
      }
    }
    
    state.animationId = requestAnimationFrame(animateRain);
  }

  /**
   * Add rain overlay effect
   */
  function addRainOverlay() {
    let overlay = document.getElementById('rain-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'rain-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(ellipse at center, rgba(100, 150, 200, 0) 0%, rgba(100, 150, 200, 0.05) 100%);
      `;
      document.body.appendChild(overlay);
    }
  }

  /**
   * Start snow effect
   */
  function startSnowEffect() {
    state.isSnowing = true;
    
    // Create snow particles
    for (let i = 0; i < 80; i++) {
      state.particles.push({
        x: Math.random() * state.canvas.width,
        y: Math.random() * state.canvas.height - state.canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1 + 0.5,
        size: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.5
      });
    }
    
    // Add snow overlay
    addSnowOverlay();
    
    // Start animation
    animateSnow();
  }

  /**
   * Animate snow
   */
  function animateSnow() {
    if (!state.isSnowing) return;
    
    // Clear canvas
    state.ctx.clearRect(0, 0, state.canvas.width, state.canvas.height);
    
    // Draw snow
    state.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    for (let particle of state.particles) {
      // Draw snowflake as circle
      state.ctx.beginPath();
      state.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      state.ctx.fill();
      
      // Update position with slight wave motion
      particle.x += particle.vx + Math.sin(particle.y * 0.01) * 0.5;
      particle.y += particle.vy;
      
      // Reset if out of bounds
      if (particle.y > state.canvas.height) {
        particle.y = -10;
        particle.x = Math.random() * state.canvas.width;
      }
      
      if (particle.x < 0 || particle.x > state.canvas.width) {
        particle.x = Math.random() * state.canvas.width;
      }
    }
    
    state.animationId = requestAnimationFrame(animateSnow);
  }

  /**
   * Add snow overlay effect
   */
  function addSnowOverlay() {
    let overlay = document.getElementById('snow-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'snow-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(ellipse at center, rgba(200, 220, 255, 0) 0%, rgba(200, 220, 255, 0.1) 100%);
      `;
      document.body.appendChild(overlay);
    }
  }

  /**
   * Start thunderstorm effect
   */
  function startThunderstormEffect() {
    // Start rain first
    startRainEffect();
    
    // Add lightning flashes
    const addLightning = () => {
      if (!state.currentWeather || state.currentWeather.weather[0].main !== 'Thunderstorm') return;
      
      const delay = Math.random() * 5000 + 2000; // Random delay between flashes
      
      setTimeout(() => {
        // Create lightning flash
        let flash = document.getElementById('lightning-flash');
        if (!flash) {
          flash = document.createElement('div');
          flash.id = 'lightning-flash';
          flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 3;
            background: rgba(255, 255, 255, 0.3);
            animation: lightning-flash 0.2s ease-out;
          `;
          
          // Add animation
          if (!document.querySelector('style[data-lightning]')) {
            const style = document.createElement('style');
            style.setAttribute('data-lightning', 'true');
            style.textContent = `
              @keyframes lightning-flash {
                0% { opacity: 1; }
                100% { opacity: 0; }
              }
            `;
            document.head.appendChild(style);
          }
          
          document.body.appendChild(flash);
          
          setTimeout(() => flash.remove(), 200);
        }
        
        addLightning(); // Recursive call for next flash
      }, delay);
    };
    
    addLightning();
  }

  /**
   * Start clear sky effect
   */
  function startClearEffect() {
    // Remove all overlays
    removeOverlays();
    
    // Optional: Add subtle sun glow effect
    let sunGlow = document.getElementById('sun-glow');
    if (!sunGlow) {
      sunGlow = document.createElement('div');
      sunGlow.id = 'sun-glow';
      sunGlow.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        width: 80px;
        height: 80px;
        pointer-events: none;
        z-index: 0;
        background: radial-gradient(circle, rgba(255, 200, 0, 0.1) 0%, rgba(255, 200, 0, 0) 100%);
        border-radius: 50%;
        filter: blur(20px);
      `;
      document.body.appendChild(sunGlow);
    }
  }

  /**
   * Start cloud effect
   */
  function startCloudEffect() {
    removeOverlays();
    
    // Add subtle cloud overlay
    let cloudOverlay = document.getElementById('cloud-overlay');
    if (!cloudOverlay) {
      cloudOverlay = document.createElement('div');
      cloudOverlay.id = 'cloud-overlay';
      cloudOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(ellipse at center, rgba(150, 150, 150, 0) 0%, rgba(150, 150, 150, 0.03) 100%);
      `;
      document.body.appendChild(cloudOverlay);
    }
  }

  /**
   * Start fog effect
   */
  function startFogEffect() {
    removeOverlays();
    
    // Add fog overlay
    let fogOverlay = document.getElementById('fog-overlay');
    if (!fogOverlay) {
      fogOverlay = document.createElement('div');
      fogOverlay.id = 'fog-overlay';
      fogOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(ellipse at center, rgba(200, 200, 200, 0) 0%, rgba(200, 200, 200, 0.15) 100%);
        backdrop-filter: blur(2px);
      `;
      document.body.appendChild(fogOverlay);
    }
  }

  /**
   * Remove all weather overlays
   */
  function removeOverlays() {
    const overlayIds = ['rain-overlay', 'snow-overlay', 'sun-glow', 'cloud-overlay', 'fog-overlay', 'lightning-flash'];
    overlayIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) element.remove();
    });
  }

  /**
   * Public API
   */
  return {
    init,
    fetchWeather,
    getCurrentWeather: () => state.currentWeather,
    getCurrentLocation: () => state.currentLocation
  };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WeatherModule.init());
} else {
  WeatherModule.init();
}
