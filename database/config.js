const mongoose = require('mongoose');

const ConectionDB = async () => {

    try {

        await mongoose.connect( process.env.DB_CNN,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            }
        );

        console.log('DB onLine!');
        
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos.');
        
    }


}

module.exports = {
    ConectionDB
}