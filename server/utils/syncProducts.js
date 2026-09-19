const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const BIGGESTLOGS_URI = 'mongodb+srv://kehindeonileola7_db_user:L14bU1pLnCuBguKN@cluster0.c3vkfla.mongodb.net/biggestlogs?retryWrites=true&w=majority&appName=Cluster0';
const LOGSSALES_URI = process.env.MONGO_URI || 'mongodb+srv://kehindeonileola7_db_user:L14bU1pLnCuBguKN@cluster0.c3vkfla.mongodb.net/logssales?retryWrites=true&w=majority&appName=Cluster0';

const syncProducts = async () => {
    try {
        console.log('Connecting to source database (biggestlogs)...');
        const sourceConn = await mongoose.createConnection(BIGGESTLOGS_URI).asPromise();
        console.log('Connected to source DB');

        console.log('Connecting to target database (logssales)...');
        const targetConn = await mongoose.createConnection(LOGSSALES_URI).asPromise();
        console.log('Connected to target DB');

        const sourceAccountColl = sourceConn.collection('accounts');
        const targetAccountColl = targetConn.collection('accounts');

        const sourceAccounts = await sourceAccountColl.find({}).toArray();
        console.log(`Found ${sourceAccounts.length} products in biggestlogs database.`);

        if (sourceAccounts.length > 0) {
            await targetAccountColl.deleteMany({});
            await targetAccountColl.insertMany(sourceAccounts);
            console.log(`Successfully synced ${sourceAccounts.length} products to logssales database.`);
        } else {
            console.log('No products found in source database to sync.');
        }

        // Also sync settings if available
        const sourceSettingColl = sourceConn.collection('settings');
        const targetSettingColl = targetConn.collection('settings');
        const sourceSettings = await sourceSettingColl.find({}).toArray();
        if (sourceSettings.length > 0) {
            await targetSettingColl.deleteMany({});
            await targetSettingColl.insertMany(sourceSettings);
            console.log(`Successfully synced settings to logssales database.`);
        }

        await sourceConn.close();
        await targetConn.close();
        console.log('Product sync completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error syncing products:', error);
        process.exit(1);
    }
};

syncProducts();
