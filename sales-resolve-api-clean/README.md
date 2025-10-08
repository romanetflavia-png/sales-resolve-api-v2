# Sales Resolve API v3

API-ul pentru aplicația Sales Resolve - versiunea 3.

## Structura

```
api-v3/
├── server.js          ← în root
├── package.json       ← în root
├── Procfile          ← în root
├── README.md
├── .gitignore
└── src/
    ├── routes/
    ├── setup/
    └── storage/
```

## Deployment

Gata pentru deployment pe Render, Railway, Heroku, etc.

### Comenzi

```bash
npm install
npm start
```

## Endpoints

- `POST /api/auth/register` - Înregistrare
- `POST /api/auth/login` - Login
- `POST /api/messages` - Trimite mesaj (public)
- `GET /api/messages` - Vezi mesaje (admin)
- `GET /api/health` - Health check

