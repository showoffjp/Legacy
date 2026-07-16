/**
 * The estate path — the administrative road a family walks after the
 * service. Tasks are grouped by season; the letter builder's institution
 * types shape the notification letters generated on /aftercare.
 *
 * This is planning guidance, not legal advice — estates with real
 * complexity deserve a probate attorney (see /directory, Legal & Estate).
 */

export type EstatePhase = "first-days" | "first-month" | "first-season" | "first-year";

export interface EstateTask {
  id: string;
  phase: EstatePhase;
  title: string;
  detail: string;
}

export const ESTATE_PHASES: { phase: EstatePhase; heading: string; subtitle: string }[] = [
  {
    phase: "first-days",
    heading: "The first days",
    subtitle: "Gather the papers and secure what they left in your care. Nothing else must happen yet.",
  },
  {
    phase: "first-month",
    heading: "The first month",
    subtitle: "The notifications that stop payments, start benefits, and protect their good name.",
  },
  {
    phase: "first-season",
    heading: "The first season",
    subtitle: "Accounts, subscriptions, and titles — steady work, best done a little at a time.",
  },
  {
    phase: "first-year",
    heading: "The first year",
    subtitle: "Taxes, property, and the closing of the estate. There is no hurry; the court sets the pace.",
  },
];

export const ESTATE_TASKS: EstateTask[] = [
  // — The first days —
  {
    id: "death-certificates",
    phase: "first-days",
    title: "Order certified death certificates (10–12 copies)",
    detail:
      "The funeral home orders these for you — most banks, insurers, and agencies require an original certified copy, not a photocopy. Extras cost little now and save weeks later.",
  },
  {
    id: "locate-will",
    phase: "first-days",
    title: "Locate the will, trust, and Letter of Wishes",
    detail:
      "Check the desk, the safe, the safe-deposit box, and their attorney. The named executor (personal representative) carries the estate from here.",
  },
  {
    id: "secure-property",
    phase: "first-days",
    title: "Secure the home, vehicles, and valuables",
    detail:
      "Lock the house, collect spare keys, move valuables out of sight, and keep utilities on for now — an empty-looking home should still look lived in.",
  },
  {
    id: "care-dependents",
    phase: "first-days",
    title: "Arrange care for pets and dependents",
    detail:
      "A neighbor or family member for now; the will may name a guardian for the long term.",
  },
  {
    id: "notify-employer",
    phase: "first-days",
    title: "Notify their employer",
    detail:
      "Ask human resources about final wages, accrued leave, group life insurance, and continuing health coverage for dependents.",
  },
  {
    id: "gather-papers",
    phase: "first-days",
    title: "Gather the paper trail",
    detail:
      "Recent bank statements, insurance policies, deeds and titles, tax returns, loan documents, and the checkbook — one folder or box is enough.",
  },
  // — The first month —
  {
    id: "ssa",
    phase: "first-month",
    title: "Notify the Social Security Administration",
    detail:
      "Call 1-800-772-1213. The funeral home often reports the death, but survivors must ask about the lump-sum death payment and survivor benefits themselves.",
  },
  {
    id: "life-insurance",
    phase: "first-month",
    title: "File life insurance claims",
    detail:
      "Each insurer needs a claim form and a certified death certificate. Benefits are usually paid within weeks and are rarely taxable.",
  },
  {
    id: "banks",
    phase: "first-month",
    title: "Notify banks and credit unions",
    detail:
      "Joint accounts usually pass to the survivor; sole accounts are frozen until the executor presents letters from the probate court.",
  },
  {
    id: "credit-cards",
    phase: "first-month",
    title: "Close credit cards in their name",
    detail:
      "Cancel cards held only in their name and stop automatic charges. Do not use their cards after death, even for household bills — the estate pays those.",
  },
  {
    id: "credit-bureaus",
    phase: "first-month",
    title: "Notify the three credit bureaus",
    detail:
      "Ask Equifax, Experian, and TransUnion to flag the file 'Deceased — do not issue credit.' This single step prevents most identity theft of the departed.",
  },
  {
    id: "probate",
    phase: "first-month",
    title: "File the will with the probate court",
    detail:
      "The county clerk where they lived opens the estate and issues the executor's letters. Many small estates qualify for a simplified affidavit process — ask the clerk.",
  },
  {
    id: "pensions",
    phase: "first-month",
    title: "Notify pension and retirement plan administrators",
    detail:
      "401(k), IRA, and pension custodians pay named beneficiaries directly — outside the will. Each needs a death certificate and beneficiary claim form.",
  },
  {
    id: "va-benefits",
    phase: "first-month",
    title: "If they served: claim veteran benefits",
    detail:
      "The VA (1-800-827-1000) provides a burial allowance, a headstone or medallion, a memorial flag, and possible survivor benefits. Have their DD-214 discharge papers ready.",
  },
  {
    id: "health-insurance",
    phase: "first-month",
    title: "Notify health insurance and Medicare",
    detail:
      "End their coverage, and ask how covered dependents continue theirs. Watch for medical bills that insurance should still pay — do not pay them from your own pocket.",
  },
  // — The first season —
  {
    id: "mail-forwarding",
    phase: "first-season",
    title: "Forward their mail",
    detail:
      "The executor can file USPS forwarding to their own address — arriving mail is the surest map of accounts you have not found yet.",
  },
  {
    id: "subscriptions",
    phase: "first-season",
    title: "Cancel subscriptions and memberships",
    detail:
      "Streaming, magazines, gyms, clubs, and app-store renewals. The bank and card statements from the folder will show every recurring charge.",
  },
  {
    id: "dmv",
    phase: "first-season",
    title: "Cancel their license; transfer vehicle titles",
    detail:
      "The DMV cancels the driver's license (another identity-theft door closed) and retitles vehicles to the heir or the estate.",
  },
  {
    id: "digital-accounts",
    phase: "first-season",
    title: "Settle digital accounts",
    detail:
      "Memorialize or close social media, secure their email, and ask about photo and document storage. Facebook, Google, and Apple each have a legacy process.",
  },
  {
    id: "voter-registration",
    phase: "first-season",
    title: "Cancel voter registration",
    detail: "A short note or form to the county election office where they were registered.",
  },
  {
    id: "insurance-policies",
    phase: "first-season",
    title: "Retitle home and auto insurance",
    detail:
      "Keep the home insured through probate — an unoccupied house may need a rider. Remove them from auto policies once vehicles transfer.",
  },
  // — The first year —
  {
    id: "final-taxes",
    phase: "first-year",
    title: "File their final income tax return",
    detail:
      "Due the usual April deadline for the year of death, marked 'Deceased' with the date across the top. A tax preparer who knows estates is worth the fee.",
  },
  {
    id: "estate-taxes",
    phase: "first-year",
    title: "File estate returns, if the estate earned income",
    detail:
      "An estate that earns income while open (interest, rent, sale gains) files its own return (Form 1041). Federal estate tax touches only the largest estates.",
  },
  {
    id: "property-deeds",
    phase: "first-year",
    title: "Transfer property deeds",
    detail:
      "Real estate passes by deed recorded with the county — through the will, a transfer-on-death deed, or joint title. The probate attorney handles the recording.",
  },
  {
    id: "distribute-close",
    phase: "first-year",
    title: "Distribute the estate and close it with the court",
    detail:
      "After debts and taxes, the executor distributes what remains as the will directs, files a final accounting, and the court closes the estate.",
  },
  {
    id: "own-documents",
    phase: "first-year",
    title: "Tend your own house",
    detail:
      "Loss teaches what clarity is worth. Update your own will and beneficiaries — and consider recording your own wishes, the kindness they may have left you.",
  },
];

/** Institution types the letter builder knows how to address. */
export type InstitutionKind =
  | "bank"
  | "credit-card"
  | "insurance"
  | "utility"
  | "subscription"
  | "credit-bureau"
  | "government"
  | "other";

export const INSTITUTION_KINDS: { id: InstitutionKind; label: string; request: string }[] = [
  {
    id: "bank",
    label: "Bank / credit union",
    request:
      "Please freeze any accounts held solely in their name, stop automatic payments and transfers, and advise me in writing what your institution requires to settle and close these accounts.",
  },
  {
    id: "credit-card",
    label: "Credit card issuer",
    request:
      "Please close the account effective the date of death, stop all recurring charges and interest from that date, and send a final statement to the address below.",
  },
  {
    id: "insurance",
    label: "Insurance company",
    request:
      "Please advise what your company requires to process any claim or refund of unearned premium on policies in their name, and send the necessary claim forms to the address below.",
  },
  {
    id: "utility",
    label: "Utility / service provider",
    request:
      "Please transfer or close the account as I will direct once you confirm the options, and send any final bill or refund of deposit to the address below.",
  },
  {
    id: "subscription",
    label: "Subscription / membership",
    request:
      "Please cancel the subscription or membership effective the date of death and refund any amounts paid for service beyond that date to the estate.",
  },
  {
    id: "credit-bureau",
    label: "Credit bureau",
    request:
      "Please place a permanent 'Deceased — do not issue credit' flag on their credit file, suppress the file from promotional inquiries, and confirm in writing when this is complete.",
  },
  {
    id: "government",
    label: "Government agency",
    request:
      "Please note the death in your records, stop any payments or correspondence addressed to them, and advise me of any survivor or estate matters your agency requires me to address.",
  },
  {
    id: "other",
    label: "Other institution",
    request:
      "Please note the death in your records, close or transfer any accounts in their name as appropriate, and advise me in writing of anything you require from the estate.",
  },
];

/** The three bureaus every estate should notify — offered as one-click rows. */
export const CREDIT_BUREAUS = ["Equifax", "Experian", "TransUnion"] as const;

export const RELATIONSHIPS = [
  "Executor of the estate",
  "Personal representative",
  "Surviving spouse",
  "Son",
  "Daughter",
  "Family member",
] as const;
