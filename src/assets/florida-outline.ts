/**
 * Florida state geographic boundary — derived from U.S. Census Bureau
 * cartographic boundary data (states-10m.json, 2017 edition via us-atlas v3).
 *
 * Source: https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json
 *         Census Bureau TIGER/Line cartographic boundaries, FIPS code 12.
 *         Extracted via scripts/extract-florida.mjs using Mercator-like
 *         projection centered on Florida (cos(~28N)) to preserve proportions.
 *
 * 354-point mainland polygon + 17-point Keys polygon.
 * viewBox: 0 0 400 386
 *
 * FPL service-territory overlay is labeled as approximate.
 * A county-based approximation is used because precise sub-county FPL
 * boundary data is not publicly available in machine-readable form.
 * The overlay should be clearly labeled "Approximate FPL Service Territory."
 */

// ── Full Florida state outline (mainland, 354 points) ───────
export const FLORIDA_MAINLAND_PATH =
  'M 141.5,10 L 142.6,13.8 L 144.6,16.3 L 144.9,20.4 L 146,24 L 148.5,26.3 ' +
  'L 172.9,27.5 L 219.7,30.2 L 256.7,32.7 L 280.9,34.4 L 280,35 L 280.4,37.8 ' +
  'L 281.6,39.1 L 281.1,42.5 L 283.1,46.2 L 289.7,45.5 L 289.7,41.9 L 290.8,39.6 ' +
  'L 291.3,33.9 L 289.2,29.5 L 289.9,26.6 L 289.7,24.2 L 291.1,23.4 L 290.4,22.3 ' +
  'L 292.6,22.6 L 294.2,19.8 L 296.9,20.1 L 298.1,21.7 L 301.2,21.9 L 304.4,23.2 ' +
  'L 305.7,24.4 L 311.6,25.4 L 314.6,26.2 L 317.2,25.5 L 319.5,26.4 L 320.2,27 ' +
  'L 319.5,32.5 L 320,37 L 319.3,38 L 321.1,39.3 L 321.8,43.9 L 322,49.3 ' +
  'L 326.1,68.2 L 328.5,74.4 L 328.5,76.9 L 333.5,91.5 L 339.2,105.5 L 344.4,116.5 ' +
  'L 356.1,136.5 L 362.9,146.2 L 363.6,149.2 L 365.4,153.3 L 362.2,156 L 361.5,158.6 ' +
  'L 361.3,162.8 L 362.2,169.1 L 363.3,173.8 L 366.1,180.8 L 372.4,193.8 L 375.1,201.9 ' +
  'L 376,205.9 L 376.9,207.4 L 378.9,214.1 L 381.9,221.5 L 383.5,224.7 L 384.6,229.2 ' +
  'L 386.9,234.5 L 390,247 L 389.8,258.4 L 388.6,266.9 L 387.7,277 L 387.1,278.8 ' +
  'L 385.7,292.7 L 385.7,300.9 L 385.2,304.7 L 383.9,308.7 L 383.9,310.8 L 382.8,309.7 ' +
  'L 383.4,307.2 L 382.5,306.2 L 379.6,307.5 L 377.8,312.4 L 376.7,313.2 L 376.5,316.3 ' +
  'L 375.1,318.3 L 374.7,322 L 375.6,323.6 L 375.3,325.9 L 376.4,326.6 L 374.9,329.2 ' +
  'L 373.5,329.8 L 373.3,332.2 L 377.1,330.3 L 381.6,320.9 L 382.8,318.9 L 382.8,320.9 ' +
  'L 381.4,324.9 L 375.3,335.7 L 373.7,339.7 L 369.2,344.2 L 363.1,350.9 L 358.8,354.1 ' +
  'L 358.2,353.5 L 364.3,347.6 L 366.9,345.7 L 368.1,343.1 L 368.6,339.2 L 369.5,337.6 ' +
  'L 368.5,336.5 L 366.9,337 L 365.6,335.8 L 364.5,336.7 L 358.4,337.7 L 355.9,339.7 ' +
  'L 354.3,340 L 351.1,337.8 L 347.8,338.5 L 346.6,340.4 L 341.7,341.3 L 337.6,341.6 ' +
  'L 334.6,339.1 L 333.1,335.8 L 333.5,332 L 334.6,329.1 L 335.6,329.2 L 335.3,326.8 ' +
  'L 333.1,322.1 L 331.2,319.9 L 331.5,318.2 L 330.1,315.2 L 328.1,313.7 L 327.2,309.5 ' +
  'L 326.1,308.7 L 324.2,309.4 L 322.5,304.5 L 318.2,303 L 318.1,302.2 L 314.3,300.4 ' +
  'L 310.5,297.7 L 308.5,298.4 L 307.1,300.2 L 304.2,294.1 L 301.5,287 L 300.7,278.6 ' +
  'L 299.4,273.3 L 298.1,270.6 L 293.1,265.1 L 291.1,264.6 L 291,262.1 L 288.8,261 ' +
  'L 288.8,264.1 L 286.3,264.6 L 286.1,261.4 L 284.7,256 L 282.5,253.5 L 283.1,252.3 ' +
  'L 285.4,252.5 L 287,254.4 L 289,246.7 L 288.6,242.5 L 287.2,241.8 L 287.2,239.9 ' +
  'L 288.6,239.4 L 287.9,237.9 L 285.8,238.1 L 284.9,239.7 L 282.9,240.2 L 284.3,247.4 ' +
  'L 282.7,248.4 L 279.1,248.9 L 278.2,251.3 L 278.2,247.7 L 277.1,245.3 L 274.1,240.7 ' +
  'L 269.4,232.1 L 267.8,227.6 L 264.4,220.8 L 259.6,213.6 L 257.1,210.9 L 256.3,208.1 ' +
  'L 254.5,205.1 L 256.3,206 L 256.5,207.5 L 259.2,206 L 261,202.6 L 263.2,201.2 ' +
  'L 265.5,196.5 L 267.8,194.8 L 267.5,193.7 L 270,192.4 L 271.9,188.4 L 271,184.7 ' +
  'L 267.1,183.7 L 268,189.2 L 264.1,187.7 L 265.1,186.1 L 264.9,182.9 L 264.1,181.1 ' +
  'L 257.2,177.6 L 257.4,180.8 L 255.4,182.1 L 257.4,183.9 L 260.3,184.2 L 262.3,189.5 ' +
  'L 260.5,191.6 L 260.5,194.6 L 259.7,195.9 L 256,196.2 L 255.4,197.7 L 256.7,199.6 ' +
  'L 255.1,201 L 254.4,199.1 L 254.7,195.1 L 252.2,190.9 L 250.6,189.7 L 249.2,186.9 ' +
  'L 250.2,178.1 L 249.3,174.9 L 248.6,166.9 L 250.2,166.9 L 250.2,171.4 L 251,175.7 ' +
  'L 252.6,176 L 251.9,168.6 L 253.5,166.8 L 253.6,164.8 L 255.1,162.7 L 255.1,160.9 ' +
  'L 256.3,158.4 L 256.3,156.5 L 258,154.3 L 258.1,149.9 L 259,145.8 L 258,142.6 ' +
  'L 258.3,139.9 L 256,138.5 L 256.7,136.5 L 255.1,131.2 L 257.2,128.1 L 253.5,122.8 ' +
  'L 254,121.3 L 252.6,118.6 L 250.8,118.5 L 251.7,116.9 L 251.5,114.5 L 250.2,113.9 ' +
  'L 241.8,112.8 L 240.2,115.2 L 238.9,115.4 L 237.3,110.6 L 237.9,108.4 L 235.3,106.9 ' +
  'L 233.2,106.4 L 232.8,103.4 L 231.6,100.6 L 229.6,98.4 L 226.9,98.1 L 226,96 ' +
  'L 221.7,93.6 L 221.7,88.3 L 221,85 L 218.8,84.7 L 217,82.8 L 214.7,82 L 212.4,79.1 ' +
  'L 212.4,77 L 210.8,75.3 L 209.9,72.9 L 207.4,70.7 L 202.3,67.7 L 195.2,64.2 ' +
  'L 190.5,60.6 L 188.5,60.7 L 183.9,62.3 L 178.3,60.9 L 178.1,62.6 L 173.4,65.9 ' +
  'L 175.1,70.7 L 174.5,72.1 L 172.7,72.4 L 170,71.7 L 169.1,70.4 L 164.8,71.5 ' +
  'L 159.3,75 L 147.6,81.4 L 146.5,81.3 L 147.8,79.2 L 146,78.6 L 144.7,80.5 ' +
  'L 142,82.5 L 135.6,82.5 L 137.9,84.8 L 138.3,86.7 L 141.2,87.7 L 146.5,85.2 ' +
  'L 151.7,83.2 L 156.6,79.2 L 157.1,79.8 L 152.8,83.8 L 147.8,85.8 L 141.5,89 ' +
  'L 139.4,89.7 L 137.6,88.1 L 134.7,87.1 L 130.6,84.6 L 127.2,84.2 L 124.1,85.6 ' +
  'L 121.8,81 L 120.9,75.3 L 122.3,73.2 L 122.3,78.3 L 123.4,82.7 L 124.6,83.8 ' +
  'L 126.4,81.9 L 126.6,77.2 L 123.6,72.1 L 120.3,69.2 L 117.3,68.6 L 114.6,66.7 ' +
  'L 111.7,63.2 L 106.9,60.9 L 102.9,57.6 L 95.6,53 L 87.1,49.3 L 76.7,45.9 ' +
  'L 71.2,45 L 60.1,44.1 L 54.1,44.3 L 45.7,45.5 L 34,47.9 L 28.3,48.6 ' +
  'L 27,48.2 L 15.7,50.6 L 18.4,49.4 L 17.2,48.2 L 18.8,47.5 L 20.2,43.5 ' +
  'L 23.5,41.8 L 19.9,39.3 L 19.3,36.7 L 22,31.7 L 21.5,28.4 L 15,24.5 ' +
  'L 14.5,22.5 L 10.4,18.7 L 10,17.6 L 12.3,12 L 11.8,10.2 L 41.6,10.1 ' +
  'L 65.8,10.4 L 97,10.4 L 116.8,10.2 L 129.5,10 L 141.5,10 Z';

// ── Florida Keys (17-point polygon) ─────────────────────────
export const FLORIDA_KEYS_PATH =
  'M 301,372.6 L 304.4,367.5 L 308,365.2 L 312.5,363.2 L 313,362 L 319.5,358.8 ' +
  'L 326.3,362.1 L 327,364.6 L 329.5,366.7 L 328.8,367.2 L 321.6,369.5 L 321.1,368.2 ' +
  'L 316.3,368.5 L 315.7,369.6 L 307.5,373.2 L 301,373.9 L 301,372.6 Z';

// viewBox preserving geographic aspect ratio (Mercator @ ~28N)
export const FLORIDA_VIEWBOX = '0 0 400 386';

// ── Approximate FPL service-territory overlay ────────────────
// Based on FPL's 43-county service area per:
//   - FPL Transmission Service Territory (consent-agreement-map.pdf)
//   - Florida PSC General Service Area Map, Aug 19 2024
//   - FPL 10-Year Site Plan 2024-2033 (Florida PSC filing)
//
// This is a county-based APPROXIMATION. FPL does not serve entire
// counties in all cases. Sub-county boundary data is not publicly
// available in machine-readable form.
//
// Northwest region (former Gulf Power, 14 counties):
//   Escambia, Santa Rosa, Okaloosa, Walton, Holmes, Washington,
//   Bay, Calhoun, Gulf, Jackson, Gadsden, Leon, Jefferson, Madison
//
// Main region (29 counties):
//   Nassau, Baker, Duval(partial), St.Johns, Clay, Putnam, Flagler,
//   Volusia, Seminole, Brevard, Indian River, St.Lucie, Okeechobee,
//   Martin, Palm Beach, Broward, Miami-Dade, Monroe, Collier, Lee,
//   Charlotte, Hendry, Glades, Highlands, Hardee, DeSoto, Sarasota,
//   Manatee, Alachua, Columbia, Suwannee, Union, Bradford
//
// Central FL gap (NOT FPL): Orange, Osceola, Hillsborough, Pinellas,
//   Polk, Pasco, Lake, Sumter, Citrus, Hernando, Marion, Levy, etc.

// Northwest FL — Panhandle region (from AL border to ~Madison/Leon)
// Approximate polygon covering the panhandle counties
export const FPL_NORTHWEST_PATH =
  'M 11.8,10.2 L 41.6,10.1 L 65.8,10.4 L 97,10.4 L 116.8,10.2 L 129.5,10 ' +
  'L 141.5,10 L 142.6,13.8 L 144.6,16.3 L 144.9,20.4 L 146,24 L 148.5,26.3 ' +
  'L 172.9,27.5 L 180,28 ' +
  // Southern boundary — roughly south of I-10/panhandle counties
  'L 178,44 L 170,52 L 155,58 L 140,62 L 120,66 L 100,62 ' +
  'L 80,57 L 60,50 L 40,50 L 28.3,48.6 ' +
  'L 27,48.2 L 15.7,50.6 L 18.4,49.4 L 17.2,48.2 L 18.8,47.5 L 20.2,43.5 ' +
  'L 23.5,41.8 L 19.9,39.3 L 19.3,36.7 L 22,31.7 L 21.5,28.4 L 15,24.5 ' +
  'L 14.5,22.5 L 10.4,18.7 L 10,17.6 L 12.3,12 L 11.8,10.2 Z';

// Main FPL territory — east coast, southeast, southwest, and south FL
// Eastern boundary follows the actual coastline from Nassau (northeast)
// Western boundary runs inland where FPL territory meets non-FPL utilities
export const FPL_MAIN_PATH =
  // Northeast — Nassau/Duval south through east coast
  'M 280.9,34.4 L 280,35 L 280.4,37.8 L 281.6,39.1 L 281.1,42.5 L 283.1,46.2 ' +
  'L 289.7,45.5 L 289.7,41.9 L 290.8,39.6 L 291.3,33.9 L 289.2,29.5 L 289.9,26.6 ' +
  'L 289.7,24.2 L 291.1,23.4 L 290.4,22.3 L 292.6,22.6 L 294.2,19.8 L 296.9,20.1 ' +
  'L 298.1,21.7 L 301.2,21.9 L 304.4,23.2 L 305.7,24.4 L 311.6,25.4 L 314.6,26.2 ' +
  'L 317.2,25.5 L 319.5,26.4 L 320.2,27 L 319.5,32.5 L 320,37 L 319.3,38 ' +
  'L 321.1,39.3 L 321.8,43.9 L 322,49.3 L 326.1,68.2 L 328.5,74.4 L 328.5,76.9 ' +
  'L 333.5,91.5 L 339.2,105.5 L 344.4,116.5 L 356.1,136.5 L 362.9,146.2 L 363.6,149.2 ' +
  'L 365.4,153.3 L 362.2,156 L 361.5,158.6 L 361.3,162.8 L 362.2,169.1 L 363.3,173.8 ' +
  'L 366.1,180.8 L 372.4,193.8 L 375.1,201.9 L 376,205.9 L 376.9,207.4 L 378.9,214.1 ' +
  'L 381.9,221.5 L 383.5,224.7 L 384.6,229.2 L 386.9,234.5 L 390,247 L 389.8,258.4 ' +
  'L 388.6,266.9 L 387.7,277 L 387.1,278.8 L 385.7,292.7 L 385.7,300.9 L 385.2,304.7 ' +
  'L 383.9,308.7 L 383.9,310.8 L 382.8,309.7 L 383.4,307.2 L 382.5,306.2 L 379.6,307.5 ' +
  'L 377.8,312.4 L 376.7,313.2 L 376.5,316.3 L 375.1,318.3 L 374.7,322 L 375.6,323.6 ' +
  'L 375.3,325.9 L 376.4,326.6 L 374.9,329.2 L 373.5,329.8 L 373.3,332.2 L 377.1,330.3 ' +
  'L 381.6,320.9 L 382.8,318.9 L 382.8,320.9 L 381.4,324.9 L 375.3,335.7 L 373.7,339.7 ' +
  'L 369.2,344.2 L 363.1,350.9 L 358.8,354.1 L 358.2,353.5 ' +
  // Keys
  'L 351.1,337.8 L 347.8,338.5 L 346.6,340.4 L 341.7,341.3 L 337.6,341.6 ' +
  'L 334.6,339.1 L 333.1,335.8 L 333.5,332 L 334.6,329.1 L 335.6,329.2 ' +
  'L 335.3,326.8 L 333.1,322.1 L 331.2,319.9 L 331.5,318.2 L 330.1,315.2 ' +
  'L 328.1,313.7 L 327.2,309.5 L 326.1,308.7 L 324.2,309.4 L 322.5,304.5 ' +
  'L 318.2,303 L 318.1,302.2 L 314.3,300.4 L 310.5,297.7 L 308.5,298.4 ' +
  'L 307.1,300.2 L 304.2,294.1 L 301.5,287 L 300.7,278.6 L 299.4,273.3 ' +
  'L 298.1,270.6 L 293.1,265.1 L 291.1,264.6 ' +
  // Southwest coast — Naples/Collier up through Sarasota/Manatee
  'L 269.4,232.1 L 267.8,227.6 L 264.4,220.8 L 259.6,213.6 L 257.1,210.9 ' +
  'L 256.3,208.1 L 254.5,205.1 ' +
  // Western FPL boundary — Manatee/Sarasota (FPL) vs Hillsborough (not FPL)
  'L 253,200 L 252,195 L 253,188 L 255,180 L 258,170 ' +
  // Inland boundary — FPL serves Hardee/Highlands/DeSoto but not Polk/Hillsborough
  'L 260,160 L 262,150 L 265,140 ' +
  // North boundary — FPL serves Alachua/Putnam but not Marion/Lake/Orange
  'L 268,130 L 270,120 L 268,110 L 265,100 ' +
  // Connect through north-central FL (Suwannee/Columbia/Baker/Nassau)
  'L 262,90 L 265,80 L 270,65 L 275,50 L 278,40 L 280.9,34.4 Z';

// Tower position (in the main FPL territory, east coast near Space Coast)
export const TOWER_POSITION = { x: 340, y: 130 };
