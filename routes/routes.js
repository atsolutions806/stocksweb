const express = require('express')
const {protect}=require('../middleware/auth')
const router = express.Router();

const{addAlert,alerts,deleteAlert,findUserAlert}=require('../controller/alert.controller')
router.route('/addAlert').post(addAlert)
router.route('/alerts').get(protect,alerts)
router.route('/deleteAlert').delete(deleteAlert)
router.route('/findUserAlert').get(protect,findUserAlert)
const{addPortfolio,deletePortfolio}=require('../controller/portfolio.controller')
router.route('/addPortfolio').post(protect,addPortfolio)
router.route('/deletePortfolio').delete(protect,deletePortfolio)
const{getStockData}=require('../controller/data.controller')
router.route('/getStockData').get(getStockData)
module.exports= router
