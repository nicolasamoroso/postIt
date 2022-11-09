const mongoose = require('mongoose')

const PostIt = mongoose.model('postIt', {
    title: {
        type: String,
        required: true,
        minLenght: 3
    },
    content: {
        type: String,
        required: true,
        minLenght: 3
    }
})

module.exports = PostIt