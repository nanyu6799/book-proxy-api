import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/findbooks', async (req, res) => {
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
    const result = {
      title: book.title || "未知",
      authors: book.authors?.join(', ') || "未知",
      description: book.description || "暂无简介",
    };

    return res.json({
      message: `书名：${result.title}\n作者：${result.authors}\n简介：${result.description}`
    });
  } catch (error) {
    console.error('查询出错：', error);
    res.status(500).json({ message: '查询失败，请稍后重试。' });
  }
});

app.listen(PORT, () => {
  console.log(`📚 Book Proxy API is running at http://localhost:${PORT}`);
});
