const transfers = new Map();

function createTransfer(code, fileInfo) {
    transfers.set(code, {
        fileInfo,
        createdAt: Date.now()
    });

    setTimeout(() => {
        transfers.delete(code);
    }, 10 * 60 * 1000);
}

function getTransfer(code) {
    return transfers.get(code);
}

function deleteTransfer(code) {
    transfers.delete(code);
}

module.exports = { createTransfer, getTransfer, deleteTransfer };
