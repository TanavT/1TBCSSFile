import exportedMethods from "./accountData.js";
import { accounts } from "./mongo/MongoCollections.js";

const accountsCollection = await accounts();
// console.log(await accountsCollection.findOne({username: "warachnid"}));
// console.log(await exportedMethods.addFriend('warachnid', 'peacentipede'));