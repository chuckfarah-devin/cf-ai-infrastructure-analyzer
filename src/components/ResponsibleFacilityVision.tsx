import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CircleDashed,
  ExternalLink,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Shield,
  TreePine,
} from 'lucide-react';
import type { CandidateSite } from '../data/siteExplorerData';
import {
  getFacilityVisionProfile,
  type FacilityVisionPerspective,
} from '../data/facilityVisionData';

interface ResponsibleFacilityVisionProps {
  site: CandidateSite;
  onBack: () => void;
  onOpenSatellite: () => void;
}

function ConceptBadge() {
  return (
    <g className="vision-scene-badge">
      <rect x="18" y="18" rx="7" width="308" height="34" />
      <text x="34" y="40">Illustrative Concept — Not a Site Plan</text>
    </g>
  );
}

function FinArray({
  x,
  y,
  count,
  width,
  gap,
  height,
  color = '#d8d0c3',
  accent = '#a8845f',
}: {
  x: number;
  y: number;
  count: number;
  width: number;
  gap: number;
  height: number;
  color?: string;
  accent?: string;
}) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <rect
          key={i}
          x={x + i * (width + gap)}
          y={y + (i % 5 === 0 ? 2 : 0)}
          width={width}
          height={height - (i % 7 === 0 ? 6 : 0)}
          rx="1"
          fill={i % 6 === 0 ? accent : color}
          opacity={i % 6 === 0 ? 0.88 : 0.96}
        />
      ))}
    </g>
  );
}

function NativeTree({
  x,
  y,
  scale = 1,
  canopy = '#3f7d55',
}: {
  x: number;
  y: number;
  scale?: number;
  canopy?: string;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0 0 C-3 -24 4 -45 0 -69" fill="none" stroke="#5f4631" strokeWidth="8" strokeLinecap="round" />
      <ellipse cx="-28" cy="-72" rx="43" ry="28" fill={canopy} />
      <ellipse cx="18" cy="-86" rx="49" ry="32" fill="#4d8a61" />
      <ellipse cx="2" cy="-52" rx="55" ry="30" fill="#386f4d" />
      <ellipse cx="45" cy="-62" rx="33" ry="22" fill="#5f986f" opacity="0.85" />
    </g>
  );
}

function PalmTree({
  x,
  y,
  scale = 1,
  lean = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  lean?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean}) scale(${scale})`}>
      <path d="M0 0 C-7 -42 8 -82 0 -126" fill="none" stroke="#8b7358" strokeWidth="10" strokeLinecap="round" />
      {[-74, -46, -18, 16, 48, 78].map(angle => (
        <path
          key={angle}
          d="M0 -126 C-7 -145 -25 -153 -57 -151"
          fill="none"
          stroke="#397653"
          strokeWidth="8"
          strokeLinecap="round"
          transform={`rotate(${angle} 0 -126)`}
        />
      ))}
      <circle cx="0" cy="-126" r="7" fill="#6f5a42" />
    </g>
  );
}

function ShieldedLight({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="-72" width="6" height="72" rx="3" fill="#475569" />
      <path d="M-15 -75 L15 -75 L10 -64 L-10 -64 Z" fill="#334155" />
      <path d="M-10 -64 L10 -64 L21 -18 L-21 -18 Z" fill="#facc15" opacity="0.08" />
      <rect x="-10" y="-64" width="20" height="4" rx="2" fill="#facc15" opacity="0.45" />
    </g>
  );
}

function ReedCluster({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} stroke="#5c8f60" strokeLinecap="round">
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${i * 7} 0 C${i * 7 - 8} -${18 + (i % 3) * 8} ${i * 7 + 6} -${35 + (i % 4) * 9} ${i * 7 + (i % 2 ? 14 : -7)} -${52 + (i % 5) * 6}`}
          strokeWidth={i % 3 === 0 ? 4 : 3}
          fill="none"
          opacity={0.78 + (i % 2) * 0.15}
        />
      ))}
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={`seed-${i}`} cx={8 + i * 14} cy={-50 - i * 5} rx="4" ry="9" fill="#80684f" stroke="none" />
      ))}
    </g>
  );
}

function NeighborhoodScene() {
  const finColumns = Array.from({ length: 18 }, (_, i) => 335 + i * 18);
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="neighborhood-vision-title">
      <title id="neighborhood-vision-title">Illustrative neighborhood-facing facility concept</title>
      <defs>
        <linearGradient id="nb-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc5ea" />
          <stop offset="0.6" stopColor="#d9edf8" />
          <stop offset="1" stopColor="#f3ead9" />
        </linearGradient>
        <linearGradient id="nb-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a4d" />
          <stop offset="1" stopColor="#5b8799" />
        </linearGradient>
        <pattern id="nb-masonry" width="24" height="16" patternUnits="userSpaceOnUse">
          <rect width="24" height="16" fill="#b98d63" />
          <path d="M0 0 H24 M0 8 H24 M8 0 V8 M18 8 V16" stroke="#966f4f" strokeWidth="0.7" opacity="0.48" />
        </pattern>
        <pattern id="nb-perforated" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#cfd5d9" />
          <circle cx="6" cy="6" r="1.7" fill="#8b949d" opacity="0.55" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#nb-sky)" />
      <circle cx="815" cy="78" r="36" fill="#fff6d7" opacity="0.6" />

      <path d="M0 344 C140 322 255 330 380 346 C522 364 663 339 806 356 C890 366 934 358 960 350 L960 540 L0 540 Z" fill="#d7d0c3" />
      <path d="M0 424 C190 405 377 418 515 432 C696 450 826 424 960 435 L960 540 L0 540 Z" fill="#bfc7bd" />
      <path d="M0 462 C220 446 440 462 654 474 C790 482 880 470 960 475 L960 540 L0 540 Z" fill="#989b91" />

      {/* Left articulated masonry volume */}
      <polygon points="70,246 320,205 320,414 70,443" fill="#a97851" />
      <polygon points="82,255 308,219 308,407 82,431" fill="url(#nb-masonry)" />
      <polygon points="70,246 320,205 336,218 89,260" fill="#75533e" />
      <path d="M99 283 L289 250 M99 321 L289 291 M99 360 L289 334" stroke="#7e5b43" strokeWidth="2" opacity="0.35" />
      <rect x="139" y="337" width="52" height="76" rx="3" fill="#263f4a" />
      <path d="M129 331 H203 L195 344 H137 Z" fill="#7a5d47" />

      {/* Main composed facade */}
      <rect x="300" y="126" width="428" height="302" rx="3" fill="#d9d4ca" />
      <rect x="300" y="312" width="428" height="116" fill="url(#nb-masonry)" />
      <rect x="316" y="143" width="396" height="150" rx="3" fill="#304b58" />
      <FinArray x={323} y={136} count={22} width={9} gap={8.8} height={166} color="#d4c4aa" accent="#a67c52" />
      {finColumns.slice(1, -1).map((x, i) => (
        <rect key={x} x={x} y={153 + (i % 3) * 8} width="9" height={86 + (i % 4) * 12} fill="url(#nb-glass)" opacity="0.52" />
      ))}
      <path d="M282 125 H744 L724 145 H302 Z" fill="#7d6754" />
      <path d="M310 298 H722 L702 315 H330 Z" fill="#846b55" />

      {/* Entrance and human-scale canopy */}
      <rect x="468" y="340" width="94" height="88" rx="4" fill="#243b45" />
      <rect x="486" y="354" width="58" height="74" fill="#314f5b" opacity="0.8" />
      <path d="M438 331 H591 L571 350 H456 Z" fill="#735844" />
      <path d="M473 382 H556" stroke="#d8c8aa" strokeWidth="2" opacity="0.7" />

      {/* Right screened mechanical volume */}
      <polygon points="724,177 866,219 866,423 724,428" fill="#a9967f" />
      <polygon points="739,192 850,227 850,405 739,413" fill="url(#nb-perforated)" />
      <path d="M745 204 L845 237 M745 237 L845 270 M745 270 L845 303 M745 303 L845 336" stroke="#87919a" strokeWidth="2" opacity="0.55" />
      <rect x="756" y="326" width="70" height="50" rx="5" fill="#68747c" opacity="0.5" />
      <circle cx="778" cy="350" r="14" fill="#4f5c65" opacity="0.65" />
      <circle cx="806" cy="350" r="14" fill="#4f5c65" opacity="0.65" />

      {/* Planting beds, path, and people-scale cues */}
      <path d="M52 431 C172 415 285 423 393 439 C540 462 715 433 900 452 L900 486 C710 467 542 490 390 468 C265 450 161 446 52 461 Z" fill="#5e7d54" />
      <path d="M0 472 C215 454 415 475 612 489 C755 499 858 485 960 492 L960 540 L0 540 Z" fill="#d0c4ae" />
      <path d="M0 507 C260 493 500 510 960 503 L960 540 L0 540 Z" fill="#8d918a" opacity="0.65" />
      <NativeTree x={116} y={438} scale={0.78} />
      <NativeTree x={244} y={435} scale={0.58} canopy="#4d8a5b" />
      <NativeTree x={635} y={438} scale={0.7} canopy="#3f7654" />
      <PalmTree x={885} y={456} scale={0.74} lean={5} />
      <ShieldedLight x={414} y={470} />
      <ShieldedLight x={688} y={467} />
      <path d="M183 468 q4 -21 11 -21 q8 0 11 21 Z" fill="#384653" opacity="0.75" />
      <circle cx="194" cy="441" r="7" fill="#384653" opacity="0.75" />
      <path d="M587 469 q4 -19 10 -19 q7 0 10 19 Z" fill="#31424e" opacity="0.7" />
      <circle cx="597" cy="443" r="6" fill="#31424e" opacity="0.7" />

      <g className="vision-scene-note">
        <rect x="578" y="489" rx="6" width="358" height="28" />
        <text x="591" y="508">Symbolic public edge — no setback shown</text>
      </g>
      <ConceptBadge />
    </svg>
  );
}

function LandscapeScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="landscape-vision-title">
      <title id="landscape-vision-title">Illustrative landscape-integrated facility concept</title>
      <defs>
        <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#79b7de" />
          <stop offset="0.62" stopColor="#cfe9f5" />
          <stop offset="1" stopColor="#f4ead3" />
        </linearGradient>
        <linearGradient id="ls-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e95a3" />
          <stop offset="1" stopColor="#2e6875" />
        </linearGradient>
        <pattern id="ls-panel" width="30" height="18" patternUnits="userSpaceOnUse">
          <rect width="30" height="18" fill="#b7a58b" />
          <path d="M0 0 V18 M15 0 V18" stroke="#d9cfbd" strokeWidth="1" opacity="0.65" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#ls-sky)" />
      <path d="M0 290 C138 268 239 278 360 292 C497 308 645 277 801 300 C885 313 926 303 960 294 L960 540 L0 540 Z" fill="#8fa77a" />

      {/* Distant native canopy */}
      <path d="M0 286 C50 247 107 262 152 280 C199 242 269 251 317 282 C379 241 463 250 514 287 C581 245 670 253 723 288 C780 249 864 253 960 292 L960 333 L0 333 Z" fill="#557f59" opacity="0.8" />

      {/* Articulated low campus forms */}
      <g transform="translate(220 182)">
        <polygon points="0,80 66,56 218,56 254,80" fill="#8b7660" />
        <rect x="15" y="80" width="205" height="104" rx="4" fill="#d8d1c1" />
        <rect x="15" y="133" width="205" height="51" fill="url(#ls-panel)" />
        <rect x="30" y="91" width="175" height="31" fill="#415f66" opacity="0.85" />
        <FinArray x={35} y={88} count={11} width={8} gap={7} height={42} color="#d7c6a8" accent="#9b744d" />
        <path d="M8 126 H228 L216 138 H20 Z" fill="#79614e" />
        <rect x="57" y="142" width="42" height="42" fill="#2e4b54" opacity="0.8" />
      </g>
      <g transform="translate(484 148)">
        <polygon points="0,95 36,72 244,72 286,95" fill="#756654" />
        <rect x="18" y="95" width="244" height="141" rx="4" fill="#c9c4b9" />
        <rect x="18" y="163" width="244" height="73" fill="url(#ls-panel)" />
        <rect x="34" y="110" width="212" height="39" fill="#3c5963" />
        <FinArray x={42} y={105} count={15} width={7} gap={7} height={55} color="#dccfb8" accent="#a77c51" />
        <polygon points="18,95 36,72 58,72 40,95" fill="#a68b6f" />
        <polygon points="226,72 250,72 232,95 208,95" fill="#a68b6f" />
        <path d="M28 151 H252 L238 165 H42 Z" fill="#75604d" />
      </g>
      <g transform="translate(675 202)">
        <polygon points="0,56 42,36 174,36 208,56" fill="#82715c" />
        <rect x="14" y="56" width="178" height="93" rx="4" fill="#d9d4c8" />
        <rect x="14" y="104" width="178" height="45" fill="url(#ls-panel)" />
        <rect x="29" y="66" width="148" height="27" fill="#46636b" />
        <FinArray x={36} y={64} count={9} width={7} gap={8} height={36} color="#ded0b9" accent="#99734e" />
      </g>

      {/* Landscape edge and symbolic connection */}
      <path d="M0 340 C136 319 250 335 365 354 C485 374 650 343 790 365 C869 377 920 371 960 360 L960 540 L0 540 Z" fill="#6f925f" />
      <path d="M0 386 C159 367 294 384 420 402 C585 425 735 393 960 410 L960 540 L0 540 Z" fill="#93a86f" />
      <path d="M0 440 C160 410 320 430 465 452 C642 478 792 445 960 464 L960 540 L0 540 Z" fill="url(#ls-water)" />
      <path d="M0 440 C171 416 327 434 468 454 C650 480 801 449 960 466" fill="none" stroke="#c8e5d4" strokeWidth="5" opacity="0.45" />

      <path d="M162 356 C266 324 345 352 434 338 C517 325 607 316 714 344 C782 361 841 356 900 335" fill="none" stroke="#e5f5cf" strokeWidth="11" strokeDasharray="18 14" opacity="0.72" strokeLinecap="round" />
      <path d="M162 356 C266 324 345 352 434 338 C517 325 607 316 714 344 C782 361 841 356 900 335" fill="none" stroke="#3f7d55" strokeWidth="2.5" strokeDasharray="9 14" opacity="0.9" />
      <g className="vision-scene-note landscape-note">
        <rect x="122" y="316" rx="6" width="276" height="27" />
        <text x="135" y="334">Potential habitat connection — location TBD</text>
      </g>

      {/* Stormwater planting and native edge */}
      <ReedCluster x={66} y={512} scale={0.9} />
      <ReedCluster x={170} y={526} scale={0.72} />
      <ReedCluster x={425} y={521} scale={0.82} />
      <ReedCluster x={700} y={522} scale={0.75} />
      <ReedCluster x={815} y={517} scale={0.88} />
      <NativeTree x={102} y={363} scale={0.64} />
      <NativeTree x={382} y={365} scale={0.5} canopy="#5a8c5f" />
      <NativeTree x={845} y={369} scale={0.67} />
      <PalmTree x={910} y={430} scale={0.82} lean={-7} />
      <PalmTree x={42} y={430} scale={0.64} lean={6} />

      {/* A few subtle shielded path lights */}
      <ShieldedLight x={300} y={414} />
      <ShieldedLight x={764} y={414} />

      <g className="vision-scene-note">
        <rect x="548" y="493" rx="6" width="388" height="28" />
        <text x="561" y="512">Environmental features symbolic — no mapped boundaries</text>
      </g>
      <ConceptBadge />
    </svg>
  );
}

function Transformer({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="18" width="72" height="48" rx="6" fill="#5d6d75" />
      <rect x="10" y="8" width="52" height="22" rx="4" fill="#71838b" />
      {[16, 31, 46].map(cx => (
        <g key={cx}>
          <rect x={cx} y="-9" width="5" height="18" fill="#475a62" />
          <ellipse cx={cx + 2.5} cy="-9" rx="9" ry="4" fill="#8ea0a8" />
        </g>
      ))}
      <path d="M8 37 H64 M8 48 H64" stroke="#42515a" strokeWidth="3" />
    </g>
  );
}

function CoolingUnit({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="0" width="112" height="72" rx="7" fill="#788891" />
      <rect x="9" y="9" width="94" height="54" rx="5" fill="#5f727b" />
      {[25, 56, 87].map(cx => (
        <g key={cx}>
          <circle cx={cx} cy="36" r="18" fill="#465862" />
          <circle cx={cx} cy="36" r="12" fill="#71828a" />
          <path d={`M${cx} 36 L${cx + 11} 28 M${cx} 36 L${cx - 10} 27 M${cx} 36 L${cx + 2} 48`} stroke="#3d4c55" strokeWidth="3" />
        </g>
      ))}
    </g>
  );
}

function FacilityScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="facility-vision-title">
      <title id="facility-vision-title">Illustrative facility design concept with utility infrastructure</title>
      <defs>
        <linearGradient id="fs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#83b9dd" />
          <stop offset="0.63" stopColor="#d8ebf4" />
          <stop offset="1" stopColor="#efe5d4" />
        </linearGradient>
        <pattern id="fs-masonry" width="26" height="18" patternUnits="userSpaceOnUse">
          <rect width="26" height="18" fill="#ad815e" />
          <path d="M0 0 H26 M0 9 H26 M9 0 V9 M19 9 V18" stroke="#865f45" strokeWidth="0.75" opacity="0.5" />
        </pattern>
        <pattern id="fs-screen" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#b6bec3" />
          <rect x="2" y="2" width="2.3" height="2.3" fill="#6f7a82" opacity="0.55" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#fs-sky)" />
      <path d="M0 324 C151 296 310 312 468 333 C651 357 790 323 960 348 L960 540 L0 540 Z" fill="#9aac91" />
      <path d="M0 409 C186 385 340 405 513 425 C711 449 833 421 960 434 L960 540 L0 540 Z" fill="#c0beb1" />
      <path d="M58 470 C216 445 385 459 540 477 C718 497 835 477 960 486 L960 540 L58 540 Z" fill="#6f7778" opacity="0.75" />
      <path d="M80 464 C254 444 424 458 586 478 C727 495 858 478 960 487" fill="none" stroke="#eef0e7" strokeWidth="5" strokeDasharray="18 18" opacity="0.7" />

      {/* Rear data hall */}
      <g transform="translate(96 174)">
        <polygon points="0,91 74,61 286,61 342,91" fill="#806b57" />
        <rect x="18" y="91" width="294" height="153" rx="4" fill="#cec8bb" />
        <rect x="18" y="181" width="294" height="63" fill="url(#fs-masonry)" />
        <rect x="38" y="108" width="254" height="52" fill="#354f59" />
        <FinArray x={48} y={102} count={17} width={8} gap={7} height={66} color="#d4c7b0" accent="#9a734e" />
        <path d="M16 160 H314 L299 177 H31 Z" fill="#7a624f" />
      </g>

      {/* Main data hall */}
      <g transform="translate(286 116)">
        <polygon points="0,126 54,94 340,94 402,126" fill="#75604c" />
        <rect x="24" y="126" width="348" height="208" rx="5" fill="#d9d4c7" />
        <rect x="24" y="243" width="348" height="91" fill="url(#fs-masonry)" />
        <rect x="44" y="146" width="306" height="72" fill="#344f5c" />
        <FinArray x={54} y={138} count={21} width={9} gap={6.5} height={91} color="#ded1b8" accent="#a77a50" />
        <path d="M19 219 H378 L360 239 H37 Z" fill="#7c6753" />
        <rect x="128" y="274" width="86" height="60" rx="3" fill="#293f48" />
        <path d="M103 263 H239 L220 280 H121 Z" fill="#6f5846" />
      </g>

      {/* Utility/cooling yard honestly visible behind screen */}
      <g transform="translate(630 292)">
        <rect x="-12" y="-8" width="236" height="116" rx="8" fill="#9ba6aa" opacity="0.5" />
        <CoolingUnit x={0} y={10} />
        <CoolingUnit x={116} y={17} />
        <path d="M-2 3 H230 M-2 99 H230" stroke="#4f5f66" strokeWidth="6" />
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M${i * 14} -5 V105`} stroke="#6d787e" strokeWidth="3" opacity="0.65" />
        ))}
        <rect x="0" y="0" width="230" height="104" fill="url(#fs-screen)" opacity="0.36" />
      </g>

      {/* Electrical infrastructure */}
      <g transform="translate(68 325)">
        <rect x="-18" y="-9" width="214" height="96" rx="7" fill="#87948f" opacity="0.45" />
        <Transformer x={0} y={12} />
        <Transformer x={84} y={18} />
        <path d="M18 4 C52 -36 98 -30 132 4 C159 -20 183 -15 197 8" fill="none" stroke="#3f4f59" strokeWidth="5" />
        <path d="M-18 88 H198" stroke="#58676d" strokeWidth="7" />
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={`M${-10 + i * 16} -8 V88`} stroke="#5f6f75" strokeWidth="2" opacity="0.6" />
        ))}
      </g>

      {/* Controlled access and service route */}
      <g transform="translate(565 399)">
        <rect x="0" y="0" width="82" height="45" rx="4" fill="#b6916d" />
        <rect x="9" y="11" width="30" height="20" fill="#334d58" />
        <path d="M-8 -8 H90 L80 3 H1 Z" fill="#725944" />
        <rect x="86" y="12" width="12" height="66" fill="#46565e" />
        <rect x="94" y="16" width="138" height="10" rx="5" fill="#a7483f" />
        <path d="M102 26 L102 78 M129 26 L129 78 M156 26 L156 78 M183 26 L183 78 M210 26 L210 78" stroke="#586a70" strokeWidth="4" />
      </g>

      {/* Native landscape and lights */}
      <NativeTree x={67} y={444} scale={0.65} />
      <NativeTree x={500} y={445} scale={0.6} canopy="#527f58" />
      <PalmTree x={896} y={449} scale={0.72} lean={-5} />
      <ShieldedLight x={456} y={454} />
      <ShieldedLight x={827} y={449} />

      {/* Educational callouts */}
      <g className="vision-callout">
        <path d="M337 116 L259 70" />
        <rect x="130" y="48" width="129" height="24" rx="5" />
        <text x="142" y="65">Articulated data hall</text>
      </g>
      <g className="vision-callout">
        <path d="M705 293 L701 254" />
        <rect x="614" y="229" width="174" height="24" rx="5" />
        <text x="626" y="246">Screened cooling equipment</text>
      </g>
      <g className="vision-callout">
        <path d="M163 327 L165 283" />
        <rect x="75" y="258" width="180" height="24" rx="5" />
        <text x="87" y="275">Electrical infrastructure</text>
      </g>
      <g className="vision-callout">
        <path d="M646 402 L648 368" />
        <rect x="555" y="344" width="186" height="24" rx="5" />
        <text x="567" y="361">Controlled service access</text>
      </g>

      <ConceptBadge />
    </svg>
  );
}

function VisionScene({ perspective }: { perspective: FacilityVisionPerspective }) {
  switch (perspective.id) {
    case 'neighborhood':
      return <NeighborhoodScene />;
    case 'landscape':
      return <LandscapeScene />;
    case 'facility':
      return <FacilityScene />;
  }
}

const PERSPECTIVE_ICONS: Record<FacilityVisionPerspective['id'], typeof TreePine> = {
  neighborhood: Shield,
  landscape: TreePine,
  facility: Building2,
};

export default function ResponsibleFacilityVision({ site, onBack, onOpenSatellite }: ResponsibleFacilityVisionProps) {
  const profile = getFacilityVisionProfile(site.id);

  if (!profile) {
    return (
      <section className="facility-vision" aria-labelledby="facility-vision-title">
        <button type="button" className="satellite-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Back to {site.name} Profile
        </button>
        <div className="facility-vision-empty">
          <Info size={18} />
          No responsible facility concept has been prepared for this site.
        </div>
      </section>
    );
  }

  return (
    <section className="facility-vision" aria-labelledby="facility-vision-title">
      <div className="facility-vision-toolbar">
        <button type="button" className="satellite-back-btn" onClick={onBack}>
          <ArrowLeft size={16} />
          Florida Overview & {site.name} Profile
        </button>
        <button type="button" className="facility-gis-link" onClick={onOpenSatellite}>
          <Layers size={15} />
          Open Verified Environmental Context
        </button>
      </div>

      <div className="facility-vision-heading">
        <div>
          <h3 id="facility-vision-title">{site.name} — {profile.title}</h3>
          <p>{profile.subtitle}</p>
        </div>
        <span className={`satellite-classification ${site.classification}`}>{site.classificationLabel}</span>
      </div>

      <div className="facility-vision-notice">
        <MapPin size={16} />
        <div>
          <strong>Illustrative Concept — Not a Site Plan</strong>
          <span>
            These architectural vignettes explore design principles only. They do not show parcel boundaries, building placement,
            buildable land, environmental suitability, an approved architectural style, or a development proposal.
          </span>
        </div>
      </div>

      <div className="facility-vision-intro">
        <div>
          <Building2 size={18} />
          <div>
            <strong>Architectural character</strong>
            <span>Warm materials, shaded overhangs, articulated facade sections, fins, and architectural screening reduce generic warehouse-like massing.</span>
          </div>
        </div>
        <div>
          <TreePine size={18} />
          <div>
            <strong>Landscape integration</strong>
            <span>Native planting and symbolic habitat connections are design ideas only; environmental suitability and locations require separate verification.</span>
          </div>
        </div>
        <div>
          <Shield size={18} />
          <div>
            <strong>Practical infrastructure</strong>
            <span>Cooling equipment, electrical systems, service access, and security are acknowledged rather than hidden behind decorative landscaping.</span>
          </div>
        </div>
      </div>

      <div className="facility-vision-gallery">
        {profile.perspectives.map(perspective => {
          const Icon = PERSPECTIVE_ICONS[perspective.id];
          return (
            <article key={perspective.id} className="facility-vision-card">
              <div className="facility-vision-card-header">
                <Icon size={18} />
                <div>
                  <h4>{perspective.title}</h4>
                  <p>{perspective.subtitle}</p>
                </div>
              </div>

              <div className="facility-vision-art">
                <VisionScene perspective={perspective} />
              </div>

              <p className="facility-vision-intent">{perspective.designIntent}</p>

              <div className="facility-vision-list-section ideas">
                <h5><CheckCircle size={14} /> Design ideas shown</h5>
                <ul>
                  {perspective.ideas.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>

              <div className="facility-vision-list-section limits">
                <h5><CircleDashed size={14} /> Not shown or established</h5>
                <ul>
                  {perspective.limitations.map(item => <li key={item}>{item}</li>)}
                </ul>
              </div>

              <details className="facility-vision-questions">
                <summary><HelpCircle size={14} /> Questions for real site planning</summary>
                <ul>
                  {perspective.questions.map(item => <li key={item}>{item}</li>)}
                </ul>
              </details>
            </article>
          );
        })}
      </div>

      <div className="facility-vision-footer">
        <Info size={16} />
        <p>
          These concept scenes are intentionally symbolic and unscaled. They do not establish that previously disturbed land is buildable or suitable,
          and they are separate from the verified wetlands, flood, conservation, aquatic-preserve, and shoreline GIS layers. Real facility planning would
          require parcel research, ecological and contamination studies, engineering design, utility analysis, community input, and applicable approvals.
        </p>
      </div>

      <button type="button" className="facility-gis-link facility-gis-link-bottom" onClick={onOpenSatellite}>
        Review verified environmental GIS separately
        <ExternalLink size={14} />
      </button>
    </section>
  );
}
