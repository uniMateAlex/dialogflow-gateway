// /api/query.js

import { SessionsClient } from "@google-cloud/dialogflow";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { query, sessionId } = req.body;

  // استخدام متغير البيئة بدل ملف خارجي
  const key = JSON.parse(process.env.GOOGLE_CREDENTIALS);

  const client = new SessionsClient({
    credentials: {
      private_key: key.private_key,
      client_email: key.client_email,
    },
  });

  const sessionPath = client.projectAgentSessionPath(key.project_id, sessionId);

  try {
    const [response] = await client.detectIntent({
      session: sessionPath,
      queryInput: {
        text: { text: query, languageCode: "ar" },
      },
    });

    res.status(200).json({ reply: response.queryResult.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow error:", error);
    res.status(500).json({ error: "Dialogflow error" });
  }
}
