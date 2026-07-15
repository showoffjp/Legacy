import type { Scripture } from "@/lib/types";

/** Comfort passages, King James Version (public domain). */
export const SCRIPTURES: Scripture[] = [
  {
    id: "psalm-23",
    reference: "Psalm 23",
    theme: "The Lord is my Shepherd",
    text: "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake. Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me. Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over. Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.",
  },
  {
    id: "john-14",
    reference: "John 14:1–3",
    theme: "In my Father's house",
    text: "Let not your heart be troubled: ye believe in God, believe also in me. In my Father's house are many mansions: if it were not so, I would have told you. I go to prepare a place for you. And if I go and prepare a place for you, I will come again, and receive you unto myself; that where I am, there ye may be also.",
  },
  {
    id: "john-11",
    reference: "John 11:25–26",
    theme: "The resurrection and the life",
    text: "Jesus said unto her, I am the resurrection, and the life: he that believeth in me, though he were dead, yet shall he live: and whosoever liveth and believeth in me shall never die.",
  },
  {
    id: "romans-8",
    reference: "Romans 8:38–39",
    theme: "Nothing can separate us",
    text: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.",
  },
  {
    id: "revelation-21",
    reference: "Revelation 21:4",
    theme: "No more tears",
    text: "And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.",
  },
  {
    id: "psalm-121",
    reference: "Psalm 121:1–4",
    theme: "My help cometh from the Lord",
    text: "I will lift up mine eyes unto the hills, from whence cometh my help. My help cometh from the LORD, which made heaven and earth. He will not suffer thy foot to be moved: he that keepeth thee will not slumber. Behold, he that keepeth Israel shall neither slumber nor sleep.",
  },
  {
    id: "thessalonians-4",
    reference: "1 Thessalonians 4:13–14",
    theme: "Sorrow not without hope",
    text: "But I would not have you to be ignorant, brethren, concerning them which are asleep, that ye sorrow not, even as others which have no hope. For if we believe that Jesus died and rose again, even so them also which sleep in Jesus will God bring with him.",
  },
  {
    id: "ecclesiastes-3",
    reference: "Ecclesiastes 3:1–4",
    theme: "A time for every season",
    text: "To every thing there is a season, and a time to every purpose under the heaven: a time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted; a time to kill, and a time to heal; a time to break down, and a time to build up; a time to weep, and a time to laugh; a time to mourn, and a time to dance.",
  },
  {
    id: "timothy-4",
    reference: "2 Timothy 4:7–8",
    theme: "The good fight, the finished course",
    text: "I have fought a good fight, I have finished my course, I have kept the faith: henceforth there is laid up for me a crown of righteousness, which the Lord, the righteous judge, shall give me at that day: and not to me only, but unto all them also that love his appearing.",
  },
  {
    id: "isaiah-41",
    reference: "Isaiah 41:10",
    theme: "Fear thou not",
    text: "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.",
  },
  {
    id: "corinthians-15",
    reference: "1 Corinthians 15:54–57",
    theme: "Death is swallowed up in victory",
    text: "So when this corruptible shall have put on incorruption, and this mortal shall have put on immortality, then shall be brought to pass the saying that is written, Death is swallowed up in victory. O death, where is thy sting? O grave, where is thy victory? The sting of death is sin; and the strength of sin is the law. But thanks be to God, which giveth us the victory through our Lord Jesus Christ.",
  },
  {
    id: "matthew-5",
    reference: "Matthew 5:4",
    theme: "Blessed are they that mourn",
    text: "Blessed are they that mourn: for they shall be comforted.",
  },
  {
    id: "psalm-46",
    reference: "Psalm 46:1",
    theme: "A very present help",
    text: "God is our refuge and strength, a very present help in trouble.",
  },
  {
    id: "philippians-1",
    reference: "Philippians 1:21",
    theme: "To die is gain",
    text: "For to me to live is Christ, and to die is gain.",
  },
];

export const scriptureById = (id: string) => SCRIPTURES.find((s) => s.id === id);
