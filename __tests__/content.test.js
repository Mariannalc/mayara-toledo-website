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
