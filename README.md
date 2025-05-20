# trim_url_backend

# for development
npm run dev

# for production
npm start

# for development
dotenv -e .env.development -- npx prisma db push

# for production
dotenv -e .env.production -- npx prisma db push

Generate the Prisma client so your code can use the updated schema:

# for development
npx prisma generate