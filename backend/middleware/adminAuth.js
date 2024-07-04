module.exports = function (req, res, next) {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({ msg: 'Admin resources. Access denied.' });
    }
    next();
  };
  