import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const exist = database.delete('tasks', id)

      if (exist) {
        return res.writeHead(204).end()
      }
      return res.writeHead(406).end('Task não existe!')
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params
      const { title, description } = req.body

      const task = database.selectById('tasks', id)
      if (!task){
        return res.writeHead(406).end('Task não existe!')
      }

      database.update('tasks', id, {
        title: title ? title : task.title,
        description: description ? description : task.description,
        completed_at: task.completed_at,
        created_at: task.created_at,
        updated_at: new Date()
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.selectById('tasks', id)
      if (!task){
        return res.writeHead(406).end('Task não existe!')
      }

      database.update('tasks', id, {
        title: task.title,
        description: task.description,
        completed_at: new Date(),
        created_at: task.created_at,
        updated_at: task.updated_at
      })

      return res.writeHead(204).end()
    }
  }
]