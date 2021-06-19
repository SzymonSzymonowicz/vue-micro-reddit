const authenticationMiddleware =
  (whiteList = []) =>
  (req, res, next) => {
    if (whiteList.find((url) => url === req.url)) {
      return next();
    }

    console.log(req);
    console.log("======================================================================");
    console.log("USER:")
    console.log(req.user);
    console.log("METHOD:")
    console.log(req.method);
    console.log("======================================================================");

    if (req.method === "OPTIONS" || req.isAuthenticated()) {
      return next();
    }

    return res.sendStatus(401);
  };

module.exports = authenticationMiddleware;
