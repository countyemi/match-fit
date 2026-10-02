import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dumbbell, Calendar, Target, CheckCircle2, Circle, TrendingUp,
  ChevronRight, ChevronLeft, Flame, Settings, Trophy, Activity,
  ClipboardList, Home, LineChart as LineChartIcon, Plus, X, Info, PlayCircle
} from "lucide-react";

// Builds a real YouTube search link for an exercise — opens externally so the
// person gets an actual, current, licensed video demo rather than anything
// reproduced or embedded here.
function demoSearchUrl(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(name + " exercise proper form tutorial")}`;
}
const LOCAL_DEMOS = {
  "Dead Bug": "/videos/dead-bug.mp4",
  "Weighted Dead Bug": "/videos/dead-bug.mp4",
  "Box Jump (low box)": "/videos/box-jump.mp4",
  "Box Jump (higher box)": "/videos/box-jump.mp4",
  "Hip Thrust": "/videos/hip-thrust.mp4",
  "Med Ball Scoop Toss": "/videos/med-ball-toss.mp4",
  "Pallof Press": "/videos/pallof-press.mp4",
  "Pallof Press (heavier)": "/videos/pallof-press.mp4",
  "Weighted Pallof Press": "/videos/pallof-press.mp4",
  "Band Lateral Walk": "/videos/band-lateral-walk.mp4",
  "Glute Bridge": "/videos/glute-bridge.mp4",
  "Ladder – Linear Run": "/videos/ladder-linear-run.mp4",
  "Leg Swings & Hip Circles": "/videos/leg-swings-hip-circles.mp4",
  "Bulgarian Split Squat": "/videos/bulgarian-split-squat.mp4",
  "Bulgarian Split Squat (loaded)": "/videos/bulgarian-split-squat.mp4",
  "Goblet Squat": "/videos/Goblet_Squat.mp4",
  "Romanian Deadlift": "/videos/Romanian_Deadlift.mp4",
  "Walking Lunge": "/videos/walking-lunge.mp4",
};
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

/* ============================================================
   DESIGN TOKENS
   Warm cream & photography-led premium look, inspired by the
   reference booking/fintech UIs — lime accent, sage numerals,
   real court & gym photography in the hero moments.
   ============================================================ */
const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&display=swap');

.tfa {
  --cream: #F8F6EC;
  --cream-mid: #F0ECDA;
  --card: #FFFFFF;
  --card-hi: #FFFEF9;
  --tile: #16241A;
  --line: #E6E0C9;
  --line-soft: rgba(23,25,15,0.09);
  --ink: #1A1A13;
  --ink-dim: #6E6C5A;
  --lime: #D8FF5C;
  --lime-soft: #ECFFA6;
  --lime-dim: #93A34A;
  --sage: #43542F;
  --sage-soft: #6E8049;
  --clay: #C1502F;
  --clay-deep: #9A4527;
  --ok: #3F7D4E;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 22px;
  --shadow-sm: 0 1px 2px rgba(23,20,10,.06);
  --shadow-md: 0 10px 28px -10px rgba(23,20,10,.14), 0 1px 3px rgba(23,20,10,.05);
  --shadow-lg: 0 24px 48px -16px rgba(23,20,10,.28), 0 2px 8px rgba(23,20,10,.06);
  --ease: cubic-bezier(.2,.7,.3,1);
  font-family: 'IBM Plex Sans', sans-serif;
  background:
    radial-gradient(70% 45% at 12% -6%, rgba(216,255,92,0.14) 0%, transparent 55%),
    linear-gradient(180deg, var(--cream) 0%, var(--cream-mid) 100%);
  color: var(--ink);
  min-height: 100vh;
  width: 100%;
  -webkit-font-smoothing: antialiased;
}
.tfa * { box-sizing: border-box; }
.tfa-scroll { max-width: 860px; margin: 0 auto; padding: 24px 18px 72px; }
.tfa-display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.03em; }
.tfa-mono { font-family: 'IBM Plex Mono', monospace; }
.tfa button, .tfa a, .tfa input, .tfa textarea { transition: all .18s var(--ease); }

/* Header / scoreboard */
.tfa-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.tfa-brand { display: flex; align-items: center; gap: 11px; }
.tfa-brand-button { border: 0; padding: 0; background: transparent; color: inherit; text-align: left; cursor: pointer; }
.tfa-brand-button:hover .tfa-title { color: var(--sage); }
.tfa-brand-mark { width: 36px; height: 36px; border-radius: 10px; background: linear-gradient(145deg, var(--lime-soft), var(--lime)); display:flex; align-items:center; justify-content:center; box-shadow: 0 0 0 1px rgba(0,0,0,.08) inset, var(--shadow-sm); }
.tfa-title { font-size: 27px; line-height: 1; letter-spacing: 0.01em; color: var(--ink); }
.tfa-subtitle { font-size: 10.5px; color: var(--ink-dim); text-transform: uppercase; letter-spacing: 0.14em; margin-top: 3px; }

.tfa-scoreboard { background: linear-gradient(175deg, var(--card-hi), var(--card) 60%); border: 1px solid var(--line); border-radius: var(--radius-xl); padding: 20px 22px; margin-bottom: 18px; position: relative; overflow: hidden; box-shadow: var(--shadow-md); }
.tfa-scoreboard::before { content:''; position:absolute; inset:0; background: repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(23,20,10,0.025) 40px); pointer-events:none; }
.tfa-scoreboard::after { content:''; position:absolute; top:0; left:0; right:0; height:2px; background: linear-gradient(90deg, transparent, var(--lime), transparent); }
.tfa-sets-row { display:flex; gap: 10px; margin-bottom: 16px; position: relative; }
.tfa-set-chip { flex:1; border-radius: var(--radius-md); padding: 11px 13px; background: var(--cream); border: 1px solid var(--line); transition: all .2s var(--ease); }
.tfa-set-chip.active { border-color: var(--lime-dim); box-shadow: 0 0 0 1px var(--lime-dim) inset; background: rgba(216,255,92,0.14); }
.tfa-set-chip.done { border-color: var(--ok); }
.tfa-set-label { font-size: 9.5px; text-transform: uppercase; letter-spacing: .12em; color: var(--ink-dim); font-weight: 600; }
.tfa-set-name { font-size: 21px; font-family: 'Bebas Neue', sans-serif; margin-top: 2px; letter-spacing: .01em; color: var(--ink); }
.tfa-games-track { display:flex; gap: 4px; flex-wrap: wrap; position: relative; }
.tfa-game-dot { width: 9px; height: 9px; border-radius: 3px; background: var(--line); transition: all .2s var(--ease); }
.tfa-game-dot.done { background: var(--ink); }
.tfa-game-dot.today { outline: 2px solid var(--ink); outline-offset: 1.5px; }

/* Nav */
.tfa-nav { display:flex; gap: 4px; margin-bottom: 20px; background: var(--card); padding: 5px; border-radius: 999px; border: 1px solid var(--line); overflow-x:auto; box-shadow: var(--shadow-sm); scrollbar-width: none; }
.tfa-nav::-webkit-scrollbar { display: none; }
.tfa-nav button { flex:1; min-width: 78px; display:flex; flex-direction:column; align-items:center; gap:4px; padding: 10px 6px; border-radius: 999px; background:transparent; border:none; color: var(--ink-dim); font-family: 'IBM Plex Sans'; font-size: 10.5px; letter-spacing:.04em; cursor:pointer; text-transform:uppercase; font-weight:600; }
.tfa-nav button:hover { color: var(--ink); }
.tfa-nav button.active { background: var(--ink); color: var(--cream); box-shadow: var(--shadow-sm); }
.tfa-nav button:focus-visible { outline: 2px solid var(--lime-dim); outline-offset: 2px; }

/* Cards */
.tfa-card { background: linear-gradient(175deg, var(--card-hi), var(--card) 60%); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 20px; margin-bottom: 14px; box-shadow: var(--shadow-sm); }
.tfa-card-title { font-size: 12.5px; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-dim); margin-bottom: 12px; display:flex; align-items:center; gap:7px; font-weight: 600; }
.tfa-structure-intro { max-width: 650px; color: var(--ink-dim); font-size: 13.5px; line-height: 1.55; margin-bottom: 16px; }
.tfa-structure-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.tfa-structure-step { display: flex; align-items: center; gap: 9px; min-height: 48px; padding: 9px 10px; background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius-sm); }
.tfa-structure-number { display: flex; align-items: center; justify-content: center; flex-shrink: 0; width: 24px; height: 24px; border-radius: 50%; background: var(--ink); color: var(--lime); font-family: 'IBM Plex Mono'; font-size: 10px; font-weight: 700; }
.tfa-structure-step span:last-child { color: var(--ink); font-size: 12px; font-weight: 600; line-height: 1.25; }
.tfa-structure-note { display: flex; align-items: flex-start; gap: 8px; margin-top: 14px; padding-top: 13px; border-top: 1px solid var(--line); color: var(--ink-dim); font-size: 12px; line-height: 1.5; }

/* Photo hero */
.tfa-hero { position: relative; overflow: hidden; border-radius: var(--radius-xl); padding: 26px 24px 24px; margin-bottom: 18px; box-shadow: var(--shadow-lg); min-height: 236px; display:flex; flex-direction:column; justify-content:flex-end; }
.tfa-hero-art { position: absolute; inset: 0; z-index: 0; }
.tfa-hero-art svg { width: 100%; height: 100%; display: block; }
.tfa-hero-scrim { position: absolute; inset: 0; z-index: 1; background: linear-gradient(180deg, rgba(15,14,8,.1) 0%, rgba(12,11,6,.5) 55%, rgba(10,9,5,.86) 100%); }
.tfa-hero-content { position: relative; z-index: 2; display: flex; flex-direction: column; align-items: flex-start; }
.tfa-hero-eyebrow { font-size: 10.5px; text-transform:uppercase; letter-spacing:.16em; color: var(--lime); font-weight:700; }
.tfa-hero-title { font-size: 42px; font-family:'Bebas Neue'; line-height:1.02; margin: 6px 0 8px; letter-spacing: .01em; color: #fff; }
.tfa-hero-meta { color: rgba(255,255,255,0.86); font-size: 13px; margin-bottom: 18px; line-height: 1.5; }
.tfa-btn { display:inline-flex; align-items:center; gap:8px; background: linear-gradient(165deg, var(--lime-soft), var(--lime)); color: #16220A; font-weight:700; border:none; padding: 12px 20px; border-radius: var(--radius-md); cursor:pointer; font-family:'IBM Plex Sans'; font-size: 14px; box-shadow: 0 8px 20px -8px rgba(23,20,10,.4); align-self: flex-start; }
.tfa-btn:hover { transform: translateY(-1px); box-shadow: 0 10px 22px -8px rgba(23,20,10,.45); }
.tfa-btn:active { transform: translateY(0); }
.tfa-btn:focus-visible { outline: 2px solid var(--ink); outline-offset: 2px; }
.tfa-btn.secondary { background: rgba(255,255,255,0.14); color: #fff; border: 1px solid rgba(255,255,255,0.4); font-weight: 600; box-shadow: none; backdrop-filter: blur(6px); }
.tfa-btn.secondary:hover { background: rgba(255,255,255,0.22); }
.tfa-btn.ghost { background: transparent; color: var(--ink-dim); border: none; padding: 6px 10px; font-size: 12.5px; box-shadow: none; align-self: auto; }
.tfa-btn.ghost:hover { color: var(--ink); }
.tfa-btn:disabled { opacity: .5; cursor: default; transform: none; }

/* Blocks / exercises */
.tfa-block { margin-bottom: 18px; }
.tfa-block-head { display:flex; align-items:baseline; gap:10px; margin-bottom: 9px; padding-bottom: 8px; position: relative; }
.tfa-block-head::after { content:''; position:absolute; left:0; right:0; bottom:0; height:1px; background: linear-gradient(90deg, var(--line), transparent 85%); }
.tfa-block-name { font-size: 15px; font-weight:700; letter-spacing: .01em; color: var(--ink); }
.tfa-block-time { font-size: 11px; color: var(--ink-dim); margin-left:auto; font-family:'IBM Plex Mono'; }
.tfa-ex { display:flex; align-items:center; gap: 12px; padding: 11px 8px; border-radius: var(--radius-sm); }
.tfa-ex:hover { background: rgba(23,20,10,0.03); }
.tfa-ex-check { flex-shrink:0; cursor:pointer; color: var(--ink-dim); }
.tfa-ex-check:hover { color: var(--ink); }
.tfa-ex-check.checked { color: var(--ok); }
.tfa-ex-icon { flex-shrink:0; width: 46px; height: 46px; background: var(--tile); border-radius: var(--radius-sm); box-shadow: var(--shadow-sm); }
.tfa-ex-body { flex:1; min-width:0; }
.tfa-ex-name { font-size: 14px; font-weight:600; color: var(--ink); }
.tfa-ex-name.checked { text-decoration: line-through; color: var(--ink-dim); }
.tfa-ex-cue { font-size: 12px; color: var(--ink-dim); margin-top:1px; line-height: 1.4; }
.tfa-ex-sets { flex-shrink:0; font-family:'IBM Plex Mono'; font-size: 13px; color: var(--ink); text-align:right; min-width: 66px; font-weight: 700; }
.tfa-ex-demo { flex-shrink:0; display:flex; align-items:center; gap:4px; color: var(--ink-dim); text-decoration:none; font-size: 10.5px; text-transform:uppercase; letter-spacing:.05em; border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 6px 9px; white-space:nowrap; font-weight: 600; }
.tfa-ex-demo:hover { color: var(--ink); border-color: var(--lime-dim); background: rgba(216,255,92,0.22); }
.tfa-ex-demo:focus-visible { outline: 2px solid var(--lime-dim); outline-offset: 2px; }
.tfa-video-backdrop { position: fixed; inset: 0; z-index: 10; display: flex; align-items: center; justify-content: center; padding: 18px; background: rgba(12, 14, 8, .72); backdrop-filter: blur(5px); }
.tfa-video-dialog { width: min(760px, 100%); background: var(--card-hi); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: 14px; box-shadow: var(--shadow-lg); }
.tfa-video-dialog-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 11px; }
.tfa-video-dialog-title { font-size: 15px; font-weight: 700; color: var(--ink); }
.tfa-video-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; padding: 0; border: 1px solid var(--line); border-radius: var(--radius-sm); background: var(--cream); color: var(--ink-dim); cursor: pointer; }
.tfa-video-close:hover { color: var(--ink); border-color: var(--ink-dim); }
.tfa-video-player { display: block; width: 100%; max-height: 70vh; background: #111; border-radius: var(--radius-sm); }

.tfa-deload { background: linear-gradient(135deg, rgba(216,255,92,0.22), rgba(216,255,92,0.08)); border: 1px solid var(--lime-dim); border-radius: var(--radius-md); padding: 12px 16px; font-size: 12.5px; color: var(--ink); margin-bottom: 16px; display:flex; gap:9px; align-items:flex-start; line-height: 1.5; font-weight: 500; }

/* Plan list */
.tfa-week-row { display:flex; align-items:center; gap: 12px; padding: 13px 10px; border-radius: var(--radius-md); cursor:pointer; border: 1px solid transparent; }
.tfa-week-row:hover { border-color: var(--line); background: rgba(23,20,10,0.02); }
.tfa-week-num { font-family:'Bebas Neue'; font-size: 22px; width: 46px; text-align:center; color: var(--ink-dim); }
.tfa-week-num.current { color: var(--ink); font-weight: 700; }
.tfa-week-body { flex:1; }
.tfa-week-title { font-size: 13.5px; font-weight:600; color: var(--ink); }
.tfa-week-sub { font-size: 11px; color: var(--ink-dim); margin-top: 1px; }
.tfa-pip-row { display:flex; gap:5px; }
.tfa-pip { width: 23px; height: 23px; border-radius: 7px; background: var(--cream); border: 1px solid var(--line); display:flex; align-items:center; justify-content:center; font-size: 10px; font-weight:700; color: var(--ink-dim); }
.tfa-pip:hover { border-color: var(--ink-dim); }
.tfa-pip.done { background: var(--ink); border-color: var(--ink); color: var(--lime); }
.tfa-week-sessions { margin: -4px 10px 10px 68px; border-left: 1px solid var(--line); padding-left: 12px; }
.tfa-session-row { width: 100%; display:flex; align-items:center; gap: 10px; padding: 9px 10px; border: 0; border-radius: var(--radius-sm); background: transparent; color: var(--ink); text-align:left; cursor:pointer; }
.tfa-session-row:hover { background: rgba(23,20,10,0.04); }
.tfa-session-row > span:nth-child(2) { flex: 1; min-width: 0; }
.tfa-session-row strong, .tfa-session-row small { display:block; }
.tfa-session-row strong { font-size: 12.5px; }
.tfa-session-row small { color: var(--ink-dim); font-size: 11px; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tfa-session-row > svg { color: var(--ink-dim); flex-shrink: 0; }

/* Progress */
.tfa-stat-grid { display:grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 16px; }
.tfa-stat { background: var(--cream); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 15px 13px; }
.tfa-stat-num { font-family:'Bebas Neue'; font-size: 31px; line-height:1; color: var(--ink); }
.tfa-stat-label { font-size: 10px; color: var(--ink-dim); text-transform:uppercase; letter-spacing:.07em; margin-top: 4px; font-weight: 600; }
.tfa-pace { font-size: 13px; padding: 11px 15px; border-radius: var(--radius-md); background: rgba(63,125,78,0.1); color: var(--ok); border: 1px solid rgba(63,125,78,0.25); margin-bottom: 16px; line-height: 1.5; }
.tfa-pace.behind { background: rgba(193,80,47,0.09); color: var(--clay-deep); border-color: rgba(193,80,47,0.28); }

.tfa-goal-item { display:flex; gap:10px; padding: 9px 0; position: relative; font-size: 13.5px; line-height: 1.5; }
.tfa-goal-item:not(:last-child)::after { content:''; position:absolute; left:0; right:0; bottom:0; height:1px; background: var(--line); }
.tfa-goal-dot { width:6px; height:6px; border-radius:50%; background: var(--lime-dim); margin-top:7px; flex-shrink:0; }

.tfa-input { width:100%; background: var(--cream); border: 1px solid var(--line); color: var(--ink); padding: 10px 12px; border-radius: var(--radius-sm); font-family:'IBM Plex Sans'; font-size: 13.5px; }
.tfa-input:focus { outline: none; border-color: var(--lime-dim); box-shadow: 0 0 0 3px rgba(216,255,92,.18); }
.tfa-label { font-size: 10.5px; text-transform:uppercase; letter-spacing:.09em; color: var(--ink-dim); margin-bottom: 6px; display:block; font-weight: 600; }
.tfa-row-2 { display:grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.tfa-rpe-row { display:flex; gap:6px; margin-top: 4px; flex-wrap: wrap; }
.tfa-rpe-btn { width: 29px; height: 29px; border-radius: var(--radius-sm); border: 1px solid var(--line); background: var(--cream); color: var(--ink-dim); font-family:'IBM Plex Mono'; font-size: 12px; cursor:pointer; font-weight: 600; }
.tfa-rpe-btn:hover { border-color: var(--ink-dim); }
.tfa-rpe-btn.active { background: var(--clay); border-color: var(--clay); color: white; }

.tfa-empty { text-align:center; padding: 32px 16px; color: var(--ink-dim); font-size: 13.5px; }

@media (max-width: 480px) {
  .tfa-stat-grid { grid-template-columns: repeat(3,1fr); gap: 7px; }
  .tfa-structure-grid { grid-template-columns: repeat(2, 1fr); }
  .tfa-stat-num { font-size: 24px; }
  .tfa-hero-title { font-size: 32px; }
  .tfa-ex { flex-wrap: wrap; }
  .tfa-ex-body { min-width: 140px; }
  .tfa-ex-sets { margin-left: 58px; }
}
@media (prefers-reduced-motion: reduce) {
  .tfa * { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; }
}

/* Pattern icon keyframes */
@keyframes tfaBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(4px); } }
@keyframes tfaSquatLimb { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(22deg); } }
@keyframes tfaHinge { 0%,100% { transform: rotate(0deg); } 50% { transform: rotate(-28deg); } }
@keyframes tfaPush { 0%,100% { transform: translateX(0); } 50% { transform: translateX(-5px); } }
@keyframes tfaPull { 0%,100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
@keyframes tfaLunge { 0%,100% { transform: translateX(0) translateY(0); } 50% { transform: translateX(6px) translateY(2px); } }
@keyframes tfaRotate { 0%,100% { transform: rotate(-20deg); } 50% { transform: rotate(20deg); } }
@keyframes tfaJump { 0%,100% { transform: translateY(0); } 40% { transform: translateY(-7px); } 60% { transform: translateY(-7px);} }
@keyframes tfaAgility { 0%,100% { transform: translateX(-5px); } 50% { transform: translateX(5px); } }
@keyframes tfaBrace { 0%,100% { transform: scaleY(1); } 50% { transform: scaleY(0.92); } }
@keyframes tfaThrow { 0%,100% { transform: rotate(10deg) translateX(0); } 50% { transform: rotate(-35deg) translateX(-4px); } }
@keyframes tfaPulse { 0%,100% { r: 5; opacity:1; } 50% { r: 8; opacity:.6; } }
@keyframes tfaStretch { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(1.15); } }
`;

/* ============================================================
   MOVEMENT-PATTERN ICONS (custom, not stock video — avoids
   licensing issues and stays lightweight)
   ============================================================ */
function PatternIcon({ pattern }) {
  const stroke = "#D8FF5C";
  const dim = "#7C9280";
  const common = { viewBox: "0 0 60 60", width: 46, height: 46 };
  switch (pattern) {
    case "squat":
      return (
        <svg {...common}>
          <circle cx="30" cy="16" r="6" fill={stroke} />
          <line x1="30" y1="22" x2="30" y2="38" stroke={stroke} strokeWidth="3" style={{ animation: "tfaBounce 1.1s ease-in-out infinite" }} />
          <g style={{ transformOrigin: "30px 38px", animation: "tfaSquatLimb 1.1s ease-in-out infinite" }}>
            <line x1="30" y1="38" x2="22" y2="52" stroke={dim} strokeWidth="3" />
            <line x1="30" y1="38" x2="38" y2="52" stroke={dim} strokeWidth="3" />
          </g>
        </svg>
      );
    case "hinge":
      return (
        <svg {...common}>
          <circle cx="24" cy="14" r="5" fill={stroke} />
          <g style={{ transformOrigin: "26px 30px", animation: "tfaHinge 1.3s ease-in-out infinite" }}>
            <line x1="24" y1="19" x2="26" y2="34" stroke={stroke} strokeWidth="3" />
          </g>
          <line x1="26" y1="34" x2="26" y2="50" stroke={dim} strokeWidth="3" />
          <line x1="26" y1="50" x2="38" y2="50" stroke={dim} strokeWidth="3" />
        </svg>
      );
    case "push":
      return (
        <svg {...common}>
          <circle cx="30" cy="30" r="6" fill={stroke} />
          <line x1="30" y1="36" x2="30" y2="50" stroke={dim} strokeWidth="3" />
          <g style={{ animation: "tfaPush 1s ease-in-out infinite" }}>
            <line x1="30" y1="30" x2="46" y2="30" stroke={stroke} strokeWidth="3" />
          </g>
        </svg>
      );
    case "pull":
      return (
        <svg {...common}>
          <circle cx="30" cy="30" r="6" fill={stroke} />
          <line x1="30" y1="36" x2="30" y2="50" stroke={dim} strokeWidth="3" />
          <g style={{ animation: "tfaPull 1s ease-in-out infinite" }}>
            <line x1="30" y1="30" x2="14" y2="30" stroke={stroke} strokeWidth="3" />
          </g>
        </svg>
      );
    case "lunge":
      return (
        <svg {...common}>
          <circle cx="26" cy="14" r="5" fill={stroke} />
          <line x1="26" y1="19" x2="26" y2="36" stroke={stroke} strokeWidth="3" />
          <g style={{ animation: "tfaLunge 1.2s ease-in-out infinite" }}>
            <line x1="26" y1="36" x2="18" y2="52" stroke={dim} strokeWidth="3" />
            <line x1="26" y1="36" x2="40" y2="46" stroke={dim} strokeWidth="3" />
          </g>
        </svg>
      );
    case "rotate":
      return (
        <svg {...common}>
          <circle cx="30" cy="18" r="5" fill={stroke} />
          <line x1="30" y1="23" x2="30" y2="42" stroke={dim} strokeWidth="3" />
          <g style={{ transformOrigin: "30px 30px", animation: "tfaRotate 1s ease-in-out infinite" }}>
            <line x1="14" y1="30" x2="46" y2="30" stroke={stroke} strokeWidth="3" />
          </g>
        </svg>
      );
    case "jump":
      return (
        <svg {...common}>
          <g style={{ animation: "tfaJump 1s ease-in-out infinite" }}>
            <circle cx="30" cy="18" r="6" fill={stroke} />
            <line x1="30" y1="24" x2="30" y2="38" stroke={stroke} strokeWidth="3" />
            <line x1="30" y1="38" x2="22" y2="50" stroke={dim} strokeWidth="3" />
            <line x1="30" y1="38" x2="38" y2="50" stroke={dim} strokeWidth="3" />
          </g>
        </svg>
      );
    case "agility":
      return (
        <svg {...common}>
          <g style={{ animation: "tfaAgility 0.8s ease-in-out infinite" }}>
            <circle cx="30" cy="18" r="6" fill={stroke} />
            <line x1="30" y1="24" x2="30" y2="38" stroke={stroke} strokeWidth="3" />
            <line x1="30" y1="38" x2="20" y2="50" stroke={dim} strokeWidth="3" />
            <line x1="30" y1="38" x2="40" y2="50" stroke={dim} strokeWidth="3" />
          </g>
        </svg>
      );
    case "core":
      return (
        <svg {...common}>
          <g style={{ transformOrigin: "30px 30px", animation: "tfaBrace 1.4s ease-in-out infinite" }}>
            <circle cx="16" cy="30" r="5" fill={stroke} />
            <line x1="21" y1="30" x2="44" y2="30" stroke={stroke} strokeWidth="3" />
            <line x1="30" y1="30" x2="30" y2="42" stroke={dim} strokeWidth="3" />
          </g>
        </svg>
      );
    case "throw":
      return (
        <svg {...common}>
          <circle cx="24" cy="16" r="5" fill={stroke} />
          <line x1="24" y1="21" x2="24" y2="40" stroke={dim} strokeWidth="3" />
          <g style={{ transformOrigin: "24px 24px", animation: "tfaThrow 1s ease-in-out infinite" }}>
            <line x1="24" y1="24" x2="44" y2="18" stroke={stroke} strokeWidth="3" />
          </g>
        </svg>
      );
    case "cardio":
      return (
        <svg {...common}>
          <circle cx="30" cy="30" r="5" fill={stroke} style={{ animation: "tfaPulse 0.9s ease-in-out infinite" }} />
          <circle cx="30" cy="30" r="14" fill="none" stroke={dim} strokeWidth="2" opacity="0.5" />
        </svg>
      );
    case "stretch":
    default:
      return (
        <svg {...common}>
          <circle cx="30" cy="16" r="5" fill={stroke} />
          <g style={{ transformOrigin: "30px 30px", animation: "tfaStretch 1.6s ease-in-out infinite" }}>
            <line x1="16" y1="30" x2="44" y2="30" stroke={stroke} strokeWidth="3" />
          </g>
          <line x1="30" y1="30" x2="30" y2="50" stroke={dim} strokeWidth="3" />
        </svg>
      );
  }
}

/* ============================================================
   HERO SCENE ART — illustrated SVG backgrounds (court / gym /
   celebration) instead of hotlinked photos, so it always renders.
   ============================================================ */
function SceneArt({ kind }) {
  if (kind === "gym") {
    return (
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="gymSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#26301F" />
            <stop offset="100%" stopColor="#0F1710" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#gymSky)" />
        {[...Array(6)].map((_, i) => (
          <line key={i} x1={i * 70 - 20} y1="0" x2={i * 70 + 60} y2="240" stroke="#3A4A2C" strokeWidth="1" opacity="0.25" />
        ))}
        {/* rack shelf */}
        <rect x="0" y="150" width="400" height="6" fill="#0B120C" />
        {/* dumbbells */}
        {[40, 100, 160, 220, 280, 340].map((x, i) => (
          <g key={x}>
            <rect x={x - 22} y="122" width="44" height="10" rx="3" fill="#1B2818" />
            <circle cx={x - 18} cy="127" r="13" fill="#0D140E" stroke="#3A4A2C" strokeWidth="1.5" />
            <circle cx={x + 18} cy="127" r="13" fill="#0D140E" stroke="#3A4A2C" strokeWidth="1.5" />
          </g>
        ))}
        {/* barbell leaning */}
        <line x1="330" y1="240" x2="230" y2="70" stroke="#2A3520" strokeWidth="8" />
        <circle cx="230" cy="70" r="20" fill="#161F12" stroke="#D8FF5C" strokeWidth="2" opacity="0.85" />
        <circle cx="330" cy="240" r="24" fill="#161F12" stroke="#3A4A2C" strokeWidth="2" />
      </svg>
    );
  }
  if (kind === "trophy") {
    return (
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="trophySky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#5C6E3B" />
            <stop offset="55%" stopColor="#33421F" />
            <stop offset="100%" stopColor="#171F0F" />
          </linearGradient>
        </defs>
        <rect width="400" height="240" fill="url(#trophySky)" />
        <circle cx="330" cy="40" r="70" fill="#D8FF5C" opacity="0.18" />
        {[...Array(14)].map((_, i) => (
          <circle key={i} cx={(i * 53 + 20) % 400} cy={((i * 97) % 200) + 10} r={i % 3 === 0 ? 3 : 2} fill="#D8FF5C" opacity="0.5" />
        ))}
        <g transform="translate(200,150)">
          <rect x="-30" y="60" width="60" height="14" rx="3" fill="#0F1710" />
          <rect x="-10" y="30" width="20" height="34" fill="#0F1710" />
          <path d="M -34 -30 C -34 10, -20 30, 0 30 C 20 30, 34 10, 34 -30 Z" fill="#161F12" stroke="#D8FF5C" strokeWidth="2.5" />
          <path d="M -34 -18 C -55 -14, -55 20, -32 24" fill="none" stroke="#D8FF5C" strokeWidth="2.5" />
          <path d="M 34 -18 C 55 -14, 55 20, 32 24" fill="none" stroke="#D8FF5C" strokeWidth="2.5" />
        </g>
      </svg>
    );
  }
  // court-sunset / court-action share a base court illustration
  const action = kind === "court-action";
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="courtSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8935A" />
          <stop offset="45%" stopColor="#9C6B4E" />
          <stop offset="100%" stopColor="#3E4A2E" />
        </linearGradient>
        <linearGradient id="courtSurface" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4F6B3C" />
          <stop offset="100%" stopColor="#2E4023" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#courtSky)" />
      <circle cx="70" cy="55" r="38" fill="#F7D080" opacity="0.55" />
      {/* tree/hedge line at horizon */}
      <rect x="0" y="118" width="400" height="18" fill="#2E3A22" opacity="0.7" />
      {/* court surface (perspective trapezoid) */}
      <polygon points="40,240 360,240 300,130 100,130" fill="url(#courtSurface)" />
      {/* court lines */}
      <polygon points="60,232 340,232 292,138 108,138" fill="none" stroke="#EDEADA" strokeWidth="2.5" opacity="0.85" />
      <line x1="200" y1="138" x2="200" y2="232" stroke="#EDEADA" strokeWidth="2" opacity="0.7" />
      <line x1="80" y1="185" x2="320" y2="185" stroke="#EDEADA" strokeWidth="2" opacity="0.7" />
      {/* net */}
      <line x1="80" y1="130" x2="80" y2="185" stroke="#EDEADA" strokeWidth="2" opacity="0.6" />
      <line x1="320" y1="130" x2="320" y2="185" stroke="#EDEADA" strokeWidth="2" opacity="0.6" />
      <line x1="80" y1="132" x2="320" y2="132" stroke="#EDEADA" strokeWidth="3" opacity="0.75" />
      {action && (
        <g transform="translate(200,150)">
          <circle cx="0" cy="-8" r="8" fill="#1A1A13" />
          <line x1="0" y1="0" x2="0" y2="26" stroke="#1A1A13" strokeWidth="4" />
          <line x1="0" y1="6" x2="-16" y2="26" stroke="#1A1A13" strokeWidth="4" />
          <line x1="0" y1="6" x2="18" y2="-14" stroke="#1A1A13" strokeWidth="4" />
          <line x1="18" y1="-14" x2="34" y2="-30" stroke="#1A1A13" strokeWidth="3" />
          <ellipse cx="42" cy="-38" rx="12" ry="16" fill="none" stroke="#D8FF5C" strokeWidth="2.5" transform="rotate(35 42 -38)" />
          <line x1="0" y1="26" x2="-6" y2="46" stroke="#1A1A13" strokeWidth="4" />
          <line x1="0" y1="26" x2="10" y2="46" stroke="#1A1A13" strokeWidth="4" />
        </g>
      )}
    </svg>
  );
}


const PHASES = [
  { id: 1, name: "Foundation", range: "Weeks 1–8 · Months 1–2", weeks: [1, 8],
    focus: "Movement quality, base hypertrophy, injury-proof shoulders/knees, build the habit." },
  { id: 2, name: "Build", range: "Weeks 9–17 · Months 3–4",  weeks: [9, 17],
    focus: "Heavier strength, real power complexes, sharper agility, weighted core." },
  { id: 3, name: "Peak", range: "Weeks 18–26 · Months 5–6", weeks: [18, 26],
    focus: "Max power & game-speed reactions, strength maintained, fat-loss finishers intensify." },
];
const TOTAL_WEEKS = 26;
const DELOAD_WEEKS = new Set([4, 8, 12, 16, 20, 24]);

const ex = (name, sets, reps, pattern, cue) => ({ name, sets, reps, pattern, cue });

const DEFAULT_PROFILE = {
  age: "",
  availability: "3",
  sessionMinutes: "120",
  priority: "agility",
  experience: "intermediate",
};
const ACTIVE_USER_KEY = "match-fit-active-user";
const LEGACY_USERNAMES_KEY = "match-fit-usernames";

function normalizeUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").toLowerCase();
}

async function getUsernameList() {
  const response = await fetch("/api/users");
  if (!response.ok) throw new Error("Could not load usernames.");
  const serverUsers = await response.json();
  try {
    const oldUsers = JSON.parse(window.localStorage.getItem(LEGACY_USERNAMES_KEY) || "[]");
    return [...new Set([...serverUsers, ...oldUsers.map(normalizeUsername)])];
  } catch {
    return serverUsers;
  }
}

function readLegacyUserState(username) {
  try {
    const raw = window.localStorage.getItem(`match-fit-user-${normalizeUsername(username)}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

async function readUserState(username) {
  const response = await fetch(`/api/users/${encodeURIComponent(normalizeUsername(username))}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Could not load saved progress.");
  const saved = await response.json();
  return saved.state || null;
}

async function writeUserState(username, value) {
  const response = await fetch(`/api/users/${encodeURIComponent(normalizeUsername(username))}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
  if (!response.ok) throw new Error("Could not save progress.");
}

function adjustSets(value, amount) {
  const sets = Number(value);
  return Number.isFinite(sets) ? String(Math.max(1, sets + amount)) : value;
}

function personalisedBlocks(phase, day, profile) {
  const source = TEMPLATES[phase][day];
  if (!profile) return source;

  const shortSession = Number(profile.sessionMinutes) <= 60;
  const priority = profile.priority;
  return source
    .filter((block) => !(shortSession && ["Conditioning Finisher", "Cooldown"].some((name) => block.label.startsWith(name))))
    .map((block) => ({
      ...block,
      exercises: block.exercises.map((exercise) => {
        const targetsPriority =
          (priority === "forehand" && day === "C" && ["throw", "rotate", "hinge"].includes(exercise.pattern)) ||
          (priority === "backhand" && day === "B" && ["pull", "rotate"].includes(exercise.pattern)) ||
          (priority === "serve" && day === "B" && ["push", "throw", "rotate"].includes(exercise.pattern)) ||
          (priority === "agility" && block.label.startsWith("Reactive")) ||
          (priority === "endurance" && ["Reactive", "Conditioning"].some((label) => block.label.startsWith(label)));
        return targetsPriority ? { ...exercise, sets: adjustSets(exercise.sets, 1) } : exercise;
      }),
    }));
}

// Day A = Lower Body Power + Strength + Core
// Day B = Upper Body Power + Shoulder Care + Core
// Day C = Full-Body Integration + Reactive Agility + Conditioning
const TEMPLATES = {
  1: {
    A: [
      { label: "Warm-Up", time: "10 min", exercises: [
        ex("Leg Swings & Hip Circles", "2", "10 each", "stretch", "Controlled range, not max stretch"),
        ex("Glute Bridge", "2", "15", "hinge", "Squeeze glutes at top, 1s hold"),
        ex("Band Lateral Walk", "2", "10 each dir.", "agility", "Stay low, knees out"),
      ]},
      { label: "Reactive / Agility", time: "10 min", exercises: [
        ex("Ladder – Linear Run", "4", "1 pass", "agility", "Quick feet, tall posture"),
        ex("Reaction Ball Catches", "3", "10", "agility", "React, don't anticipate"),
      ]},
      { label: "Power", time: "15 min", exercises: [
        ex("Box Jump (low box)", "4", "5", "jump", "Land soft, reset each rep"),
        ex("Med Ball Scoop Toss", "3", "8", "throw", "Drive from legs, not arms"),
      ]},
      { label: "Strength", time: "45 min", exercises: [
        ex("Goblet Squat", "4", "10", "squat", "Chest tall, knees track toes"),
        ex("Romanian Deadlift", "3", "10", "hinge", "Hinge at hips, flat back"),
        ex("Bulgarian Split Squat", "3", "10 /leg", "lunge", "Front knee stacked over ankle"),
        ex("Walking Lunge", "3", "12 /leg", "lunge", "Long stride, upright torso"),
        ex("Hip Thrust", "3", "12", "hinge", "Full lockout, ribs down"),
      ]},
      { label: "Core", time: "15 min", exercises: [
        ex("Plank", "3", "40s", "core", "Ribs down, glutes tight"),
        ex("Dead Bug", "3", "10 /side", "core", "Low back pinned to floor"),
        ex("Pallof Press", "3", "12 /side", "core", "Resist the twist"),
      ]},
      { label: "Cooldown", time: "10 min", exercises: [
      ]},
    ],
    B: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Band Pull-Apart", "2", "15", "pull", "Squeeze shoulder blades"),
        ex("Scapular Wall Slides", "2", "10", "pull", "Ribs down, slide slow"),
        ex("Arm Circles + YTWs", "2", "10 each", "stretch", "Small then large circles"),
      ]},
      { label: "Reactive / Agility", time: "10 min", exercises: [
        ex("Reaction Ball Wall Toss", "3", "10", "agility", "React off the bounce"),
        ex("Ladder – Icky Shuffle", "4", "1 pass", "agility", "Quick, light steps"),
      ]},
      { label: "Power", time: "15 min", exercises: [
        ex("Med Ball Chest Pass", "3", "8", "throw", "Explode through the ball"),
        ex("Med Ball Overhead Slam", "3", "8", "throw", "Full body extension"),
      ]},
      { label: "Strength", time: "45 min", exercises: [
        ex("Dumbbell Bench Press", "4", "10", "push", "Control the descent"),
        ex("Seated Cable Row", "4", "10", "pull", "Drive elbows back"),
        ex("Standing Landmine Press", "3", "10 /side", "push", "Brace core, press up & out"),
        ex("Single-Arm DB Row", "3", "10 /side", "pull", "Flat back, no twisting"),
        ex("Cuban Press", "3", "12", "rotate", "Slow, light weight — shoulder health"),
        ex("Band External Rotation", "3", "15", "rotate", "Elbow pinned to side"),
      ]},
      { label: "Core", time: "15 min", exercises: [
        ex("Side Plank w/ Rotation", "3", "8 /side", "core", "Reach under, then open up"),
        ex("Hanging Knee Raise", "3", "10", "core", "No swinging"),
        ex("Cable Anti-Rotation Chop", "3", "10 /side", "core", "Hips stay square"),
      ]},
      { label: "Cooldown", time: "10 min", exercises: [
        ex("Pec / Shoulder Stretch", "2", "30s /side", "stretch", "Doorway stretch, gentle"),
        ex("Thoracic Rotation Stretch", "2", "8 /side", "stretch", "Open through the chest"),
      ]},
    ],
    C: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Light Jump Rope", "1", "3 min", "cardio", "Easy bounce, find rhythm"),
        ex("Dynamic Lunge w/ Twist", "2", "8 /side", "lunge", "Rotate toward front leg"),
        ex("Inchworm", "2", "8", "stretch", "Walk hands out slow"),
      ]},
      { label: "Reactive / Agility", time: "12 min", exercises: [
        ex("5-10-5 Pro Agility (light)", "4", "1 rep", "agility", "Low, quick change of direction"),
        ex("Lateral Cone Shuffle", "4", "20s", "agility", "Stay low, don't cross feet"),
        ex("Split-Step & React Drill", "3", "10", "agility", "Split as cue lands, react"),
      ]},
      { label: "Power", time: "12 min", exercises: [
        ex("Kettlebell Swing", "4", "12", "hinge", "Hips snap, not squat"),
        ex("Skater Hop", "3", "8 /side", "jump", "Stick each landing"),
      ]},
      { label: "Strength (Full Body)", time: "35 min", exercises: [
        ex("Trap Bar / DB Deadlift", "3", "8", "hinge", "Push floor away"),
        ex("Push-Up", "3", "AMRAP", "push", "Full range, tight core"),
        ex("Chin-Up / Assisted Pulldown", "3", "8", "pull", "Full hang to chin over bar"),
        ex("Walking Lunge w/ Rotation", "3", "10 /leg", "lunge", "Rotate toward lead leg"),
      ]},
      { label: "Core", time: "10 min", exercises: [
        ex("Controlled Russian Twist", "3", "16", "core", "Slow — control, not speed"),
        ex("Plank Shoulder Taps", "3", "20", "core", "Hips stay still"),
      ]},
      { label: "Conditioning Finisher", time: "10 min", exercises: [
        ex("Bike or Row Intervals", "6", "20s on/40s off", "cardio", "Hard effort, full recovery"),
      ]},
    ],
  },
  2: {
    A: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Dynamic Mobility Flow", "1", "6 min", "stretch", "Hips, ankles, t-spine"),
        ex("Glute Bridge", "2", "12", "hinge", "Fast set-up, quality reps"),
      ]},
      { label: "Reactive / Agility", time: "12 min", exercises: [
        ex("Ladder – Lateral + Crossover", "4", "1 pass", "agility", "Hips stay low"),
        ex("Reactive Ball Drop-Catch", "3", "10", "agility", "React only after drop"),
        ex("5-10-5 Shuttle (moderate)", "4", "1 rep", "agility", "Push effort up"),
      ]},
      { label: "Power", time: "15 min", exercises: [
        ex("Box Jump (higher box)", "5", "5", "jump", "Full triple extension"),
        ex("Broad Jump", "4", "5", "jump", "Stick the landing"),
        ex("Med Ball Rotational Throw", "4", "8 /side", "throw", "Rotate through hips first"),
      ]},
      { label: "Strength", time: "40 min", exercises: [
        ex("Barbell Back Squat", "5", "6", "squat", "Heavier — brace before descent"),
        ex("Romanian Deadlift", "4", "8", "hinge", "Feel hamstring stretch"),
        ex("Bulgarian Split Squat (loaded)", "4", "8 /leg", "lunge", "Add dumbbells"),
        ex("Single-Leg RDL", "3", "8 /leg", "hinge", "Balance + posterior chain"),
      ]},
      { label: "Core", time: "15 min", exercises: [
        ex("Weighted Plank", "3", "40s", "core", "Plate on back, stay rigid"),
        ex("Pallof Press (heavier)", "3", "10 /side", "core", "Slower tempo"),
        ex("Side Plank w/ Rotation", "3", "10 /side", "core", "Full reach through"),
      ]},
      { label: "Cooldown", time: "10 min", exercises: [
      ]},
    ],
    B: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Band Pull-Apart", "2", "15", "pull", "Warm the upper back"),
        ex("Scap Wall Slides", "2", "10", "pull", "Controlled, full range"),
      ]},
      { label: "Reactive / Agility", time: "10 min", exercises: [
        ex("Reaction Ball", "3", "12", "agility", "Faster reset each set"),
        ex("Quick-Hands Ladder", "5", "1 pass", "agility", "Hands match feet speed"),
      ]},
      { label: "Power", time: "12 min", exercises: [
        ex("Med Ball Overhead Slam (heavier)", "4", "8", "throw", "Full extension on reach"),
        ex("Landmine Rotation", "4", "8 /side", "rotate", "Drive from back foot"),
      ]},
      { label: "Strength", time: "45 min", exercises: [
        ex("Incline DB Press", "5", "6", "push", "Heavier — control the negative"),
        ex("Lat Pulldown", "4", "8", "pull", "Drive elbows down & back"),
        ex("Single-Arm DB Row (heavier)", "4", "8 /side", "pull", "No rotation through torso"),
        ex("Face Pull", "3", "15", "pull", "External rotation at end range"),
        ex("Cuban Press", "3", "12", "rotate", "Keep it light — quality over load"),
      ]},
      { label: "Core", time: "15 min", exercises: [
        ex("Hanging Knee Raise", "3", "12", "core", "Add slight rotation if strong"),
        ex("Cable Anti-Rotation Chop", "3", "10 /side", "core", "Resist the pull"),
        ex("Weighted Dead Bug", "3", "10 /side", "core", "Hold light plate overhead"),
      ]},
      { label: "Cooldown", time: "10 min", exercises: [
        ex("Pec / Shoulder Stretch", "2", "30s /side", "stretch", "Ease into it"),
        ex("Thoracic Rotation", "2", "8 /side", "stretch", "Follow the reach with eyes"),
      ]},
    ],
    C: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Jump Rope", "1", "3 min", "cardio", "Build a light sweat"),
        ex("Dynamic Lunge Flow", "2", "8 /side", "lunge", "Add rotation each rep"),
      ]},
      { label: "Reactive / Agility", time: "14 min", exercises: [
        ex("Pro Agility Shuttle (high effort)", "5", "1 rep", "agility", "Push pace, keep form"),
        ex("Lateral Bounds", "4", "6 /side", "agility", "Stick each landing, then explode"),
        ex("Mini-Hurdle Lateral Steps", "3", "20s", "agility", "Quick, light contact"),
      ]},
      { label: "Power", time: "12 min", exercises: [
        ex("Kettlebell Swing (heavier)", "4", "15", "hinge", "Snap the hips hard"),
        ex("DB Hang Clean (light)", "4", "6", "jump", "Focus on the pull, not the catch"),
      ]},
      { label: "Strength", time: "30 min", exercises: [
        ex("Deadlift", "4", "6", "hinge", "Reset each rep, brace hard"),
        ex("Push-Up (weighted/deficit)", "3", "AMRAP", "push", "Add a plate on back if ready"),
        ex("Chin-Up", "4", "8", "pull", "Add weight if bodyweight is easy"),
        ex("Step-Up w/ Knee Drive", "3", "8 /leg", "lunge", "Drive knee up explosively"),
      ]},
      { label: "Core", time: "10 min", exercises: [
        ex("Weighted Russian Twist", "3", "20", "core", "Controlled tempo, not speed"),
        ex("Plank Shoulder Taps (fast)", "3", "24", "core", "Minimize hip sway"),
      ]},
      { label: "Conditioning Finisher", time: "10 min", exercises: [
        ex("Battle Ropes or Sled Push/Pull", "6", "20s on/40s off", "cardio", "All-out effort"),
      ]},
    ],
  },
  3: {
    A: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Dynamic Mobility Flow", "1", "6 min", "stretch", "Get hips & ankles hot"),
        ex("Pogo Hops", "2", "10", "jump", "Stiff ankles, quick contact"),
      ]},
      { label: "Reactive / Agility (game speed)", time: "14 min", exercises: [
        ex("Split-Step & Multi-Directional React", "12", "1 rep", "agility", "Simulate reading a shot"),
        ex("5-10-5 Shuttle (max effort)", "5", "1 rep", "agility", "All-out, full recovery between"),
        ex("Reactive Ball – 2 Ball Drill", "3", "10", "agility", "React fast, no guessing"),
      ]},
      { label: "Power", time: "15 min", exercises: [
        ex("Depth Jump", "4", "5", "jump", "Minimal ground contact time"),
        ex("Broad Jump", "5", "5", "jump", "Chase max distance"),
        ex("Med Ball Rotational Throw (max speed)", "5", "6 /side", "throw", "This mirrors your swing power"),
      ]},
      { label: "Strength (maintain)", time: "30 min", exercises: [
        ex("Back Squat", "4", "5", "squat", "Heavy but crisp — no grinding reps"),
        ex("Romanian Deadlift", "3", "6", "hinge", "Keep bar close"),
        ex("Bulgarian Split Squat", "3", "6 /leg", "lunge", "Explosive up, controlled down"),
      ]},
      { label: "Core", time: "12 min", exercises: [
        ex("Weighted Pallof Press", "4", "10 /side", "core", "Heaviest load of the program"),
        ex("Side Plank Rotation (dynamic)", "3", "12 /side", "core", "Faster tempo now"),
      ]},
      { label: "Cooldown", time: "8 min", exercises: [
        ex("Full-Body Stretch Flow", "1", "8 min", "stretch", "Prioritize hips & shoulders"),
      ]},
    ],
    B: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Band Pull-Apart + Scap Slides", "2", "12 each", "pull", "Wake up the upper back"),
      ]},
      { label: "Reactive / Agility", time: "12 min", exercises: [
        ex("Quick-Hands Reactive Ladder", "6", "1 pass", "agility", "Max speed, clean feet"),
        ex("Reaction Ball Wall Toss (fast)", "4", "10", "agility", "Shorten your reaction window"),
      ]},
      { label: "Power", time: "14 min", exercises: [
        ex("Med Ball Chest Pass (max speed)", "5", "6", "throw", "This builds two-handed power"),
        ex("Med Ball Overhead Slam", "5", "6", "throw", "Full extension, max effort"),
      ]},
      { label: "Strength (maintain)", time: "30 min", exercises: [
        ex("Dumbbell Bench Press", "4", "5", "push", "Crisp reps, no grinding"),
        ex("Lat Pulldown", "3", "8", "pull", "Keep pulling strength up"),
        ex("Single-Arm DB Row", "3", "8 /side", "pull", "Control the eccentric"),
        ex("Rotator Cuff Maintenance", "2", "12 each", "rotate", "Cuban Press + Ext. Rotation"),
      ]},
      { label: "Core", time: "14 min", exercises: [
        ex("Cable Anti-Rotation Chop (fast)", "4", "10 /side", "core", "Explosive resist, controlled return"),
        ex("Hanging Knee Raise", "3", "12", "core", "Add rotation if strong"),
      ]},
      { label: "Cooldown", time: "10 min", exercises: [
        ex("Shoulder & Pec Stretch Flow", "1", "6 min", "stretch", "This is racquet-arm recovery"),
      ]},
    ],
    C: [
      { label: "Warm-Up", time: "8 min", exercises: [
        ex("Jump Rope + Dynamic Flow", "1", "6 min", "cardio", "Get the heart rate up"),
      ]},
      { label: "Reactive / Agility (game speed)", time: "14 min", exercises: [
        ex("Shadow Rally Movement Drill", "6", "20s", "agility", "Simulate real point patterns"),
        ex("Lateral Bounds (max)", "5", "6 /side", "agility", "Max distance and control"),
        ex("Mini-Hurdle Quick Feet", "4", "20s", "agility", "Fast, light, precise"),
      ]},
      { label: "Power", time: "12 min", exercises: [
        ex("Kettlebell Swing (explosive)", "5", "10", "hinge", "Snap hips, not arms"),
        ex("DB Hang Clean", "5", "5", "jump", "Full body pull, clean catch"),
      ]},
      { label: "Strength (maintain)", time: "22 min", exercises: [
        ex("Deadlift", "3", "5", "hinge", "Heavy but technically clean"),
        ex("Chin-Up", "3", "8", "pull", "Add weight if possible"),
        ex("Explosive / Clap Push-Up", "3", "8", "push", "Max intent off the floor"),
      ]},
      { label: "Core", time: "10 min", exercises: [
        ex("Anti-Rotation Combo Circuit", "3", "rounds", "core", "Pallof + Dead Bug + Plank, no rest between"),
      ]},
      { label: "Conditioning Finisher (fat-loss push)", time: "10 min", exercises: [
        ex("HIIT Bike/Row or Shuttle Sprints", "8", "20s on/20s off", "cardio", "This is your hardest finisher block"),
      ]},
    ],
  },
};

const DAILY_GOALS = [
  "Protein: ~1.6–2.0 g per kg bodyweight, spread across meals",
  "8,000–10,000 steps outside the gym session",
  "5–10 min mobility or stretching (hips, shoulders, t-spine)",
  "7–8 hours of sleep",
  "~3L water, more on training days",
];
const WEEKLY_GOALS = [
  "Complete all 3 gym sessions",
  "1–2 on-court sessions applying the power/rotation work to your serve",
  "1 full rest or active-recovery day — walk, light swim, easy mobility",
  "Log weight/waist once, same day and time each week",
];
const MONTHLY_GOALS = [
  { month: 1, phase: 1, text: "Nail squat/hinge/lunge technique. Build the training habit. Record baseline weight, waist, and a phone-video of your serve." },
  { month: 2, phase: 1, text: "Add 5–10% load on main lifts vs Month 1. Push through the two deload weeks without skipping them." },
  { month: 3, phase: 2, text: "Move into heavier strength work. Test and record a baseline standing broad jump — this is your power benchmark." },
  { month: 4, phase: 2, text: "Aim for a strength PR on squat, deadlift, or bench. Reassess body composition and progress photos." },
  { month: 5, phase: 3, text: "Shift into max-power, game-speed training. Re-test your broad jump and compare to Month 3." },
  { month: 6, phase: 3, text: "Peak week performance check-in: strength, jump power, body composition, and serve speed/feel. Plan a maintenance phase after." },
];

function phaseOfWeek(w) {
  if (w <= 8) return 1;
  if (w <= 17) return 2;
  return 3;
}
function buildWeeks() {
  const weeks = [];
  for (let w = 1; w <= TOTAL_WEEKS; w++) {
    weeks.push({ week: w, phase: phaseOfWeek(w), deload: DELOAD_WEEKS.has(w) });
  }
  return weeks;
}
const WEEKS = buildWeeks();
const SESSION_DAYS = ["A", "B", "C"];
const SESSION_NUM = { A: 1, B: 2, C: 3 };
const DAY_TITLES = { A: "Lower Power & Strength", B: "Upper Power & Shoulder Care", C: "Full-Body & Reactive Agility" };

function sessionKey(week, day) { return `W${week}-${day}`; }
function allSessionKeys() {
  const out = [];
  for (const w of WEEKS) for (const d of SESSION_DAYS) out.push(sessionKey(w.week, d));
  return out;
}
const ALL_KEYS = allSessionKeys();
const TOTAL_SESSIONS = ALL_KEYS.length;
const STORAGE_KEY = "tennis-program-state";

async function readProgramState() {
  if (window.storage?.get) {
    const result = await window.storage.get(STORAGE_KEY, false);
    return result?.value || null;
  }
  return window.localStorage.getItem(STORAGE_KEY);
}

async function writeProgramState(value) {
  if (window.storage?.set) {
    await window.storage.set(STORAGE_KEY, value, false);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, value);
}

/* ============================================================
   LOGIN + PROFILE SETUP
   ============================================================ */
function UsernameLogin({ onContinue }) {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [claimed, setClaimed] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const cleaned = normalizeUsername(username);
  const isExistingUser = !!cleaned && claimed.includes(cleaned);

  useEffect(() => {
    getUsernameList()
      .then(setClaimed)
      .catch(() => setMessage("Couldn't connect to app storage. Start the app server and try again."))
      .finally(() => setLoadingUsers(false));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cleaned) {
      setMessage("Choose a username to continue.");
      return;
    }

    setSubmitting(true);
    setMessage(isExistingUser ? `Welcome back, ${cleaned}. Loading your saved plan…` : `Setting up ${cleaned}…`);
    try {
      await onContinue({ username: cleaned, isExisting: isExistingUser });
    } catch {
      setMessage("Couldn't load or save your account. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="tfa">
      <style>{STYLE}</style>
      <div className="tfa-scroll">
        <div className="tfa-header">
          <div className="tfa-brand">
            <div className="tfa-brand-mark"><Trophy size={18} color="#16220A" /></div>
            <div>
              <div className="tfa-title">Match Fit</div>
              <div className="tfa-subtitle">Tennis performance</div>
            </div>
          </div>
        </div>

        <form className="tfa-card" onSubmit={handleSubmit}>
          <div className="tfa-card-title"><ClipboardList size={14}/> Sign in with your username</div>
          <div className="tfa-structure-intro">
            New players can claim a username first. Returning players can log in with the same username to keep their progress connected to their account.
          </div>

          <label className="tfa-label" htmlFor="username-login">Username</label>
          <input
            id="username-login"
            className="tfa-input"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Enter your username"
            autoComplete="off"
          />

          <button className="tfa-btn" type="submit" disabled={loadingUsers || submitting} style={{ marginTop: 18 }}>
            <Target size={16}/> {loadingUsers ? "Connecting…" : submitting ? "Loading…" : cleaned ? (isExistingUser ? "Sign in" : "Claim Username") : "Claim Username"}
          </button>

          {message ? (
            <div className="tfa-pace" style={{ marginTop: 14 }}>
              {message}
            </div>
          ) : cleaned ? (
            <div className="tfa-pace" style={{ marginTop: 14 }}>
              {isExistingUser ? `Welcome back, ${cleaned}. Sign in to continue.` : `"${cleaned}" is available. Claim it to start your profile.`}
            </div>
          ) : null}

          <div style={{ marginTop: 14, fontSize: 12.5, color: "var(--ink-dim)" }}>
            No password required while testing — your progress is linked to your username.
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfileSetup({ onComplete }) {
  const [form, setForm] = useState(DEFAULT_PROFILE);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (!form.age) return;
    onComplete(form);
  };

  return (
    <div className="tfa">
      <style>{STYLE}</style>
      <div className="tfa-scroll">
        <div className="tfa-header">
          <div className="tfa-brand">
            <div className="tfa-brand-mark"><Trophy size={18} color="#16220A" /></div>
            <div>
              <div className="tfa-title">Match Fit</div>
              <div className="tfa-subtitle">Build your starting plan</div>
            </div>
          </div>
        </div>
        <form className="tfa-card" onSubmit={submit}>
          <div className="tfa-card-title"><ClipboardList size={14}/> Tell us about your training</div>
          <div className="tfa-structure-intro">Your answers shape session length, exercise volume, and the tennis quality you want to improve first.</div>
          <div className="tfa-row-2">
            <div>
              <label className="tfa-label" htmlFor="profile-age">Age</label>
              <input id="profile-age" className="tfa-input" type="number" min="13" max="100" required placeholder="e.g. 32" value={form.age} onChange={(event) => update("age", event.target.value)} />
            </div>
            <div>
              <label className="tfa-label" htmlFor="profile-experience">Experience</label>
              <select id="profile-experience" className="tfa-input" value={form.experience} onChange={(event) => update("experience", event.target.value)}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div className="tfa-row-2" style={{ marginTop: 12 }}>
            <div>
              <label className="tfa-label" htmlFor="profile-days">Available days per week</label>
              <select id="profile-days" className="tfa-input" value={form.availability} onChange={(event) => update("availability", event.target.value)}>
                <option value="2">2 days</option>
                <option value="3">3 days</option>
                <option value="4">4 days</option>
              </select>
            </div>
            <div>
              <label className="tfa-label" htmlFor="profile-duration">Session duration</label>
              <select id="profile-duration" className="tfa-input" value={form.sessionMinutes} onChange={(event) => update("sessionMinutes", event.target.value)}>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>
            <label className="tfa-label" htmlFor="profile-priority">What matters most right now?</label>
            <select id="profile-priority" className="tfa-input" value={form.priority} onChange={(event) => update("priority", event.target.value)}>
              <option value="forehand">Forehand strength</option>
              <option value="backhand">Backhand strength</option>
              <option value="serve">Serve power</option>
              <option value="agility">Speed and agility</option>
              <option value="endurance">Endurance</option>
            </select>
          </div>
          <button className="tfa-btn" type="submit" style={{ marginTop: 18 }}><Target size={16}/> Build My Starting Plan</button>
        </form>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [username, setUsername] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState({}); // { "W1-A": { done, checkedIds:[], rpe, notes, completedAt } }
  const [metrics, setMetrics] = useState([]); // [{date, weight}]
  const [view, setView] = useState("dashboard");
  const [activeSession, setActiveSession] = useState(null); // "W1-A"
  const [planOpenPhase, setPlanOpenPhase] = useState(1);
  const [metricInput, setMetricInput] = useState({ weight: "", waist: "" });

  useEffect(() => {
    (async () => {
      try {
        const activeUser = window.localStorage.getItem(ACTIVE_USER_KEY);
        if (activeUser) {
          const savedState = await readUserState(activeUser) || readLegacyUserState(activeUser);
          if (savedState) {
            await writeUserState(activeUser, savedState);
            window.localStorage.removeItem(`match-fit-user-${normalizeUsername(activeUser)}`);
            setUsername(activeUser);
            setStartDate(savedState.startDate || null);
            setProfile(savedState.profile || (savedState.startDate ? DEFAULT_PROFILE : null));
            setLogs(savedState.logs || {});
            setMetrics(savedState.metrics || []);
          }
        }
      } catch (e) {
        // no saved state yet
      }
      setLoading(false);
    })();
  }, []);

  const persist = useCallback(async (next) => {
    try {
      if (username) {
        await writeUserState(username, next);
        window.localStorage.setItem(ACTIVE_USER_KEY, username);
      } else {
        await writeProgramState(JSON.stringify(next));
      }
      setSaveError(false);
    } catch (e) {
      setSaveError(true);
    }
  }, [username]);

  const updateState = useCallback((patch) => {
    const nextStart = "startDate" in patch ? patch.startDate : startDate;
    const nextLogs = "logs" in patch ? patch.logs : logs;
    const nextMetrics = "metrics" in patch ? patch.metrics : metrics;
    const nextProfile = "profile" in patch ? patch.profile : profile;

    setStartDate(nextStart);
    setLogs(nextLogs);
    setMetrics(nextMetrics);
    setProfile(nextProfile);
    persist({ startDate: nextStart, profile: nextProfile, logs: nextLogs, metrics: nextMetrics });
  }, [persist, startDate, logs, metrics, profile]);

  const beginProgram = (nextProfile) => {
    const today = new Date().toISOString().slice(0, 10);
    updateState({ startDate: today, profile: nextProfile });
  };

  const handleUsernameChoice = async ({ username: nextUsername, isExisting }) => {
    const cleaned = normalizeUsername(nextUsername);
    const savedState = await readUserState(cleaned) || readLegacyUserState(cleaned) || (isExisting ? readLegacyProgramState() : null);
    const nextState = savedState || { startDate: null, profile: null, logs: {}, metrics: [] };
    await writeUserState(cleaned, nextState);
    window.localStorage.removeItem(`match-fit-user-${cleaned}`);

    setUsername(cleaned);
    setStartDate(nextState.startDate || null);
    setProfile(nextState.profile || (nextState.startDate ? DEFAULT_PROFILE : null));
    setLogs(nextState.logs || {});
    setMetrics(nextState.metrics || []);
    window.localStorage.setItem(ACTIVE_USER_KEY, cleaned);
  };

  const handleLogout = useCallback(() => {
    window.localStorage.removeItem(ACTIVE_USER_KEY);
    setUsername("");
    setStartDate(null);
    setProfile(null);
    setLogs({});
    setMetrics([]);
    setView("dashboard");
  }, []);

  const daysSinceStart = useMemo(() => {
    if (!startDate) return 0;
    const diff = Date.now() - new Date(startDate + "T00:00:00").getTime();
    return Math.max(0, Math.floor(diff / 86400000));
  }, [startDate]);

  const currentWeek = useMemo(() => {
    if (!startDate) return 1;
    return Math.min(TOTAL_WEEKS, Math.floor(daysSinceStart / 7) + 1);
  }, [daysSinceStart, startDate]);

  const currentPhase = phaseOfWeek(currentWeek);

  const completedCount = useMemo(
    () => Object.values(logs).filter((l) => l && l.done).length,
    [logs]
  );

  const expectedCompleted = useMemo(() => {
    if (!startDate) return 0;
    return Math.min(TOTAL_SESSIONS, Math.round((daysSinceStart / 7) * 3));
  }, [daysSinceStart, startDate]);

  const paceDiff = completedCount - expectedCompleted;

  const estCompletionDate = useMemo(() => {
    if (!startDate) return null;
    if (completedCount === 0 || daysSinceStart === 0) {
      const d = new Date(startDate + "T00:00:00");
      d.setDate(d.getDate() + TOTAL_WEEKS * 7);
      return d;
    }
    const pace = completedCount / daysSinceStart; // sessions per day
    const remaining = TOTAL_SESSIONS - completedCount;
    const daysRemaining = pace > 0 ? remaining / pace : 999;
    const d = new Date();
    d.setDate(d.getDate() + Math.round(daysRemaining));
    return d;
  }, [completedCount, daysSinceStart, startDate]);

  // next session = first key in order that isn't done
  const nextSessionKey = useMemo(() => {
    for (const k of ALL_KEYS) {
      if (!logs[k] || !logs[k].done) return k;
    }
    return null;
  }, [logs]);

  const streakWeeks = useMemo(() => {
    let streak = 0;
    for (const w of WEEKS) {
      const all3 = SESSION_DAYS.every((d) => logs[sessionKey(w.week, d)]?.done);
      if (all3) streak++;
      else break;
    }
    return streak;
  }, [logs]);

  const openSession = (key) => { setActiveSession(key); setView("session"); };

  const toggleExercise = (key, exId) => {
    const cur = logs[key] || { done: false, checkedIds: [], rpe: null, notes: "" };
    const has = cur.checkedIds.includes(exId);
    const nextChecked = has ? cur.checkedIds.filter((x) => x !== exId) : [...cur.checkedIds, exId];
    const nextLogs = { ...logs, [key]: { ...cur, checkedIds: nextChecked } };
    updateState({ logs: nextLogs });
  };

  const setRpe = (key, rpe) => {
    const cur = logs[key] || { done: false, checkedIds: [], rpe: null, notes: "" };
    updateState({ logs: { ...logs, [key]: { ...cur, rpe } } });
  };

  const setNotes = (key, notes) => {
    const cur = logs[key] || { done: false, checkedIds: [], rpe: null, notes: "" };
    updateState({ logs: { ...logs, [key]: { ...cur, notes } } });
  };

  const completeSession = (key) => {
    const cur = logs[key] || { checkedIds: [], rpe: null, notes: "" };
    updateState({ logs: { ...logs, [key]: { ...cur, done: true, completedAt: new Date().toISOString() } } });
  };
  const reopenSession = (key) => {
    const cur = logs[key] || {};
    updateState({ logs: { ...logs, [key]: { ...cur, done: false } } });
  };

  const addMetric = () => {
    if (!metricInput.weight && !metricInput.waist) return;
    const entry = {
      date: new Date().toISOString().slice(0, 10),
      weight: metricInput.weight ? Number(metricInput.weight) : null,
      waist: metricInput.waist ? Number(metricInput.waist) : null,
    };
    updateState({ metrics: [...metrics, entry] });
    setMetricInput({ weight: "", waist: "" });
  };

  if (loading) {
    return (
      <div className="tfa">
        <style>{STYLE}</style>
        <div className="tfa-scroll"><div className="tfa-empty">Loading your program…</div></div>
      </div>
    );
  }

  if (!username) {
    return <UsernameLogin onContinue={handleUsernameChoice} />;
  }

  if (!profile) {
    return <ProfileSetup onComplete={(nextProfile) => { updateState({ profile: nextProfile }); }} />;
  }

  if (!startDate) {
    return (
      <div className="tfa">
        <style>{STYLE}</style>
        <div className="tfa-scroll">
          <div className="tfa-header">
            <div className="tfa-brand">
              <div className="tfa-brand-mark"><Trophy size={18} color="#16220A" /></div>
              <div>
                <div className="tfa-title">Match Fit</div>
                <div className="tfa-subtitle">6-Month Tennis Performance Program</div>
              </div>
            </div>
          </div>
          <div className="tfa-hero">
            <div className="tfa-hero-art"><SceneArt kind="court-sunset" /></div>
            <div className="tfa-hero-scrim" />
            <div className="tfa-hero-content">
              <div className="tfa-hero-eyebrow">Ready to start</div>
              <div className="tfa-hero-title">26 weeks. 3 sets.<br/>78 sessions.</div>
              <div className="tfa-hero-meta">
                Foundation → Build → Peak. Muscle, fat loss, core strength, reaction speed, and
                swing power — built around your gym schedule of 3× 2-hour sessions a week.
              </div>
              <button className="tfa-btn" onClick={() => beginProgram(profile)}><Flame size={16}/> Start Program Today</button>
            </div>
          </div>
          <div className="tfa-card">
            <div className="tfa-card-title"><Info size={14}/> How this is structured</div>
            <div className="tfa-structure-intro">
              Every session follows the same two-hour rhythm, so you can focus on quality and build momentum. Progress is tracked automatically once you start.
            </div>
            <div className="tfa-structure-grid">
              {["Warm-up", "Reactive agility", "Power / plyometrics", "Strength", "Core", "Cooldown"].map((step, index) => (
                <div className="tfa-structure-step" key={step}>
                  <span className="tfa-structure-number">{index + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="tfa-structure-note">
              <Calendar size={14} style={{ flexShrink: 0, marginTop: 2 }} />
              Every 4th week is a lighter deload to keep you recovering and injury-free.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tfa">
      <style>{STYLE}</style>
      <div className="tfa-scroll">
        <Header
          onHome={() => { setActiveSession(null); setView("dashboard"); }}
          onLogout={handleLogout}
        />
        <Scoreboard currentPhase={currentPhase} currentWeek={currentWeek} logs={logs} />
        <Nav view={view} setView={setView} />

        {view === "dashboard" && (
          <Dashboard
            nextSessionKey={nextSessionKey}
            openSession={openSession}
            completedCount={completedCount}
            expectedCompleted={expectedCompleted}
            paceDiff={paceDiff}
            streakWeeks={streakWeeks}
            currentWeek={currentWeek}
            estCompletionDate={estCompletionDate}
          />
        )}

        {view === "plan" && (
          <PlanView
            planOpenPhase={planOpenPhase}
            setPlanOpenPhase={setPlanOpenPhase}
            logs={logs}
            currentWeek={currentWeek}
            openSession={openSession}
          />
        )}

        {view === "session" && activeSession && (
          <SessionView
            sessionKey={activeSession}
            logs={logs}
            toggleExercise={toggleExercise}
            setRpe={setRpe}
            setNotes={setNotes}
            completeSession={completeSession}
            reopenSession={reopenSession}
            profile={profile}
            back={() => setView("plan")}
          />
        )}

        {view === "progress" && (
          <ProgressView
            completedCount={completedCount}
            expectedCompleted={expectedCompleted}
            paceDiff={paceDiff}
            streakWeeks={streakWeeks}
            estCompletionDate={estCompletionDate}
            metrics={metrics}
            metricInput={metricInput}
            setMetricInput={setMetricInput}
            addMetric={addMetric}
            startDate={startDate}
          />
        )}

        {view === "goals" && <GoalsView currentPhase={currentPhase} />}

        {saveError && (
          <div className="tfa-pace behind" style={{ marginTop: 10 }}>
            Couldn't save progress just now — check your connection. Your changes will retry automatically.
          </div>
        )}
      </div>
    </div>
  );
}

function Header({ onHome, onLogout }) {
  return (
    <header className="tfa-header">
      <button className="tfa-brand tfa-brand-button" onClick={onHome} aria-label="Go to Match Fit home">
        <div className="tfa-brand-mark"><Trophy size={18} color="#16220A" /></div>
        <div>
          <div className="tfa-title">Match Fit</div>
          <div className="tfa-subtitle">6-Month Tennis Performance Program</div>
        </div>
      </button>

      {onLogout && (
        <button className="tfa-btn ghost" onClick={onLogout} style={{ padding: "8px 12px" }}>
          Log out
        </button>
      )}
    </header>
  );
}

function Scoreboard({ currentPhase, currentWeek, logs }) {
  return (
    <div className="tfa-scoreboard">
      <div className="tfa-sets-row">
        {PHASES.map((p) => {
          const state = p.id < currentPhase ? "done" : p.id === currentPhase ? "active" : "";
          return (
            <div key={p.id} className={`tfa-set-chip ${state}`}>
              <div className="tfa-set-label">Set {p.id}</div>
              <div className="tfa-set-name">{p.name}</div>
            </div>
          );
        })}
      </div>
      <div className="tfa-games-track">
        {WEEKS.map((w) => {
          const done = SESSION_DAYS.every((d) => logs[sessionKey(w.week, d)]?.done);
          const partial = SESSION_DAYS.some((d) => logs[sessionKey(w.week, d)]?.done);
          return (
            <div
              key={w.week}
              className={`tfa-game-dot ${done ? "done" : ""} ${w.week === currentWeek ? "today" : ""}`}
              style={partial && !done ? { background: "var(--lime-dim)" } : undefined}
              title={`Week ${w.week}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function Nav({ view, setView }) {
  const items = [
    { id: "dashboard", label: "Today", icon: Home },
    { id: "plan", label: "Plan", icon: Calendar },
    { id: "progress", label: "Progress", icon: TrendingUp },
    { id: "goals", label: "Goals", icon: Target },
  ];
  return (
    <div className="tfa-nav">
      {items.map((it) => (
        <button key={it.id} className={view === it.id ? "active" : ""} onClick={() => setView(it.id)}>
          <it.icon size={17} />
          {it.label}
        </button>
      ))}
    </div>
  );
}

function Dashboard({ nextSessionKey, openSession, completedCount, expectedCompleted, paceDiff, streakWeeks, currentWeek, estCompletionDate }) {
  if (!nextSessionKey) {
    return (
      <div className="tfa-hero">
        <div className="tfa-hero-art"><SceneArt kind="trophy" /></div>
        <div className="tfa-hero-scrim" />
        <div className="tfa-hero-content">
          <div className="tfa-hero-eyebrow">Program Complete</div>
          <div className="tfa-hero-title">Match Point.</div>
          <div className="tfa-hero-meta">All 78 sessions logged. Head to Progress to see the full picture.</div>
        </div>
      </div>
    );
  }
  const [wk, day] = nextSessionKey.split("-");
  const weekNum = wk.replace("W", "");
  const isDeload = DELOAD_WEEKS.has(Number(weekNum));
  return (
    <>
      <div className="tfa-hero">
        <div className="tfa-hero-art"><SceneArt kind="court-action" /></div>
        <div className="tfa-hero-scrim" />
        <div className="tfa-hero-content">
          <div className="tfa-hero-eyebrow">Up Next · Week {weekNum}, Session {SESSION_NUM[day]}</div>
          <div className="tfa-hero-title">{DAY_TITLES[day]}</div>
          <div className="tfa-hero-meta">{isDeload ? "Deload week — lighter volume, same structure." : "2-hour session · warm-up through cooldown"}</div>
          <button className="tfa-btn" onClick={() => openSession(nextSessionKey)}><Dumbbell size={16}/> Open Session</button>
        </div>
      </div>

      <div className="tfa-card">
        <div className="tfa-card-title"><Activity size={14}/> This Week at a Glance</div>
        <div className="tfa-stat-grid">
          <div className="tfa-stat"><div className="tfa-stat-num">{completedCount}</div><div className="tfa-stat-label">Sessions Done</div></div>
          <div className="tfa-stat"><div className="tfa-stat-num">{streakWeeks}</div><div className="tfa-stat-label">Week Streak</div></div>
          <div className="tfa-stat"><div className="tfa-stat-num tfa-mono">{currentWeek}/26</div><div className="tfa-stat-label">Current Week</div></div>
        </div>
        <div className={`tfa-pace ${paceDiff < 0 ? "behind" : ""}`}>
          {paceDiff > 0 && `You're ${paceDiff} session${paceDiff === 1 ? "" : "s"} ahead of plan.`}
          {paceDiff === 0 && "Right on pace with the plan."}
          {paceDiff < 0 && `${Math.abs(paceDiff)} session${Math.abs(paceDiff) === 1 ? "" : "s"} behind plan — no problem, just get back to the next one.`}
        </div>
        {estCompletionDate && (
          <div style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>
            At your current pace, estimated finish: <strong style={{ color: "var(--ink)" }}>{estCompletionDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</strong>
          </div>
        )}
      </div>
    </>
  );
}

function PlanView({ planOpenPhase, setPlanOpenPhase, logs, currentWeek, openSession }) {
  const [expandedWeek, setExpandedWeek] = useState(currentWeek);
  const phase = PHASES.find((p) => p.id === planOpenPhase);
  const phaseWeeks = WEEKS.filter((w) => w.phase === planOpenPhase);
  return (
    <>
      <div className="tfa-nav" style={{ marginBottom: 12 }}>
        {PHASES.map((p) => (
          <button key={p.id} className={planOpenPhase === p.id ? "active" : ""} onClick={() => setPlanOpenPhase(p.id)}>
            Set {p.id}
          </button>
        ))}
      </div>
      <div className="tfa-card">
        <div className="tfa-card-title"><ClipboardList size={14}/> {phase.name} · {phase.range}</div>
        <div style={{ fontSize: 13.5, color: "var(--ink-dim)", marginBottom: 10 }}>{phase.focus}</div>
        {phaseWeeks.map((w) => (
          <div key={w.week}>
            <div className="tfa-week-row" onClick={() => setExpandedWeek(expandedWeek === w.week ? null : w.week)}>
            <div className={`tfa-week-num ${w.week === currentWeek ? "current" : ""}`}>{w.week}</div>
            <div className="tfa-week-body">
              <div className="tfa-week-title">Week {w.week}{w.deload ? " — Deload" : ""}</div>
              <div className="tfa-week-sub">{w.deload ? "Reduced volume, full recovery focus" : "3 sessions this week"}</div>
            </div>
            <div className="tfa-pip-row">
              {SESSION_DAYS.map((d) => {
                const k = sessionKey(w.week, d);
                const done = logs[k]?.done;
                return (
                  <div key={d} className={`tfa-pip ${done ? "done" : ""}`} aria-label={`Session ${SESSION_NUM[d]}${done ? ", complete" : ""}`}>
                    {d}
                  </div>
                );
              })}
            </div>
            <ChevronRight size={16} style={{ transform: expandedWeek === w.week ? "rotate(90deg)" : undefined, flexShrink: 0 }} />
            </div>
            {expandedWeek === w.week && (
              <div className="tfa-week-sessions">
                {SESSION_DAYS.map((d) => {
                  const k = sessionKey(w.week, d);
                  const done = logs[k]?.done;
                  return (
                    <button key={d} className="tfa-session-row" onClick={() => openSession(k)}>
                      <span className={`tfa-pip ${done ? "done" : ""}`}>{SESSION_NUM[d]}</span>
                      <span>
                        <strong>Session {SESSION_NUM[d]}</strong>
                        <small>{DAY_TITLES[d]}</small>
                      </span>
                      <ChevronRight size={15} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function SessionView({ sessionKey: key, logs, toggleExercise, setRpe, setNotes, completeSession, reopenSession, profile, back }) {
  const [activeDemo, setActiveDemo] = useState(null);
  const [wk, day] = key.split("-");
  const week = Number(wk.replace("W", ""));
  const phase = phaseOfWeek(week);
  const deload = DELOAD_WEEKS.has(week);
  const blocks = personalisedBlocks(phase, day, profile);
  const log = logs[key] || { checkedIds: [], rpe: null, notes: "" };
  const totalEx = blocks.reduce((s, b) => s + b.exercises.length, 0);
  const checkedCount = log.checkedIds?.length || 0;

  return (
    <div>
      <button className="tfa-btn ghost" onClick={back}><ChevronLeft size={15}/> Back to plan</button>
      <div className="tfa-hero" style={{ backgroundImage: "url('https://images.pexels.com/photos/17092539/pexels-photo-17092539.jpeg?auto=compress&cs=tinysrgb&w=1600')", marginTop: 10 }}>
        <div className="tfa-hero-eyebrow">Week {week} · Day {day}</div>
        <div className="tfa-hero-title">{DAY_TITLES[day]}</div>
        <div className="tfa-hero-meta">{checkedCount}/{totalEx} exercises checked{log.done ? " · Session complete" : ""}</div>
        {!log.done ? (
          <button className="tfa-btn" onClick={() => completeSession(key)}><CheckCircle2 size={16}/> Complete Session</button>
        ) : (
          <button className="tfa-btn secondary" onClick={() => reopenSession(key)}>Reopen Session</button>
        )}
      </div>

      {deload && (
        <div className="tfa-deload">
          <Info size={15} style={{ flexShrink: 0, marginTop: 1 }} />
          Deload week: cut the sets shown below by roughly 40%, skip the conditioning finisher, and prioritize full recovery between exercises.
        </div>
      )}

      {profile && (
        <div className="tfa-pace" style={{ marginBottom: 18 }}>
          Personalised for {profile.priority === "forehand" ? "forehand strength" : profile.priority === "backhand" ? "backhand strength" : profile.priority === "serve" ? "serve power" : profile.priority === "agility" ? "speed and agility" : "endurance"}. Your {profile.sessionMinutes}-minute sessions across {profile.availability} training days use {profile.priority === "agility" ? "extra reactive work" : "extra priority-focused volume"}.
        </div>
      )}

      {blocks.map((block, bi) => (
        <div className="tfa-block" key={bi}>
          <div className="tfa-block-head">
            <div className="tfa-block-name">{block.label}</div>
            <div className="tfa-block-time">{block.time}</div>
          </div>
          {block.exercises.map((exItem, ei) => {
            const exId = `${key}-${bi}-${ei}`;
            const checked = log.checkedIds?.includes(exId);
            return (
              <div className="tfa-ex" key={exId}>
                <div className={`tfa-ex-check ${checked ? "checked" : ""}`} onClick={() => toggleExercise(key, exId)}>
                  {checked ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </div>
                <div className="tfa-ex-icon"><PatternIcon pattern={exItem.pattern} /></div>
                <div className="tfa-ex-body">
                  <div className={`tfa-ex-name ${checked ? "checked" : ""}`}>{exItem.name}</div>
                  <div className="tfa-ex-cue">{exItem.cue}</div>
                </div>
                <div className="tfa-ex-sets tfa-mono">{exItem.sets} × {exItem.reps}</div>
                {LOCAL_DEMOS[exItem.name] ? (
                  <button className="tfa-ex-demo" onClick={(e) => { e.stopPropagation(); setActiveDemo({ name: exItem.name, src: LOCAL_DEMOS[exItem.name] }); }}>
                    <PlayCircle size={13} /> Demo
                  </button>
                ) : (
                  <a className="tfa-ex-demo" href={demoSearchUrl(exItem.name)} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                    <PlayCircle size={13} /> Demo
                  </a>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="tfa-card">
        <div className="tfa-card-title">Session Feel (RPE)</div>
        <div className="tfa-rpe-row">
          {[1,2,3,4,5,6,7,8,9,10].map((n) => (
            <button key={n} className={`tfa-rpe-btn ${log.rpe === n ? "active" : ""}`} onClick={() => setRpe(key, n)}>{n}</button>
          ))}
        </div>
      </div>

      <div className="tfa-card">
        <div className="tfa-card-title">Notes</div>
        <textarea
          className="tfa-input"
          rows={3}
          placeholder="How did it feel? Any weight bumps, tweaks, or pain to watch?"
          value={log.notes || ""}
          onChange={(e) => setNotes(key, e.target.value)}
        />
      </div>

      {activeDemo && (
        <div className="tfa-video-backdrop" role="presentation" onClick={() => setActiveDemo(null)}>
          <div className="tfa-video-dialog" role="dialog" aria-modal="true" aria-labelledby="demo-title" onClick={(e) => e.stopPropagation()}>
            <div className="tfa-video-dialog-head">
              <div className="tfa-video-dialog-title" id="demo-title">{activeDemo.name} Demo</div>
              <button className="tfa-video-close" aria-label="Close video" onClick={() => setActiveDemo(null)}><X size={16} /></button>
            </div>
            <video className="tfa-video-player" src={activeDemo.src} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </div>
  );
}

function ProgressView({ completedCount, expectedCompleted, paceDiff, streakWeeks, estCompletionDate, metrics, metricInput, setMetricInput, addMetric, startDate }) {
  const chartData = metrics.map((m) => ({ date: m.date.slice(5), weight: m.weight, waist: m.waist }));
  return (
    <>
      <div className="tfa-card">
        <div className="tfa-card-title"><TrendingUp size={14}/> Program Progress</div>
        <div className="tfa-stat-grid">
          <div className="tfa-stat"><div className="tfa-stat-num">{completedCount}<span style={{ fontSize: 15, color: "var(--ink-dim)" }}>/78</span></div><div className="tfa-stat-label">Total Sessions</div></div>
          <div className="tfa-stat"><div className="tfa-stat-num">{Math.round((completedCount / TOTAL_SESSIONS) * 100)}%</div><div className="tfa-stat-label">Complete</div></div>
          <div className="tfa-stat"><div className="tfa-stat-num">{streakWeeks}</div><div className="tfa-stat-label">Week Streak</div></div>
        </div>
        <div className={`tfa-pace ${paceDiff < 0 ? "behind" : ""}`}>
          {paceDiff > 0 && `Ahead of plan by ${paceDiff} session${paceDiff === 1 ? "" : "s"}.`}
          {paceDiff === 0 && "Right on pace."}
          {paceDiff < 0 && `Behind plan by ${Math.abs(paceDiff)} session${Math.abs(paceDiff) === 1 ? "" : "s"}. Expected ${expectedCompleted} by now.`}
        </div>
        {estCompletionDate && (
          <div style={{ fontSize: 12.5, color: "var(--ink-dim)" }}>
            Estimated finish at current pace: <strong style={{ color: "var(--ink)" }}>{estCompletionDate.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</strong>
            {" "}(started {new Date(startDate + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric" })})
          </div>
        )}
      </div>

      <div className="tfa-card">
        <div className="tfa-card-title"><LineChartIcon size={14}/> Body Metrics</div>
        <div className="tfa-row-2" style={{ marginBottom: 10 }}>
          <div>
            <label className="tfa-label">Weight</label>
            <input className="tfa-input" type="number" placeholder="e.g. 84" value={metricInput.weight} onChange={(e) => setMetricInput((s) => ({ ...s, weight: e.target.value }))} />
          </div>
          <div>
            <label className="tfa-label">Waist</label>
            <input className="tfa-input" type="number" placeholder="e.g. 92" value={metricInput.waist} onChange={(e) => setMetricInput((s) => ({ ...s, waist: e.target.value }))} />
          </div>
        </div>
        <button className="tfa-btn secondary" onClick={addMetric}><Plus size={15}/> Log Today's Numbers</button>

        {chartData.length > 1 ? (
          <div style={{ marginTop: 18, height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1F4A61" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#A9BAC2" fontSize={11} />
                <YAxis stroke="#A9BAC2" fontSize={11} domain={["auto", "auto"]} />
                <Tooltip contentStyle={{ background: "#0B2431", border: "1px solid #1F4A61", fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="weight" stroke="#D9E24C" strokeWidth={2} dot={{ r: 3 }} connectNulls />
                <Line type="monotone" dataKey="waist" stroke="#C1502F" strokeWidth={2} dot={{ r: 3 }} connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="tfa-empty">Log at least two entries to see your trend line.</div>
        )}
      </div>
    </>
  );
}

function GoalsView({ currentPhase }) {
  const phase = PHASES.find((p) => p.id === currentPhase);
  return (
    <>
      <div className="tfa-card">
        <div className="tfa-card-title"><Target size={14}/> Daily Goals</div>
        {DAILY_GOALS.map((g, i) => (
          <div className="tfa-goal-item" key={i}><div className="tfa-goal-dot" />{g}</div>
        ))}
      </div>
      <div className="tfa-card">
        <div className="tfa-card-title"><Calendar size={14}/> Weekly Goals</div>
        {WEEKLY_GOALS.map((g, i) => (
          <div className="tfa-goal-item" key={i}><div className="tfa-goal-dot" />{g}</div>
        ))}
      </div>
      <div className="tfa-card">
        <div className="tfa-card-title"><Trophy size={14}/> Monthly Milestones — currently in {phase.name}</div>
        {MONTHLY_GOALS.map((g) => (
          <div className="tfa-goal-item" key={g.month} style={{ opacity: g.phase === currentPhase ? 1 : 0.6 }}>
            <div className="tfa-goal-dot" style={g.phase === currentPhase ? {} : { background: "var(--ink-dim)" }} />
            <span><strong>Month {g.month}:</strong> {g.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
