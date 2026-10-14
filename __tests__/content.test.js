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

const en = fs.readFileSync(path.join(__dirname, '..', 'en.html'), 'utf8');

describe('EN version', () => {
  test('cal.com links present', () => {
    expect(en).toContain('cal.com/mayaratoledo/let-s-talk-style-free-25-minute-call');
    expect(en).toContain('cal.com/mayaratoledo/discover-your-colours-personal-colour-analysis');
  });
  test('colour analysis pricing', () => {
    expect(en).toContain('£175');
    expect(en).toContain('£25 deposit');
  });
  test('curated photos', () => {
    ['25','34','44','17','43'].forEach(n => expect(en).toContain(`mayara-en-${n}.jpg`));
  });
  test('no navy in palette, burgundy accent kept', () => {
    expect(en).not.toMatch(/navy/i);
    expect(en).toContain('--burgundy');
  });
});

describe('PT tweaks (30/09)', () => {
  test('payment labels per client request', () => {
    expect(html).toContain('Pagar em Libras · £95');
    expect(html).toContain('Pagar em Reais · R$647');
  });
  test('Kibbe removed from credentials', () => {
    expect(html).not.toContain('Kibbe Body Type');
    expect(html).toContain('<span>Personal Stylist</span>');
  });
  test('intake goes straight to contact step with new cal link', () => {
    expect(html).toContain("getElementById('step-4').classList.add('active')");
    expect(html).toContain('vamos-conversar-sobre-seu-estilo-chamada-gratuita-de-25-minutos');
    expect(html).not.toContain('cal.com/mayaratoledo/primeira-reuniao');
  });
  test('EN link in nav', () => {
    expect(html).toContain('href="/en"');
  });
});

describe('EN spec 09/10', () => {
  test('standardised free-call CTA everywhere', () => {
    expect((en.match(/Book a free call/g) || []).length).toBeGreaterThanOrEqual(4);
    expect(en).not.toContain('Book a free 25-minute call<');
    expect(en).not.toContain('Book your free call');
  });
  test('hero format line, region only (no street address)', () => {
    expect(en).toContain('in-person colour analysis in Chesterfield');
    expect(en).not.toMatch(/Ankerbold/i);
  });
  test('three keyboard-accessible expandable blocks', () => {
    expect((en.match(/<details class="ps-details">/g) || []).length).toBe(3);
  });
  test('colour analysis: duration, location, deposit and balance', () => {
    expect(en).toContain('approximately two hours');
    expect(en).toContain('Chesterfield, Derbyshire — S42');
    expect(en).toContain('The remaining £150 is payable before your appointment begins');
  });
  test('testimonials section between services and about', () => {
    expect(en).toContain('What women say about working with me');
    expect((en.match(/Elegância sem Frescura course participant/g) || []).length).toBe(3);
    expect(en).toContain('Testimonials translated from Portuguese.');
    expect(en.indexOf('id="testimonials"')).toBeLessThan(en.indexOf('id="about"'));
  });
  test('new About copy, old coherence title removed', () => {
    expect(en).toContain('Style that reflects who you are today.');
    expect(en).toContain('Elegance without Fuss');
    expect(en).not.toContain("It's about coherence");
    expect(en).not.toContain('starts to respond differently');
  });
});

const esf = fs.readFileSync(path.join(__dirname, '..', 'elegancia-sem-frescura.html'), 'utf8');
const vercel = fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8');

describe('ESF landing page', () => {
  test('served at /elegancia-sem-frescura', () => {
    expect(vercel).toContain('"/elegancia-sem-frescura"');
    expect(html).toContain('href="/elegancia-sem-frescura"');
  });
  test('presented as a Mayara Toledo programme with checkout', () => {
    expect(esf).toContain('Um programa Mayara Toledo');
    expect(esf).toContain('buy.stripe.com/14AaEYc9Ec1D8PM4gNgQE02');
    expect(esf).toContain('buy.stripe.com/aFa3cwa1wd5H7LIcNjgQE03');
  });
  test('wired to the admin open/waitlist switch', () => {
    expect(esf).toContain("fetch('/api/settings')");
    expect(esf).toContain('openWaitlistForm');
    expect(esf).toContain('Entrar na lista de espera');
  });
});
