# ESF Relaunch — index.html Design

**Date:** 2026-09-30
**Source:** Client's "Ajustes no site.docx" (29/09/2026) + meeting decisions
**Scope:** index.html only. No API/admin changes.

## Goal

Flip the site from "em breve / lista de espera" to open enrollment for the new
Elegância sem Frescura (ESF) cohort, with the client's new copy and two
currency-specific Stripe checkout links.

## Decisions made with user

1. **Currency choice lives inside the lead modal** — after name/email, a final
   step shows two payment buttons (£95 UK / R$647 BR). Works from every CTA.
2. **Info block:** keep hero laurels; update the existing meta list in
   `#mentoria` with the docx copy (not literally beside the hero).
3. **"Ainda tem dúvidas?":** "Garantir minha vaga" becomes primary;
   "Agendar conversa" stays as secondary outline; Instagram link remains.

## Changes

### A. State flip (HTML default = open enrollment)

All ESF CTAs become **"Garantir minha vaga"** and call `openMentoriaForm()`:
hero, services card, `#mentoria` gold button, investimento button, agendamento
primary, footer link. The admin WAITLIST mode stays the off-switch — add the
new labels to the JS swap map:

- `'Garantir minha vaga'` → `'Entrar na lista de espera'`
- `'Garantir minha vaga →'` → `'Entrar na lista de espera →'`

### B. Copy swaps (verbatim from docx)

| Section | Change |
|---|---|
| Hero | Tagline: "Para mulheres que querem parar de ter um guarda-roupa cheio e a sensação de não ter o que vestir." + "Uma mentoria prática de quatro semanas para você editar o que já possui, comprar com mais critério e criar looks que representem a mulher que você é hoje." CTA: Garantir minha vaga. |
| Services card (ESF) | Tag: "Mentoria em grupo · Inscrições abertas". Desc: "A nova turma do Elegância sem Frescura já está com vagas abertas. São quatro encontros ao vivo, exercícios práticos e acompanhamento para você construir uma imagem mais coerente com quem é hoje." Announcement default: "Inscrições abertas" (admin `mentoria_text` still overrides). CTA: "Garantir minha vaga →". |
| `#mentoria` sub | "Em breve: segunda turma" → "Inscrições abertas". |
| `#mentoria` meta list | 1. **Próxima turma** — Quintas-feiras, 11am Londres · 7h Brasília. 2. **4 encontros ao vivo** — 40 minutos de conteúdo prático por encontro. Todas as aulas ficam gravadas. 3. **Turma pequena** — Para uma experiência próxima, prática e acompanhada. 4. **Grupo exclusivo no WhatsApp** — Exercícios, orientações e espaço para dúvidas durante a mentoria. 5. **Material de apoio** — Exercícios práticos e materiais complementares para aplicar cada encontro. |
| 4 Encontros | 01 Detox com Direção — "Antes de comprar qualquer coisa, você precisa enxergar o que já tem." 02 Tecidos, Caimento e Qualidade — "Compre melhor. Escolha com mais critério." 03 Estilo com Identidade — "Entenda o que faz você se sentir bonita, segura e reconhecível." 04 Refinando a Imagem e Criando Looks — "Use proporção, acessórios e combinações para fazer o seu guarda-roupa trabalhar a seu favor." |
| O que você vai conquistar | Title: "O que você vai levar dessa jornada". Replace 5 bullets with the docx's 7 (guarda-roupa funcional; clareza fica/sai/falta; critério para comprar; qualidade/caimento/acabamento; direção de estilo; repertório de looks; método para evoluir com autonomia). Testimonials unchanged. |
| Investimento | Title: "Inscrições abertas". Sub: "Uma jornada prática de quatro semanas para você se vestir com mais clareza, intenção e autonomia." Prices: **R$647** / **£95**. Inclui: 4 encontros ao vivo pelo Zoom; gravações de todas as aulas; grupo exclusivo no WhatsApp; exercícios práticos semanais; material de apoio; acompanhamento no grupo durante a mentoria, com respostas em dias úteis. CTA: Garantir minha vaga. |
| FAQ | Replace with the docx's 5 Q&As (para quem é; preciso morar no UK — "quintas-feiras, às 7h, no horário de Brasília"; encontro perdido/gravações; suporte no WhatsApp; mentoria vs consultoria). "Catálogo do Reino Unido" question dropped. |
| Agendamento | Primary: "Garantir minha vaga" (`openMentoriaForm`). Secondary outline: "Agendar conversa" (`openIntake`). Instagram outline stays. |

Note: docx says **Zoom**; the old copy said Google Meet. Follow the docx.

### C. Two-currency checkout (only logic change)

In `submitMentoriaForm()`: validate, send lead to FormSubmit (unchanged
payload), then show a new final modal step `mf-step-pay` with two buttons
instead of redirecting:

- **Pagar £95 · Reino Unido** → `https://buy.stripe.com/14AaEYc9Ec1D8PM4gNgQE02`
- **Pagar R$647 · Brasil** → `https://buy.stripe.com/aFa3cwa1wd5H7LIcNjgQE03`

Lead is captured before payment (abandoned checkouts stay recoverable).
Old single link `…14BgQE00` removed.

## Error handling

FormSubmit failure already fails soft (try/catch) — payment buttons still
show. No new failure modes introduced.

## Testing / verification

1. `npm test` — existing Jest API tests stay green (no API changes).
2. Serve locally; walk the modal: empty-fields error → lead sent → both
   currency buttons open the correct Stripe links.
3. Simulate `/api/settings` returning `mode: 'WAITLIST'` → all "Garantir
   minha vaga" CTAs swap to "Entrar na lista de espera" and open the
   waitlist form.
4. Visual pass on mobile width (hero tagline grew by a sentence).
