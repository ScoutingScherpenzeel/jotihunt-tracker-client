FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY . .
RUN bun install
RUN bun run build

EXPOSE 80
CMD ["bun", "run", "preview"]