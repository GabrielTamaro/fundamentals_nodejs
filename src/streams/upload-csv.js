import http from 'node:http'
import fs from 'node:fs'
import { parse } from 'csv-parse'

const server = http.createServer(async (req, res) => {

  const { method, url } = req

  if (method === 'POST' && url === '/tasks'){
    const csvPath = new URL('./csv-file.csv', import.meta.url);

    const stream = fs.createReadStream(csvPath);

    const linesParse = stream
    .pipe(parse({ delimiter: ",", from_line: 2,skipEmptyLines: true }))

    for await (const line of linesParse) {
      const [title, description] = line;
  
      await fetch('http://localhost:3333/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        })
      })
    }

    return res.writeHead(204).end()
  }

  return res.writeHead(404).end()
})

server.listen(3334)