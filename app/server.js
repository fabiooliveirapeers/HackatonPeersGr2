const express = require('express');
const app = express();
app.use(express.json());

// Dados simulados de esteiras de um centro de distribuição
const esteiras = [
  { id: 1, setor: 'Recebimento', velocidade: 1.2, status: 'operando' },
  { id: 2, setor: 'Separação', velocidade: 0.8, status: 'operando' },
  { id: 3, setor: 'Expedição', velocidade: 1.5, status: 'manutenção' },
];

let demoFailureActive = false;

app.get('/health', (req, res) => {
  if (demoFailureActive) {
    return res.status(503).json({
      status: 'degraded',
      error: 'Falha simulada de deploy',
    });
  }

  res.status(200).json({ status: 'ok' });
});

app.get('/esteiras', (req, res) => {
  const { status, setor } = req.query;
  const filtradas = esteiras.filter((esteira) => {
    const matchStatus = !status || esteira.status === status;
    const matchSetor = !setor || esteira.setor === setor;
    return matchStatus && matchSetor;
  });

  res.status(200).json(filtradas);
});

app.get('/esteiras/:id', (req, res) => {
  const esteira = esteiras.find((e) => e.id === Number(req.params.id));
  if (!esteira) {
    return res.status(404).json({ error: 'Esteira não encontrada' });
  }
  res.status(200).json(esteira);
});

app.get('/tests', (req, res) => {
  const testes = [
    'GET /health',
    'GET /esteiras',
    'GET /esteiras/:id',
    'GET /tests',
    'GET /demo/failure',
    'POST /demo/failure',
    'POST /demo/rollback',
  ];

  res.status(200).json(testes);
});

app.get('/demo/failure', (req, res) => {
  res.status(200).json({
    active: demoFailureActive,
    message: demoFailureActive ? 'Falha simulada ativa' : 'Sem falha simulada',
  });
});

app.post('/demo/failure', (req, res) => {
  demoFailureActive = true;

  res.status(500).json({
    error: 'Falha simulada de deploy',
    rollback: 'Use o workflow de rollback para restaurar a versão anterior.',
  });
});

app.post('/demo/rollback', (req, res) => {
  demoFailureActive = false;

  res.status(200).json({
    status: 'ok',
    message: 'Rollback simulado concluído',
  });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`LogiTrack API rodando na porta ${PORT}`));
}

module.exports = app;
