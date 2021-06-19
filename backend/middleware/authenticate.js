const authenticationMiddleware =
  (whiteList = []) =>
  (req, res, next) => {
    if (whiteList.find((url) => url === req.path)) {
      return next();
    }

    if (req.method === "OPTIONS" || req.isAuthenticated()) {
      return next();
    }

    return res.sendStatus(401);
  };

module.exports = authenticationMiddleware;
