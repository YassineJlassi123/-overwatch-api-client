# Overwatch API Client

A comprehensive API client for Overwatch 2 player data built with **Hono.js**, **Zod**, and **Got**. This project provides a clean, type-safe interface to the OverFast API.

## 🚀 Features

- **Player Search**: Find players by BattleTag
- **Complete User Data**: Get aggregated stats, summaries
- **Type Safety**: Full TypeScript support with Zod validation
- **Error Handling**: Comprehensive error handling with custom error types
- **Rate Limiting**: Built-in retry logic and request optimization
- **Clean Architecture**: Modular structure with separation of concerns

## 📁 Project Structure

```
src/
├── lib/
│   ├── overwatch/
│   │   ├── client.ts          # Main OverwatchClient class
│   │   ├── types.ts           # TypeScript interfaces
│   │   └── validators.ts      # Zod schemas for validation
│   ├── utils/
│   │   ├── errors.ts          # Custom error classes
│   │   └── response.ts        # Response helpers
│   └── config/
│       └── api.ts             # Configuration
├── modules/
│   ├── search/
│   │   ├── routes.ts          # Search routes
│   │   └── handlers.ts        # Search handlers
│   ├── user/
│   │   ├── routes.ts          # User data routes
│   │   └── handlers.ts        # User handlers
│   └── health/
│       └── routes.ts          # Health check
├── app.ts                     # Main Hono app
└── index.ts                   # Entry point
```

## 🛠️ Installation

1. **Clone or create the project directory:**
```bash
mkdir overwatch-api
cd overwatch-api
```

2. **Initialize and install dependencies:**
```bash
npm init -y
npm install hono zod got
npm install -D typescript @types/node tsx nodemon
```

3. **Create environment file (`.env`):**
```env
OVERWATCH_API_URL=https://overfast-api.tekrop.fr
PORT=3000
NODE_ENV=development
```


## 🏃‍♂️ Running the Project

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## 📝 API Endpoints

### 🔍 Player Search
```
GET /api/search?name={battletag}&platform={platform}
```
**Example:** `/api/search?name=Player-1234&platform=pc`

### 👤 Complete User Data (Recommended)
```
GET /api/user/{battletag}?platform={platform}
```
**Example:** `/api/user/Player-1234?platform=pc`

Returns aggregated data including:
- Player summary (profile info, endorsement, competitive ranks)
- Competitive stats
- Quickplay stats  

### 📊 User Summary Only
```
GET /api/user/{battletag}/summary?platform={platform}
```
**Example:** `/api/user/Player-1234/summary?platform=pc`

### 📈 User Stats by Mode
```
GET /api/user/{battletag}/stats?platform={platform}&mode={mode}
```
**Example:** `/api/user/Player-1234/stats?platform=pc&mode=competitive`

### ❤️ Health Check
```
GET /health
```

## 🎮 Usage Examples

### Search for a player:
```bash
curl "http://localhost:3000/api/search?name=Player-1234"
```

### Get complete user data:
```bash
curl "http://localhost:3000/api/user/Player-1234?platform=pc"
```

### Get only competitive stats:
```bash
curl "http://localhost:3000/api/user/Player-1234/stats?mode=competitive"
```

## 📋 Parameters

- **BattleTag Format**: Must be `Name-1234` (e.g., `Player-1234`)
- **Platforms**: `pc`, `console`
- **Game Modes**: `competitive`, `quickplay`

## 🔧 Technologies Used

- **[Hono.js](https://hono.dev/)**: Fast, lightweight web framework
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **[Got](https://github.com/sindresorhus/got)**: Modern HTTP request library
- **[OverFast API](https://overfast-api.tekrop.fr/)**: Unofficial Overwatch 2 API

## 🐛 Error Handling

The API includes comprehensive error handling:
- **400**: Validation errors (invalid BattleTag format, missing parameters)
- **404**: Player not found
- **500**: API errors or server issues

All responses follow a consistent format:
```json
{
  "success": boolean,
  "data": any,
  "error": string,
  "message": string,
  "timestamp": string
}
```

## 📚 API Documentation

Visit `http://localhost:3000/` after starting the server to see the complete API documentation with examples.

## 🚨 Important Notes

- **No API Key Required**: OverFast API is free and doesn't require authentication
- **Rate Limiting**: The public OverFast API has rate limits, consider hosting your own instance for high throughput
- **BattleTag Format**: Must include the dash (e.g., `Player-1234`, not `Player#1234`)
- **Case Sensitive**: BattleTags are case-sensitive

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests!

