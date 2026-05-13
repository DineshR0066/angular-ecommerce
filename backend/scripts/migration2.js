const { MongoClient } = require('mongodb');

async function migrate() {
    const uri = "mongodb://localhost:27017";
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('cloned'); 
        const usersColl = db.collection('users');

        console.log("🚀 Starting Migration: Matching 'customer_id' to 'customer_id'...");

        const cursor = usersColl.aggregate([
            {
                $lookup: {
                    from: 'customers', 
                    localField: 'customer_id',   // Field in Users
                    foreignField: 'customer_id', // Field in Customers (as you specified)
                    as: 'matched_docs'
                }
            },
            {
                $addFields: {
                    customer_data: { $arrayElemAt: ['$matched_docs', 0] }
                }
            }
        ]);

        let bulkOps = [];
        let count = 0;

        while (await cursor.hasNext()) {
            const doc = await cursor.next();

            // Only update if a match was found in the customers table
            if (doc.customer_data) {
                bulkOps.push({
                    updateOne: {
                        filter: { _id: doc._id },
                        update: { 
                            $set: { details: doc.customer_data } 
                        }
                    }
                });
            }

            if (bulkOps.length === 500) {
                await usersColl.bulkWrite(bulkOps);
                count += bulkOps.length;
                console.log(`Updated ${count} records...`);
                bulkOps = [];
            }
        }

        if (bulkOps.length > 0) {
            await usersColl.bulkWrite(bulkOps);
            count += bulkOps.length;
        }

        console.log(`✅ Success! Total records with new 'details' field: ${count}`);

    } catch (err) {
        console.error("❌ Migration Error:", err);
    } finally {
        await client.close();
    }
}

migrate();