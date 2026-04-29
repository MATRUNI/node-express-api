export function typeCheck(req,res,next)
{
    let {name,price,category,quantity}=req.body;
    if(!name || !category)
    {
        return res.status(400).json({error:"Name and category are required"})
    }
    price=Number(price);
    quantity=Number(quantity);
    if(isNaN(price) || isNaN(quantity))
    {
        return res.status(400).json({error:"Price and quantity should be number"})
    }
    next();
}