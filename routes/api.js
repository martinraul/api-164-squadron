const express = require('express');
const router = express.Router();
const service = require('../services/sqlite.js');

router.get('/pilots', (req, res, next) => {
  service.getPilots((pilots) => {
    return res.send(pilots);
  });
});

router.get('/pilots/:id', (req, res, next) => {
  service.getSinglePilot(req.params.id, (singlePilot) => {
    return res.send(singlePilot);
  });
});

router.get('/pilots/perpage/:number', (req, res) => {
  service.getPilots((pilots) => {
    const pageCount = Math.ceil(pilots.length / `${req.params.number}`);
    let page = parseInt(req.query.p);
    if (!page) {
      page = 1;
    }
    if (page > pageCount) {
      page = pageCount;
    }
    res.json({
      page: page,
      pageCount: pageCount,
      pilots: pilots.slice(
        page * `${req.params.number}` - `${req.params.number}`,
        page * `${req.params.number}`
      ),
    });
  });
});

module.exports = router;
