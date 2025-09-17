const express = require('express');

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());

/**
 * Generate the first `count` Fibonacci numbers.
 * Returns an array starting with 0, 1, 1, 2, ... of length `count`.
 * @param {number} count
 * @returns {number[]}
 */
function generateFibonacci(count) {
  if (count <= 0) {
    return [];
  }
  if (count === 1) {
    return [0];
  }
  const sequence = [0, 1];
  for (let i = 2; i < count; i += 1) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

function parseRequestedCount(req) {
  const candidate =
    (req.method === 'GET' ? req.query.n ?? req.query.count : req.body?.n ?? req.body?.count);
  const parsed = typeof candidate === 'string' ? Number.parseInt(candidate, 10) : candidate;
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed)) {
    return { error: 'Parameter `n` (integer) is required.' };
  }
  if (parsed < 0) {
    return { error: 'Parameter `n` must be a non-negative integer.' };
  }
  if (parsed > 1000) {
    return { error: 'Parameter `n` must be <= 1000.' };
  }
  return { value: parsed };
}

function handleFibonacci(req, res) {
  const result = parseRequestedCount(req);
  if (result.error) {
    return res.status(400).json({ error: result.error });
  }
  const sequence = generateFibonacci(result.value);
  return res.json({ sequence, length: sequence.length });
}

app.get('/fibonacci', handleFibonacci);
app.post('/fibonacci', handleFibonacci);

app.get('/', (_req, res) => {
  res.json({ message: 'Use GET /fibonacci?n=10 or POST /fibonacci { n }' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

