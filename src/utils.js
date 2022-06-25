module.exports = {
    getMinutesDifference: (t1, t2) => {
        return Math.round(Math.abs((t1.getTime() - t2.getTime()) / 1000 / 60));
    }
};
