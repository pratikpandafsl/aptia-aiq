// Illustrative, fictional records for the prototype, not pension advice.
// Replace this array with your API response using the same object shape.
/** @type {import('./components/chat-types').Conversation[]} */
export const conversations = [
  {
    id: "b-khan-lrf",
    title: "B Khan LRF calculation",
    messages: [
      { id: "khan-question", role: "user", text: "Weir group member: B Khan, QQ000013A, wants to retire 14 September 2026 (Age 71), what LRF will be applied to his benefits?" },
      { id: "khan-answer", role: "assistant", text: "Bottom line: For B Khan retiring on 14 September 2026, the late retirement factor for the non-GMP part of the pension is 1.587 (using 1.08^6), because that date is exactly 6 years after the scheme retirement date of 14 September 2020 shown in the member record [weir.4].\n\nInputs used:\n• Scheme retirement date: 14 September 2020 — from the member record [weir.4].\n• Requested retirement date: 14 September 2026 — from your question.\n• Years late (n): 6.0 years (72 complete months) — based on those two dates.\n• Formula: LRF = 1.08^n with complete months counted proportionately [weir.1].\n\nCalculation (computed deterministically, not estimated):\n1.08^6 = 1.586874…\nRounded LRF: 1.587 [weir.1]\n\nOne important scheme point: the Weir late retirement note says the non-GMP basis is increased by this LRF, but the GMP basis is increased instead by the statutory minimum from GMP payable date, not by this LRF." }
    ],
    sources: [
      { id: "weir.4", kind: "record", title: "Member record — B Khan (QQ000013A)", status: "Current", fields: [{ label: "Version", value: "Admin system snapshot" }, { label: "Effective", value: "09/11/2026" }, { label: "Owner", value: "Aptia Pensions Admin Platform" }, { label: "Updated", value: "09/11/2026" }, { label: "Reference", value: "Table MEMBER_BENEFITS · NRD field" }], excerpt: "NRD: 14/09/2020 · Status: Deferred · GMP: Yes · DOB: 14/09/1955" },
      { id: "weir.1", kind: "document", title: "Weir_Group_Trust_Deed_and_Rules.pdf", status: "Current", fields: [{ label: "Version", value: "v7.2 (consolidated)" }, { label: "Pages", value: "41–44" }, { label: "Effective", value: "06/04/2019" }, { label: "Owner", value: "Weir Group Trustees / Scheme Secretary" }, { label: "Updated", value: "12/03/2026" }, { label: "Reference", value: "Rule 6.3 Late Retirement" }], excerpt: "… increased by a factor of 1.08 for each year (complete months counted proportionately). The GMP shall be increased in accordance with statutory requirements." }
    ],
    reasoning: ["Matched the member record to the scheme and reference supplied in the question.", "Compared 14 September 2026 with the recorded retirement date of 14 September 2020: 72 complete months.", "Applied the cited non-GMP rule: 1.08 raised to 6 gives 1.586874, rounded to 1.587.", "Separated GMP treatment from the non-GMP calculation. The answer requires human review."],
    validation: [{ label: "Member match", detail: "The supplied scheme and member reference match the sample record." }, { label: "Calculation", detail: "72 complete months = 6 years; 1.08^6 = 1.586874." }, { label: "Source coverage", detail: "The member record supplies the date and the scheme rules supply the factor." }, { label: "Human review", detail: "Confirm live records and scheme rules before acting on this illustrative answer." }],
    confidence: 93
  },
  ...[
    ["bereavement", "Bereavement documents", "Which documents are needed for a bereavement query?", "The sample checklist includes the death certificate, the member reference and contact details for the person reporting the death. Confirm the current scheme checklist before requesting documents.", "Bereavement_Checklist.pdf"],
    ["weir-npa", "Weir normal pension age", "Where can I check the normal pension age for a Weir member?", "Check the member’s recorded normal retirement date and the applicable section of the scheme rules. Do not infer an individual member’s retirement date from their age alone.", "Weir_Member_Administration_Guide.pdf"],
    ["jlr-spouse", "JLR spouse pension rule", "Where is the JLR spouse pension rule recorded?", "The sample record points to the dependant benefits section. Eligibility and the benefit basis need to be checked against the member’s section and the current scheme rules.", "JLR_Dependant_Benefits.pdf"],
    ["weir-late", "Late retirement factor — Weir Group", "How is a Weir late retirement factor calculated?", "For this illustrative scheme rule, the non-GMP factor is 1.08 raised to the number of years late, with complete months counted proportionately. Check the retirement dates and handle GMP separately.", "Weir_Group_Trust_Deed_and_Rules.pdf"],
    ["weir-barber", "Barber period — Weir Group", "What should I check for the Barber period in Weir Group?", "Review the member’s service dates and the equalisation provisions in the applicable scheme section. The sample does not establish an individual entitlement; this needs human review.", "Weir_Equalisation_Guidance.pdf"],
    ["early-retirement", "Early retirement — scheme needed", "Can you calculate an early retirement pension?", "Please provide the scheme name, the member reference and the requested retirement date. A scheme-specific rule and current member record are needed before a calculation can be made.", "Early_Retirement_Checklist.pdf"]
  ].map(([id, title, question, answer, document]) => ({
    id, title,
    messages: [{ id: `${id}-question`, role: "user", text: question }, { id: `${id}-answer`, role: "assistant", text: answer }],
    sources: [{ id: `${id}.1`, kind: "document", title: document, status: "Sample", fields: [{ label: "Version", value: "Illustrative copy" }, { label: "Owner", value: "Sample scheme administration team" }, { label: "Reference", value: "Prototype checklist" }], excerpt: answer }],
    reasoning: ["Identified the scheme topic in the question.", "Reviewed the illustrative checklist linked to this conversation.", "Highlighted the records and human review needed before giving member-specific advice."],
    validation: [{ label: "Sample data", detail: "This is an illustrative conversation, not a live scheme record." }, { label: "Human review", detail: "Confirm the applicable rules and current member details." }],
    confidence: null
  }))
];