# ESF Relaunch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Flip mayaratoledo.com from "em breve/waitlist" to open enrollment with the client's new copy (Ajustes no site.docx, 29/09) and two currency-specific Stripe links (£95 UK / R$647 BR).

**Architecture:** Single-file change to `index.html` (copy swaps + one new modal step + small JS change), plus one new Jest content test. The admin `/api/settings` WAITLIST mode remains the enrollment off-switch.

**Tech Stack:** Static HTML/CSS/JS, Jest (already installed), Vercel.

**Spec:** `docs/superpowers/specs/2026-09-30-esf-relaunch-design.md`

Line numbers below refer to the file at commit `65aac20`; they shift as tasks land — locate by the quoted `old` strings, which are exact.

---

### Task 1: Content regression test (write first, watch it fail)

**Files:**
- Create: `__tests__/content.test.js`

- [ ] **Step 1: Write the failing test**

```js
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

describe('ESF relaunch content', () => {
  test('new Stripe links present, old link removed', () => {
    expect(html).toContain('buy.stripe.com/14AaEYc9Ec1D8PM4gNgQE02'); // £95 UK
    expect(html).toContain('buy.stripe.com/aFa3cwa1wd5H7LIcNjgQE03'); // R$647 BR
    expect(html).not.toContain('5kQ3cwa1w2r34zw14BgQE00'); // old single link
  });

  test('open-enrollment state', () => {
    expect(html).toContain('Inscrições abertas');
    expect(html).not.toContain('Em breve: segunda turma');
    expect(html).toContain('Garantir minha vaga');
  });

  test('new prices, old prices gone', () => {
    expect(html).toContain('647');
    expect(html).toMatch(/<small>£<\/small>95/);
    expect(html).not.toContain('<small>R$</small>547');
    expect(html).not.toContain('<small>£</small>79');
  });

  test('waitlist swap map covers new CTA labels', () => {
    expect(html).toContain("'Garantir minha vaga': 'Entrar na lista de espera'");
    expect(html).toContain("'Garantir minha vaga →': 'Entrar na lista de espera →'");
  });

  test('currency step exists in mentoria modal', () => {
    expect(html).toContain('id="mf-step-pay"');
  });
});
```

- [ ] **Step 2: Run it — must fail**

Run: `npx jest __tests__/content.test.js`
Expected: FAIL (old link still present, no "Garantir minha vaga", etc.)

- [ ] **Step 3: Commit the red test**

```bash
git add __tests__/content.test.js
git commit -m "test: add ESF relaunch content assertions (red)"
```

---

### Task 2: Hero

**Files:**
- Modify: `index.html:2017-2020` (hero tagline + CTA)

- [ ] **Step 1: Replace tagline and CTA**

Old:
```html
          <p class="hero-tagline reveal reveal-delay-2">Reconecte-se com quem você é. Construa um guarda-roupa elegante, prático e coerente com a mulher que você se tornou.</p>
          <a href="#mentoria" class="btn-primary reveal reveal-delay-3">
            Quero participar
          </a>
```

New:
```html
          <p class="hero-tagline reveal reveal-delay-2">Para mulheres que querem parar de ter um guarda-roupa cheio e a sensação de não ter o que vestir.<br><br>Uma mentoria prática de quatro semanas para você editar o que já possui, comprar com mais critério e criar looks que representem a mulher que você é hoje.</p>
          <button class="btn-primary reveal reveal-delay-3" onclick="openMentoriaForm()">
            Garantir minha vaga
          </button>
```

---

### Task 3: Services card (ESF)

**Files:**
- Modify: `index.html:2102-2108`

- [ ] **Step 1: Replace the card content**

Old:
```html
        <span class="servico-tag">Mentoria em grupo · Em breve</span>
        <h3 class="servico-title">Elegância sem Frescura</h3>
        <p class="servico-desc">Segunda turma a caminho. 4 encontros online e ao vivo pelo Google Meet para construir uma imagem coerente com quem você é, sem seguir tendências cegas. Registre seu interesse e receba as informações em primeira mão.</p>
        <p id="mentoria-announcement" class="servico-announcement">Em breve: Segunda turma do Elegância sem Frescura</p>
        <button class="servico-cta" onclick="openWaitlistForm()">Registrar interesse →</button>
```

New:
```html
        <span class="servico-tag">Mentoria em grupo · Inscrições abertas</span>
        <h3 class="servico-title">Elegância sem Frescura</h3>
        <p class="servico-desc">A nova turma do Elegância sem Frescura já está com vagas abertas. São quatro encontros ao vivo, exercícios práticos e acompanhamento para você construir uma imagem mais coerente com quem é hoje.</p>
        <p id="mentoria-announcement" class="servico-announcement">Inscrições abertas</p>
        <button class="servico-cta" onclick="openMentoriaForm()">Garantir minha vaga →</button>
```

---

### Task 4: #mentoria section (sub, meta list, gold button)

**Files:**
- Modify: `index.html:2129`, `2138-2140`, `2144-2165`

- [ ] **Step 1: Sub line**

Old: `<p class="section-sub reveal reveal-delay-1" style="color:rgba(240,232,220,0.55);margin-bottom:0.5rem;">Em breve: segunda turma</p>`
New: `<p class="section-sub reveal reveal-delay-1" style="color:rgba(240,232,220,0.55);margin-bottom:0.5rem;">Inscrições abertas</p>`

- [ ] **Step 2: Gold button**

Old:
```html
      <button class="btn-gold" onclick="openWaitlistForm()" style="margin-top:auto;">
        Registrar meu interesse
      </button>
```
New:
```html
      <button class="btn-gold" onclick="openMentoriaForm()" style="margin-top:auto;">
        Garantir minha vaga
      </button>
```

- [ ] **Step 3: Meta items** — keep each `<svg>` icon exactly as is; replace only the five `mi-meta-text` divs:

1. `<div class="mi-meta-text"><strong>Próxima turma</strong>Quintas-feiras, às 11am · Horário de Londres (7h Brasília)</div>`
2. `<div class="mi-meta-text"><strong>4 encontros ao vivo</strong>40 minutos de conteúdo prático por encontro. Todas as aulas ficam gravadas.</div>`
3. `<div class="mi-meta-text"><strong>Turma pequena</strong>Para uma experiência próxima, prática e acompanhada.</div>`
4. `<div class="mi-meta-text"><strong>Grupo exclusivo no WhatsApp</strong>Exercícios, orientações e espaço para dúvidas durante a mentoria.</div>`
5. `<div class="mi-meta-text"><strong>Material de apoio</strong>Exercícios práticos e materiais complementares para aplicar cada encontro.</div>`

---

### Task 5: 4 Encontros, 4 Transformações

**Files:**
- Modify: `index.html:2179-2198` (four `.session-card` blocks; numbers/markup unchanged, titles/subtitles replaced)

- [ ] **Step 1: Replace the four titles + subtitles**

| # | `session-title` | `session-subtitle` |
|---|---|---|
| 01 | Detox com Direção | Antes de comprar qualquer coisa, você precisa enxergar o que já tem. |
| 02 | Tecidos, Caimento e Qualidade | Compre melhor. Escolha com mais critério. |
| 03 | Estilo com Identidade | Entenda o que faz você se sentir bonita, segura e reconhecível. |
| 04 | Refinando a Imagem e Criando Looks | Use proporção, acessórios e combinações para fazer o seu guarda-roupa trabalhar a seu favor. |

---

### Task 6: O que você vai levar dessa jornada

**Files:**
- Modify: `index.html:2240` (h2), `2244-2265` (`.resultados-col`)

- [ ] **Step 1: Title**

Old: `<h2 class="section-title reveal reveal-delay-1">O que você vai conquistar</h2>`
New: `<h2 class="section-title reveal reveal-delay-1">O que você vai levar dessa jornada</h2>`

- [ ] **Step 2: Replace the five `result-col-item` divs with seven** (same markup pattern):

```html
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Um guarda-roupa mais funcional e alinhado à sua vida.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Clareza sobre o que fica, o que sai e o que realmente falta.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Critério para comprar melhor e evitar desperdício.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Mais entendimento sobre qualidade, caimento e acabamento.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Uma direção de estilo que faça sentido para você.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Mais repertório para montar looks com as peças que já possui.</p>
          </div>
          <div class="result-col-item">
            <span class="result-col-icon"></span>
            <p class="result-col-text">Um método simples para continuar evoluindo sua imagem com autonomia.</p>
          </div>
```

Testimonials (`.depo-col`) unchanged.

---

### Task 7: Investimento

**Files:**
- Modify: `index.html:2206-2232`

- [ ] **Step 1: Heading + sub**

Old h2: `Em breve: segunda turma` → New: `Inscrições abertas`
Old sub: `Registre seu interesse para receber as informações da próxima turma em primeira mão.`
New sub: `Uma jornada prática de quatro semanas para você se vestir com mais clareza, intenção e autonomia.`

- [ ] **Step 2: Prices**

`<span class="preco"><small>R$</small>547</span>` → `<span class="preco"><small>R$</small>647</span>`
`<span class="preco"><small>£</small>79</span>` → `<span class="preco"><small>£</small>95</span>`

- [ ] **Step 3: Inclui list** — replace the six `<li>` with:

```html
      <li><span class="mark"></span> 4 encontros ao vivo pelo Zoom</li>
      <li><span class="mark"></span> Gravações de todas as aulas</li>
      <li><span class="mark"></span> Grupo exclusivo no WhatsApp</li>
      <li><span class="mark"></span> Exercícios práticos semanais</li>
      <li><span class="mark"></span> Material de apoio</li>
      <li><span class="mark"></span> Acompanhamento no grupo durante a mentoria, com respostas em dias úteis</li>
```

- [ ] **Step 4: CTA button** — `onclick="openWaitlistForm()"` → `onclick="openMentoriaForm()"`, text `Registrar meu interesse` → `Garantir minha vaga`.

---

### Task 8: FAQ

**Files:**
- Modify: `index.html:2292-2313` (`.faq-list` contents)

- [ ] **Step 1: Replace the five `faq-item` blocks** (keep classes/reveal delays pattern):

```html
        <div class="faq-item reveal">
          <button class="faq-question">Para quem é a mentoria Elegância sem Frescura?</button>
          <div class="faq-answer"><p>Para mulheres que sentem que o guarda-roupa já não representa quem são, querem parar de comprar por impulso e desejam se vestir com mais clareza, elegância e intenção — sem depender de tendências ou de um armário cheio.</p></div>
        </div>
        <div class="faq-item reveal reveal-delay-1">
          <button class="faq-question">Preciso morar no Reino Unido para participar?</button>
          <div class="faq-answer"><p>Não. A mentoria é online e foi pensada para mulheres no Brasil, no Reino Unido e em outros lugares do mundo. Os encontros acontecem às quintas-feiras, às 7h, no horário de Brasília.</p></div>
        </div>
        <div class="faq-item reveal reveal-delay-1">
          <button class="faq-question">E se eu não puder participar de algum encontro ao vivo?</button>
          <div class="faq-answer"><p>Todas as aulas ficam gravadas para que você possa acompanhar no seu ritmo. Você não fica para trás: os exercícios e as orientações também ficam disponíveis no grupo exclusivo da turma.</p></div>
        </div>
        <div class="faq-item reveal reveal-delay-2">
          <button class="faq-question">Como funciona o suporte no WhatsApp?</button>
          <div class="faq-answer"><p>O grupo é o nosso espaço para exercícios, dúvidas e acompanhamento entre os encontros. Você pode enviar suas dúvidas por lá e receberá orientações em dias úteis, ao longo da mentoria.</p></div>
        </div>
        <div class="faq-item reveal reveal-delay-2">
          <button class="faq-question">Qual é a diferença entre a mentoria em grupo e a consultoria individual?</button>
          <div class="faq-answer"><p>A mentoria em grupo é uma jornada guiada de quatro semanas, com método, aulas e exercícios para você desenvolver autonomia ao se vestir. A consultoria individual é um serviço separado, desenhado de forma personalizada para as necessidades de cada cliente.</p></div>
        </div>
```

---

### Task 9: Agendamento CTAs + footer link

**Files:**
- Modify: `index.html:2338-2345`, `2356`

- [ ] **Step 1: btn-stack**

Old:
```html
      <div class="btn-stack reveal reveal-delay-2">
        <button class="btn-primary" onclick="openIntake()">
          Agendar conversa
        </button>
        <a href="https://www.instagram.com/bymayaratoledo/" class="btn-outline" target="_blank" rel="noopener">
          Conheça mais do meu trabalho
        </a>
      </div>
```
New:
```html
      <div class="btn-stack reveal reveal-delay-2">
        <button class="btn-primary" onclick="openMentoriaForm()">
          Garantir minha vaga
        </button>
        <button class="btn-outline" onclick="openIntake()">
          Agendar conversa
        </button>
        <a href="https://www.instagram.com/bymayaratoledo/" class="btn-outline" target="_blank" rel="noopener">
          Conheça mais do meu trabalho
        </a>
      </div>
```

- [ ] **Step 2: Footer link**

Old: `<li><a href="#mentoria" onclick="setTimeout(openWaitlistForm,400)">Registrar Interesse</a></li>`
New: `<li><a href="#mentoria" onclick="setTimeout(openMentoriaForm,400)">Garantir Minha Vaga</a></li>`

- [ ] **Step 3: Commit copy swaps (Tasks 2–9)**

```bash
git add index.html
git commit -m "feat: ESF relaunch copy — open enrollment, new sections, prices £95/R\$647"
```

---

### Task 10: Two-currency checkout

**Files:**
- Modify: `index.html:2535` (add step after `#mf-step-sending`), `2736-2737` (redirect), `2813-2818` (WAITLIST map)

- [ ] **Step 1: Add the payment step** after the closing `</div>` of `#mf-step-sending` (line 2535):

```html
      <!-- Currency choice -->
      <div id="mf-step-pay" class="mentoria-step" style="text-align:center;padding:3rem 1.5rem;">
        <span class="intake-eyebrow">Último passo</span>
        <h2 class="intake-heading" style="font-size:1.4rem;">Escolha como pagar</h2>
        <p class="intake-sub">Pagamento seguro via Stripe.</p>
        <div style="display:flex;flex-direction:column;gap:0.8rem;max-width:320px;margin:1.5rem auto 0;">
          <a class="btn-primary" href="https://buy.stripe.com/14AaEYc9Ec1D8PM4gNgQE02" style="text-align:center;">Pagar £95 · Reino Unido</a>
          <a class="btn-primary" href="https://buy.stripe.com/aFa3cwa1wd5H7LIcNjgQE03" style="text-align:center;">Pagar R$647 · Brasil</a>
        </div>
      </div>
```

- [ ] **Step 2: Show it instead of redirecting** in `submitMentoriaForm()`:

Old:
```js
      closeMentoriaForm();
      window.location.href = 'https://buy.stripe.com/5kQ3cwa1w2r34zw14BgQE00';
```
New:
```js
      mentoriaOverlay.querySelectorAll('.mentoria-step').forEach(s => s.classList.remove('active'));
      document.getElementById('mf-step-pay').classList.add('active');
      mentoriaSubmitting = false;
```

Also update the sending-step copy (line 2534): `A redirecionar para o pagamento.` → `Um momento…`

- [ ] **Step 3: Extend the WAITLIST label map** (inside the `/api/settings` IIFE):

Old:
```js
          const map = {
            'Reservar minha vaga →': 'Entrar na lista de espera →',
            'Quero participar': 'Entrar na lista de espera',
            'Quero!': 'Entrar na lista de espera',
            'Reservar Vaga': 'Lista de espera',
          };
```
New:
```js
          const map = {
            'Reservar minha vaga →': 'Entrar na lista de espera →',
            'Garantir minha vaga': 'Entrar na lista de espera',
            'Garantir minha vaga →': 'Entrar na lista de espera →',
            'Quero participar': 'Entrar na lista de espera',
            'Quero!': 'Entrar na lista de espera',
            'Reservar Vaga': 'Lista de espera',
          };
```

- [ ] **Step 4: Run all tests**

Run: `npx jest`
Expected: content.test.js PASSES; existing api tests PASS.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: two-currency Stripe checkout step in mentoria modal"
```

---

### Task 11: Manual verification

- [ ] **Step 1:** `npx vercel dev` (or `python3 -m http.server` for static-only) and check on desktop + narrow viewport:
  - Hero shows new tagline; "Garantir minha vaga" opens the lead modal.
  - Modal: empty fields → error; filled → sending → currency step; both buttons point at the right Stripe URLs (hover/inspect — don't complete payment).
  - Services card, mentoria, investimento (R$647/£95), FAQ (5 new questions), agendamento (vaga primary + conversa secondary) all show new copy.
- [ ] **Step 2:** WAITLIST mode: in DevTools console run the swap manually or temporarily set the admin to Closed — all "Garantir minha vaga" buttons become "Entrar na lista de espera" and open the waitlist form.
- [ ] **Step 3:** Final commit if any fixups; report results honestly.
