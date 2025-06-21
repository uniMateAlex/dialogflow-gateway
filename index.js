require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');

const app = express();
app.use(bodyParser.json());

const client = new SessionsClient({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }
});
const projectId = process.env.GOOGLE_PROJECT_ID;

app.post('/query', async (req, res) => {
  const { query, sessionId } = req.body;

  const sessionPath = client.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: 'ar', // لو البوت بالعربي
      },
    },
  };

  try {
    const [response] = await client.detectIntent(request);
    const reply = response.queryResult.fulfillmentText;
    res.json({ fulfillmentText: reply });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Dialogflow Gateway running on port ${PORT}`);
});