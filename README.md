# LogiTrack API

API de monitoramento de esteiras de um centro de distribuição fictício —
material do **Hackathon 2 (Sessão 02 · CI/CD e Cultura DevOps)** do
DevTalks 2026, Peers Engenharia de Software.

👉 Comece lendo [`docs/scenario.md`](docs/scenario.md) para o briefing
completo do desafio.

## Stack

- Node.js + Express
- Jest + Supertest (testes)
- Docker
- GitHub Actions (`.github/workflows/pipeline.yml`)

## Rodando localmente

```bash
cd app
npm install
npm test
npm start
```

## Demonstração de rollback

Para mostrar o rollback em live demo, rode o script abaixo a partir da raiz do repositório:

```bash
node scripts/demo-rollback.js
```

Ele inicia a API localmente, simula uma falha de deploy, mostra o impacto no endpoint `/health` e executa o rollback pelo endpoint `/demo/rollback` para restaurar o serviço.

## Rollback no pipeline

O workflow de CI/CD agora inclui uma etapa de rollback pós-deploy que pode ser acionada manualmente via `workflow_dispatch` com a opção `run_rollback=true`. A execução dessa etapa é protegida por um ambiente chamado `production`, então o rollback só começa após aprovação configurada no GitHub.
