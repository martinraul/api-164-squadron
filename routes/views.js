const express = require('express');
const router = express.Router();
const service = require('../services/sqlite.js');

router.get('/pilotList', (req, res) => {
  service.getPilots((pilots) => {
    res.render('home', {
      layout: 'layout',
      pilots,
    });
  });
});

router.get('/pilotList/:id', (req, res) => {
  service.getSinglePilot(req.params.id, (singlePilot) => {
    res.render('pilot', {
      layout: 'layout',
      singlePilot,
    });
  });
});

router.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layout',
  });
});

router.get('/', (req, res) => {
  res.render('api', {
    layout: 'layout',
  });
});

module.exports = router;
