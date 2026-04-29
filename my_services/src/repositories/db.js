import {MongoClient} from 'mongodb'

const client=new MongoClient('mongodb://localhost:27017');

class DataBase
{
    constructor()
    {
        this.collection=null;
    }
    async init()
    {
        await this.connectDB();
    }
    
    async connectDB()
    {
        await client.connect();
        const db=client.db('students')
        this.collection=db.collection('products');
    }
    async getAllData()
    {
        return await this.collection.find().toArray();
    }
    async findOne(field,type)
    {
        return await this.collection.find({[field]:type}).toArray();
    }
    async postData(name,price,category,quantity)
    {
        console.log(name,price,category,quantity);
        return await this.collection.insertOne({name,price,category,quantity});
    }

    async deleteData(field,type,isOne)
    {
        if(isOne)
        {
            console.log("Deleting One Document")
            return await this.collection.deleteOne({[field]:type});
        }
        else
        {
            console.log("Deleting Many Documents")
            return await this.collection.deleteMany({[field]:type});
        }
    }
    async updateData(filter,update)
    {
        return await this.collection.updateOne(filter, {$set:update})
    }
    async count(field,count)
    {
        await this.collection.countDocuments({field:count})
    }
}
export const db=new DataBase()