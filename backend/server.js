const express = require('express');
const cors = require('cors');
const { evaluate } = require('mathjs');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Math Computation Endpoint
app.post('/api/calculate', (req, res) => {
  const { expression } = req.body;
  try {
    const result = evaluate(expression);
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Invalid mathematical expression' });
  }
});

// 2. External Currency API Endpoint
app.get('/api/convert', async (req, res) => {
  const { from = 'USD', to = 'EUR', amount = 1 } = req.query;
  try {
    const response = await fetch(`https://open.er-api.com/v6/latest/${from}`);
    const data = await response.json();
    
    if (data && data.rates && data.rates[to]) {
      const rate = data.rates[to];
      const converted = amount * rate;
      res.json({ success: true, from, to, rate, amount: Number(amount), result: converted });
    } else {
      res.status(400).json({ success: false, error: 'Invalid currency code' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch external API data' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Local Backend running at http://localhost:${PORT}`));