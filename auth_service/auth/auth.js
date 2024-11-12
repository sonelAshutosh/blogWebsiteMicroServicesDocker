import jwt from 'jsonwebtoken'

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token === null || token === undefined) {
    return res.status(401).json({ message: '401 Unauthorized' })
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
    if (err) {
      return res.status(403).json({ message: '403 Forbidden' })
    }

    // console.log('Authenticated')

    next()
  })
}

export default authenticateToken
