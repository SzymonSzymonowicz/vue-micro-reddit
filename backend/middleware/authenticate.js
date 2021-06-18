
const authenticationMiddleware = (whiteList =[]) => (req, res, next) => {
  if (whiteList.find(url => url === req.url)) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next()
  }
  
  return res.status(401).send('Unauthorized');
}

module.exports = authenticationMiddleware;