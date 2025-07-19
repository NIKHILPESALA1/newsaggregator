import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post('/scrape', async (req, res) => {
  const { url } = req.body;
  const apiKey = 'fc-ef79c7a1df0c476cbcf411416f3c0b98';

  try {
    const response = await axios.post('https://api.firecrawl.dev/v1/scrape', { url }, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });

    res.json(response.data);
  } catch (error) {
    console.error('🔥 Error scraping site:', error.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
});

app.listen(PORT, () => {
  console.log(`🔥 Backend server running at http://localhost:${PORT}`);
});
