const express = require('express');
const bodyParser = require('body-parser');

const feedRoutes = require('./routes/feed');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(res.getHeaders());
    });
    next();
});

app.use('/feed', feedRoutes);

// Add a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Express API');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
    }
);

