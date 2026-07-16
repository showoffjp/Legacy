import type { Hymn } from "@/lib/types";

/**
 * Beloved public-domain hymns of the faith. Melodies are simplified
 * single-voice arrangements ([midi note, beats]) used by the tribute
 * studio's gentle instrumental synthesizer.
 */
export const HYMNS: Hymn[] = [
  {
    id: "amazing-grace",
    title: "Amazing Grace",
    author: "John Newton",
    year: "1779",
    firstLine: "Amazing grace! how sweet the sound, that saved a wretch like me",
    note: "The most beloved hymn of comfort — grace that carries us home.",
    melody: [
      [67, 1], [72, 2], [76, 0.5], [72, 0.5], [76, 2], [74, 1], [72, 2], [69, 1], [67, 3],
      [67, 1], [72, 2], [76, 0.5], [72, 0.5], [76, 2], [74, 1], [79, 5],
      [79, 1], [76, 2], [79, 0.5], [76, 0.5], [72, 2], [67, 1], [69, 2], [72, 0.5], [69, 0.5], [67, 3],
      [67, 1], [72, 2], [76, 0.5], [72, 0.5], [76, 2], [74, 1], [72, 5],
    ],
  },
  {
    id: "it-is-well",
    title: "It Is Well with My Soul",
    author: "Horatio Spafford",
    year: "1873",
    firstLine: "When peace, like a river, attendeth my way",
    note: "Written in the depths of loss — peace that passes understanding.",
    melody: [
      [72, 2], [71, 1], [69, 2], [67, 1], [65, 2], [67, 1], [72, 3],
      [72, 2], [74, 1], [76, 2], [77, 1], [79, 6],
      [79, 2], [81, 1], [79, 2], [77, 1], [76, 2], [77, 1], [79, 3],
      [74, 2], [76, 1], [77, 2], [76, 1], [74, 2], [71, 1], [72, 6],
    ],
  },
  {
    id: "how-great-thou-art",
    title: "How Great Thou Art",
    author: "Carl Boberg, tr. Stuart K. Hine",
    year: "1885",
    firstLine: "O Lord my God, when I in awesome wonder",
    note: "A song of wonder at the greatness of God, in life and beyond.",
    melody: [
      [67, 1], [72, 1.5], [72, 0.5], [72, 1], [74, 1], [72, 1], [69, 2],
      [69, 1], [67, 4],
      [67, 1], [72, 1.5], [72, 0.5], [72, 1], [74, 1], [72, 1], [74, 2], [71, 1], [67, 4],
    ],
  },
  {
    id: "be-thou-my-vision",
    title: "Be Thou My Vision",
    author: "Ancient Irish, tr. Mary E. Byrne",
    year: "8th c.",
    firstLine: "Be Thou my vision, O Lord of my heart",
    note: "An ancient prayer that the Lord be our vision to the very end.",
    melody: [
      [64, 1], [64, 1], [62, 1], [64, 2], [67, 1], [69, 2], [72, 1], [71, 2], [69, 1], [67, 3],
      [67, 1], [69, 1], [71, 1], [72, 2], [72, 1], [71, 2], [69, 1], [67, 3],
    ],
  },
  {
    id: "in-the-garden",
    title: "In the Garden",
    author: "C. Austin Miles",
    year: "1912",
    firstLine: "I come to the garden alone, while the dew is still on the roses",
    note: "The tender assurance that He walks with me and He talks with me.",
    melody: [
      [67, 0.5], [69, 0.5], [72, 1], [72, 1], [72, 0.5], [74, 0.5], [72, 1], [69, 2.5],
      [67, 0.5], [69, 0.5], [72, 1], [74, 1], [76, 1.5], [74, 0.5], [72, 3],
    ],
  },
  {
    id: "great-is-thy-faithfulness",
    title: "Great Is Thy Faithfulness",
    author: "Thomas O. Chisholm",
    year: "1923",
    firstLine: "Great is Thy faithfulness, O God my Father",
    note: "Morning by morning new mercies we see.",
    melody: [
      [67, 1], [71, 1], [71, 1], [72, 1], [74, 2], [72, 1], [71, 2], [69, 1], [67, 3],
      [67, 1], [69, 1], [71, 1], [72, 1], [74, 2], [76, 1], [74, 5],
    ],
  },
  {
    id: "abide-with-me",
    title: "Abide with Me",
    author: "Henry F. Lyte",
    year: "1847",
    firstLine: "Abide with me; fast falls the eventide",
    note: "An evening prayer for the Lord's presence as shadows lengthen.",
    melody: [
      [76, 2], [76, 1], [74, 1], [72, 2], [72, 2], [74, 2], [76, 2], [77, 2], [76, 4],
      [76, 2], [77, 1], [79, 1], [81, 2], [79, 2], [77, 2], [76, 2], [74, 2], [72, 4],
    ],
  },
  {
    id: "rock-of-ages",
    title: "Rock of Ages",
    author: "Augustus Toplady",
    year: "1776",
    firstLine: "Rock of Ages, cleft for me, let me hide myself in Thee",
    note: "A refuge in the Rock that cannot be moved.",
  },
  {
    id: "blessed-assurance",
    title: "Blessed Assurance",
    author: "Fanny Crosby",
    year: "1873",
    firstLine: "Blessed assurance, Jesus is mine! Oh, what a foretaste of glory divine!",
    note: "Fanny Crosby's song of certain hope — this is my story, this is my song.",
  },
  {
    id: "old-rugged-cross",
    title: "The Old Rugged Cross",
    author: "George Bennard",
    year: "1912",
    firstLine: "On a hill far away stood an old rugged cross",
    note: "Clinging to the cross, and exchanging it one day for a crown.",
  },
  {
    id: "softly-and-tenderly",
    title: "Softly and Tenderly Jesus Is Calling",
    author: "Will L. Thompson",
    year: "1880",
    firstLine: "Softly and tenderly Jesus is calling, calling for you and for me",
    note: "The gentle call — come home, come home.",
  },
  {
    id: "ill-fly-away",
    title: "I'll Fly Away",
    author: "Albert E. Brumley",
    year: "1929",
    firstLine: "Some glad morning when this life is o'er, I'll fly away",
    note: "A joyful homegoing favorite — to a land where joy shall never end.",
  },
  {
    id: "what-a-friend",
    title: "What a Friend We Have in Jesus",
    author: "Joseph M. Scriven",
    year: "1855",
    firstLine: "What a friend we have in Jesus, all our sins and griefs to bear",
    note: "Every grief carried to God in prayer.",
  },
  {
    id: "nearer-my-god",
    title: "Nearer, My God, to Thee",
    author: "Sarah Flower Adams",
    year: "1841",
    firstLine: "Nearer, my God, to Thee, nearer to Thee",
    note: "Even through the cross, ever nearer to Thee.",
  },
];

export const hymnById = (id: string) => HYMNS.find((h) => h.id === id);
