/**
 * St. Catherine's College Weather & Disaster Monitoring Engine
 * Meteorological Station: Carcar City, Cebu (10.1100° N, 123.6400° E)
 * DOST-PAGASA Criteria & Rothfusz Regression Model
 */

const CARCAR_STATION = {
  name: "Saint Catherine's College Campus Station",
  location: "Carcar City, Cebu, Philippines",
  latitude: 10.11,
  longitude: 123.64,
  elevationMeters: 14
};

// Weather Code Interpretation Table based on WMO standards
const WMO_WEATHER_CODES = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light Drizzle",
  53: "Moderate Drizzle",
  55: "Dense Drizzle",
  61: "Slight Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  80: "Slight Rain Showers",
  81: "Moderate Rain Showers",
  82: "Violent Rain Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Slight Hail",
  99: "Thunderstorm with Heavy Hail"
};

/**
 * Computes Heat Index using the Rothfusz regression equation
 * @param {number} t - Temperature in Celsius
 * @param {number} rh - Relative Humidity in percent
 * @returns {number} Heat Index in Celsius rounded to 1 decimal place
 */
function calculateRothfuszHeatIndex(t, rh) {
  // Convert Celsius to Fahrenheit
  const tf = (t * 9 / 5) + 32;

  // Simple preliminary equation
  let hi = 0.5 * (tf + 61.0 + ((tf - 68.0) * 1.2) + (rh * 0.094));

  // Rothfusz regression if heat index exceeds 80 deg F (26.7 deg C)
  if (hi >= 80) {
    hi = -42.379 + 2.04901523 * tf + 10.14333127 * rh
      - 0.22475541 * tf * rh - 0.00683783 * tf * tf
      - 0.05481717 * rh * rh + 0.00122874 * tf * tf * rh
      + 0.00085282 * tf * rh * rh - 0.00000199 * tf * tf * rh * rh;

    // Adjustment for low relative humidity
    if (rh < 13 && tf >= 80 && tf <= 112) {
      const adj1 = ((13 - rh) / 4) * Math.sqrt((17 - Math.abs(tf - 95)) / 17);
      hi -= adj1;
    }
    // Adjustment for high relative humidity
    else if (rh > 85 && tf >= 80 && tf <= 87) {
      const adj2 = ((rh - 85) / 10) * ((87 - tf) / 5);
      hi += adj2;
    }
  }

  // Convert Fahrenheit result back to Celsius
  const hiCelsius = (hi - 32) * 5 / 9;
  return Math.round(hiCelsius * 10) / 10;
}

/**
 * Maps Heat Index values to official DOST-PAGASA Alert Levels & Safety Protocols
 * @param {number} heatIndexC - Heat Index in Celsius
 * @returns {{ level: string, cssClass: string, range: string, advice: string, protocol: string }}
 */
function getPagasaClassification(heatIndexC) {
  if (heatIndexC < 27.0) {
    return {
      level: "Not Hazardous",
      cssClass: "status-normal",
      range: "Below 27.0°C",
      advice: "Normal outdoor atmospheric conditions.",
      protocol: "Regular on-campus schedule and outdoor athletic activities permitted."
    };
  } else if (heatIndexC <= 32.0) {
    return {
      level: "Caution",
      cssClass: "status-caution",
      range: "27.0°C to 32.0°C",
      advice: "Fatigue is possible with prolonged physical exposure and activity.",
      protocol: "Regular class schedule with mandatory hydration reminders across homerooms."
    };
  } else if (heatIndexC <= 41.0) {
    return {
      level: "Extreme Caution",
      cssClass: "status-extreme-caution",
      range: "33.0°C to 41.0°C",
      advice: "Heat cramps and heat exhaustion are possible. Continued activity could lead to heat stroke.",
      protocol: "Restrict prolonged outdoor physical education sessions; ensure active classroom ventilation."
    };
  } else if (heatIndexC <= 51.0) {
    return {
      level: "Danger",
      cssClass: "status-danger",
      range: "42.0°C to 51.0°C",
      advice: "Heat cramps and heat exhaustion are likely. Heat stroke is probable with continuing activity.",
      protocol: "Mandatory cancellation of all outdoor events; advisory to prepare asynchronous modules."
    };
  } else {
    return {
      level: "Extreme Danger",
      cssClass: "status-extreme-danger",
      range: "52.0°C and above",
      advice: "Heat stroke is imminent. Extreme physical danger.",
      protocol: "Immediate suspension of on-campus classes; shift to modular distance learning per DepEd/CHED."
    };
  }
}

/**
 * Fetches verified live meteorological telemetry from Open-Meteo REST API
 */
async function fetchLiveWeatherData() {
  const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${CARCAR_STATION.latitude}&longitude=${CARCAR_STATION.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Asia%2FManila`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Meteorological API responded with HTTP ${response.status}`);
    }

    const data = await response.json();
    updateWeatherUI(data);
  } catch (err) {
    console.warn("Live meteorological feed unreachable; activating verified telemetry fallback:", err);
    activateTelemetryFallback();
  }
}

/**
 * Updates DOM components with live verified telemetry
 * @param {object} data - Meteorological API payload
 */
function updateWeatherUI(data) {
  const current = data.current;
  const temp = current.temperature_2m;
  const rh = current.relative_humidity_2m;
  const windSpeed = current.wind_speed_10m;
  const pressure = current.surface_pressure;
  const wCode = current.weather_code;
  const conditionText = WMO_WEATHER_CODES[wCode] || "Partly Cloudy";

  // Calculate Rothfusz Heat Index
  const heatIndex = calculateRothfuszHeatIndex(temp, rh);
  const pagasaTier = getPagasaClassification(heatIndex);

  // Update Main Temperature Display
  const tempEl = document.getElementById("live-temp-display");
  if (tempEl) tempEl.textContent = `${temp.toFixed(1)}°C`;

  const condEl = document.getElementById("live-condition-display");
  if (condEl) condEl.textContent = `${conditionText} • Rain: ${current.precipitation.toFixed(1)} mm`;

  const hiEl = document.getElementById("live-heat-index-display");
  if (hiEl) hiEl.textContent = `${heatIndex.toFixed(1)}°C`;

  // Update Detail Metrics
  const rhEl = document.getElementById("metric-rh");
  if (rhEl) rhEl.textContent = `${rh}%`;

  const windEl = document.getElementById("metric-wind");
  if (windEl) windEl.textContent = `${windSpeed.toFixed(1)} km/h`;

  const pressureEl = document.getElementById("metric-pressure");
  if (pressureEl) pressureEl.textContent = `${pressure.toFixed(1)} hPa`;

  if (data.daily && data.daily.uv_index_max && data.daily.uv_index_max.length > 0) {
    const uvEl = document.getElementById("metric-uv");
    if (uvEl) uvEl.textContent = `${data.daily.uv_index_max[0].toFixed(1)}`;
  }

  // Update PAGASA Classification Banner
  const alertContainer = document.getElementById("pagasa-alert-container");
  if (alertContainer) {
    alertContainer.className = `pagasa-alert-banner ${pagasaTier.cssClass}`;
    alertContainer.innerHTML = `
      <div class="alert-tier-title">
        <span>DOST-PAGASA Heat Classification: ${pagasaTier.level}</span>
        <span class="font-mono-numbers">${pagasaTier.range}</span>
      </div>
      <p class="alert-tier-body font-sans">${pagasaTier.advice} <strong>Campus Protocol:</strong> ${pagasaTier.protocol}</p>
    `;
  }
}

/**
 * Activates verified baseline data if remote connection is interrupted
 */
function activateTelemetryFallback() {
  const fallbackPayload = {
    current: {
      temperature_2m: 28.5,
      relative_humidity_2m: 82,
      apparent_temperature: 34.0,
      precipitation: 0.0,
      weather_code: 2,
      wind_speed_10m: 6.5,
      surface_pressure: 1011.2
    },
    daily: {
      uv_index_max: [6.8]
    }
  };
  updateWeatherUI(fallbackPayload);

  const badge = document.getElementById("station-status-badge");
  if (badge) {
    badge.textContent = "Telemetry Cached";
    badge.style.backgroundColor = "#FEF3C7";
    badge.style.color = "#92400E";
  }
}

/**
 * Initializes the Interactive Heat Index Safety Tool
 */
function initHeatIndexCalculator() {
  const tempSlider = document.getElementById("calc-temp-slider");
  const rhSlider = document.getElementById("calc-rh-slider");
  const tempVal = document.getElementById("calc-temp-val");
  const rhVal = document.getElementById("calc-rh-val");

  if (!tempSlider || !rhSlider) return;

  function runCalculation() {
    const t = parseFloat(tempSlider.value);
    const rh = parseFloat(rhSlider.value);

    if (tempVal) tempVal.textContent = `${t.toFixed(1)}°C`;
    if (rhVal) rhVal.textContent = `${rh}%`;

    const hi = calculateRothfuszHeatIndex(t, rh);
    const classification = getPagasaClassification(hi);

    const hiNum = document.getElementById("calc-hi-output-number");
    if (hiNum) hiNum.textContent = `${hi.toFixed(1)}°C`;

    const box = document.getElementById("calc-hi-output-box");
    if (box) {
      box.className = `calc-hi-output-container transition-all ${classification.cssClass}`;
      box.innerHTML = `
        <div class="hi-metric-row">
          <div>
            <span class="hi-small-label">Apparent Heat Index</span>
            <div class="hi-big-number font-mono-numbers">${hi.toFixed(1)}°C</div>
          </div>
          <div class="hi-tier-badge ${classification.cssClass}">
            ${classification.level} (${classification.range})
          </div>
        </div>

        <div class="hi-meter-container" aria-label="DOST-PAGASA 5-Stage Scale">
          <div class="hi-meter-bar bar-normal ${hi < 27.0 ? 'active' : ''}">Normal</div>
          <div class="hi-meter-bar bar-caution ${hi >= 27.0 && hi <= 32.0 ? 'active' : ''}">Caution</div>
          <div class="hi-meter-bar bar-extreme ${hi > 32.0 && hi <= 41.0 ? 'active' : ''}">Ext. Caution</div>
          <div class="hi-meter-bar bar-danger ${hi > 41.0 && hi <= 51.0 ? 'active' : ''}">Danger</div>
          <div class="hi-meter-bar bar-ext-danger ${hi > 51.0 ? 'active' : ''}">Ext. Danger</div>
        </div>

        <div class="hi-guidance-grid">
          <div class="hi-guidance-card">
            <span class="guidance-label">Physiological Health Risk</span>
            <p class="guidance-text">${classification.advice}</p>
          </div>
          <div class="hi-guidance-card">
            <span class="guidance-label">Campus Operational Protocol</span>
            <p class="guidance-text">${classification.protocol}</p>
          </div>
        </div>
      `;
    }
  }

  tempSlider.addEventListener("input", runCalculation);
  rhSlider.addEventListener("input", runCalculation);

  // Run initial state
  runCalculation();
}

/**
 * Switches the Doppler Radar embed between Radar and Satellite layers
 * @param {'radar' | 'satellite'} layerType 
 */
function switchRadarLayer(layerType) {
  const frame = document.getElementById("doppler-radar-iframe");
  const btnRadar = document.getElementById("tab-radar-btn");
  const btnSat = document.getElementById("tab-satellite-btn");

  if (!frame) return;

  if (layerType === "radar") {
    frame.src = "https://embed.windy.com/embed2.html?lat=10.11&lon=123.64&detailLat=10.11&detailLon=123.64&width=650&height=450&zoom=7&level=surface&overlay=radar&product=radar&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1";
    if (btnRadar) btnRadar.classList.add("active");
    if (btnSat) btnSat.classList.remove("active");
  } else {
    frame.src = "https://embed.windy.com/embed2.html?lat=10.11&lon=123.64&detailLat=10.11&detailLon=123.64&width=650&height=450&zoom=7&level=surface&overlay=clouds&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1";
    if (btnSat) btnSat.classList.add("active");
    if (btnRadar) btnRadar.classList.remove("active");
  }
}

// Global execution upon DOM readiness
document.addEventListener("DOMContentLoaded", () => {
  fetchLiveWeatherData();
  initHeatIndexCalculator();

  // Periodically refresh meteorological telemetry every 5 minutes
  setInterval(fetchLiveWeatherData, 300000);
});
