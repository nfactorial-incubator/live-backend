module.exports = (req, res, next) => {
    if (req.auth.role !== 'mentor') {
        return res.status(401).end('You are not mentor');
    } else {
        return next();
    }
};
