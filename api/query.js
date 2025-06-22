// api/query.js

import { SessionsClient } from "@google-cloud/dialogflow";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { query, sessionId } = req.body;

  const creds = require("../service-account.json");

  const client = new SessionsClient({
    credentials: {
      private_key: creds.private_key,
      client_email: creds.client_email,
    }
  });

  const sessionPath = client.projectAgentSessionPath(creds.project_id, sessionId);

  const [response] = await client.detectIntent({
    session: sessionPath,
    queryInput: {
      text: { text: query, languageCode: "ar" }
    }
  });

  res.status(200).json({ reply: response.queryResult.fulfillmentText });
}
