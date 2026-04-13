const mongoose = require('mongoose');
const { prepareStackTrace } = require('postcss/lib/css-syntax-error');
const homeSchema =  mongoose.Schema({
    Name: { type: String, required: true },
    price: { type: Number, required: true },
    rooms: { type: Number, required: true },
    photo: String,
    food: { type: String, required: true },
    description: String,
});

// homeSchema.pre('findOneAndDelete',  async function(next){
//     const homeId = this.getQuery()._id;
//     await Favourite.deleteMany({ homeId: homeId });
// });

module.exports = mongoose.model('Home', homeSchema);