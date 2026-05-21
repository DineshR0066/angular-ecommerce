const { MongoClient } = require('mongodb');

async function migrateProducts() {
    const uri = "mongodb+srv://ramdinesh2709_db_user:lbxJOPfaBjwW3W0O@cluster0.aviennq.mongodb.net/ecommerce-database";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('ecommerce-database');
        const productsColl = db.collection('products');
        const sellersColl = db.collection('sellers');

        console.log("Step 1: Fetching all seller IDs...");

        const sellers = await sellersColl.find({}, { projection: { seller_id: 1 } }).toArray();
        const sellerIds = sellers.map(s => s.seller_id);

        if (sellerIds.length === 0) {
            throw new Error("No sellers found in the database!");
        }

        console.log(`Found ${sellerIds.length} sellers. Starting product migration...`);

        const cursor = productsColl.find({});
        let bulkOps = [];
        let count = 0;

        while (await cursor.hasNext()) {
            const product = await cursor.next();

            const randomSellerId = sellerIds[Math.floor(Math.random() * sellerIds.length)];

       
            bulkOps.push({
                updateOne: {
                    filter: { _id: product._id },
                    update: { $set: { seller_id: randomSellerId } }
                }
            });

            count++;

            if (bulkOps.length === 500) {
                await productsColl.bulkWrite(bulkOps);
                bulkOps = [];
                console.log(`Updated ${count} products...`);
            }
        }

        if (bulkOps.length > 0) {
            await productsColl.bulkWrite(bulkOps);
        }

        console.log(`Migration Complete! ${count} products linked to sellers.`);

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.close();
    }
}

migrateProducts();