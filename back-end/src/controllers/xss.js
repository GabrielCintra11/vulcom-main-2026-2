import createDOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import prisma from '../database/client.js'

const window = new JSDOM('').window
const DOMPurify = createDOMPurify(window)

const controller = {}

controller.retrieveComments = async function(req, res) {
  try {
    const comments = await prisma.xssComment.findMany({
      orderBy: { id: 'asc' }
    })

    res.send(comments)
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.createComment = async function(req, res) {
  try {
    const content = DOMPurify.sanitize(req.body?.content ?? '', {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    })

    await prisma.xssComment.create({ data: { content } })

    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

export default controller
