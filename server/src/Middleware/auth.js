import { verifyToken } from "../utils/token";


function checkAuth(roles) {
  return async (req, res, next) => {

    try {
      const token = req.headers.authorization.split(" ")[1];
      let error = null;
      let user = null;

      await verifyToken(token).then(({ data }, err) => {
        if (err) {
          error = err;
        }

        if (data.role === 'ADMIN' || roles.includes(data.role)) {
          user = data
        }
      });

      if (error) {
        return res.status(401).json({
          error: {
            type: 'NOT_AUTHORISED',
            message: 'User is not authorise to access this resource!'
          }
        })
      }
      req.user = user;
      next()
    } catch (error) {
      console.log('error : ', error)
      return res.status(500).json({
        error: {
          type: 'SERVER_ERROR',
          message: 'Something went wrong!',
          error
        }
      });
    }
  }
}

export {
  checkAuth
}