
const Transaction = require("../models/Transaction");


const createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);

        res.status(201).json({
            message: "Transaction created successfully",
            data: transaction
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();

        res.status(200).json({
            message: "Transactions fetched successfully",
            data: transactions
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET Single Transaction
const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            data: transaction
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


const updateTransaction = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction updated successfully",
            data: updatedTransaction
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findByIdAndDelete(
            req.params.id
        );

        if (!deletedTransaction) {
            return res.status(404).json({
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            message: "Transaction deleted successfully",
            data: deletedTransaction
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

module.exports = {
    createTransaction,
    getTransactions,
    getTransactionById,
    updateTransaction,
    deleteTransaction
};
