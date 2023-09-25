const mongoose = require('mongoose')


async function handledbConnection(url) {
 return await mongoose.connect(url)
}

module.exports = {
    handledbConnection,
}