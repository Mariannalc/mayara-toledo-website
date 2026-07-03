# To-Do List — Mayara Toledo — 30/06/2026 a 02/07/2026

---

## Priority: HIGH

---

### #1 — Alterar texto e layout do hero (lado esquerdo)

| Campo | Detalhe |
|---|---|
| **Categoria** | Task |
| **Prioridade** | HIGH |

**Mensagem original:**
> "Mari vou fazer umas mudancas - entre elegancia sem frescura e botao eu quero (lado direito). Tirar meu nome e colocar a seguinte frase: 'Reconecte-se com quem você é. Construa um guarda-roupa elegante, prático e coerente com a mulher que você se tornou.'"
— 01/07/2026, 14:45

**Comentário:** A Mayara quer remover o campo com o nome dela abaixo do título e substituir por uma nova frase de tagline posicionada entre o título "Elegância sem Frescura" e o botão CTA.

**Plano de ação:** Substituir `hero-name` pela nova frase de tagline no hero esquerdo.

**Solução:** Editar o HTML do `.hero-identity` — remover `<p class="hero-name">` e inserir `<p class="hero-tagline">` com a nova frase, aplicar estilo elegante (font-size menor, line-height generoso, cor creme suave).

**Resposta para a cliente:**
> Entendido! Vou substituir o seu nome pela frase "Reconecte-se com quem você é..." entre o título e o botão. Fica muito mais poderoso assim.

---

### #2 — Alterar o lado direito do hero: substituir laurels por palavra "RECONEXÃO"

| Campo | Detalhe |
|---|---|
| **Categoria** | Task |
| **Prioridade** | HIGH |

**Mensagem original:**
> "No lado direito vamos tirar as 3 linhas (lado esquerdo) e substitui-las por: RECONEXÃO / ESTILO / IDENTIDADE — Coloca elas talvez dentro daquele simbolo que tinha antes ou deixa sem"
— 01/07/2026, 14:45

**Comentário:** A Mayara quer trocar as 3 etiquetas de credenciais (Estrategista / Colorimetria / Kibbe) por 3 palavras-chave da marca: RECONEXÃO, ESTILO, IDENTIDADE. Ela mencionou o símbolo das laurels como possibilidade.

**Plano de ação:** Substituir o conteúdo dos 3 laurels pelas palavras RECONEXÃO, ESTILO, IDENTIDADE — mantendo ou removendo o fundo de laurel, conforme preferência final.

**Solução:** Atualizar os `<span class="laurel-name">` no HTML. Decidir com a Mayara se quer manter o fundo laurel.png ou texto limpo.

**Resposta para a cliente:**
> Vou trocar as credenciais por RECONEXÃO, ESTILO e IDENTIDADE. Quer manter o símbolo das laurels ao redor ou prefere o texto limpo em branco?

---

### #3 — Frase de destaque da marca para usar no site

| Campo | Detalhe |
|---|---|
| **Categoria** | Conteúdo / Request |
| **Prioridade** | HIGH |

**Mensagem original:**
> "E existe uma frase que, para mim, resume toda a sua marca e que eu colocaria em destaque no site: 'Não foi a roupa que transformou a minha vida. Foi aprender a vestir, com intenção, a mulher que eu já estava me tornando.'"
— 01/07/2026, 10:51

**Comentário:** Esta frase é poderosa e autêntica — ideal para a seção "Quem sou eu" ou como bloco de destaque (blockquote) numa seção de transição. Não foi implementada ainda.

**Plano de ação:** Adicionar esta frase como citação em destaque na seção "Quem sou eu" ou numa seção de transição entre Hero e Quem sou eu.

**Solução:** Inserir um `<blockquote>` estilizado com a frase, fonte Safira March/Cormorant, itálico, cor burgundy ou creme.

**Resposta para a cliente:**
> Essa frase é linda e vai ficar incrível em destaque! Vou colocá-la como citação na seção "Quem sou eu".

---

### #4 — Investigar parcelamento no Stripe (BR + UK)

| Campo | Detalhe |
|---|---|
| **Categoria** | Question |
| **Prioridade** | HIGH |

**Mensagem original:**
> "Mari tem como usar o stripe e a pessoa escolher em parcela por aqui e no Brasil?"
— 01/07/2026, 15:36

**Áudio relacionado (00000039):**
> "Mari, o Stripe é melhor para a conversão, porque a Hotmart não anuncia a taxa de conversão e o Stripe é 1%, então vamos de Stripe."
— 01/07/2026, 10:00

**Comentário:** A Mayara quer parcelamento tanto para clientes UK (£79) quanto Brasil (R$547). O Stripe suporta parcelamento no Brasil via "Stripe Installments" e no UK via Klarna/Afterpay (integração separada). Precisa de pesquisa e confirmação técnica.

**Plano de ação:** Verificar disponibilidade de parcelamento Stripe para BR e UK e apresentar as opções à Mayara.

**Solução:** Stripe no Brasil suporta parcelamento nativo com cartão local. No UK, o parcelamento é via Buy Now Pay Later (Klarna/Clearpay) — requer ativação separada. Pode criar 2 payment links: um para BRL com parcelamento, outro para GBP sem.

**Resposta para a cliente:**
> No Brasil o Stripe já permite parcelamento nativo! No UK funciona com Klarna/Clearpay (que é tipo crédito parcelado). Posso criar dois links separados — um em £ e um em R$ com opção de parcelas. Quer que eu configure isso?

---

## Priority: MEDIUM

---

### #5 — Símbolo/ícone ao lado das credenciais (laurels ou flor/mão)

| Campo | Detalhe |
|---|---|
| **Categoria** | Request |
| **Prioridade** | MEDIUM |

**Áudio original (00000048):**
> "Mari, sabe a lateral que você colocou em Estratégia de Imagem? Dá para você manter aqueles símbolos que tinha, aparecia uma flor, uma mão segurando ali as escritas?"
— 01/07/2026, 10:47

**Comentário:** A Mayara gostou do estilo visual dos laurels anteriores e quer manter algo semelhante — uma referência visual decorativa ao redor do texto das credenciais no hero.

**Plano de ação:** Reintroduzir o fundo `laurelswhite.png` nos elementos do hero-right, ou explorar um ícone alternativo (floral/orgânico).

**Solução:** Reativar o `background-image: url('laurelswhite.png')` nos `.hero-right .laurel` ou pesquisar SVG decorativo de flor/ramagem compatível com o estilo.

**Resposta para a cliente:**
> Entendido! Posso recolocar o símbolo das laurels ao redor das palavras. Também posso explorar um ícone de flor ou ramo elegante se preferir algo diferente. Qual você prefere?

---

### #6 — Substituir "4 encontros ao vivo" por "4 encontros online e ao vivo" + plataforma Zoom/Google Meet

| Campo | Detalhe |
|---|---|
| **Categoria** | Task |
| **Prioridade** | MEDIUM |

**Áudio original (00000049):**
> "pode colocar quatro encontros online e ao vivo e aí eu vejo o seu Zoom ou Google porque eu acho que hoje a gente fez Google por uma hora, né? E eu gostei da forma que você usou o Google Meet."
— 01/07/2026, 10:48

**Comentário:** A Mayara quer atualizar a descrição dos encontros e ainda está a decidir entre Zoom e Google Meet. O site menciona "Zoom" em vários lugares.

**Plano de ação:** Substituir "Zoom" por "Google Meet" (ou manter neutro como "ao vivo online") nos textos da mentoria enquanto decide.

**Solução:** Buscar todas as ocorrências de "Zoom" no HTML e substituir por "Google Meet" ou "ao vivo online". Confirmar com Mayara antes de publicar.

**Resposta para a cliente:**
> Vou trocar "Zoom" por "Google Meet" no site. Confirma que é Google Meet mesmo, para eu publicar com o nome certo?

---

## Priority: LOW

---

### #7 — Direção criativa: referências de sites (Studio McGee, Amber Interior, Coreli)

| Campo | Detalhe |
|---|---|
| **Categoria** | Feedback / Referência |
| **Prioridade** | LOW |

**Mensagem original:**
> https://studio-mcgee.com/ / https://amberinteriordesign.com/ / https://coreli.ai/lydia — "Direção criativa do site"
— 30/06/2026, 16:17

**Comentário:** A Mayara enviou 3 referências de sites que gosta visualmente. Devem ser consultadas para futuras decisões de design — especialmente para páginas novas ou ajustes de layout.

**Plano de ação:** Guardar as referências e aplicar elementos visuais relevantes (tipografia, espaçamento, hero) em próximas iterações.

**Solução:** Consultar os 3 sites antes de qualquer nova seção ou redesign. Coreli.ai é o mais próximo do nicho da Mayara (personal brand + coach feminino).

**Resposta para a cliente:**
> Guardei as referências! O Coreli.ai especialmente tem uma vibe muito próxima ao que queremos para você. Vou usar como inspiração nas próximas decisões de design.

---

### #8 — Número de WhatsApp confirmado para o site

| Campo | Detalhe |
|---|---|
| **Categoria** | Aprovação / Info |
| **Prioridade** | LOW — RESOLVIDO |

**Mensagem original:**
> "Sim por favor, assim fica separado do meu pessoal" (confirmando +44 7300 462457)
— 30/06/2026, 12:08

**Comentário:** Confirmado. O número já está no site.

**Status:** ✅ Resolvido

---

## Resumo

| Categoria | Qtd |
|-----------|-----|
| Tasks | 4 |
| Questions | 1 |
| Requests | 2 |
| Feedback / Referências | 1 |
| Aprovações / Info | 1 |

**Total de itens acionáveis:** 7
**Resolvidos na conversa:** 1 (WhatsApp confirmado)
**Pendentes:** 6

---

*Gerado em 02/07/2026 — Conversa: Marianna × Mayara Toledo (30/06 a 02/07/2026)*
