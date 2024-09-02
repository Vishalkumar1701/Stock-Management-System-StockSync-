import Merchant from "../Models/merchant.model.js";
import Stocks from "../Models/stocks.model.js";

export const getAllMerchants = async(req,res) => {
    try {
        const merchants = await Merchant.findAll({
            attributes: { exclude: ['password']},
            order: [['createdAt' , 'DESC']]
        });        
        res.status(200).json(merchants);
    } catch (error) {
        return res.status(500).json({error : 'Error fetching data'})
    }
}

export const getMerchantById = async(req,res) => {
    try {
        const merchant = await Merchant.findByPk(req.params.id);
        if(!merchant){
            return res.status(404).json({error : 'Merchant not found.'});
        }
        res.status(200).json(merchant);
    } catch (error) {
        return res.status(500).json({error : 'Error fetching merchant'});
    }
}

export const updateMerchant = async(req,res) => {
    try {
        const merchant = await Merchant.findByPk(req.params.id);
        if(!merchant){
            return res.status(404).json({error: 'Merchant not found.'});
        }
        const {fullname, email, password, sellerType} = req.body;
        await merchant.update({fullname, email, password, sellerType});
        
        const updatedMerchant = merchant.get({
            plain: true,
            attributes: { exclude: ['password'] }
        });

        res.status(200).json(updatedMerchant);
    } catch (error) {
        return res.status(500).json(error);   
    }
}

export const deleteMerchant = async(req,res) => {
    try {
        const merchant = await Merchant.findByPk(req.params.id);
        
        if(!merchant) {
            return res.status(404).json({error: 'Merchant not found'});
        }
        await Stocks.destroy({ where: { merchantId: req.params.id } });
        await merchant.destroy();        
        res.status(204).json({message : 'Deleted'});
    } catch (error) {
        return res.status(500).json({error: 'Error deleting merchant.'});
    }
};