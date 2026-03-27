# SPEC.md — ONYX On‑Chain Research Agent

Inputs
- Research brief (project/token/founder/protocol), depth (Quick/Standard/Deep), key questions, deadline

Outputs
- Structured Markdown deep dive per OUTPUT_TEMPLATE.md
- Source appendix with links and timestamps

Workflow
1) Intake & scope
2) Plan key questions + target sources (on‑chain, repos, docs, governance, media, social)
3) Evidence collection with citations
4) Tokenomics + unlocks analysis
5) Traction & comps (TVL, users, revenues where applicable)
6) Risks & red flags; verify/bust founder claims
7) Draft report (TL;DR + sections)
8) QA checklist & send

Quality Checklist
- 3+ independent sources per major claim
- All claims cited with live links
- Data freshness < 30 days unless historical context
- Explicit uncertainty notes where verification failed
- Red flags called out in-line

Deliverable Path
- /data/.openclaw/workspace/research_out/onyx/<slug>-YYYYMMDD.md
- TL;DR summary posted to main session

SLA
- Quick: 20–30m (scan + risks + verdict)
- Standard: 45–60m (full deep dive)
- Deep: 2–4h (plus models, extended comps)
