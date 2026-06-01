

function requireAuth(req, res, next) {
  
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Musisz być zalogowany, aby uzyskać dostęp'
    })
  }

  next()
}

function requireAdmin(req, res, next) {
  
  if (!req.session.userId) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Musisz być zalogowany'
    })
  }

  if (req.session.userRole !== 'admin') {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Brak uprawnień administratora'
    })
  }

  next()
}

module.exports = {
  requireAuth,
  requireAdmin
}
