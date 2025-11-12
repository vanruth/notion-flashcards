import fetch from "node-fetch";

export default async function handler(req, res) {
  const NOTION_TOKEN = process.env.NOTION_TOKEN;
  const DATABASE_ID = process.env.DATABASE_ID;

  const notionRes = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    }
  });

  const data = await notionRes.json();

  const cards = data.results.map(page => ({
    word: page.properties.Word?.title?.[0]?.plain_text ?? "",
    translation: page.properties.Translation?.rich_text?.[0]?.plain_text ?? ""
  }));

  res.status(200).json(cards);
}

