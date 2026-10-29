# Weather Telemetry & Disaster Preparedness Architecture

## Overview
This document specifies the meteorological telemetry pipeline, algorithmic heat index calculation, and disaster preparedness workflows integrated into the St. Catherine's College web portal. The system adheres to official DOST-PAGASA (Philippine Atmospheric, Geophysical and Astronomical Services Administration) criteria.

## Station Profile & Coordinates
- **Monitoring Location**: Carcar City, Cebu, Philippines (Saint Catherine's College Campus)
- **Latitude**: `10.1100° N`
- **Longitude**: `123.6400° E`
- **Elevation**: Approximately 14 meters above mean sea level
- **Climate Classification**: Type III under the Coronas Climate Classification (no very pronounced maximum rain period, with a short dry season from March to May).

## Live Meteorological Feed Specification
To prevent fabricated weather data while bypassing cross-origin restrictions (`X-Frame-Options: SAMEORIGIN` enforced on PAGASA servers), real-time ambient parameters are retrieved from the verified Open-Meteo meteorological API:

- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Parameters**:
  - `latitude`: `10.11`
  - `longitude`: `123.64`
  - `current`: `temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,surface_pressure`
  - `daily`: `temperature_2m_max,temperature_2m_min,uv_index_max`
  - `timezone`: `Asia/Manila`

## Heat Index Calculation Engine (Rothfusz Regression)
The Heat Index is computed via the standard Rothfusz regression equation when ambient temperature is equal to or greater than 27.0°C (80°F):

```
HI = -42.379 + 2.04901523*T + 10.14333127*R - 0.22475541*T*R - 0.00683783*T^2
     - 0.05481717*R^2 + 0.00122874*T^2*R + 0.00085282*T*R^2 - 0.00000199*T^2*R^2
```
*(where T is ambient temperature in degrees Fahrenheit, and R is relative humidity percentage).*

### DOST-PAGASA Warning Classification Tiers
| Heat Index Range | Warning Tier | Health Implications | Academic Protocol |
| :--- | :--- | :--- | :--- |
| **Below 27.0°C** | Not Hazardous | Normal environmental conditions. | Standard classroom operations. |
| **27.0°C to 32.0°C** | Caution | Fatigue possible with prolonged exposure. | Regular classes; scheduled hydration breaks. |
| **33.0°C to 41.0°C** | Extreme Caution | Heat cramps and heat exhaustion possible. | Restrict outdoor physical education; ensure cross-ventilation. |
| **42.0°C to 51.0°C** | Danger | Heat stroke probable with continuing activity. | Suspend outdoor campus events; prepare modular transition. |
| **52.0°C and above** | Extreme Danger | Heat stroke is imminent. | Mandatory suspension of in-person classes per DepEd/CHED orders. |

## Tropical Cyclone & Emergency Advisory Links
The portal maintains direct links to verified official DOST-PAGASA portals:
- **PAGASA Main**: `https://www.pagasa.dost.gov.ph/`
- **Bagong PAGASA**: `https://bagong.pagasa.dost.gov.ph/`
- **PANaHON Radar & Satellite**: `https://panahon.gov.ph/`
