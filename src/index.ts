import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const app = new Hono()

// write this in another folder
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
    { message: "Minimum eight characters, at least one letter, one number and one special character" }
  )
})

app.use(logger())

app.post('/login', zValidator('json', schema), async (c) => {
  try {
    const { email, password } = await c.req.json()

    console.log('email', email)
    console.log('password', password)

    if (email === 'admin@example.com' && password === 'admin123!') {
      return c.json({
        success: true,
        message: 'Login successful'
      })
    } else {
      return c.json({
        success: false,
        message: 'Invalid credentials'
      }, 401)
    }
  } catch (error) {
    return c.json({
      success: false,
      message: 'Invalid request format'
    }, 400)
  }
})


/* app.post('/login', zValidator('json', schema), async (c) => {

  console.log('ciccia')

  const { email, password } = await c.req.json()
  if (email === 'test@test.it' && password === 'Passoword123!') {
    return c.json({ success: true })
  } else {
    return c.json({ success: false }, 401)
  }
}) */

export default app
