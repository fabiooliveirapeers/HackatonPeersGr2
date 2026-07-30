# Cenário: LogiTrack — Esteira em Chamas 🔥

A LogiTrack é uma startup fictícia que monitora esteiras (conveyor belts) de
centros de distribuição através de uma API simples. Na sexta-feira passada,
durante um deploy de rotina, a esteira — agora a de CI/CD — causou um
incidente:

- O time fez deploy direto pra produção, sem qualquer validação.
- Um token de deploy vazou em texto puro nos logs do pipeline.
- Quando o deploy quebrou o serviço, não havia como voltar rápido — o
  rollback foi manual e levou 3 horas.
- Ninguém percebeu o problema a tempo, porque não existe nenhuma métrica ou
  alerta configurado.

Seu time herdou essa pipeline. O desafio: destrinchar o
`.github/workflows/pipeline.yml` atual, identificar os problemas, e entregar
uma esteira de CI/CD confiável.

## O que seu time precisa entregar

1. **Pipeline corrigida rodando no Actions** — build, testes reais
   (bloqueantes) e deploy.
2. **Gerenciamento seguro de secrets** — nada de token em texto puro no
   YAML.
3. **Estratégia de deploy segura** — alguma forma de blue/green ou canary,
   e um caminho de rollback claro (não precisa ser 100% automatizado, mas
   precisa existir e ser demonstrável).
4. **Disciplina de trigger** — a pipeline não deve rodar descontroladamente
   em qualquer branch.
5. **Observabilidade mínima** — pelo menos um passo que gere log
   estruturado ou um health-check pós-deploy.
6. **Um ADR curto (meia página)** documentando as decisões técnicas do seu
   time.

## Regras

- Cada time recebe o repo via "Use this template" e trabalha isolado no
  seu próprio repositório.
- Podem usar qualquer ferramenta vista na Sessão 02 (GitHub Actions,
  Docker, feature flags, gerenciamento de secrets, etc.) — não precisa ser
  literalmente Vault/Prometheus, pode ser simulado.
- Ao final, cada time demonstra ao vivo: um deploy passando e, em seguida,
  simula uma falha para mostrar como fariam o rollback.

## Critérios de avaliação

| Dimensão | O que avaliamos |
|---|---|
| Ferramentas | A pipeline usa as ferramentas certas, bem configuradas (Actions, Docker) |
| Práticas | Testes realmente bloqueiam o merge, disciplina de branch/trigger, alguma forma de blue/green ou feature flag |
| Governança | Secrets fora do código, log/observabilidade mínima, plano de rollback demonstrável |

## Rodando localmente

```bash
cd app
npm install
npm test
npm start
```
