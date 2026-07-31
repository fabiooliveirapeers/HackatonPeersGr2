# ADR-001: CI/CD confiável para LogiTrack

## Status
Aceito.

## Contexto
A pipeline anterior fazia deploy direto para produção, executava passos sem validação real e expunha um token de deploy em texto puro. Isso aumentava o risco de regressões, dificultava a recuperação em caso de falha e deixava o time sem visibilidade sobre o estado do serviço.

## Decisão
A partir de agora, a entrega passa por uma pipeline com validação obrigatória antes do deploy: testes automatizados, build de imagem Docker e smoke test do container. O deploy para produção só ocorre após essas etapas e apenas a partir da branch principal. Credenciais passam a ser tratadas como secrets do GitHub Actions, nunca como valores fixos no YAML ou em logs. Para recuperação rápida, mantemos scripts de deploy e rollback e um workflow manual de rollback, permitindo restaurar uma versão anterior em poucos minutos.

## Consequências
- Confiabilidade: mudanças quebradas são bloqueadas antes de chegar em produção.
- Segurança: tokens e segredos ficam fora do código e não aparecem nos logs.
- Recuperação rápida: rollback fica documentado e executável de forma padronizada.
- Disciplina de execução: a pipeline só roda em cenários controlados, com triggers limitados e sem deploys improvisados.
- Visibilidade: o pipeline gera evidência de build, publicação da imagem e validação do serviço após o deploy.
