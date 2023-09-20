Daylon's Japanese translation practice app.

# User Notes

Visit the deployed version at: https://japanese-studying.vercel.app/translation-practice

# Developer Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Required set-up

1. npm i -g vercel@latest
2. vercel env pull .env

## To update the database schema

1. Modify prisma/schema.prisma
2. `npx prisma db push` or `npx prisma generate`


## Running locally

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
