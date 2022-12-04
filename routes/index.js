const express = require('express');
const router = express.Router();
const { readFile, determineMonths, processData } = require('./../services');
module.exports = () => {
  router.get('/', async (req, res, next) => {
    try {
      return res.render('layout', {
        pageTitle: 'Main',
        template: 'main',
      });
    } catch (err) {
      return next(err);
    }
  });
  router.post('/:api', async (req, res, next) => {
    try {
      const { startMonth, endMonth, year, data1, data2 } = req.body;
      let sMonth = parseInt(startMonth);
      let eMonth = parseInt(endMonth);
      //var test = data2 == 'ws' ? true : false;
      const data = await readFile(year);
      const months = await determineMonths(sMonth, eMonth);
      const result = await processData(
        data.weather.record,
        months,
        data1,
        data2
      );
      //console.log(result);
      return res.json({ result });
    } catch (err) {
      return next(err);
    }
  });
  return router;
};
