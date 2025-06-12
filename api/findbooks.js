// api/findbooks.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: 'Missing title parameter' });
  }

  try {
    const query = encodeURIComponent(title);
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${query}`);
    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      return res.json({ message: "未找到相关图书。" });
    }

    const book = data.items[0].volumeInfo;
    return res.json({
      message: `书名：${book.title}\n作者：${book.authors?.join(', ') || "未知"}\n简介：${book.description || "暂无简介"}`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '查询失败' });
  }
}
