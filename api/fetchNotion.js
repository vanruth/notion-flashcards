import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const data = await notion.databases.query({ database_id: databaseId });

    // Debugging: see what Notion returns
    console.log(JSON.stringify(data, null, 2));

    const cards = data.results.map(page => ({
      word: page.properties["Word"]?.title?.[0]?.plain_text || "",
      // Fix: for Text type, read the `text` property
      translation: page.properties["Translation"]?.text?.[0]?.plain_text || "",
    })).filter(card => card.word && card.translation);

    res.status(200).json({ cards });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

