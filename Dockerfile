FROM oven/bun:1 as base
WORKDIR /usr/src/app 

COPY . .
RUN bun install
RUN bun run build

EXPOSE 80
ENTRYPOINT sh -c "./dist/vite-envs.sh && bun run preview"