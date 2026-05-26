# 🏆 Arena dos Mestres da Lógica

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-20_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-3-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Jogo educativo multiplayer de matemática para o 7° ano**  
Projeto de conclusão de curso — SENAI Desenvolvimento de Sistemas

[Demonstração](#-demonstração) · [Instalação](#-instalação) · [Como jogar](#-como-jogar) · [Arquitetura](#-arquitetura) · [Banco de dados](#-banco-de-dados) · [Contribuindo](#-contribuindo)

</div>

---

## 📖 Sobre o projeto

A **Arena dos Mestres da Lógica** é um jogo educativo de matemática em formato de **caça ao tesouro digital multiplayer**, desenvolvido para ser executado em rede local durante feiras de ciências e eventos escolares.

Alunos criam um avatar personalizado e competem em tempo real para avançar por **4 salas temáticas** com **10 fases progressivas** cada — totalizando **40 desafios** alinhados ao currículo do 7° ano (BNCC). O ranking é atualizado ao vivo via WebSocket e pode ser exibido em um telão para estimular a competição saudável.

### ✨ Funcionalidades principais

- **Criação de avatar** com 3 classes de herói, paleta de cores e acessórios
- **40 fases progressivas** divididas em 4 salas temáticas com dificuldade crescente
- **Desbloqueio sequencial de salas** — cada arena só abre ao completar a anterior
- **Ranking ao vivo** via WebSocket com Top 5 exibido em sidebar e telão dedicado
- **Sistema de pontuação** com bônus de velocidade, penalidade por erro e multiplicador por sala
- **Pistas gratuitas** e animação da resposta correta após 3 erros (pensado para 11–12 anos)
- **Painel do professor** com mapa de calor de erros por fase e alerta de alunos travados
- **100% offline** — roda em rede local sem internet durante a feira

---

## 🎮 Demonstração

```
Alunos acessam via navegador:    http://IP_DO_SERVIDOR:5173
Telão do ranking (projetor):     http://IP_DO_SERVIDOR:5173/leaderboard-tv
Painel do professor:             http://IP_DO_SERVIDOR:5173/professor
```

### Fluxo do jogo

```
Lobby → Criar Avatar → Selecionar Sala → Jogar Fase → Feedback →
→ Próxima Fase → ... → Completar Sala → Desbloquear próxima → Vitória
```

### As 4 salas temáticas

| # | Sala | Tema Matemático | Multiplicador | Desbloqueio |
|---|---|---|---|---|
| 🌳 | Floresta dos Números | Múltiplos, divisores, MMC, MDC | ×1,0 | Sempre aberta |
| 💎 | Caverna de Cristais | Frações: leitura, equivalência, operações | ×1,3 | Após Sala 1 |
| ⚓ | Porto dos Mercadores | Números decimais e porcentagem | ×1,6 | Após Sala 2 |
| 🏰 | Castelo dos Segredos | Inteiros e proporcionalidade | ×2,0 | Após Sala 3 |

---

## 🛠️ Tecnologias

### Front-end
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Interface e componentes reativos |
| Vite | 5 | Build tool e servidor de desenvolvimento |
| Tailwind CSS | 3 | Estilização utilitária |
| Framer Motion | 11 | Animações de transição entre fases |
| React Router | 6 | Navegação entre páginas |
| Socket.io Client | 4 | Comunicação em tempo real |

### Back-end
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 20 LTS | Runtime JavaScript |
| Express | 4 | Servidor HTTP e API REST |
| Socket.io | 4 | WebSocket para ranking ao vivo |
| better-sqlite3 | 9 | Banco de dados leve, arquivo único |
| uuid | 9 | Geração de IDs únicos por jogador |

---

## 📋 Pré-requisitos

Antes de começar, verifique se você tem instalado:

- [Node.js 20 LTS](https://nodejs.org/) ou superior
- [npm 10+](https://www.npmjs.com/) (já vem com o Node.js)
- [Git](https://git-scm.com/)
- Navegador moderno (Chrome 120+, Firefox 121+, Edge 120+)

Para verificar as versões instaladas:

```bash
node --version   # deve mostrar v20.x.x ou superior
npm --version    # deve mostrar 10.x.x ou superior
git --version    # deve mostrar git version 2.x.x
```

---

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone https://github.com/rafaelbernini/arena-dos-mestres.git
cd arena-dos-mestres
```

### 2. Instalar dependências do servidor

```bash
cd server
npm install
cd ..
```

### 3. Instalar dependências do cliente

```bash
cd client
npm install
cd ..
```

### 4. Inicializar o banco de dados

```bash
node server/db/init.js
```

Este comando cria o arquivo `server/db/game.db` com o schema completo e as 4 salas já configuradas.

### 5. Configurar variáveis de ambiente (opcional)

Copie o arquivo de exemplo e ajuste se necessário:

```bash
cp .env.example .env
```

```env
PORT=3001           # porta do servidor back-end
PROFESSOR_PIN=1234  # PIN de acesso ao painel do professor
```

---

## ▶️ Rodando o projeto

### Desenvolvimento (dois terminais)

**Terminal 1 — servidor:**
```bash
node server/index.js
# ✅ Arena dos Mestres rodando em http://0.0.0.0:3001
```

**Terminal 2 — cliente:**
```bash
cd client
npm run dev
# ✅ Local: http://localhost:5173
# ✅ Network: http://SEU_IP:5173
```

### Usando o script combinado (raiz do projeto)

Se quiser rodar os dois com um único comando, instale o `concurrently` na raiz:

```bash
npm install
npm run dev
```

---

## 🏫 Configuração para evento / feira escolar

### Descobrir o IP da máquina servidora

```bash
# Linux / macOS
hostname -I

# Windows (PowerShell)
(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' }).IPAddress
```

### Distribuir o link para os alunos

Cole o IP encontrado nos navegadores de cada computador:

```
http://192.168.1.XX:5173
```

> **Dica:** Gere um QR Code com esse link e imprima em cada mesa — facilita para os alunos acessarem pelo celular também.

### Abrir o telão (projetor)

No computador conectado ao projetor, abra em tela cheia (F11):

```
http://192.168.1.XX:5173/leaderboard-tv
```

### Abrir o painel do professor

Em um segundo monitor ou tablet do professor:

```
http://192.168.1.XX:5173/professor
```
PIN padrão: `1234` (altere no arquivo `.env`)

---

## 🗺️ Estrutura do projeto

```
arena-dos-mestres/
│
├── client/                         ← Aplicação React (Vite)
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx                 ← Roteamento principal
│       ├── main.jsx                ← Entry point React
│       ├── index.css               ← Estilos globais e animações
│       │
│       ├── components/
│       │   ├── AvatarCreator/      ← Criação e preview do personagem
│       │   ├── Challenges/         ← Componentes de cada fase
│       │   ├── FX/                 ← Efeitos visuais (partículas, glitch)
│       │   ├── GameMap/            ← Mapa com os nós de fase
│       │   ├── HUD/                ← TimerBar, ScoreDisplay, PhaseProgress
│       │   └── Leaderboard/
│       │       ├── LeaderboardMini.jsx   ← Sidebar durante o jogo
│       │       └── LeaderboardTV.jsx     ← Tela fullscreen para telão
│       │
│       ├── context/
│       │   ├── GameContext.jsx     ← Estado global do jogador
│       │   └── SocketContext.jsx   ← Conexão WebSocket compartilhada
│       │
│       ├── hooks/
│       │   ├── useTimer.js         ← Timer regressivo com Page Visibility API
│       │   └── useScore.js         ← Pontuação com multiplicador por sala
│       │
│       └── pages/
│           ├── LobbyPage.jsx       ← Tela de entrada com nick
│           ├── AvatarPage.jsx      ← Criação de personagem
│           ├── RoomSelectorPage.jsx← Hub de seleção de salas
│           ├── GamePage.jsx        ← Fase ativa com HUD completo
│           ├── VictoryPage.jsx     ← Tela de vitória final
│           └── ProfessorPage.jsx   ← Painel pedagógico
│
├── server/                         ← API Node.js + Socket.io
│   ├── index.js                    ← Entry point do servidor
│   ├── db/
│   │   ├── schema.sql              ← Estrutura do banco + seed das salas
│   │   └── init.js                 ← Script de inicialização
│   ├── routes/
│   │   ├── players.js              ← POST/GET /api/players
│   │   ├── rooms.js                ← GET/POST /api/rooms
│   │   └── scores.js               ← GET /api/scores
│   └── sockets/
│       └── leaderboard.js          ← Eventos WebSocket do ranking
│
├── shared/                         ← Código compartilhado (cliente + servidor)
│   ├── difficulty.js               ← Constantes de dificuldade, classes, scoring
│   └── phases.config.js            ← Configuração das 40 fases com variações
│
├── docs/
│   └── game.md                     ← Documento de design e especificação completa
│
├── .env.example
├── .gitignore
├── package.json                    ← Scripts combinados (raiz)
├── setup-github.ps1                ← Script PowerShell para sincronizar com GitHub
└── README.md
```

---

## 🗄️ Banco de dados

O projeto usa **SQLite** com o arquivo `server/db/game.db` gerado automaticamente.

### Diagrama das tabelas

```
┌─────────────┐       ┌──────────────────────────┐
│   rooms     │       │  player_room_progress     │
│─────────────│       │──────────────────────────│
│ id          │◄──┐   │ id                        │
│ room_key    │   │   │ player_id  ────────────►┐ │
│ name        │   └───│ room_id                  │ │
│ theme       │       │ phases_done (JSON)        │ │
│ emoji       │       │ room_score                │ │
│ required_   │       │ is_completed              │ │
│   room_id ──┘       │ completed_at              │ │
│ multiplier  │       └──────────────────────────┘ │
│ unlock_bonus│                                     │
│ boss_name   │       ┌──────────────────────────┐ │
└─────────────┘       │      players             │◄┘
                      │──────────────────────────│
                      │ id (UUID)                 │
                      │ nickname                  │
                      │ hero_class                │
                      │ avatar_json               │
                      │ current_room_id           │
                      │ total_score               │
                      │ rooms_completed           │
                      │ connected                 │
                      └──────────────────────────┘
                                │
                      ┌─────────▼────────────────┐
                      │    response_logs          │
                      │──────────────────────────│
                      │ player_id                 │
                      │ room_id                   │
                      │ phase                     │
                      │ is_correct                │
                      │ points_earned             │
                      │ attempts_used             │
                      │ hint_used                 │
                      │ response_time_s           │
                      └──────────────────────────┘
```

### Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/players` | Criar novo jogador |
| `GET` | `/api/players/:id` | Buscar estado do jogador |
| `GET` | `/api/rooms/:playerId` | Status de todas as salas |
| `POST` | `/api/rooms/:roomId/phase/:n/complete` | Registrar fase concluída |
| `GET` | `/api/rooms/leaderboard/global` | Top 5 global |
| `GET` | `/api/scores/player/:id` | Histórico de um jogador |
| `GET` | `/api/scores/report` | Relatório pedagógico |
| `GET` | `/api/health` | Health check do servidor |

### Eventos WebSocket

| Evento | Direção | Descrição |
|---|---|---|
| `player_join` | Cliente → Servidor | Registrar jogador online |
| `request_leaderboard` | Cliente → Servidor | Solicitar Top 5 atual |
| `phase_start` | Cliente → Servidor | Atualizar timestamp de atividade |
| `leaderboard_update` | Servidor → Todos | Top 5 atualizado |
| `room_unlock_broadcast` | Servidor → Todos | Feed: alguém desbloqueou sala |
| `absolute_winner` | Servidor → Todos | Alguém completou as 40 fases |

---

## 🎯 Sistema de pontuação

```
Pontuação da fase = (1.000 pts base + bônus de velocidade − penalidade) × multiplicador da sala

Bônus de velocidade:  até +300 pts se resolvido nos primeiros 20 segundos
Penalidade por erro:  −100 pts por resposta incorreta
Multiplicador:        ×1,0 (Sala 1) / ×1,3 (Sala 2) / ×1,6 (Sala 3) / ×2,0 (Sala 4)
Bônus de desbloqueio: +300 pts (Sala 2) / +500 pts (Sala 3) / +800 pts (Sala 4)
Tempo por fase:       60 segundos
Tentativas:           3 por fase (na 3ª exibe a resposta correta)
Pistas:               gratuitas (sem custo de pontos)
```

### Classes de herói

| Classe | Emoji | Perk |
|---|---|---|
| Explorador Curioso | 🧭 | Pistas extras gratuitas |
| Inventor Maluco | 🔧 | Timer começa com +10 segundos |
| Artista dos Números | 🎨 | Erros custam −50 pts em vez de −100 |

---

## 📊 Painel do professor

Acesse em `/professor` com o PIN configurado no `.env` (padrão: `1234`).

Funcionalidades disponíveis:

- **Mapa de calor** — identifica quais fases têm maior taxa de erro
- **Alerta de alunos travados** — lista jogadores sem progresso há mais de 5 minutos
- **Tempo médio por fase** — em segundos, por sala
- **Taxa de uso de pistas** — por fase
- **Dados brutos** — tabela completa de `response_logs` para análise

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga o fluxo abaixo:

```bash
# 1. Fork e clone
git clone https://github.com/SEU_USUARIO/arena-dos-mestres.git

# 2. Crie uma branch descritiva
git checkout -b feat/nova-fase-geometria

# 3. Faça suas alterações e commit
git add .
git commit -m "feat: adiciona fase de geometria na sala 3"

# 4. Push e abra um Pull Request
git push origin feat/nova-fase-geometria
```

### Convenção de commits

```
feat:     nova funcionalidade
fix:      correção de bug
docs:     documentação
style:    formatação (sem mudança de lógica)
refactor: refatoração sem nova feature
test:     testes
chore:    tarefas de manutenção
```

---

## 📁 Scripts disponíveis

### Raiz do projeto
```bash
npm run dev          # inicia servidor + cliente simultaneamente
npm run install:all  # instala dependências de todos os workspaces
npm run setup        # inicializa o banco de dados
```

### Client (`cd client`)
```bash
npm run dev          # servidor de desenvolvimento Vite (com hot reload)
npm run build        # build de produção em client/dist/
npm run preview      # preview do build de produção
```

### Server (`cd server`)
```bash
npm run dev          # servidor com --watch (reinicia ao salvar)
npm start            # servidor sem watch (produção)
```

### Sincronizar com GitHub (Windows)
```powershell
.\setup-github.ps1 https://github.com/SEU_USUARIO/SEU_REPO.git
```

---

## 🐛 Solução de problemas

<details>
<summary><strong>Porta 3001 ou 5173 já em uso</strong></summary>

```bash
# Linux / macOS
lsof -ti:3001 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess -Force
```
</details>

<details>
<summary><strong>Alunos não conseguem acessar pelo IP</strong></summary>

1. Verifique se o firewall permite a porta 5173 e 3001
2. Confirme que todos estão na mesma rede Wi-Fi / cabeada
3. Teste acessar `http://IP:3001/api/health` no navegador — deve retornar `{"ok":true}`
4. No Windows, libere as portas no Firewall do Windows Defender
</details>

<details>
<summary><strong>Erro "better-sqlite3" ao instalar no Windows</strong></summary>

O `better-sqlite3` precisa de ferramentas de compilação C++. Instale:

```powershell
# No PowerShell como Administrador
npm install --global windows-build-tools
```

Ou instale o **Visual Studio Build Tools** em: https://visualstudio.microsoft.com/downloads/
</details>

<details>
<summary><strong>Banco de dados corrompido ou resetar o jogo</strong></summary>

```bash
# Apagar e recriar o banco (apaga todos os jogadores e pontuações)
rm server/db/game.db
node server/db/init.js
```
</details>

<details>
<summary><strong>Script PowerShell bloqueado no Windows</strong></summary>

```powershell
# Executar uma vez como Administrador
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
</details>

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.

---

## 👥 Autores

Desenvolvido como projeto de conclusão de curso em **Desenvolvimento de Sistemas — SENAI**.

---

<div align="center">

Feito com ❤️ por alunos para alunos

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!

</div>