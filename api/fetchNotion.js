import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  try {
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!databaseId || !process.env.NOTION_API_KEY) {
      throw new Error("Missing environment variables.");
    }

    const data = await notion.databases.query({ database_id: databaseId });

    console.log("Raw Notion data:", JSON.stringify(data, null, 2));

    const cards = data.results.map(page => ({
      word: page.properties["Word"]?.title?.[0]?.plain_text || "",
      translation: page.properties["Translation"]?.text?.[0]?.plain_text || "",
    })).filter(card => card.word && card.translation);

    console.log("Parsed cards:", cards);

    res.status(200).json({ cards });
  } catch (error) {
    console.error("Error fetching Notion data:", error);
    res.status(500).json({ error: error.message });
  }
}
