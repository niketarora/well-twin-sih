/**
 * Configuration settings for the CSS ML Model integration.
 * Enables switching between local backend proxy, direct Render endpoint, or staging.
 */

export const CSS_ML_CONFIG = {
  // Base URL for CSS model requests.
  // In browser runtime, requests default to the FastAPI backend proxy (/api/v1/css)
  // to avoid CORS 405 errors from Render preflight requests.
  API_BASE_URL:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CSS_MODEL_API_URL) ||
    '/api/v1/css',

  // Raw Render service endpoint for server-side or diagnostic reference
  DIRECT_RENDER_URL: 'https://cssmodel.onrender.com',

  // Render free tier startup can take 30-50s on cold start
  TIMEOUT_MS: 60000,

  // Conversion factors
  BARRELS_TO_M3: 0.1589873,
  M3_TO_BARRELS: 6.2898108,

  // Economic thresholds defined by Baghewala field operating standards
  ECONOMIC_CUTOFF_OSR: 0.18, // m³/t floor
  OPTIMAL_OSR_THRESHOLD: 0.30, // m³/t target

  // Model metadata default
  DEFAULT_MODEL_VERSION: 'css-field-month-surrogate-v1.0.0',
};
