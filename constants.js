/**
 * Carbon Shadow - Centralized Constants
 * Replace magic numbers across the app with these named exports.
 */

export const EMISSION_THRESHOLDS = {
  // Diet impacts (in tons/yr)
  DIET: {
    VEGAN: 2.5,
    VEGETARIAN: 3.5,
    AVERAGE: 5.5,
    MEAT: 7.5
  },
  // Commute impacts (in tons/yr)
  COMMUTE: {
    BIKE: 0,
    EV: 2.0,
    TRANSIT: 3.0,
    CAR: 7.0
  },
  // Flight impacts (in tons/yr)
  FLIGHTS: {
    NONE: 0,
    LOW: 3.0,
    HIGH: 8.0
  }
};

export const TWIN_SCENARIO = {
  BASE_SCORE: 4.2,
  MODIFIERS: {
    DIET_VEGAN: -1.0,
    DIET_MEAT: 1.5,
    COMMUTE_CAR: 2.0,
    COMMUTE_BIKE: -1.0,
    FLIGHTS_HIGH: 3.0
  },
  PROJECTIONS: {
    CURRENT_PATH_MULTIPLIER: 1.8,
    OPTIMAL_PATH_MULTIPLIER: -0.4
  }
};

export const UI_CONFIG = {
  GAUGE_MAX_SCORE: 50,
  GAUGE_PATH_LENGTH: 251, // From stroke-dasharray
  ANIMATION_DURATION_MS: 1000,
  SLOW_ANIMATION_MS: 2000
};

export const REWARDS = {
  SHIFT_CARBON_REDUCTION: 1.2,
  SHIFT_WALLET_POINTS: 25,
  ECHO_DEBT_REDUCTION: 0.5
};
