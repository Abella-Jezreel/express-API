const express = require('express');
const app = express();

const feedRoutes = require('./routes/feed');

app.use('/feed', feedRoutes);

// Add a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Express API');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

