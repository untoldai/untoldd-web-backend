export const asyncHanlder = (requestHanlder) => {
    return (req,res,next)=>{
        Promise.resolve(requestHanlder(req, res, next)).catch((err) => next(err));
    }
}