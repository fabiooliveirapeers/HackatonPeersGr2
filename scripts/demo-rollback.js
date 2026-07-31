#!/usr/bin/env node
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const port = process.env.PORT || '3000';
const appDir = path.join(__dirname, '..', 'app');

function requestJson(method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path: pathname,
        method,
        headers: payload
          ? {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload),
            }
          : undefined,
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          let parsedBody = null;
          if (data) {
            try {
              parsedBody = JSON.parse(data);
            } catch (error) {
              parsedBody = data;
            }
          }

          resolve({
            statusCode: res.statusCode,
            body: parsedBody,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

function waitForServer(timeoutMs = 15000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const loop = async () => {
      try {
        const response = await requestJson('GET', '/health');
        if (response.statusCode === 200) {
          resolve();
          return;
        }
      } catch (error) {
        // keep trying until timeout
      }

      if (Date.now() - startedAt >= timeoutMs) {
        reject(new Error('Servidor não ficou pronto a tempo.'));
        return;
      }

      setTimeout(loop, 500);
    };

    loop();
  });
}

async function main() {
  const serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: appDir,
    env: { ...process.env, PORT: port },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverOutput = '';
  serverProcess.stdout.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });
  serverProcess.stderr.on('data', (chunk) => {
    serverOutput += chunk.toString();
  });

  const cleanup = () => {
    if (!serverProcess.killed) {
      serverProcess.kill('SIGTERM');
    }
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  try {
    await waitForServer();

    console.log('1. Verificando health inicial');
    const initialHealth = await requestJson('GET', '/health');
    console.log(`   -> ${initialHealth.statusCode} ${JSON.stringify(initialHealth.body)}`);

    console.log('2. Simulando falha de deploy');
    const failure = await requestJson('POST', '/demo/failure');
    console.log(`   -> ${failure.statusCode} ${JSON.stringify(failure.body)}`);

    console.log('3. Validando impacto da falha');
    const brokenHealth = await requestJson('GET', '/health');
    console.log(`   -> ${brokenHealth.statusCode} ${JSON.stringify(brokenHealth.body)}`);

    console.log('4. Executando rollback');
    const rollback = await requestJson('POST', '/demo/rollback');
    console.log(`   -> ${rollback.statusCode} ${JSON.stringify(rollback.body)}`);

    console.log('5. Validando recuperação');
    const restoredHealth = await requestJson('GET', '/health');
    console.log(`   -> ${restoredHealth.statusCode} ${JSON.stringify(restoredHealth.body)}`);

    console.log('Rollback demonstrado com sucesso.');
  } finally {
    cleanup();
    await new Promise((resolve) => {
      serverProcess.once('exit', resolve);
      setTimeout(resolve, 2000);
    });
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
