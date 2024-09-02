import { Op } from 'sequelize';
import Merchant from '../Models/merchant.model.js';
import Stocks from '../Models/stocks.model.js'


//Create a Stock
export const createStock = async(req,res) => {
    const {stockName, price, quantity} = req.body;
    const merchantId = req.user.id;
    try {
        const newStock = await Stocks.create({
            stockName,
            merchantId,
            price,
            quantity,
        });
        res.status(201).json(newStock);
    } catch (error) {
        return res.status(500).json(error);
    }
}

//Get all stocks
export const getAllStocks = async(req,res)=> {
    const {searchQuery} = req.query;
    try {

        const stocks = await Stocks.findAll({
            attributes: {exclude: ['password']},
            include: [{
                model : Merchant,
                as: 'Merchant',
                attributes: ['fullname'],
                required: false,
            }],
            where: searchQuery ? {
                [Op.or] : [
                    {stockName: {[Op.like]: `%${searchQuery}%`}},
                    {
                        '$Merchant.fullname$' : {
                            [Op.like]: `%${searchQuery}%`
                        }
                    }
                ]
            } : {},
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(stocks);
    } catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
}

//Get stocks by id
export const getStockById = async(req,res) => {
    try {
        const stock = await Stocks.findByPk(req,params.id);
        if(!stock) {
            return res.status(404).json({error : 'Stock not found'});
        }
        res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getStockByMerchantId = async(req,res) => {
    try {
        const merchantId = req.params.id;
        const {stockName} = req.query;

        if(!merchantId) {
            return res.status(400).json({message: 'Merchant id is required'});
        }
        const searchCriteria = {
            where : {
                merchantId: merchantId
            }
        };
        if(stockName) {
            searchCriteria.where.stockName = {
                [Op.like]: `%${stockName}%`
            };
        }
        const stocks = await Stocks.findAll(searchCriteria);
        if(!stocks.length){
            return res.status(404).json({message: 'No stocks avilable yet'});
        }
        res.status(200).json(stocks);

    } catch (error) {
        return res.status(500).json({error: 'Server error', error});
    }
}

//update stock
export const updateStock = async(req,res) => {
    try {
        const stock = await Stocks.findByPk(req.params.id);
        if(!stock){
            return res.status(404).json({message : 'Stock not found.'});
        }
        const {stockName, price, quantity} = req.body;
        await stock.update({stockName, price, quantity});

        res.status(200).json(stock);
    } catch (error) {
        return res.status(500).json(error);   
    }
}

//delete stock
export const deleteStock = async(req,res)=> {
    try {
        const stock = await Stocks.findByPk(req.params.id);
        if(!stock) {
            return res.status(404).json({error : 'Stock not found'})
        }
        await stock.destroy();
        res.status(204).json({success : 'Stock deleted successfully.'})
    } catch (error) {
        return res.status(500).json(error)
    }
}
