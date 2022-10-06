const express = require('express')
const {protect}=require('../middleware/auth')
const router = express.Router();
const{searchData}=require('../controller/data.controller')
router.route('/search').get(searchData)
const{addAlert,alerts,deleteAlert,findUserAlert}=require('../controller/alert.controller')
router.route('/addAlert').post(protect,addAlert)
router.route('/alerts').get(protect,alerts)
router.route('/deleteAlert').delete(deleteAlert)
router.route('/findUserAlert').get(protect,findUserAlert)
const{addPortfolio,deletePortfolio}=require('../controller/portfolio.controller')
router.route('/addPortfolio').post(protect,addPortfolio)
router.route('/deletePortfolio').delete(protect,deletePortfolio)

module.exports= router