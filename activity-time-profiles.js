const SESSION_TIME_VARIANCE = 0.15;

function fromKph(kph) {
  return Math.round(3600 / kph);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function profile(avgSeconds, referenceLabel, referenceNote) {
  return {
    avg_seconds: avgSeconds,
    variance_fraction: SESSION_TIME_VARIANCE,
    reference_label: referenceLabel,
    reference_note: referenceNote,
  };
}

const CURATED_REFERENCE = "Curated encounter estimate";
const CURATED_NOTE = "Estimated from a standard kill loop for this activity, including common banking, respawn, and reset time rather than an animation-perfect PB.";

const PROFILES = {
  "abyssal-sire": profile(fromKph(39), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 39 kills per hour."),
  "alchemical-hydra": profile(fromKph(25), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 25 kills per hour."),
  "amoxliatl": profile(fromKph(40), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 40 kills per hour."),
  "araxxor": profile(fromKph(35), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 35 kills per hour."),
  "artio": profile(fromKph(52), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 52 kills per hour."),
  "barrows-chests": profile(fromKph(12), "OSRS Wiki MMG", "OSRS Wiki Barrows guide assumes 12 chest clears per hour."),
  brutus: profile(105, CURATED_REFERENCE, CURATED_NOTE),
  bryophyta: profile(105, CURATED_REFERENCE, CURATED_NOTE),
  callisto: profile(fromKph(25), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 25 kills per hour."),
  "calvar-ion": profile(fromKph(55), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 55 kills per hour."),
  cerberus: profile(fromKph(50), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 50 kills per hour."),
  "chambers-of-xeric": profile(fromKph(3), "OSRS Wiki MMG", "OSRS Wiki Chambers of Xeric normal-mode guide assumes 3 completions per hour."),
  "chambers-of-xeric-challenge-mode": profile(1500, CURATED_REFERENCE, "Scaled above the normal-mode Chambers reference to reflect longer challenge-mode completions."),
  "chaos-elemental": profile(fromKph(60), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 60 kills per hour."),
  "chaos-fanatic": profile(80, CURATED_REFERENCE, CURATED_NOTE),
  "commander-zilyana": profile(fromKph(27), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 27 kills per hour."),
  "corporeal-beast": profile(420, CURATED_REFERENCE, CURATED_NOTE),
  "crazy-archaeologist": profile(75, CURATED_REFERENCE, CURATED_NOTE),
  "dagannoth-prime": profile(fromKph(25), "OSRS Wiki MMG", "OSRS Wiki solo tribrid Dagannoth Kings guide assumes 25 kills per hour."),
  "dagannoth-rex": profile(fromKph(28), "OSRS Wiki MMG", "OSRS Wiki Rex-only Dagannoth Kings guide assumes 28 kills per hour."),
  "dagannoth-supreme": profile(fromKph(25), "OSRS Wiki MMG", "OSRS Wiki solo tribrid Dagannoth Kings guide assumes 25 kills per hour."),
  "deranged-archaeologist": profile(95, CURATED_REFERENCE, CURATED_NOTE),
  "doom-of-mokhaiotl": profile(fromKph(6), "OSRS Wiki MMG", "OSRS Wiki delve 1-8 guide assumes 6 clears per hour."),
  "duke-sucellus": profile(fromKph(34), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 34 kills per hour."),
  "general-graardor": profile(fromKph(27), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 27 kills per hour."),
  "giant-mole": profile(90, CURATED_REFERENCE, CURATED_NOTE),
  "grotesque-guardians": profile(105, CURATED_REFERENCE, CURATED_NOTE),
  hespori: profile(180, CURATED_REFERENCE, CURATED_NOTE),
  "kalphite-queen": profile(120, CURATED_REFERENCE, CURATED_NOTE),
  "king-black-dragon": profile(90, CURATED_REFERENCE, CURATED_NOTE),
  kraken: profile(110, CURATED_REFERENCE, CURATED_NOTE),
  "kree-arra": profile(fromKph(27), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 27 kills per hour."),
  "k-ril-tsutsaroth": profile(135, CURATED_REFERENCE, "Aligned to the same broad God Wars kill loop cadence as the other solo GWD generals."),
  "lunar-chests": profile(300, CURATED_REFERENCE, "Estimated from a typical Lunar Chests run loop rather than a single combat kill."),
  nex: profile(360, "OSRS Wiki MMG", "Uses the OSRS Wiki team Nex reference loop by default, with a slower duo-aware adjustment when team size is set to two."),
  nightmare: profile(fromKph(12), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 12 kills per hour in a standard Nightmare team loop."),
  "phosani-s-nightmare": profile(fromKph(8), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 8 kills per hour."),
  obor: profile(100, CURATED_REFERENCE, CURATED_NOTE),
  "phantom-muspah": profile(fromKph(25), "OSRS Wiki MMG", "OSRS Wiki Twisted bow Phantom Muspah guide assumes 25 kills per hour."),
  sarachnis: profile(105, CURATED_REFERENCE, CURATED_NOTE),
  scorpia: profile(80, CURATED_REFERENCE, CURATED_NOTE),
  scurrius: profile(55, CURATED_REFERENCE, "Fast baseline tuned to the actual boss loop rather than the much slower public-guide session assumptions."),
  "shellbane-gryphon": profile(95, CURATED_REFERENCE, CURATED_NOTE),
  skotizo: profile(140, CURATED_REFERENCE, CURATED_NOTE),
  spindel: profile(fromKph(60), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 60 kills per hour."),
  tempoross: profile(480, CURATED_REFERENCE, "Estimated from a standard Tempoross reward cycle instead of a single monster kill."),
  "the-gauntlet": profile(fromKph(7), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 7 completions per hour."),
  "the-corrupted-gauntlet": profile(fromKph(6), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 6 completions per hour."),
  "the-hueycoatl": profile(180, CURATED_REFERENCE, CURATED_NOTE),
  "the-leviathan": profile(fromKph(24), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 24 kills per hour."),
  "the-royal-titans": profile(150, CURATED_REFERENCE, CURATED_NOTE),
  "the-whisperer": profile(fromKph(20), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 20 kills per hour."),
  "theatre-of-blood": profile(fromKph(3), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 3 completions per hour for a clean trio loop."),
  "theatre-of-blood-hard-mode": profile(1440, CURATED_REFERENCE, "Scaled above the normal Theatre of Blood reference to reflect slower hard-mode completions."),
  "thermonuclear-smoke-devil": profile(95, CURATED_REFERENCE, CURATED_NOTE),
  "tombs-of-amascut": profile(fromKph(1.75), "OSRS Wiki MMG", "OSRS Wiki solo 300-raid-level Tombs of Amascut guide assumes 1.75 completions per hour."),
  "tombs-of-amascut-expert-mode": profile(fromKph(1.5), "OSRS Wiki MMG", "OSRS Wiki high-invocation Tombs of Amascut guide assumes about 1.5 completions per hour."),
  "tzkal-zuk": profile(4200, CURATED_REFERENCE, "Estimated from a typical Inferno completion, which is better represented as a long-form run than a single boss reset."),
  "tztok-jad": profile(2400, CURATED_REFERENCE, "Estimated from a typical Fight Caves completion, which is better represented as a long-form run than a single boss reset."),
  vardorvis: profile(fromKph(32), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 32 kills per hour."),
  venenatis: profile(fromKph(26), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 26 kills per hour."),
  "vet-ion": profile(105, CURATED_REFERENCE, CURATED_NOTE),
  vorkath: profile(fromKph(30), "OSRS Wiki MMG", "OSRS Wiki Dragon hunter crossbow Vorkath guide assumes 30 kills per hour."),
  wintertodt: profile(420, CURATED_REFERENCE, "Estimated from a standard Wintertodt reward cycle instead of a single monster kill."),
  yama: profile(fromKph(10), "OSRS Wiki MMG", "OSRS Wiki solo Yama guide assumes 10 kills per hour."),
  zalcano: profile(fromKph(13), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 13 kills per hour."),
  zulrah: profile(fromKph(20), "OSRS Wiki MMG", "OSRS Wiki money-making guide assumes 20 kills per hour."),
};

function getNexAdjustedProfile(baseProfile, options = {}) {
  const teamSize = clamp(Math.floor(Number(options.nex_team_size) || 5), 1, 60);
  if (teamSize <= 2) {
    return {
      ...baseProfile,
      avg_seconds: 600,
      reference_note: "Adjusted to the OSRS Wiki duo Nex guide pace of about 6 kills per hour.",
    };
  }
  if (teamSize >= 5) {
    return {
      ...baseProfile,
      avg_seconds: 360,
      reference_note: "Adjusted to the OSRS Wiki team Nex guide pace of about 10 kills per hour.",
    };
  }
  const blend = (teamSize - 2) / 3;
  return {
    ...baseProfile,
    avg_seconds: Math.round(600 + ((360 - 600) * blend)),
    reference_note: "Interpolated between the OSRS Wiki duo and team Nex guide paces for the selected team size.",
  };
}

export function getActivityTimeProfile(slug, options = {}) {
  const baseProfile = PROFILES[slug];
  if (!baseProfile) {
    return null;
  }
  if (slug === "nex") {
    return getNexAdjustedProfile(baseProfile, options);
  }
  return { ...baseProfile };
}

export function estimateSessionDuration(slug, attempts, options = {}) {
  const profile = getActivityTimeProfile(slug, options);
  const count = Math.max(0, Math.floor(Number(attempts) || 0));
  if (!profile || count <= 0) {
    return null;
  }
  const averageSeconds = profile.avg_seconds * count;
  const variance = profile.variance_fraction ?? SESSION_TIME_VARIANCE;
  return {
    average_seconds: averageSeconds,
    low_seconds: Math.round(averageSeconds * (1 - variance)),
    high_seconds: Math.round(averageSeconds * (1 + variance)),
    avg_kill_seconds: profile.avg_seconds,
    variance_fraction: variance,
    reference_label: profile.reference_label,
    reference_note: profile.reference_note,
  };
}
