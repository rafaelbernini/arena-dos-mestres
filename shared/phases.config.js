// Configuração das 40 fases — 4 salas × 10 fases
// Conteúdo alinhado ao 7° ano SESI, 1° e 2° bimestre

export const PHASES_CONFIG = {

  floresta: [
    { phase:1, topic:'Múltiplos de um número', difficulty:'easy',
      variations:[
        { q:'Quais são os 5 primeiros múltiplos de 3?', answer:15, hint:'Conte de 3 em 3: 3, 6, 9, 12, ...' },
        { q:'Quais são os 5 primeiros múltiplos de 4?', answer:20, hint:'Conte de 4 em 4: 4, 8, 12, 16, ...' },
        { q:'Quais são os 5 primeiros múltiplos de 5?', answer:25, hint:'Conte de 5 em 5: 5, 10, 15, 20, ...' },
      ]},
    { phase:2, topic:'Divisores de um número', difficulty:'easy',
      variations:[
        { q:'Quantos divisores tem o número 12?', answer:6, hint:'Os divisores de 12 são: 1, 2, 3, 4, 6, 12' },
        { q:'Quantos divisores tem o número 18?', answer:6, hint:'Os divisores de 18 são: 1, 2, 3, 6, 9, 18' },
        { q:'Quantos divisores tem o número 20?', answer:6, hint:'Os divisores de 20 são: 1, 2, 4, 5, 10, 20' },
      ]},
    { phase:3, topic:'Números primos', difficulty:'easy',
      variations:[
        { q:'Qual destes é primo: 9, 11, 15, 21?', answer:11, hint:'Primo só divide por 1 e por ele mesmo' },
        { q:'Qual destes é primo: 6, 8, 13, 25?', answer:13, hint:'Tente dividir cada número por 2, 3, 5...' },
        { q:'Qual destes é primo: 4, 9, 17, 27?', answer:17, hint:'17 só divide por 1 e por 17' },
      ]},
    { phase:4, topic:'Decomposição em fatores primos', difficulty:'medium',
      variations:[
        { q:'36 decomposto em fatores primos é 2² × ?²', answer:3, hint:'36 = 2×18 = 2×2×9 = 2×2×3×3' },
        { q:'24 decomposto em fatores primos é 2³ × ?', answer:3, hint:'24 = 2×12 = 2×2×6 = 2×2×2×3' },
        { q:'30 decomposto em fatores primos é 2 × 3 × ?', answer:5, hint:'30 = 2×15 = 2×3×5' },
      ]},
    { phase:5, topic:'MMC — mínimo múltiplo comum (simples)', difficulty:'medium',
      variations:[
        { q:'Dois tambores batem a cada 4 e 6 batidas. Em que batida tocam juntos pela 1ª vez?', answer:12, hint:'Liste múltiplos de 4 e 6 e ache o menor comum' },
        { q:'Dois semáforos piscam a cada 3 e 5 segundos. Quando piscam juntos pela 1ª vez?', answer:15, hint:'MMC(3,5): múltiplos de 3: 3,6,9,12,15... múltiplos de 5: 5,10,15...' },
        { q:'Dois sinos tocam a cada 6 e 9 minutos. Quando tocam juntos pela 1ª vez?', answer:18, hint:'MMC(6,9): múltiplos de 6: 6,12,18... múltiplos de 9: 9,18...' },
      ]},
    { phase:6, topic:'MMC — aplicação em problemas cotidianos', difficulty:'medium',
      variations:[
        { q:'Ônibus A sai a cada 6 min e B a cada 9 min. Daqui a quantos min saem juntos?', answer:18, hint:'MMC(6,9) = 18' },
        { q:'Luzes A piscam a cada 4s e B a cada 6s. Em quantos segundos piscam juntas?', answer:12, hint:'MMC(4,6) = 12' },
        { q:'Ana visita avó a cada 6 dias e Pedro a cada 8 dias. Em quantos dias visitam juntos?', answer:24, hint:'MMC(6,8) = 24' },
      ]},
    { phase:7, topic:'MDC — máximo divisor comum (simples)', difficulty:'medium',
      variations:[
        { q:'Qual o maior número que divide 12 e 18 exatamente?', answer:6, hint:'Divisores de 12: 1,2,3,4,6,12 — Divisores de 18: 1,2,3,6,9,18' },
        { q:'Qual o maior número que divide 20 e 30 exatamente?', answer:10, hint:'Divisores de 20: 1,2,4,5,10,20 — Divisores de 30: 1,2,3,5,6,10,15,30' },
        { q:'Qual o maior número que divide 24 e 36 exatamente?', answer:12, hint:'Decompõe os dois e pega os fatores comuns' },
      ]},
    { phase:8, topic:'MDC — aplicação em problemas', difficulty:'medium',
      variations:[
        { q:'Azulejos de 48cm e 36cm — qual o maior tamanho que corta os dois sem sobrar? (em cm)', answer:12, hint:'MDC(48,36) = 12' },
        { q:'Fitas de 60cm e 45cm — qual o maior pedaço igual que as duas formam? (em cm)', answer:15, hint:'MDC(60,45) = 15' },
        { q:'Barras de 40cm e 24cm — qual o maior pedaço igual possível? (em cm)', answer:8, hint:'MDC(40,24) = 8' },
      ]},
    { phase:9, topic:'MMC e MDC juntos', difficulty:'hard',
      variations:[
        { q:'MMC(8,12) = ?', answer:24, hint:'Múltiplos de 8: 8,16,24... Múltiplos de 12: 12,24...' },
        { q:'MDC(30,45) = ?', answer:15, hint:'Decomponha: 30=2×3×5, 45=3²×5 — fator comum: 3×5=15' },
        { q:'MMC(6,10) = ?', answer:30, hint:'Múltiplos de 6: 6,12,18,24,30... Múltiplos de 10: 10,20,30...' },
      ]},
    { phase:10, topic:'Desafio combinado — Floresta', difficulty:'hard',
      variations:[
        { q:'3 desafios seguidos: múltiplos, primos e MMC. Sem pausa!', answer:null, hint:'Revise tudo que aprendeu na floresta!' },
      ]},
  ],

  caverna: [
    { phase:1, topic:'Leitura e escrita de frações', difficulty:'easy',
      variations:[
        { q:'Um bolo dividido em 8 partes. Comi 3 partes. Que fração comi?', answer:'3/8', hint:'Numerador = partes comidas, Denominador = total de partes' },
        { q:'Uma pizza dividida em 6 partes. Comi 2 partes. Que fração comi?', answer:'2/6', hint:'Numerador = partes comidas, Denominador = total de partes' },
        { q:'Uma barra com 10 quadradinhos. Pintei 4. Que fração pintei?', answer:'4/10', hint:'Numerador = pintados, Denominador = total' },
      ]},
    { phase:2, topic:'Frações equivalentes', difficulty:'easy',
      variations:[
        { q:'1/2 é equivalente a ?/4', answer:2, hint:'Multiplique numerador e denominador por 2' },
        { q:'1/3 é equivalente a ?/6', answer:2, hint:'Multiplique numerador e denominador por 2' },
        { q:'2/5 é equivalente a ?/10', answer:4, hint:'Multiplique numerador e denominador por 2' },
      ]},
    { phase:3, topic:'Simplificação de frações', difficulty:'easy',
      variations:[
        { q:'Simplifique 6/9 ao máximo. Qual o numerador?', answer:2, hint:'MDC(6,9)=3. Divida ambos por 3: 2/3' },
        { q:'Simplifique 8/12 ao máximo. Qual o numerador?', answer:2, hint:'MDC(8,12)=4. Divida ambos por 4: 2/3' },
        { q:'Simplifique 10/15 ao máximo. Qual o numerador?', answer:2, hint:'MDC(10,15)=5. Divida ambos por 5: 2/3' },
      ]},
    { phase:4, topic:'Comparar frações — mesmo denominador', difficulty:'easy',
      variations:[
        { q:'Qual é maior: 3/7 ou 5/7?', answer:'5/7', hint:'Mesmo denominador: compare só os numeradores' },
        { q:'Qual é maior: 4/9 ou 7/9?', answer:'7/9', hint:'Mesmo denominador: compare só os numeradores' },
        { q:'Qual é maior: 2/5 ou 4/5?', answer:'4/5', hint:'Mesmo denominador: compare só os numeradores' },
      ]},
    { phase:5, topic:'Comparar frações — denominadores diferentes', difficulty:'medium',
      variations:[
        { q:'Qual é maior: 1/2 ou 1/3?', answer:'1/2', hint:'1/2=3/6 e 1/3=2/6. Compare: 3/6 > 2/6' },
        { q:'Qual é maior: 1/4 ou 1/3?', answer:'1/3', hint:'1/4=3/12 e 1/3=4/12. Compare: 4/12 > 3/12' },
        { q:'Qual é maior: 3/4 ou 2/3?', answer:'3/4', hint:'3/4=9/12 e 2/3=8/12. Compare: 9/12 > 8/12' },
      ]},
    { phase:6, topic:'Adição de frações — mesmo denominador', difficulty:'medium',
      variations:[
        { q:'2/7 + 3/7 = ?/7. Qual o numerador?', answer:5, hint:'Some só os numeradores: 2+3=5. O denominador fica igual.' },
        { q:'1/5 + 3/5 = ?/5. Qual o numerador?', answer:4, hint:'Some só os numeradores: 1+3=4. O denominador fica igual.' },
        { q:'3/9 + 4/9 = ?/9. Qual o numerador?', answer:7, hint:'Some só os numeradores: 3+4=7. O denominador fica igual.' },
      ]},
    { phase:7, topic:'Subtração de frações — mesmo denominador', difficulty:'medium',
      variations:[
        { q:'5/8 − 2/8 = ?/8. Qual o numerador?', answer:3, hint:'Subtraia os numeradores: 5−2=3. O denominador fica igual.' },
        { q:'6/7 − 2/7 = ?/7. Qual o numerador?', answer:4, hint:'Subtraia os numeradores: 6−2=4. O denominador fica igual.' },
        { q:'9/10 − 3/10 = ?/10. Qual o numerador?', answer:6, hint:'Subtraia os numeradores: 9−3=6. O denominador fica igual.' },
      ]},
    { phase:8, topic:'Adição com denominadores diferentes (MMC simples)', difficulty:'hard',
      variations:[
        { q:'1/2 + 1/4 = ?/4. Qual o numerador?', answer:3, hint:'1/2=2/4. Então 2/4+1/4=3/4. Numerador=3' },
        { q:'1/3 + 1/6 = ?/6. Qual o numerador?', answer:3, hint:'1/3=2/6. Então 2/6+1/6=3/6. Numerador=3' },
        { q:'1/2 + 1/6 = ?/6. Qual o numerador?', answer:4, hint:'1/2=3/6. Então 3/6+1/6=4/6. Numerador=4' },
      ]},
    { phase:9, topic:'Fração de uma quantidade', difficulty:'hard',
      variations:[
        { q:'3/4 de 20 peixes = ? peixes', answer:15, hint:'Divida 20 por 4, depois multiplique por 3: 20÷4×3=15' },
        { q:'2/5 de 30 reais = ? reais', answer:12, hint:'Divida 30 por 5, depois multiplique por 2: 30÷5×2=12' },
        { q:'3/8 de 40 figurinhas = ? figurinhas', answer:15, hint:'Divida 40 por 8, depois multiplique por 3: 40÷8×3=15' },
      ]},
    { phase:10, topic:'Desafio combinado — Caverna', difficulty:'hard',
      variations:[
        { q:'3 desafios: simplificar, comparar e somar frações. Rápido!', answer:null, hint:'Revise tudo que aprendeu na caverna!' },
      ]},
  ],

  porto: [
    { phase:1, topic:'Leitura de números decimais', difficulty:'easy',
      variations:[
        { q:'Como se escreve "seis reais e cinquenta centavos" em número?', answer:'6.50', hint:'Reais são a parte inteira, centavos são os decimais' },
        { q:'Como se escreve "três reais e vinte e cinco centavos"?', answer:'3.25', hint:'3 reais = parte inteira; 25 centavos = 0,25' },
        { q:'Como se escreve "dez reais e setenta centavos"?', answer:'10.70', hint:'10 reais = parte inteira; 70 centavos = 0,70' },
      ]},
    { phase:2, topic:'Comparar números decimais', difficulty:'easy',
      variations:[
        { q:'Qual é maior: 2,5 ou 2,48?', answer:'2.5', hint:'Compare casa a casa: 2,5 = 2,50. 50 > 48, então 2,50 > 2,48' },
        { q:'Qual é maior: 1,3 ou 1,28?', answer:'1.3', hint:'1,3 = 1,30. 30 > 28, então 1,30 > 1,28' },
        { q:'Qual é maior: 0,9 ou 0,89?', answer:'0.9', hint:'0,9 = 0,90. 90 > 89, então 0,90 > 0,89' },
      ]},
    { phase:3, topic:'Adição de decimais (dinheiro)', difficulty:'easy',
      variations:[
        { q:'R$ 3,50 + R$ 2,75 = R$ ?', answer:6.25, hint:'Some como inteiros e depois ponha a vírgula: 350+275=625 → R$6,25' },
        { q:'R$ 4,20 + R$ 3,80 = R$ ?', answer:8.00, hint:'420+380=800 → R$8,00' },
        { q:'R$ 5,50 + R$ 1,75 = R$ ?', answer:7.25, hint:'550+175=725 → R$7,25' },
      ]},
    { phase:4, topic:'Subtração de decimais (troco)', difficulty:'medium',
      variations:[
        { q:'Paguei R$ 10,00 e a compra custou R$ 7,35. Qual o troco?', answer:2.65, hint:'10,00 − 7,35 = 2,65' },
        { q:'Paguei R$ 20,00 e a compra custou R$ 13,50. Qual o troco?', answer:6.50, hint:'20,00 − 13,50 = 6,50' },
        { q:'Paguei R$ 5,00 e a compra custou R$ 3,70. Qual o troco?', answer:1.30, hint:'5,00 − 3,70 = 1,30' },
      ]},
    { phase:5, topic:'Multiplicação: decimal × inteiro (dinheiro)', difficulty:'medium',
      variations:[
        { q:'Cada peixe custa R$ 3,50. Comprei 4 peixes. Total: R$ ?', answer:14.00, hint:'3,50 × 4 = 14,00' },
        { q:'Cada maçã custa R$ 1,25. Comprei 6 maçãs. Total: R$ ?', answer:7.50, hint:'1,25 × 6 = 7,50' },
        { q:'Cada ingresso custa R$ 8,50. Comprei 3. Total: R$ ?', answer:25.50, hint:'8,50 × 3 = 25,50' },
      ]},
    { phase:6, topic:'Divisão de decimal por inteiro', difficulty:'medium',
      variations:[
        { q:'R$ 18,60 dividido igualmente entre 3 amigos. Cada um paga R$ ?', answer:6.20, hint:'18,60 ÷ 3 = 6,20' },
        { q:'R$ 24,80 dividido entre 4 pessoas. Cada uma paga R$ ?', answer:6.20, hint:'24,80 ÷ 4 = 6,20' },
        { q:'R$ 15,60 dividido entre 3 colegas. Cada um paga R$ ?', answer:5.20, hint:'15,60 ÷ 3 = 5,20' },
      ]},
    { phase:7, topic:'Porcentagem — 10% de um valor', difficulty:'medium',
      variations:[
        { q:'Um produto custa R$ 80,00 com 10% de desconto. O desconto é R$ ?', answer:8.00, hint:'10% = dividir por 10. 80 ÷ 10 = 8' },
        { q:'Uma peça custa R$ 120,00 com 10% de desconto. O desconto é R$ ?', answer:12.00, hint:'10% = dividir por 10. 120 ÷ 10 = 12' },
        { q:'Um sapato custa R$ 90,00 com 10% de desconto. O desconto é R$ ?', answer:9.00, hint:'10% = dividir por 10. 90 ÷ 10 = 9' },
      ]},
    { phase:8, topic:'Porcentagem — 25% e 50% de um valor', difficulty:'hard',
      variations:[
        { q:'Qual é 25% de R$ 120,00?', answer:30.00, hint:'25% = dividir por 4. 120 ÷ 4 = 30' },
        { q:'Qual é 50% de R$ 80,00?', answer:40.00, hint:'50% = dividir por 2. 80 ÷ 2 = 40' },
        { q:'Qual é 25% de R$ 200,00?', answer:50.00, hint:'25% = dividir por 4. 200 ÷ 4 = 50' },
      ]},
    { phase:9, topic:'Porcentagem com acréscimo', difficulty:'hard',
      variations:[
        { q:'Produto de R$ 60,00 com frete de 20%. Valor do frete: R$ ?', answer:12.00, hint:'20% de 60: 60×20÷100 = 12' },
        { q:'Produto de R$ 50,00 com acréscimo de 10%. Valor final: R$ ?', answer:55.00, hint:'10% de 50 = 5. Valor final = 50+5 = 55' },
        { q:'Produto de R$ 40,00 com acréscimo de 25%. Valor final: R$ ?', answer:50.00, hint:'25% de 40 = 10. Valor final = 40+10 = 50' },
      ]},
    { phase:10, topic:'Desafio combinado — Porto', difficulty:'hard',
      variations:[
        { q:'3 situações reais de mercado: soma, desconto e troco. Rápido!', answer:null, hint:'Revise o que aprendeu no porto!' },
      ]},
  ],

  castelo: [
    { phase:1, topic:'Números inteiros na reta numérica', difficulty:'easy',
      variations:[
        { q:'Onde fica −5 na reta numérica? Quantas casas à ESQUERDA do zero?', answer:5, hint:'Negativos ficam à esquerda do zero. −5 está 5 casas para a esquerda' },
        { q:'Onde fica −8 na reta numérica? Quantas casas à ESQUERDA do zero?', answer:8, hint:'−8 está 8 casas à esquerda do zero' },
        { q:'Onde fica −3 na reta numérica? Quantas casas à ESQUERDA do zero?', answer:3, hint:'−3 está 3 casas à esquerda do zero' },
      ]},
    { phase:2, topic:'Comparar inteiros positivos e negativos', difficulty:'easy',
      variations:[
        { q:'Cidade A está a −50m e B a +30m. Qual é a mais BAIXA?', answer:'A', hint:'−50 é menor que +30 na reta numérica' },
        { q:'Temperatura de −3°C ou +5°C — qual é mais FRIA?', answer:'-3', hint:'Na reta numérica −3 está mais à esquerda que +5' },
        { q:'Qual é menor: −10 ou −2?', answer:'-10', hint:'Na reta numérica, −10 está mais à esquerda' },
      ]},
    { phase:3, topic:'Adição de inteiros — mesmo sinal', difficulty:'easy',
      variations:[
        { q:'Temperatura era −3°C e caiu mais 5°C. Nova temperatura: ?°C', answer:-8, hint:'−3 + (−5) = −8. Negativos somam, sinal fica negativo' },
        { q:'Dívida de R$10 e gastou mais R$4. Nova dívida: R$ −?', answer:-14, hint:'(−10)+(−4) = −14' },
        { q:'Temperatura −6°C cai mais 4°C. Nova temperatura: ?°C', answer:-10, hint:'(−6)+(−4) = −10' },
      ]},
    { phase:4, topic:'Adição de inteiros — sinais diferentes', difficulty:'medium',
      variations:[
        { q:'(+7) + (−4) = ?', answer:3, hint:'Subtraia o menor do maior: 7−4=3. Sinal do maior (+)' },
        { q:'(+5) + (−8) = ?', answer:-3, hint:'Subtraia o menor do maior: 8−5=3. Sinal do maior (−)' },
        { q:'(+10) + (−6) = ?', answer:4, hint:'Subtraia o menor do maior: 10−6=4. Sinal do maior (+)' },
      ]},
    { phase:5, topic:'Subtração de inteiros (contexto concreto)', difficulty:'medium',
      variations:[
        { q:'Herói está no andar −2 e desce 3 andares. Em que andar está?', answer:-5, hint:'−2 − 3 = −5' },
        { q:'Temperatura era 4°C e caiu 9°C. Qual a nova temperatura?', answer:-5, hint:'4 − 9 = −5' },
        { q:'Saldo era R$ 2,00 e gastou R$ 7,00. Qual o novo saldo?', answer:-5, hint:'2 − 7 = −5' },
      ]},
    { phase:6, topic:'Inteiros em contexto de saldo/dívida', difficulty:'medium',
      variations:[
        { q:'Saldo era R$ −15,00 (dívida). Recebeu R$ 40,00. Novo saldo: R$ ?', answer:25, hint:'(−15) + 40 = 25' },
        { q:'Saldo era R$ −30,00. Recebeu R$ 50,00. Novo saldo: R$ ?', answer:20, hint:'(−30) + 50 = 20' },
        { q:'Saldo era R$ −20,00. Recebeu R$ 35,00. Novo saldo: R$ ?', answer:15, hint:'(−20) + 35 = 15' },
      ]},
    { phase:7, topic:'Reconhecer grandezas proporcionais', difficulty:'medium',
      variations:[
        { q:'2 velas queimam em 3 horas. 4 velas queimam em 6 horas. É proporcional?', answer:'sim', hint:'2×3=6 e 4×6=24? Não. Mas a RAZÃO 2/3=4/6? Sim!' },
        { q:'3 laranjas custam R$6. 6 laranjas custam R$12. É proporcional?', answer:'sim', hint:'6÷3=2 e 12÷6=2. A razão é constante!' },
        { q:'2 torneiras enchem 10L. 4 torneiras enchem 20L. É proporcional?', answer:'sim', hint:'10÷2=5 e 20÷4=5. A razão é constante!' },
      ]},
    { phase:8, topic:'Regra de três simples direta', difficulty:'hard',
      variations:[
        { q:'3 pedreiros constroem 9m de muro. 5 pedreiros constroem ? m', answer:15, hint:'9÷3=3m por pedreiro. 3×5=15' },
        { q:'2 torneiras enchem 10L em 1h. 4 torneiras enchem ? L em 1h', answer:20, hint:'10÷2=5L por torneira. 5×4=20' },
        { q:'4 caixas pesam 12kg. 6 caixas pesam ? kg', answer:18, hint:'12÷4=3kg por caixa. 3×6=18' },
      ]},
    { phase:9, topic:'Regra de três aplicada ao cotidiano', difficulty:'hard',
      variations:[
        { q:'Receita para 12 pães usa 3 xícaras de farinha. Para 20 pães, ? xícaras', answer:5, hint:'3÷12=0,25 xícara por pão. 0,25×20=5' },
        { q:'Carro anda 60 km com 5L de gasolina. Com 8L anda ? km', answer:96, hint:'60÷5=12km por litro. 12×8=96' },
        { q:'4 funcionários fazem 20 peças por hora. 6 funcionários fazem ? peças', answer:30, hint:'20÷4=5 peças por funcionário. 5×6=30' },
      ]},
    { phase:10, topic:'Desafio combinado — Castelo', difficulty:'hard',
      variations:[
        { q:'3 desafios mistos: inteiros, saldo e regra de 3. Prepare-se!', answer:null, hint:'Revise o que aprendeu no castelo!' },
      ]},
  ],
};
