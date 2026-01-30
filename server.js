const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const cors = require('cors');



// ================== CONFIG ==================


const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3000;

const app = express();
const bot = new TelegramBot(TOKEN, { polling: true });

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

// Test bot command
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '✅ Bot is active and working!');
});

// Contact form API
app.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  const telegramMessage = `
📩 *New Contact Form Submission*

👤 *Name:* ${name}
📧 *Email:* ${email}
📱 *Phone:* ${phone || 'N/A'}
💬 *Message:* ${message}
`;

  try {
    await bot.sendMessage(CHAT_ID, telegramMessage, {
      parse_mode: 'Markdown'
    });

    res.json({ success: true, message: 'Message sent to Telegram' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Start server
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
