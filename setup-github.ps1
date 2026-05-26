#Requires -Version 5.1
<#
.SYNOPSIS
    Sincroniza o projeto Arena dos Mestres da Logica com o GitHub.

.DESCRIPTION
    Inicializa um repositorio Git local, faz o commit inicial
    e envia para o repositorio remoto informado.

.PARAMETER RemoteUrl
    URL do repositorio GitHub.
    Exemplo: https://github.com/SEU_USUARIO/SEU_REPO.git

.EXAMPLE
    .\setup-github.ps1 -RemoteUrl https://github.com/joao/arena-dos-mestres.git

.EXAMPLE
    .\setup-github.ps1 https://github.com/joao/arena-dos-mestres.git
#>

param(
    [Parameter(Position = 0, Mandatory = $true,
        HelpMessage = "URL do repositorio GitHub (ex: https://github.com/rafaelbernini/arena-dos-mestres.git)")]
    [ValidatePattern('^https?://')]
    [string]$RemoteUrl
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# ---------------------------------------------------------------------------
# Funcoes auxiliares
# ---------------------------------------------------------------------------

function Write-Step {
    param([string]$Icon, [string]$Message)
    Write-Host ""
    Write-Host "$Icon  $Message" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "   OK  $Message" -ForegroundColor Green
}

function Write-Fail {
    param([string]$Message)
    Write-Host "   ERRO  $Message" -ForegroundColor Red
}

function Assert-GitInstalled {
    try {
        $ver = git --version 2>&1
        Write-Success "Git encontrado: $ver"
    }
    catch {
        Write-Fail "Git nao encontrado. Instale em: https://git-scm.com/download/win"
        exit 1
    }
}

function Assert-NotInsideGitRepo {
    $previousErrorActionPreference = $ErrorActionPreference
    try {
        # `git rev-parse` returns a non-zero exit code outside a repo, which is
        # expected here and should not abort the script.
        $ErrorActionPreference = 'Continue'
        $inside = & git rev-parse --is-inside-work-tree 2>$null
    }
    finally {
        $ErrorActionPreference = $previousErrorActionPreference
    }

    if ($LASTEXITCODE -eq 0 -and $inside -eq 'true') {
        Write-Host ""
        Write-Host "  AVISO  Esta pasta ja e um repositorio Git." -ForegroundColor Yellow
        Write-Host "         O script vai apenas adicionar o remote e fazer push." -ForegroundColor Yellow
    }
}

# ---------------------------------------------------------------------------
# Inicio
# ---------------------------------------------------------------------------

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host "   Arena dos Mestres da Logica - Setup GitHub" -ForegroundColor Magenta
Write-Host "   SESI  7 Ano  Matematica" -ForegroundColor DarkMagenta
Write-Host "============================================================" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "   Repositorio de destino:" -ForegroundColor Gray
Write-Host "   $RemoteUrl" -ForegroundColor White
Write-Host ""

# 1. Verificar Git
Write-Step "1/5" "Verificando instalacao do Git..."
Assert-GitInstalled

# 2. Verificar se ja e repo Git
Write-Step "2/5" "Verificando estado do repositorio local..."
Assert-NotInsideGitRepo

# 3. git init (so se nao tiver .git)
if (-not (Test-Path ".git")) {
    Write-Step "3/5" "Inicializando repositorio Git..."
    git init
    if ($LASTEXITCODE -ne 0) { Write-Fail "Falha em git init"; exit 1 }
    Write-Success "Repositorio inicializado"
} else {
    Write-Step "3/5" "Repositorio Git ja existe. Pulando git init."
}

# 4. Staging + commit
Write-Step "4/5" "Adicionando arquivos e criando commit inicial..."

git add .
if ($LASTEXITCODE -ne 0) { Write-Fail "Falha em git add"; exit 1 }

$commitMsg = "feat: projeto inicial -- Arena dos Mestres da Logica SESI"
git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    # Pode falhar se nao houver nada novo (repo ja tinha commits)
    Write-Host "   AVISO  Nenhum arquivo novo para commitar (ou commit ja existe)." -ForegroundColor Yellow
}
Write-Success "Commit criado"

git branch -M main
if ($LASTEXITCODE -ne 0) { Write-Fail "Falha ao renomear branch para main"; exit 1 }
Write-Success "Branch renomeada para 'main'"

# 5. Remote + push
Write-Step "5/5" "Conectando ao GitHub e fazendo push..."

# Remove remote 'origin' se ja existir, para evitar conflito
$existingRemote = git remote 2>&1 | Select-String 'origin'
if ($existingRemote) {
    git remote remove origin
    Write-Host "   INFO  Remote 'origin' anterior removido." -ForegroundColor Gray
}

git remote add origin $RemoteUrl
if ($LASTEXITCODE -ne 0) { Write-Fail "Falha ao adicionar remote"; exit 1 }
Write-Success "Remote 'origin' adicionado"

Write-Host ""
Write-Host "   Enviando codigo para o GitHub..." -ForegroundColor Gray
Write-Host "   (pode aparecer uma janela de login na primeira vez)" -ForegroundColor Gray
Write-Host ""

git push -u origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Fail "Falha no push. Verifique:"
    Write-Host "   - O repositorio existe no GitHub?" -ForegroundColor Yellow
    Write-Host "   - Voce tem permissao de escrita nele?" -ForegroundColor Yellow
    Write-Host "   - Esta autenticado? (git config --global credential.helper manager)" -ForegroundColor Yellow
    exit 1
}

# ---------------------------------------------------------------------------
# Sucesso
# ---------------------------------------------------------------------------

Write-Host ""
Write-Host "============================================================" -ForegroundColor DarkGreen
Write-Host "   Pronto! Repositorio sincronizado com sucesso." -ForegroundColor Green
Write-Host ""
Write-Host "   Acesse:" -ForegroundColor Gray
Write-Host "   $RemoteUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "   Proximos passos:" -ForegroundColor Gray
Write-Host "   1. cd arena-dos-mestres" -ForegroundColor White
Write-Host "   2. node server/db/init.js" -ForegroundColor White
Write-Host "   3. cd server ; npm install ; cd .." -ForegroundColor White
Write-Host "   4. cd client ; npm install ; cd .." -ForegroundColor White
Write-Host "   5. npm run dev" -ForegroundColor White
Write-Host "============================================================" -ForegroundColor DarkGreen
Write-Host ""
