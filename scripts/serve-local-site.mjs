import { createReadStream, existsSync, statSync } from "node:fs"
import { createServer } from "node:http"
import { extname, resolve, sep } from "node:path"
import { spawn } from "node:child_process"

const host = "127.0.0.1"
const port = Number(process.env.PORT ?? 3000)
const root = resolve(process.cwd(), "out")
const openBrowser = process.argv.includes("--open")
const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
}

function getFilePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0])
  const target = resolve(root, `.${cleanPath}`)
  if (target !== root && !target.startsWith(`${root}${sep}`)) return null
  if (existsSync(target) && statSync(target).isDirectory()) return resolve(target, "index.html")
  return target
}

const server = createServer((request, response) => {
  const requestedPath = getFilePath(request.url ?? "/")
  const found = requestedPath && existsSync(requestedPath) && !statSync(requestedPath).isDirectory()
  const filePath = found ? requestedPath : resolve(root, "404.html")

  response.writeHead(found ? 200 : 404, {
    "Content-Type": mimeTypes[extname(filePath).toLowerCase()] ?? "application/octet-stream",
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`
  console.log(`Local portfolio available at ${url}`)
  if (openBrowser) spawn("cmd.exe", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref()
})
