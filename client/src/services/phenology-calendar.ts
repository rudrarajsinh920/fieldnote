/**
 * Phenology Calendar Service
 * The 72 Micro-Seasons (Kō) Naturalist Solar Calendar.
 * Divides the year into 72 five-day micro-seasons reflecting subtle ecological shifts
 * in soil, moisture, foliar pigments, and insect behaviour.
 */

export interface MicroSeason {
  id: number;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter';
  subSeason: string;
  name: string;
  poeticName: string;
  startMonth: number; // 1-12
  startDay: number;
  endMonth: number;
  endDay: number;
  botanicalFocus: string;
  phenologyDirective: string;
}

export const MICRO_SEASONS: MicroSeason[] = [
  // Autumn (Focus for October)
  {
    id: 49,
    season: 'Autumn',
    subSeason: 'Cold Dew (Kanro)',
    name: 'Wild Geese Arrive',
    poeticName: 'Kōgan kitaru',
    startMonth: 10,
    startDay: 8,
    endMonth: 10,
    endDay: 12,
    botanicalFocus: 'Deciduous leaf chlorophyll breakdown, cold morning dew on spider silk',
    phenologyDirective: 'Notice how morning condensation accumulates on horizontal leaf margins compared to vertical blades.',
  },
  {
    id: 50,
    season: 'Autumn',
    subSeason: 'Cold Dew (Kanro)',
    name: 'Chrysanthemums First Bloom',
    poeticName: 'Kiku no hana hiraku',
    startMonth: 10,
    startDay: 13,
    endMonth: 10,
    endDay: 17,
    botanicalFocus: 'Late flowering composites, seed-pod hardening, root sap descent',
    phenologyDirective: 'Find a plant producing late autumn seeds. Feel the dryness of the casing against living green stems.',
  },
  {
    id: 51,
    season: 'Autumn',
    subSeason: 'Cold Dew (Kanro)',
    name: 'Crickets Chirp by the Door',
    poeticName: 'Kirigirisu to ni ari',
    startMonth: 10,
    startDay: 18,
    endMonth: 10,
    endDay: 22,
    botanicalFocus: 'Bark crevices sheltering overwintering insects, fallen leaf dampness',
    phenologyDirective: 'Inspect the base of a stone wall or brick foundation where insects seek evening thermal mass.',
  },
  {
    id: 52,
    season: 'Autumn',
    subSeason: 'Frost Descent (Sōkō)',
    name: 'First Frost Descends',
    poeticName: 'Shimohajimete furu',
    startMonth: 10,
    startDay: 23,
    endMonth: 10,
    endDay: 27,
    botanicalFocus: 'Surface cell freezing, frost-heaved soil aggregate, brittle grasses',
    phenologyDirective: 'Touch the shaded side of pavement or earth early in the day. Notice where moisture has frozen or chilled deeply.',
  },
  {
    id: 53,
    season: 'Autumn',
    subSeason: 'Frost Descent (Sōkō)',
    name: 'Light Rains Fall from Time to Time',
    poeticName: 'Shigure tokidoki furu',
    startMonth: 10,
    startDay: 28,
    endMonth: 11,
    endDay: 1,
    botanicalFocus: 'Intermittent rainfall soaking dead foliage, earthworm burrow caps',
    phenologyDirective: 'Observe the scent and dark coloration of soil immediately following brief precipitation.',
  },
  // Sample seasons for other months to provide year-round support
  {
    id: 1,
    season: 'Spring',
    subSeason: 'Beginning of Spring (Risshun)',
    name: 'East Wind Melts the Ice',
    poeticName: 'Harukaze kōri o toku',
    startMonth: 2,
    startDay: 4,
    endMonth: 2,
    endDay: 8,
    botanicalFocus: 'Frozen puddle thaws, early willow buds swelling, soil softening',
    phenologyDirective: 'Examine where ice is relinquishing its grip on stones and muddy hollows.',
  },
  {
    id: 15,
    season: 'Spring',
    subSeason: 'Clear and Bright (Seimei)',
    name: 'Swallows Arrive',
    poeticName: 'Tsubame kitaru',
    startMonth: 4,
    startDay: 5,
    endMonth: 4,
    endDay: 9,
    botanicalFocus: 'New tender shoots, bright vernal foliage, aerial pollinator activity',
    phenologyDirective: 'Observe tender new leaves backlit by the sun. Notice how translucent the pale green veins appear.',
  },
  {
    id: 28,
    season: 'Summer',
    subSeason: 'Summer Solstice (Geshi)',
    name: 'Self-Heal Spikes Wither',
    poeticName: 'Utsubogusa karuru',
    startMonth: 6,
    startDay: 21,
    endMonth: 6,
    endDay: 26,
    botanicalFocus: 'Midsummer solar zenith, deep leaf waxes, wilting of spring ephemerals',
    phenologyDirective: 'Locate a plant that has finished flowering and begun drying under intense summer sun.',
  },
  {
    id: 43,
    season: 'Autumn',
    subSeason: 'White Dew (Hakuro)',
    name: 'Dew Glistens White on Grass',
    poeticName: 'Kusa no tsuyu shiroshi',
    startMonth: 9,
    startDay: 8,
    endMonth: 9,
    endDay: 12,
    botanicalFocus: 'Clear morning condensation droplets, nocturnal radiative cooling',
    phenologyDirective: 'Look closely at spider webs or grass tips before direct sunlight evaporates the morning dew beads.',
  },
];

/**
 * Get the current active 5-day micro-season for any given date.
 */
export function getCurrentMicroSeason(date: Date = new Date()): MicroSeason {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  // Find exact match in defined seasons
  const exact = MICRO_SEASONS.find((s) => {
    if (s.startMonth === s.endMonth) {
      return month === s.startMonth && day >= s.startDay && day <= s.endDay;
    }
    // Crosses month boundary
    return (
      (month === s.startMonth && day >= s.startDay) ||
      (month === s.endMonth && day <= s.endDay)
    );
  });

  if (exact) return exact;

  // Fallback to nearest seasonal approximation based on month
  if (month >= 9 && month <= 11) {
    return MICRO_SEASONS[0]; // Autumn Cold Dew
  } else if (month >= 3 && month <= 5) {
    return MICRO_SEASONS[6]; // Spring
  } else if (month >= 6 && month <= 8) {
    return MICRO_SEASONS[7]; // Summer
  } else {
    return MICRO_SEASONS[5]; // Winter/Early Spring
  }
}
