import {
  ArrowLeft,
  Building2,
  CheckCircle,
  CircleDashed,
  ExternalLink,
  FileText,
  HelpCircle,
  Info,
  Layers,
  MapPin,
  Shield,
  Sprout,
  Sun,
  TreePine,
} from 'lucide-react';
import type { CandidateSite } from '../data/siteExplorerData';
import {
  getFacilityVisionProfile,
  type FacilityVisionEvidenceNote,
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

function SolarPanel({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M8 52 L22 78 M82 52 L96 78" stroke="#52656c" strokeWidth="6" strokeLinecap="round" />
      <polygon points="0,20 76,0 112,14 37,36" fill="#193f55" />
      <polygon points="5,21 74,3 105,15 38,34" fill="#2e6f8f" />
      <path d="M18 26 L89 8 M34 30 L100 13 M15 22 L50 34 M38 17 L72 29 M61 11 L93 22" stroke="#93bdcc" strokeWidth="1.5" opacity="0.78" />
      <path d="M0 20 L37 36 L112 14" fill="none" stroke="#0e2d3d" strokeWidth="3" />
    </g>
  );
}

function SolarField({ x, y, rows, panels, spacingX, spacingY }: {
  x: number;
  y: number;
  rows: number;
  panels: number;
  spacingX: number;
  spacingY: number;
}) {
  return (
    <g>
      {Array.from({ length: rows }, (_, row) => (
        <g key={row} opacity={1 - row * 0.06}>
          {Array.from({ length: panels }, (_, col) => (
            <SolarPanel
              key={col}
              x={x + col * spacingX + row * 28}
              y={y + row * spacingY}
              scale={1 - row * 0.08}
            />
          ))}
        </g>
      ))}
    </g>
  );
}

function IndiantownEnergyReuseScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="it-reuse-title it-reuse-desc">
      <title id="it-reuse-title">Coal-to-solar reuse illustrative concept</title>
      <desc id="it-reuse-desc">
        Symbolic illustration showing a faded industrial silhouette, solar arrays, and grid infrastructure. It does not depict parcel boundaries or place Monarch Solar on the former plant footprint.
      </desc>
      <defs>
        <linearGradient id="itr-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e5f0f4" />
          <stop offset="62%" stopColor="#f2eadb" />
          <stop offset="100%" stopColor="#d9d0bc" />
        </linearGradient>
        <linearGradient id="itr-land" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8ea477" />
          <stop offset="54%" stopColor="#b2b886" />
          <stop offset="100%" stopColor="#8ea477" />
        </linearGradient>
      </defs>

      <rect width="960" height="540" fill="url(#itr-sky)" />
      <circle cx="746" cy="88" r="42" fill="#f6c86e" opacity="0.82" />
      <circle cx="746" cy="88" r="60" fill="#f6c86e" opacity="0.14" />

      <path d="M0 281 C154 258 323 270 479 292 C641 315 799 289 960 303 L960 540 L0 540 Z" fill="#a6b184" />
      <path d="M0 353 C174 326 337 342 514 362 C693 382 820 361 960 374 L960 540 L0 540 Z" fill="url(#itr-land)" />

      {/* Former industrial silhouette, intentionally symbolic and unlocated */}
      <g opacity="0.34">
        <rect x="72" y="178" width="146" height="90" rx="3" fill="#70706d" />
        <rect x="101" y="112" width="30" height="156" rx="10" fill="#6e6f70" />
        <rect x="148" y="137" width="24" height="131" rx="9" fill="#777879" />
        <path d="M218 188 H300 L326 268 H218 Z" fill="#7b7a75" />
        <path d="M92 111 C117 84 153 88 176 111" fill="none" stroke="#c7d2d0" strokeWidth="9" strokeLinecap="round" />
      </g>
      <g className="vision-scene-note">
        <rect x="55" y="280" width="258" height="31" rx="7" />
        <text x="68" y="301">Former industrial use — symbolic</text>
      </g>

      {/* Reused energy infrastructure, symbolic */}
      <g transform="translate(686 220)">
        <path d="M62 0 L12 132 M62 0 L112 132 M31 56 H93 M20 91 H104 M12 132 H112" fill="none" stroke="#52636a" strokeWidth="6" strokeLinecap="round" />
        <path d="M20 55 C-37 72 -73 94 -110 131 M103 55 C170 73 207 96 250 137" fill="none" stroke="#52636a" strokeWidth="3" opacity="0.72" />
      </g>
      <g transform="translate(566 292)">
        <rect x="0" y="0" width="82" height="64" rx="6" fill="#758489" />
        <rect x="12" y="-12" width="18" height="16" fill="#455961" />
        <rect x="51" y="-12" width="18" height="16" fill="#455961" />
        <path d="M13 18 H70 M13 32 H70 M13 46 H70" stroke="#b8c6c8" strokeWidth="4" />
      </g>

      {/* Solar generation foreground */}
      <SolarField x={304} y={318} rows={3} panels={4} spacingX={124} spacingY={63} />
      <SolarField x={87} y={371} rows={2} panels={3} spacingX={135} spacingY={70} />

      {/* Transition marker */}
      <g>
        <path d="M329 196 C423 145 509 145 602 195" fill="none" stroke="#df9e39" strokeWidth="7" strokeLinecap="round" strokeDasharray="2 14" />
        <path d="M590 184 L612 199 L585 211 Z" fill="#df9e39" />
        <rect x="370" y="122" width="186" height="34" rx="7" fill="rgba(255,255,255,0.78)" stroke="rgba(150,105,45,0.32)" />
        <text x="385" y="144" fill="#7a571f" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="13" fontWeight="750">
          Energy-site reuse pathway
        </text>
      </g>

      {/* Native edge and access path */}
      <path d="M0 458 C170 432 334 452 493 470 C670 490 821 469 960 481 L960 540 L0 540 Z" fill="#5f7d5b" />
      <path d="M57 540 C170 499 306 482 446 484 C586 486 733 501 905 469" fill="none" stroke="#c6b998" strokeWidth="31" opacity="0.72" />
      <path d="M57 540 C170 499 306 482 446 484 C586 486 733 501 905 469" fill="none" stroke="#796f5d" strokeWidth="3" strokeDasharray="9 13" opacity="0.55" />
      <NativeTree x={61} y={462} scale={0.75} />
      <NativeTree x={237} y={471} scale={0.58} canopy="#4d835b" />
      <PalmTree x={853} y={466} scale={0.72} lean={-6} />
      <ReedCluster x={190} y={481} />
      <ReedCluster x={780} y={474} />

      <g className="vision-scene-note landscape-note">
        <rect x="536" y="486" width="404" height="34" rx="7" />
        <text x="550" y="502">Monarch documented southwest of plant</text>
        <text x="550" y="516">Array placement here is symbolic only</text>
      </g>

      <ConceptBadge />
    </svg>
  );
}

function IndiantownLandscapeStewardshipScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="it-steward-title it-steward-desc">
      <title id="it-steward-title">Solar landscape stewardship illustrative concept</title>
      <desc id="it-steward-desc">
        Symbolic illustration of native groundcover, screening, stormwater planting, and a possible habitat connection around solar infrastructure. It does not document restoration work.
      </desc>
      <defs>
        <linearGradient id="its-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e6f2ee" />
          <stop offset="63%" stopColor="#f2ead9" />
          <stop offset="100%" stopColor="#d6c7ae" />
        </linearGradient>
        <linearGradient id="its-ground" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#93a86f" />
          <stop offset="55%" stopColor="#afb475" />
          <stop offset="100%" stopColor="#7d9b65" />
        </linearGradient>
      </defs>

      <rect width="960" height="540" fill="url(#its-sky)" />
      <path d="M0 266 C166 236 339 255 500 279 C670 304 812 278 960 294 L960 540 L0 540 Z" fill="#a4ac77" />
      <path d="M0 342 C184 315 347 335 527 357 C707 379 824 354 960 370 L960 540 L0 540 Z" fill="url(#its-ground)" />

      {/* Distant solar field */}
      <SolarField x={360} y={206} rows={3} panels={4} spacingX={116} spacingY={52} />
      <SolarField x={166} y={246} rows={2} panels={3} spacingX={119} spacingY={56} />

      {/* Screened but visible electrical equipment */}
      <g transform="translate(743 278)">
        <rect x="-8" y="-7" width="143" height="91" rx="7" fill="#9a8e75" opacity="0.35" />
        <rect x="8" y="8" width="92" height="58" rx="5" fill="#68777d" />
        <path d="M20 23 H88 M20 36 H88 M20 49 H88" stroke="#b8c3c6" strokeWidth="4" />
        <rect x="105" y="18" width="21" height="49" fill="#54676e" />
        <path d="M-5 -3 V79 M13 -3 V79 M112 -3 V79 M130 -3 V79" stroke="#7c6c54" strokeWidth="4" opacity="0.72" />
      </g>
      <g className="vision-callout">
        <path d="M787 280 L777 242" />
        <rect x="669" y="217" width="209" height="24" rx="5" />
        <text x="681" y="234">Electrical equipment remains visible</text>
      </g>

      {/* Native landscape buffer */}
      <path d="M0 411 C126 386 268 399 414 421 C570 445 742 416 960 432 L960 540 L0 540 Z" fill="#66865c" />
      <path d="M0 457 C153 431 323 452 489 469 C664 487 810 463 960 476 L960 540 L0 540 Z" fill="#526f4f" />
      <NativeTree x={75} y={427} scale={0.8} />
      <NativeTree x={145} y={449} scale={0.58} canopy="#4b8159" />
      <NativeTree x={611} y={445} scale={0.6} canopy="#5a8354" />
      <PalmTree x={903} y={435} scale={0.78} lean={-4} />
      {Array.from({ length: 24 }, (_, i) => (
        <g key={i} transform={`translate(${36 + i * 37} ${456 + (i % 4) * 8})`}>
          <path d="M0 21 C-5 9 -2 2 4 -7 C7 5 9 11 0 21" fill="#315e3f" />
          <circle cx="-4" cy="8" r="3" fill={i % 3 === 0 ? '#d89b5f' : '#e7c46b'} />
          <circle cx="5" cy="4" r="2.5" fill={i % 2 === 0 ? '#c97266' : '#eee0a3'} />
        </g>
      ))}

      {/* Conceptual stormwater planting */}
      <path d="M96 515 C224 475 370 486 513 503 C650 519 787 509 930 478" fill="none" stroke="#b7b18b" strokeWidth="44" opacity="0.9" />
      <path d="M96 515 C224 475 370 486 513 503 C650 519 787 509 930 478" fill="none" stroke="#668aa0" strokeWidth="10" opacity="0.55" />
      <ReedCluster x={141} y={493} />
      <ReedCluster x={328} y={484} />
      <ReedCluster x={532} y={502} />
      <ReedCluster x={742} y={493} />
      <ReedCluster x={881} y={474} />

      {/* Symbolic habitat question, not mapped corridor */}
      <path d="M61 322 C138 368 208 404 294 440 C378 475 456 493 558 506" fill="none" stroke="#3f7d55" strokeWidth="5" strokeDasharray="10 12" opacity="0.58" />
      <g className="vision-callout">
        <path d="M132 346 L96 300" />
        <rect x="34" y="275" width="209" height="24" rx="5" />
        <text x="46" y="292">Possible habitat connection — TBD</text>
      </g>
      <g className="vision-callout">
        <path d="M469 495 L509 455" />
        <rect x="488" y="430" width="211" height="24" rx="5" />
        <text x="500" y="447">Stormwater planting concept only</text>
      </g>

      <g className="vision-scene-note landscape-note">
        <rect x="534" y="486" width="404" height="34" rx="7" />
        <text x="548" y="502">Design principles, not documented restoration</text>
        <text x="548" y="516">Ecology, drainage, and contamination require review</text>
      </g>

      <ConceptBadge />
    </svg>
  );
}

function GeneratorSet({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="0" y="14" width="96" height="52" rx="5" fill="#6d7b82" />
      <rect x="8" y="22" width="80" height="30" rx="3" fill="#596a72" />
      <path d="M14 28 H82 M14 36 H82 M14 44 H82" stroke="#8fa2aa" strokeWidth="3" opacity="0.8" />
      <rect x="14" y="-18" width="10" height="32" fill="#4d5e66" />
      <rect x="70" y="-26" width="10" height="40" fill="#4d5e66" />
      <ellipse cx="19" cy="-20" rx="7" ry="3" fill="#8ea0a8" />
      <ellipse cx="75" cy="-28" rx="7" ry="3" fill="#8ea0a8" />
    </g>
  );
}

function FenceRail({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const posts = Math.floor((x2 - x1) / 46);
  return (
    <g>
      <path d={`M${x1} ${y} H${x2} M${x1} ${y + 12} H${x2}`} stroke="#8a6f52" strokeWidth="5" strokeLinecap="round" />
      {Array.from({ length: posts + 1 }, (_, i) => (
        <rect key={i} x={x1 + i * 46 - 2.5} y={y - 8} width="5" height="30" rx="2" fill="#75593f" />
      ))}
    </g>
  );
}

function DesotoNeighborhoodScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="dn-vision-title dn-vision-desc">
      <title id="dn-vision-title">Illustrative rural-facing facility concept</title>
      <desc id="dn-vision-desc">
        Symbolic street-level view of one hypothetical facility design with warm-toned articulated facades, native screening, a post-and-rail frontage, and shielded lighting. No real property boundary, setback, or residence is depicted.
      </desc>
      <defs>
        <linearGradient id="dn-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc5ea" />
          <stop offset="0.6" stopColor="#d9edf8" />
          <stop offset="1" stopColor="#f3ead9" />
        </linearGradient>
        <linearGradient id="dn-glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1e3a4d" />
          <stop offset="1" stopColor="#5b8799" />
        </linearGradient>
        <pattern id="dn-masonry" width="24" height="16" patternUnits="userSpaceOnUse">
          <rect width="24" height="16" fill="#b98d63" />
          <path d="M0 0 H24 M0 8 H24 M8 0 V8 M18 8 V16" stroke="#966f4f" strokeWidth="0.7" opacity="0.48" />
        </pattern>
        <pattern id="dn-perforated" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#cfd5d9" />
          <circle cx="6" cy="6" r="1.7" fill="#8b949d" opacity="0.55" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#dn-sky)" />
      <circle cx="820" cy="76" r="34" fill="#fff6d7" opacity="0.6" />

      {/* Distant pasture and tree line */}
      <path d="M0 330 C140 308 255 316 380 332 C522 350 663 325 806 342 C890 352 934 344 960 336 L960 540 L0 540 Z" fill="#a9b98a" />
      <path d="M0 322 C60 292 118 302 162 318 C210 284 282 292 330 320 C392 282 474 290 526 324 C592 286 678 292 730 326 C788 290 872 294 960 328 L960 352 L0 352 Z" fill="#5f8659" opacity="0.75" />
      <path d="M0 424 C190 405 377 418 515 432 C696 450 826 424 960 435 L960 540 L0 540 Z" fill="#bfc7bd" />
      <path d="M0 462 C220 446 440 462 654 474 C790 482 880 470 960 475 L960 540 L0 540 Z" fill="#989b91" />

      {/* Left articulated masonry volume */}
      <polygon points="70,246 320,205 320,414 70,443" fill="#a97851" />
      <polygon points="82,255 308,219 308,407 82,431" fill="url(#dn-masonry)" />
      <polygon points="70,246 320,205 336,218 89,260" fill="#75533e" />
      <path d="M99 283 L289 250 M99 321 L289 291 M99 360 L289 334" stroke="#7e5b43" strokeWidth="2" opacity="0.35" />
      <rect x="139" y="337" width="52" height="76" rx="3" fill="#263f4a" />
      <path d="M129 331 H203 L195 344 H137 Z" fill="#7a5d47" />

      {/* Main composed facade */}
      <rect x="300" y="126" width="428" height="302" rx="3" fill="#d9d4ca" />
      <rect x="300" y="312" width="428" height="116" fill="url(#dn-masonry)" />
      <rect x="316" y="143" width="396" height="150" rx="3" fill="#304b58" />
      <FinArray x={323} y={136} count={22} width={9} gap={8.8} height={166} color="#d4c4aa" accent="#a67c52" />
      {Array.from({ length: 16 }, (_, i) => (
        <rect key={i} x={353 + i * 18} y={153 + (i % 3) * 8} width="9" height={86 + (i % 4) * 12} fill="url(#dn-glass)" opacity="0.52" />
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
      <polygon points="739,192 850,227 850,405 739,413" fill="url(#dn-perforated)" />
      <path d="M745 204 L845 237 M745 237 L845 270 M745 270 L845 303 M745 303 L845 336" stroke="#87919a" strokeWidth="2" opacity="0.55" />
      <rect x="756" y="326" width="70" height="50" rx="5" fill="#68747c" opacity="0.5" />
      <circle cx="778" cy="350" r="14" fill="#4f5c65" opacity="0.65" />
      <circle cx="806" cy="350" r="14" fill="#4f5c65" opacity="0.65" />

      {/* Planting beds and post-and-rail rural frontage */}
      <path d="M52 431 C172 415 285 423 393 439 C540 462 715 433 900 452 L900 484 C710 465 542 488 390 466 C265 448 161 444 52 459 Z" fill="#5e7d54" />
      <path d="M0 490 C215 472 415 493 612 505 C755 515 858 501 960 508 L960 540 L0 540 Z" fill="#d0c4ae" />
      <FenceRail x1={18} x2={918} y={492} />
      <NativeTree x={116} y={438} scale={0.78} />
      <NativeTree x={244} y={435} scale={0.58} canopy="#4d8a5b" />
      <NativeTree x={635} y={438} scale={0.7} canopy="#3f7654" />
      <PalmTree x={885} y={452} scale={0.74} lean={5} />
      <ShieldedLight x={414} y={466} />
      <ShieldedLight x={688} y={463} />

      <g className="vision-scene-note">
        <rect x="578" y="499" rx="6" width="358" height="28" />
        <text x="591" y="518">Symbolic rural edge — no setback shown</text>
      </g>
      <ConceptBadge />
    </svg>
  );
}

function DesotoLandscapeScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="dl-vision-title dl-vision-desc">
      <title id="dl-vision-title">Illustrative rural landscape concept</title>
      <desc id="dl-vision-desc">
        Symbolic oblique view of the same hypothetical buildings in a pasture landscape with conceptual stormwater planting and a dashed habitat question mark. No mapped wetlands, parcels, or real site geometry is depicted.
      </desc>
      <defs>
        <linearGradient id="dl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#79b7de" />
          <stop offset="0.62" stopColor="#cfe9f5" />
          <stop offset="1" stopColor="#f4ead3" />
        </linearGradient>
        <linearGradient id="dl-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e95a3" />
          <stop offset="1" stopColor="#2e6875" />
        </linearGradient>
        <pattern id="dl-panel" width="30" height="18" patternUnits="userSpaceOnUse">
          <rect width="30" height="18" fill="#b7a58b" />
          <path d="M0 0 V18 M15 0 V18" stroke="#d9cfbd" strokeWidth="1" opacity="0.65" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#dl-sky)" />

      {/* Open pasture and distant hammock canopy */}
      <path d="M0 290 C138 268 239 278 360 292 C497 308 645 277 801 300 C885 313 926 303 960 294 L960 540 L0 540 Z" fill="#9cb27e" />
      <path d="M0 286 C50 247 107 262 152 280 C199 242 269 251 317 282 C379 241 463 250 514 287 C581 245 670 253 723 288 C780 249 864 253 960 292 L960 333 L0 333 Z" fill="#557f59" opacity="0.8" />

      {/* Same articulated low campus forms */}
      <g transform="translate(220 182)">
        <polygon points="0,80 66,56 218,56 254,80" fill="#8b7660" />
        <rect x="15" y="80" width="205" height="104" rx="4" fill="#d8d1c1" />
        <rect x="15" y="133" width="205" height="51" fill="url(#dl-panel)" />
        <rect x="30" y="91" width="175" height="31" fill="#415f66" opacity="0.85" />
        <FinArray x={35} y={88} count={11} width={8} gap={7} height={42} color="#d7c6a8" accent="#9b744d" />
        <path d="M8 126 H228 L216 138 H20 Z" fill="#79614e" />
        <rect x="57" y="142" width="42" height="42" fill="#2e4b54" opacity="0.8" />
      </g>
      <g transform="translate(484 148)">
        <polygon points="0,95 36,72 244,72 286,95" fill="#756654" />
        <rect x="18" y="95" width="244" height="141" rx="4" fill="#c9c4b9" />
        <rect x="18" y="163" width="244" height="73" fill="url(#dl-panel)" />
        <rect x="34" y="110" width="212" height="39" fill="#3c5963" />
        <FinArray x={42} y={105} count={15} width={7} gap={7} height={55} color="#dccfb8" accent="#a77c51" />
        <polygon points="18,95 36,72 58,72 40,95" fill="#a68b6f" />
        <polygon points="226,72 250,72 232,95 208,95" fill="#a68b6f" />
        <path d="M28 151 H252 L238 165 H42 Z" fill="#75604d" />
      </g>
      <g transform="translate(675 202)">
        <polygon points="0,56 42,36 174,36 208,56" fill="#82715c" />
        <rect x="14" y="56" width="178" height="93" rx="4" fill="#d9d4c8" />
        <rect x="14" y="104" width="178" height="45" fill="url(#dl-panel)" />
        <rect x="29" y="66" width="148" height="27" fill="#46636b" />
        <FinArray x={36} y={64} count={9} width={7} gap={8} height={36} color="#ded0b9" accent="#99734e" />
      </g>

      {/* Pasture bands, conceptual swale, and symbolic habitat question */}
      <path d="M0 340 C136 319 250 335 365 354 C485 374 650 343 790 365 C869 377 920 371 960 360 L960 540 L0 540 Z" fill="#6f925f" />
      <path d="M0 386 C159 367 294 384 420 402 C585 425 735 393 960 410 L960 540 L0 540 Z" fill="#93a86f" />
      <path d="M0 444 C160 414 320 434 465 456 C642 482 792 449 960 468 L960 540 L0 540 Z" fill="url(#dl-water)" opacity="0.9" />
      <path d="M0 444 C171 420 327 438 468 458 C650 484 801 453 960 470" fill="none" stroke="#c8e5d4" strokeWidth="5" opacity="0.45" />

      <path d="M162 356 C266 324 345 352 434 338 C517 325 607 316 714 344 C782 361 841 356 900 335" fill="none" stroke="#e5f5cf" strokeWidth="11" strokeDasharray="18 14" opacity="0.72" strokeLinecap="round" />
      <path d="M162 356 C266 324 345 352 434 338 C517 325 607 316 714 344 C782 361 841 356 900 335" fill="none" stroke="#3f7d55" strokeWidth="2.5" strokeDasharray="9 14" opacity="0.9" />
      <g className="vision-scene-note landscape-note">
        <rect x="122" y="316" rx="6" width="276" height="27" />
        <text x="135" y="334">Potential habitat connection — location TBD</text>
      </g>

      {/* Stormwater planting and native pasture edge */}
      <ReedCluster x={66} y={516} scale={0.9} />
      <ReedCluster x={170} y={529} scale={0.72} />
      <ReedCluster x={425} y={524} scale={0.82} />
      <ReedCluster x={700} y={525} scale={0.75} />
      <ReedCluster x={815} y={520} scale={0.88} />
      <NativeTree x={102} y={363} scale={0.64} />
      <NativeTree x={382} y={365} scale={0.5} canopy="#5a8c5f" />
      <NativeTree x={845} y={369} scale={0.67} />
      <PalmTree x={910} y={430} scale={0.82} lean={-7} />
      <PalmTree x={42} y={430} scale={0.64} lean={6} />
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

function DesotoFacilityScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="df-vision-title df-vision-desc">
      <title id="df-vision-title">Illustrative complete facility concept with utility infrastructure</title>
      <desc id="df-vision-desc">
        Symbolic view of the same hypothetical design honestly showing generic on-site generation, cooling equipment, transformers, security, and service access. No real site layout or engineering design is depicted.
      </desc>
      <defs>
        <linearGradient id="df-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#83b9dd" />
          <stop offset="0.63" stopColor="#d8ebf4" />
          <stop offset="1" stopColor="#efe5d4" />
        </linearGradient>
        <pattern id="df-masonry" width="26" height="18" patternUnits="userSpaceOnUse">
          <rect width="26" height="18" fill="#ad815e" />
          <path d="M0 0 H26 M0 9 H26 M9 0 V9 M19 9 V18" stroke="#865f45" strokeWidth="0.75" opacity="0.5" />
        </pattern>
        <pattern id="df-screen" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#b6bec3" />
          <rect x="2" y="2" width="2.3" height="2.3" fill="#6f7a82" opacity="0.55" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#df-sky)" />
      <path d="M0 324 C151 296 310 312 468 333 C651 357 790 323 960 348 L960 540 L0 540 Z" fill="#9aac91" />
      <path d="M0 409 C186 385 340 405 513 425 C711 449 833 421 960 434 L960 540 L0 540 Z" fill="#c0beb1" />
      <path d="M58 470 C216 445 385 459 540 477 C718 497 835 477 960 486 L960 540 L58 540 Z" fill="#6f7778" opacity="0.75" />
      <path d="M80 464 C254 444 424 458 586 478 C727 495 858 478 960 487" fill="none" stroke="#eef0e7" strokeWidth="5" strokeDasharray="18 18" opacity="0.7" />

      {/* Rear data hall */}
      <g transform="translate(96 174)">
        <polygon points="0,91 74,61 286,61 342,91" fill="#806b57" />
        <rect x="18" y="91" width="294" height="153" rx="4" fill="#cec8bb" />
        <rect x="18" y="181" width="294" height="63" fill="url(#df-masonry)" />
        <rect x="38" y="108" width="254" height="52" fill="#354f59" />
        <FinArray x={48} y={102} count={17} width={8} gap={7} height={66} color="#d4c7b0" accent="#9a734e" />
        <path d="M16 160 H314 L299 177 H31 Z" fill="#7a624f" />
      </g>

      {/* Main data hall */}
      <g transform="translate(286 116)">
        <polygon points="0,126 54,94 340,94 402,126" fill="#75604c" />
        <rect x="24" y="126" width="348" height="208" rx="5" fill="#d9d4c7" />
        <rect x="24" y="243" width="348" height="91" fill="url(#df-masonry)" />
        <rect x="44" y="146" width="306" height="72" fill="#344f5c" />
        <FinArray x={54} y={138} count={21} width={9} gap={6.5} height={91} color="#ded1b8" accent="#a77a50" />
        <path d="M19 219 H378 L360 239 H37 Z" fill="#7c6753" />
        <rect x="128" y="274" width="86" height="60" rx="3" fill="#293f48" />
        <path d="M103 263 H239 L220 280 H121 Z" fill="#6f5846" />
      </g>

      {/* On-site generation yard, symbolic */}
      <g transform="translate(626 218)">
        <rect x="-14" y="-30" width="248" height="100" rx="8" fill="#9ba6aa" opacity="0.5" />
        <GeneratorSet x={0} y={18} scale={0.78} />
        <GeneratorSet x={128} y={24} scale={0.72} />
        <path d="M-4 74 H240" stroke="#4f5f66" strokeWidth="6" />
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M${i * 14} -26 V74`} stroke="#6d787e" strokeWidth="3" opacity="0.65" />
        ))}
        <rect x="-8" y="-26" width="240" height="98" fill="url(#df-screen)" opacity="0.34" />
      </g>

      {/* Cooling yard honestly visible behind screen */}
      <g transform="translate(630 322)">
        <rect x="-12" y="-8" width="236" height="104" rx="8" fill="#9ba6aa" opacity="0.5" />
        <CoolingUnit x={0} y={10} />
        <CoolingUnit x={116} y={16} />
        <path d="M-2 3 H230 M-2 92 H230" stroke="#4f5f66" strokeWidth="6" />
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d={`M${i * 14} -5 V98`} stroke="#6d787e" strokeWidth="3" opacity="0.65" />
        ))}
        <rect x="0" y="0" width="230" height="98" fill="url(#df-screen)" opacity="0.36" />
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
      <g transform="translate(565 404)">
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
        <path d="M742 196 L742 162" />
        <rect x="630" y="137" width="222" height="24" rx="5" />
        <text x="642" y="154">On-site generation — project use only</text>
      </g>
      <g className="vision-callout">
        <path d="M705 322 L700 302" />
        <rect x="562" y="277" width="174" height="24" rx="5" />
        <text x="574" y="294">Screened cooling equipment</text>
      </g>
      <g className="vision-callout">
        <path d="M163 327 L165 291" />
        <rect x="75" y="266" width="180" height="24" rx="5" />
        <text x="87" y="283">Electrical infrastructure</text>
      </g>

      <ConceptBadge />
    </svg>
  );
}

function MonitoringWell({ x, y, label = 'MW' }: { x: number; y: number; label?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-3" y="-34" width="6" height="34" rx="2" fill="#cbd5da" />
      <rect x="-5" y="-38" width="10" height="6" rx="2" fill="#5d7078" />
      <rect x="-6" y="0" width="12" height="4" rx="2" fill="#9aa6ab" />
      <text x="0" y="-44" textAnchor="middle" fill="#48606b" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" fontSize="11" fontWeight="700">{label}</text>
    </g>
  );
}

function PostedSign({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-2.5" y="-34" width="5" height="34" rx="2" fill="#5f6b72" />
      <rect x="-24" y="-56" width="48" height="26" rx="3" fill="#f6efe0" stroke="#8a6f4e" strokeWidth="2" />
      <rect x="-18" y="-49" width="36" height="4" rx="2" fill="#a7483f" />
      <rect x="-18" y="-41" width="24" height="3" rx="1.5" fill="#8a8177" />
    </g>
  );
}

function TreatmentSkid({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="26" width="120" height="58" rx="6" fill="#7d8b92" />
      <rect x="10" y="10" width="46" height="34" rx="5" fill="#5f727b" />
      <circle cx="33" cy="27" r="11" fill="#46565e" />
      <rect x="66" y="18" width="44" height="24" rx="4" fill="#6a7d85" />
      <path d="M12 50 H108 M12 62 H98 M12 74 H104" stroke="#b9c6ca" strokeWidth="4" opacity="0.85" />
      <rect x="104" y="-18" width="8" height="44" fill="#4d5e66" />
      <ellipse cx="108" cy="-20" rx="7" ry="3" fill="#8ea0a8" />
    </g>
  );
}

function EscambiaRemedyFirstScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="er-vision-title er-vision-desc">
      <title id="er-vision-title">Illustrative remedy-first stewardship concept</title>
      <desc id="er-vision-desc">
        Symbolic view of soil containment, monitoring wells, controlled access, and ongoing groundwater treatment at a Superfund site. No actual cell geometry is depicted and remediation is ongoing.
      </desc>
      <defs>
        <linearGradient id="er-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8fc0e4" />
          <stop offset="0.62" stopColor="#dcecf5" />
          <stop offset="1" stopColor="#efe8d6" />
        </linearGradient>
      </defs>

      <rect width="960" height="540" fill="url(#er-sky)" />

      {/* Distant industrial context, faded */}
      <g opacity="0.3">
        <rect x="40" y="212" width="150" height="70" rx="3" fill="#7c7f7a" />
        <rect x="66" y="168" width="18" height="114" rx="6" fill="#75787a" />
        <rect x="106" y="182" width="16" height="100" rx="6" fill="#7d807c" />
        <rect x="800" y="228" width="130" height="54" rx="3" fill="#83857f" />
        <path d="M800 228 L830 198 H900 L930 228" fill="#7a7d78" />
      </g>

      {/* Ground */}
      <path d="M0 300 C150 278 310 292 470 308 C640 326 800 300 960 318 L960 540 L0 540 Z" fill="#8aa06f" />
      <path d="M0 380 C160 358 330 376 500 392 C680 410 820 388 960 398 L960 540 L0 540 Z" fill="#a3b483" />

      {/* Symbolic capped containment mound — generic form, not actual geometry */}
      <path d="M180 400 C230 296 380 258 520 262 C660 266 760 320 790 400 C790 430 180 430 180 400 Z" fill="#7fae6a" />
      <path d="M196 392 C250 306 385 276 515 280 C640 284 730 330 768 392" fill="none" stroke="#5f9155" strokeWidth="6" opacity="0.6" />
      <path d="M230 368 C320 322 470 312 590 330 M270 396 C380 356 540 350 660 372" fill="none" stroke="#6b9a5e" strokeWidth="4" opacity="0.5" />

      {/* Perimeter fence with signage */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 150 + i * 44;
        return <path key={i} d={`M${x} 306 V392`} stroke="#7d8a90" strokeWidth="3" opacity="0.85" />;
      })}
      <path d="M150 316 C320 292 620 288 810 330 M150 330 C320 306 620 302 810 344" fill="none" stroke="#93a1a7" strokeWidth="2.5" opacity="0.8" />
      <PostedSign x={230} y={398} />
      <PostedSign x={690} y={398} />

      {/* Monitoring wells */}
      <MonitoringWell x={306} y={376} />
      <MonitoringWell x={520} y={352} />
      <MonitoringWell x={648} y={382} />

      {/* OU-2 treatment skid and symbolic subsurface zone */}
      <TreatmentSkid x={700} y={298} />
      <path d="M640 452 C700 434 780 434 850 450 C880 456 890 468 852 476 C780 490 700 488 648 474 C612 464 608 460 640 452 Z" fill="#5e95a3" opacity="0.5" stroke="#3f707c" strokeWidth="3" strokeDasharray="10 8" />
      <g className="vision-callout">
        <path d="M758 296 L740 252" />
        <rect x="618" y="227" width="246" height="24" rx="5" />
        <text x="630" y="244">Active OU-2 groundwater remediation</text>
      </g>

      {/* No-groundwater symbol */}
      <g transform="translate(120 330)">
        <circle cx="0" cy="0" r="26" fill="rgba(255,255,255,0.82)" stroke="#a7483f" strokeWidth="4" />
        <path d="M0 -10 C-7 0 -10 6 -10 12 C-10 20 -4 24 0 24 C4 24 10 20 10 12 C10 6 7 0 0 -10" fill="#4d7f96" />
        <path d="M-17 -17 L17 17" stroke="#a7483f" strokeWidth="4.5" />
      </g>
      <g className="vision-scene-note">
        <rect x="52" y="368" rx="6" width="240" height="28" />
        <text x="65" y="387">No groundwater use or new wells</text>
      </g>

      {/* Callouts */}
      <g className="vision-callout">
        <path d="M470 282 L430 232" />
        <rect x="316" y="207" width="178" height="24" rx="5" />
        <text x="328" y="224">Capped containment area</text>
      </g>
      <g className="vision-callout">
        <path d="M306 340 L262 314" />
        <rect x="120" y="288" width="150" height="24" rx="5" />
        <text x="132" y="305">Monitoring wells</text>
      </g>
      <g className="vision-callout">
        <path d="M232 362 L196 330" />
        <rect x="98" y="416" width="196" height="24" rx="5" />
        <text x="110" y="433">Controlled access &amp; signage</text>
      </g>

      {/* Native edge planting at margins only */}
      <ReedCluster x={60} y={522} scale={0.9} />
      <ReedCluster x={350} y={528} scale={0.75} />
      <ReedCluster x={880} y={520} scale={0.85} />
      <NativeTree x={70} y={420} scale={0.6} />
      <NativeTree x={905} y={420} scale={0.62} canopy="#4d8a5b" />
      <PalmTree x={868} y={452} scale={0.6} lean={-5} />

      <g className="vision-scene-note landscape-note">
        <rect x="470" y="500" rx="6" width="466" height="28" />
        <text x="483" y="519">Remedy elements symbolic — actual footprints in verified records</text>
      </g>
      <ConceptBadge />
    </svg>
  );
}

function EscambiaConditionalReuseScene() {
  return (
    <svg className="vision-scene" viewBox="0 0 960 540" role="img" aria-labelledby="ec-vision-title ec-vision-desc">
      <title id="ec-vision-title">Illustrative conditional commercial reuse concept</title>
      <desc id="ec-vision-desc">
        Hypothetical generic commercial architecture alongside a separately depicted protected remedy area. No parcel is identified as buildable, approved, or unconstrained.
      </desc>
      <defs>
        <linearGradient id="ec-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#86bcdf" />
          <stop offset="0.6" stopColor="#d9edf8" />
          <stop offset="1" stopColor="#f1e9d8" />
        </linearGradient>
        <pattern id="ec-masonry" width="24" height="16" patternUnits="userSpaceOnUse">
          <rect width="24" height="16" fill="#b98d63" />
          <path d="M0 0 H24 M0 8 H24 M8 0 V8 M18 8 V16" stroke="#966f4f" strokeWidth="0.7" opacity="0.48" />
        </pattern>
      </defs>

      <rect width="960" height="540" fill="url(#ec-sky)" />

      {/* Background field and protected remedy area, kept separate */}
      <path d="M0 306 C140 284 260 296 380 310 C540 328 700 300 960 322 L960 540 L0 540 Z" fill="#9cb27e" />
      <path d="M560 300 C650 268 790 268 880 292 C920 302 945 310 960 316 L960 430 C860 418 700 420 580 428 C540 430 540 330 560 300 Z" fill="#7fae6a" />
      <path d="M560 300 C650 268 790 268 880 292 C920 302 945 310 960 316" fill="none" stroke="#5f9155" strokeWidth="5" opacity="0.55" />
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M${560 + i * 44} ${300 + (i % 3) * 2} V368`} stroke="#7d8a90" strokeWidth="3" opacity="0.85" />
      ))}
      <path d="M556 312 C660 290 830 288 958 322 M556 326 C660 304 830 302 958 336" fill="none" stroke="#93a1a7" strokeWidth="2.5" opacity="0.8" />
      <PostedSign x={600} y={368} />
      <MonitoringWell x={760} y={330} />
      <MonitoringWell x={868} y={344} />

      {/* Generic commercial frontage — hypothetical, clearly separate from remedy area */}
      <g transform="translate(90 170)">
        <polygon points="0,80 60,58 224,58 262,80" fill="#806b57" />
        <rect x="16" y="80" width="216" height="140" rx="4" fill="#d8d1c1" />
        <rect x="16" y="158" width="216" height="62" fill="url(#ec-masonry)" />
        <rect x="32" y="96" width="184" height="46" fill="#354f59" />
        <FinArray x={40} y={90} count={14} width={8} gap={6.8} height={58} color="#d4c7b0" accent="#9a734e" />
        <path d="M12 144 H236 L222 158 H26 Z" fill="#7a624f" />
        <rect x="80" y="166" width="52" height="54" rx="3" fill="#293f48" />
      </g>
      <g transform="translate(368 196)">
        <polygon points="0,64 48,44 190,44 224,64" fill="#75604c" />
        <rect x="14" y="64" width="188" height="112" rx="4" fill="#d9d4c7" />
        <rect x="14" y="128" width="188" height="48" fill="url(#ec-masonry)" />
        <rect x="28" y="78" width="160" height="36" fill="#344f5c" />
        <FinArray x={36} y={72} count={12} width={7} gap={6.5} height={48} color="#ded1b8" accent="#a77a50" />
        <path d="M10 114 H206 L194 126 H22 Z" fill="#7c6753" />
      </g>

      {/* Street frontage, walk, and shallow-rooted landscaping */}
      <path d="M0 396 C180 376 340 392 500 406 C660 420 820 404 960 414 L960 540 L0 540 Z" fill="#cfc8ba" />
      <path d="M0 470 C200 452 420 468 640 480 C800 490 900 480 960 484 L960 540 L0 540 Z" fill="#8d918a" opacity="0.7" />
      <path d="M0 452 C190 436 380 452 560 464 C720 474 860 466 960 470" fill="none" stroke="#eef0e7" strokeWidth="5" strokeDasharray="18 18" opacity="0.7" />
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i} transform={`translate(${44 + i * 36} ${424 + (i % 3) * 7})`}>
          <path d="M0 14 C-5 4 -2 -3 4 -10 C7 0 9 6 0 14" fill="#4c7a4e" />
          <circle cx="-4" cy="6" r="3" fill={i % 3 === 0 ? '#d89b5f' : '#e7c46b'} />
          <circle cx="5" cy="3" r="2.5" fill={i % 2 === 0 ? '#c97266' : '#eee0a3'} />
        </g>
      ))}

      <ShieldedLight x={330} y={408} />
      <ShieldedLight x={620} y={414} />
      <NativeTree x={44} y={414} scale={0.55} canopy="#4d8a5b" />
      <PalmTree x={548} y={420} scale={0.58} lean={4} />

      {/* Callouts */}
      <g className="vision-callout">
        <path d="M214 250 L180 208" />
        <rect x="60" y="182" width="264" height="24" rx="5" />
        <text x="72" y="199">Generic commercial architecture — hypothetical</text>
      </g>
      <g className="vision-callout">
        <path d="M740 300 L700 262" />
        <rect x="560" y="237" width="280" height="24" rx="5" />
        <text x="572" y="254">Protected remedy area — nothing built</text>
      </g>
      <g className="vision-callout">
        <path d="M300 428 L340 400" />
        <rect x="300" y="452" width="222" height="24" rx="5" />
        <text x="312" y="469">Conceptual shallow-rooted landscaping</text>
      </g>

      <g className="vision-scene-note landscape-note">
        <rect x="540" y="498" rx="6" width="400" height="28" />
        <text x="553" y="517">No parcel identified as buildable or approved</text>
      </g>
      <ConceptBadge />
    </svg>
  );
}

function VisionScene({ perspective }: { perspective: FacilityVisionPerspective }) {
  switch (perspective.sceneId) {
    case 'st-johns-neighborhood':
      return <NeighborhoodScene />;
    case 'st-johns-landscape':
      return <LandscapeScene />;
    case 'st-johns-facility':
      return <FacilityScene />;
    case 'indiantown-energy-reuse':
      return <IndiantownEnergyReuseScene />;
    case 'indiantown-landscape-stewardship':
      return <IndiantownLandscapeStewardshipScene />;
    case 'desoto-neighborhood':
      return <DesotoNeighborhoodScene />;
    case 'desoto-landscape':
      return <DesotoLandscapeScene />;
    case 'desoto-facility':
      return <DesotoFacilityScene />;
    case 'escambia-remedy-first':
      return <EscambiaRemedyFirstScene />;
    case 'escambia-conditional-reuse':
      return <EscambiaConditionalReuseScene />;
  }
}

const PERSPECTIVE_ICONS: Record<FacilityVisionPerspective['icon'], typeof TreePine> = {
  community: Shield,
  landscape: TreePine,
  infrastructure: Building2,
  energy: Sun,
  stewardship: Sprout,
  evidence: FileText,
};

const EVIDENCE_LABELS: Record<FacilityVisionEvidenceNote['type'], string> = {
  documented: 'Documented Public Record',
  'developer-statement': 'Owner / Developer Statement',
  'potential-protection': 'Potential Protection',
  unresolved: 'Unresolved Question',
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
            These concept scenes explore design principles only. They do not show parcel boundaries, building placement,
            buildable land, environmental suitability, an approved architectural style, or a development proposal.
          </span>
        </div>
      </div>

      <div className="facility-vision-intro">
        {profile.introNotes.map(note => {
          const Icon = PERSPECTIVE_ICONS[note.icon];
          return (
            <div key={note.title}>
              <Icon size={18} />
              <div>
                <strong>{note.title}</strong>
                <span>{note.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {profile.evidenceNotes && profile.evidenceNotes.length > 0 && (
        <div className="facility-vision-evidence">
          <div className="facility-vision-evidence-heading">
            <FileText size={16} />
            <div>
              <strong>Record basis &amp; unresolved questions</strong>
              <span>These notes distinguish public evidence from owner statements and concepts requiring verification.</span>
            </div>
          </div>
          <div className="facility-vision-evidence-grid">
            {profile.evidenceNotes.map(note => (
              <div key={`${note.type}-${note.text}`} className="vision-evidence-note">
                <span className={`vision-evidence-badge ${note.type}`}>{EVIDENCE_LABELS[note.type]}</span>
                <p>{note.text}</p>
                {note.source && (
                  <span className="vision-evidence-source">
                    {note.source.label}{note.source.date ? ` · ${note.source.date}` : ''}
                    {note.source.url && (
                      <a href={note.source.url} target="_blank" rel="noreferrer">
                        Public source <ExternalLink size={10} />
                      </a>
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`facility-vision-gallery layout-${profile.galleryLayout}`}>
        {profile.perspectives.map(perspective => {
          const Icon = PERSPECTIVE_ICONS[perspective.icon];
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
          and they are separate from the verified wetlands, flood, conservation, aquatic-preserve, and shoreline GIS layers. Real site evaluation would
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
