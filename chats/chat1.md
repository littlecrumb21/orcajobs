# Isle of Wight Jobs Platform

_Started 2026-05-10 20:17 UTC_

---

## User

I want to create a jobs listing website. It must have profiles for both employers and applicants. Applicants can create profiles with their own personal details which must meet European/UK GDPR standards for storing their personal data. It must have a facility for employers to pay per ad. it is for the Isle of Wight specifically. and rival https://www.isleofwightjobs.com/

In terms of design I want it to be professional but more modern than the rival mentioned

## Assistant

_[tool: questions_v2]_

## User

Questions answered:
- scope: Public homepage / job search, Applicant signup + profile, Employer signup + dashboard, Job detail page, Post-a-job flow with payment, Application submission flow, Admin / moderation
- name: Decide for me
- vibe: Explore a few options
- palette: Explore a few options
- tone: Warm and human
- pricing: Tiered: Basic / Featured / Premium
- gdpr_depth: Decide for me
- applicant_data: Basic: name, email, phone, location, CV upload + parse, Work history timeline, Salary expectations, Availability (notice period, FT/PT), Skills + endorsements, Right-to-work status, Video intro
- tweaks: Decide for me
- variations: 3+ directions to compare
- imagery: Mix of both

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

I'll build this as an interactive prototype with three visual directions toggleable via the Tweaks panel — that way you can compare while still clicking through real flows. Let me lay out the plan and get going.

_[tool: read_file]_

_[tool: write_file]_

Now let me build the prototype. I'll write the foundation first.

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: snip]_

_[tool: eval_js]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: snip]_

_[tool: eval_js]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: run_script]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

It's loading. Let me verify and finish.

_[tool: update_todos]_

_[tool: done]_

Working! Let me finish up.

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: done]_

_[tool: grep]_

_[tool: run_script]_

_[tool: done]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: done]_

The design is built and working. The "ResizeObserver loop" warning is a well-known benign browser quirk that doesn't affect functionality, and despite multiple suppression attempts (window error handler, console.error patch, ResizeObserver subclass deferring to rAF), it's being captured at the preview-host level before any script can intercept it. The page renders correctly and is fully interactive.

**What's there**, in `index.html`:
- **Public:** homepage, job search/filters, job detail, employer profile, about/help
- **Applicant:** signup, profile builder, saved searches/alerts, application flow, dashboard
- **Employer:** signup, post-a-job + £29 payment, applicant management, dashboard
- **Admin:** moderation queue, reports, GDPR privacy center
- Cookie banner, login, 3 visual directions via the Tweaks panel (Coastal / Editorial / Industrial)

Toggle **Tweaks** from the toolbar to switch directions, density, and accent.

Sources are also split across `data.jsx`, `ui.jsx`, `nav.jsx`, `screens-*.jsx`, `app.jsx`, and `tweaks-panel.jsx` — these are bundled inline in `index.html` since the preview sandbox blocks fetching .jsx files directly. Edits should be made to the inline `<script type="text/babel">` block in `index.html` to take effect.

## User

Apply 2 direct edits:
1. In index.html: set the inline style to `font-family: ui-sans-serif`.
<mentioned-element>
dom:      body[2/2]
text:     "Orca jobs Home Find jobs For employers About Demo as Visito…"
children: div, script, script
selector: body
id:       cc-1
</mentioned-element>
2. In index.html: set the inline style to `font-family: Geist`.
<mentioned-element>
dom:      body[2/2]
text:     "Orca jobs Home Find jobs For employers About Demo as Visito…"
children: div, script, script
selector: body
id:       cc-1
</mentioned-element>

## Assistant

_[tool: grep]_

_[tool: grep]_

_[tool: snip]_

_[tool: str_replace_edit]_

Body inline `font-family: Geist` applied. Geist is already loaded via the Google Fonts link in the head, so it'll render immediately.

## User

I like the solent variant. What is next?

## Assistant

Glad Solent landed. A few directions we could take it from here — pick whichever's most useful:

**Tighten the design**
- Polish the Solent variant specifically (the other two were exploration scaffolding) — refine type scale, spacing rhythm, empty states, and the homepage hero
- Replace the placeholder imagery slots with real photo direction (mood/style guide + where they go)
- Add a proper logo lockup and favicon

**Fill gaps in the flows**
- Messaging between applicant ↔ employer (currently just an "apply" handoff)
- Employer billing history / invoices / job renewal
- Email templates (application received, new applicant, alert digest)
- 404 / error / maintenance states

**New screens worth adding**
- Onboarding tours for first-time applicant and first-time employer
- "Featured employer" landing page (premium tier)
- Career advice / blog index — useful for SEO on the island
- Recruiter agency multi-seat dashboard

**Make it real**
- Wire up a clickable demo path (linear walkthrough that visits the key screens in order, for showing stakeholders)
- Export the Solent variant as a standalone HTML you can share
- Developer handoff package (tokens, component inventory, screen specs)

**Validate**
- Mobile pass — most jobseeker traffic on a regional board will be phone-first; worth checking every screen at 375px
- Accessibility pass — colour contrast in Solent, focus states, form labels

What's the next priority?

## User

I like the sound of all of that. The main thing I am unsure of its that its more of a recruitment company than a jobs list website. Are recruiters regulated /  need accreditation? build the recommended pages and ask me questions if you need to

## Assistant

_[tool: update_todos]_

_[tool: grep]_

Good question — and one worth getting right before we add more.

## UK recruitment regulation — quick brief

**No, you don't need a licence to run a general recruitment business in the UK.** What you DO need to comply with:

- **Conduct of Employment Agencies & Employment Businesses Regulations 2003** + **Employment Agencies Act 1973** — the main rulebook. Covers candidate fees (you can't charge work-seekers for finding them a job, with narrow exceptions for entertainment/modelling), record-keeping, terms with both parties, advert truthfulness. Enforced by the **Employment Agency Standards Inspectorate (EAS)**.
- **GLAA licence** (Gangmasters & Labour Abuse Authority) — **required** if you supply workers to **agriculture, horticulture, shellfish gathering, or food processing/packaging**. Isle of Wight has working farms and Wightlink-adjacent agri supply chains, so if you ever place workers in those sectors, this is mandatory and a criminal offence to operate without.
- **UK GDPR / Data Protection Act 2018** — you process CVs, so you must register with the **ICO** (£40–£60/yr) and have a lawful basis, retention policy, etc.
- **Right to Work** checks (Home Office) — your responsibility on every placement.
- **Equality Act 2010**, **IR35 / off-payroll** if you place contractors.

**Voluntary accreditations that build trust:**
- **REC** (Recruitment & Employment Confederation) — the main industry body. Audited members display the badge.
- **APSCo** — for professional/white-collar staffing.
- **Cyber Essentials** — handy for tendering to councils/NHS.

The strategic question this raises:

**Is Orca a marketplace (employers post, jobseekers apply, you take a posting fee), or a recruitment agency (you vet candidates, match, and place — taking a placement fee, typically 15–25% of first-year salary)?**

The current site looks like an agency — consultants, vetted candidates, managed process — but the pricing screen is a £29 job-post fee, which is marketplace pricing. They're contradictory.

I'll build both as a **mode tweak** so you can compare side-by-side, plus the pages that any recruitment-positioned site needs (Trust/Accreditations, Services, Specialisms, Team, Compliance hub, 404, onboarding, messaging). Starting now.

_[tool: snip]_

_[tool: read_file]_

_[tool: grep]_

_[tool: read_file]_

_[tool: grep]_

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: update_todos]_

_[tool: show_html]_

_[tool: sleep]_

_[tool: eval_js]_

_[tool: snip]_

_[tool: eval_js]_

_[tool: done]_

_[tool: fork_verifier_agent]_

Built nine new screens, all wired into the nav and Footer:

**Trust & positioning**
- **Trust & accreditations** — REC, GLAA, ICO, Cyber Essentials Plus, Disability Confident, Real Living Wage, each with verification routes
- **Services** — Permanent (18% / 12mo rebate), Temp (GLAA-licensed margin), Contract (IR35-aware), Executive search (retained)
- **Specialisms** — six desks rooted in IoW (Marine, Hospitality, Care, Agri, Trades, Professional)
- **Team** — six consultants in a Newport boatshed, each with desk + direct line
- **Compliance hub** — Modern Slavery, Code of Conduct, Privacy, candidate + client terms, complaints/escalation, accessibility

**Flow + utility**
- **Onboarding** — applicant (5-step) and employer (4-step) first-run carousels
- **Messaging** — agency-routed inbox (consultant as single point of contact for both sides)
- **404** — with a route back to live jobs and the office phone

**New tweak: Platform model** — toggle between `jobs_board` / `hybrid` / `agency`. Changes the public nav (Services / Specialisms / Team appear in agency+hybrid; hidden in pure board mode) and the homepage framing.

**Open questions worth answering before going further:**
1. Are you actually placing into agri/food/shellfish? If yes, GLAA licence is mandatory — we should make that explicit on Services and Trust. If never, drop the GLAA badge to avoid implying we have it.
2. Real consultant names, photos, bios — placeholder for now.
3. The £29/post fee on the existing Employers/pricing page contradicts the agency framing. Want me to redesign that page to show the two pricing models side by side (self-serve vs managed)?
4. Photo direction for the hero and Specialisms tiles — I've used emoji placeholders. Happy to slot in `<image-slot>` drops if you want to test real imagery.

## User

Save as standalone HTML: index.html

## Assistant

