# Step 1: Menggunakan image Node.js 20 sebagai base image untuk build
FROM node:20 AS build

# Set working directory di dalam container
WORKDIR /app

# Menyalin file package.json dan yarn.lock terlebih dahulu untuk mengoptimalkan layer cache
COPY package.json yarn.lock ./

# Install dependencies menggunakan Yarn
RUN yarn install

# Menyalin seluruh kode aplikasi
COPY . .

# Jalankan prisma generate untuk menghasilkan Prisma Client sebelum build
RUN npx prisma generate

# Build aplikasi Next.js untuk produksi
RUN yarn build

# Step 2: Menyiapkan environment untuk menjalankan aplikasi
FROM node:20

# Set working directory di dalam container
WORKDIR /app

# Menyalin dependensi yang sudah diinstall dan build dari tahap pertama
COPY --from=build /app /app

# Expose port untuk web app
EXPOSE 3000

# Menjalankan aplikasi Next.js di produksi
CMD ["yarn", "start"]
