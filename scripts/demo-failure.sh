#!/usr/bin/env bash
set -euo pipefail

echo "Simulando falha de deploy..."
echo "Aplicando configuração de rollback de demonstração"

if command -v docker >/dev/null 2>&1; then
  docker ps >/dev/null 2>&1 || true
fi

echo "Rollback pronto para execução via workflow manual."
