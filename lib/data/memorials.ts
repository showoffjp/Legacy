import type { Memorial } from "@/lib/types";

/** Sample memorials shown as examples of what families can create. */
export const MEMORIALS: Memorial[] = [
  {
    slug: "eleanor-mae-thompson",
    fullName: "Eleanor Mae Thompson",
    birthDate: "1938-04-12",
    deathDate: "2026-05-30",
    location: "Nashville, Tennessee",
    portraitEmoji: "🕊️",
    verse: {
      reference: "Psalm 23:6",
      text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
    },
    story: [
      "Eleanor Mae Thompson was born on a spring morning in 1938 in Franklin, Tennessee, the third of six children. She met the love of her life, Harold, at a church picnic in 1957 — she always said she knew by the way he bowed his head to pray.",
      "For forty-two years she taught Sunday school at First Baptist Church of Nashville, where generations of children learned Psalm 23 sitting cross-legged on her braided rug. Her kitchen produced more casseroles for grieving families than anyone could count, delivered warm with a handwritten verse taped to the foil.",
      "She was preceded in death by Harold, her husband of 61 years, and welcomed into glory on May 30, 2026, with her family singing 'It Is Well' at her bedside — a hymn she had requested for that very hour since 1985.",
    ],
    essence: [
      "Sunday school teacher for 42 years",
      "Made the county's best chicken pot pie",
      "Never missed a grandchild's recital",
      "Kept a prayer list with 114 names",
      "Hummed hymns while she gardened",
    ],
    hymnIds: ["it-is-well", "in-the-garden", "great-is-thy-faithfulness"],
    survivedBy:
      "Her children Ruth (Mark) Callahan, Samuel (Diane) Thompson, and Grace (Peter) Nguyen; eleven grandchildren; and nineteen great-grandchildren.",
  },
  {
    slug: "deacon-robert-earl-hayes",
    fullName: "Deacon Robert Earl Hayes",
    birthDate: "1949-09-03",
    deathDate: "2026-06-14",
    location: "Atlanta, Georgia",
    portraitEmoji: "✝️",
    verse: {
      reference: "2 Timothy 4:7",
      text: "I have fought a good fight, I have finished my course, I have kept the faith.",
    },
    story: [
      "Robert Earl Hayes was born in Macon, Georgia in 1949, and came up singing bass in the junior choir at Mount Olive Missionary Baptist Church. He drove a city bus for thirty-one years and said his route was his mission field — regulars knew Tuesday mornings came with a scripture and a smile.",
      "Ordained a deacon in 1988, he unlocked the church doors before sunrise every Sunday for thirty-eight years. He taught the young men's Bible study, coached little league, and quietly paid the light bills of more neighbors than his family ever knew until the cards began arriving.",
      "He went home to be with the Lord on June 14, 2026, surrounded by four generations of family. His homegoing celebration overflowed the sanctuary he loved, and the congregation sang 'I'll Fly Away' just as he'd always planned — clapping, like he asked.",
    ],
    essence: [
      "Deacon for 38 years",
      "Drove the #12 bus with a verse ready",
      "Coached little league for two decades",
      "Bass voice that anchored the choir",
      "Paid neighbors' bills in secret",
    ],
    hymnIds: ["ill-fly-away", "old-rugged-cross", "blessed-assurance"],
    survivedBy:
      "His beloved wife of 52 years, Mother Dorothy Hayes; children Robert Jr. (Keisha), Angela, and Marcus (Tamika); nine grandchildren; and a church family too numerous to count.",
  },
  {
    slug: "maria-elena-vasquez",
    fullName: "María Elena Vásquez",
    birthDate: "1962-11-21",
    deathDate: "2026-04-08",
    location: "Phoenix, Arizona",
    portraitEmoji: "🌹",
    verse: {
      reference: "Proverbs 31:28",
      text: "Her children arise up, and call her blessed; her husband also, and he praiseth her.",
    },
    story: [
      "María Elena Vásquez was born in Hermosillo, Sonora, in 1962, and carried her mother's rosary and her father's work ethic across the border to Phoenix in 1984 with two suitcases and an unshakable faith.",
      "She cleaned office buildings at night and studied English at dawn, and in 1998 opened Panadería Elena, where the smell of pan dulce and the sound of morning prayers greeted the neighborhood for twenty-eight years. Every Christmas Eve she fed anyone who knocked — no questions, extra tamales.",
      "A daughter of St. Anthony's parish, she led the Guadalupana society and never missed a novena. She entered eternal rest on April 8, 2026, after a courageous illness borne with the words 'Dios sabe' — God knows. Her funeral Mass was celebrated in two languages and one faith.",
    ],
    essence: [
      "Rose before dawn to bake and to pray",
      "Fed the whole block every Christmas Eve",
      "Led the Guadalupana society 15 years",
      "Sent three children to college",
      "Her rosary never left her apron pocket",
    ],
    hymnIds: ["amazing-grace", "be-thou-my-vision", "nearer-my-god"],
    survivedBy:
      "Her husband Jorge; children Ana (David) Morales, Luis (Priya) Vásquez, and Carmen Vásquez; seven grandchildren; her sisters Rosa and Guadalupe; and the entire St. Anthony's parish family.",
  },
];

export const memorialBySlug = (slug: string) => MEMORIALS.find((m) => m.slug === slug);
