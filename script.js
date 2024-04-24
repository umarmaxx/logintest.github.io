const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const connectionString = 'mongodb+srv://umarmaxx:<umarmaxx95>@raid0.uquj7u1.mongodb.net/?retryWrites=true&w=majority&appName=Raid0';
const client = new MongoClient(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
        return client.db('test').collection('sample data');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas', error);
    }
}

async function fetchData() {
    const collection = await connectDatabase();
    const data = await collection.find({}).toArray();
    const dataList = document.getElementById('dataList');
    dataList.innerHTML = '';
    data.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${item.name}</strong> - ${item.email} 
        <button onclick="editItem('${item._id}', '${item.name}', '${item.email}')">Edit</button> 
        <button onclick="deleteItem('${item._id}')">Delete</button>`;
        dataList.appendChild(li);
    });
}

async function addItem(event) {
    event.preventDefault();
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const collection = await connectDatabase();
    await collection.insertOne({ name, email });
    fetchData();
    document.getElementById('crudForm').reset();
}

async function editItem(id, name, email) {
    const newName = prompt('Enter new name:', name);
    const newEmail = prompt('Enter new email:', email);
    if (newName && newEmail) {
        const collection = await connectDatabase();
        await collection.updateOne({ _id: ObjectId(id) }, { $set: { name: newName, email: newEmail } });
        fetchData();
    }
}

async function deleteItem(id) {
    if (confirm('Are you sure you want to delete this item?')) {
        const collection = await connectDatabase();
        await collection.deleteOne({ _id: ObjectId(id) });
        fetchData();
    }
}

document.getElementById('crudForm').addEventListener('submit', addItem);
fetchData();
