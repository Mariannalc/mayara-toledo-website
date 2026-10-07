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
