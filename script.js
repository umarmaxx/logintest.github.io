const form = document.getElementById('dataForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const dataList = document.getElementById('dataList');
const errorMsg = document.getElementById('errorMsg');

// MongoDB Atlas connection URL
const uri = 'mongodb+srv://umarmaxx:umarmaxx95@raid0.uquj7u1.mongodb.net/?retryWrites=true&w=majority&appName=Raid0';

// Database and Collection Info
const dbName = 'test';
const collectionName = 'sampledata';

// Function to fetch data from MongoDB
async function fetchData() {
    try {
        const response = await fetch(`${uri}/database/${dbName}/collection/${collectionName}`);
        const data = await response.json();
        dataList.innerHTML = '';
        data.forEach(item => {
            dataList.innerHTML += `<div>${item.name} - ${item.email} <button onclick="deleteData('${item._id}')">Delete</button></div>`;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to add data to MongoDB
async function addData(data) {
    try {
        await fetch(`${uri}/database/${dbName}/collection/${collectionName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        fetchData();
    } catch (error) {
        console.error('Error adding data:', error);
    }
}

// Function to delete data from MongoDB
async function deleteData(id) {
    try {
        await fetch(`${uri}/database/${dbName}/collection/${collectionName}/${id}`, {
            method: 'DELETE'
        });
        fetchData();
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}

form.addEventListener('submit', event => {
    event.preventDefault();
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    if (name && email) {
        addData({ name, email });
        nameInput.value = '';
        emailInput.value = '';
    } else {
        errorMsg.textContent = 'Please fill out all fields.';
    }
});

fetchData();
