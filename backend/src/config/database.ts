import mongoose from 'mongoose' ;

// connect database .
export const connect = async (url : string) => {
    try {
        await mongoose.connect(url) ;
        console.log("Connect success") ;
    }
    catch {
        console.log("No connect to database") ;
    }
}