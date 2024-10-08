const bcrypt = require('bcrypt');
const { collection } = require('../Models/userModel');  // Make sure this points to your MongoDB collection
const Ticket = require('../Models/ticketModel');  // Ensure correct path and case

const signupLoad = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        console.log(error);
    }
};
const signup = async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        return res.render('signup', { message: 'User already exists. Try a different name.', success: false });
    } else {
        const saltRounds = 10;
        const hashedPwd = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPwd;

        const userData = await collection.insertMany([data]);
        console.log(userData);

        // Passing the success flag as true for green color message
        res.render('login', { message: 'Signup successful! Please login.', success: true });
    }
};


const loginLoad=async (req,res)=>{
    res.render('login');
}
const login = async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.name });
        if (!check) {
            return res.render('login', { message: 'Username not found', success: false });
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        
        if (isPasswordMatch) {
            const searchSource = req.query.source || ''; // Get the search input from the query string
            let tickets;

            if (searchSource) {
                // Fetch tickets that match the source using a case-insensitive search
                tickets = await Ticket.find({ source: { $regex: searchSource, $options: 'i' } });
            } else {
                // If no search query, return all tickets
                tickets = await Ticket.find();  
            }

            // Render the home page with the filtered tickets and pass searchQuery
            res.render('home', { 
                username: check.name, 
                tickets: tickets, 
                searchQuery: searchSource  // Pass searchQuery to the view
            });
        } else {
            res.render('login', { message: 'Wrong password', success: false });
        }
    } catch (error) {
        res.render('login', { message: 'Login failed. Please try again.', success: false });
    }
};



const sellerLoad=async (req,res)=>{
    try {
        res.render('seller');
    } catch (error) {
        console.log(error);
    }
}
const seller = async (req, res) => {
    try {
        const data = {
            source: req.body.source,
            destination: req.body.destination,
            price: req.body.price,
            ticket: req.body.ticket,
            comments: req.body.comments
        };

        // Insert into the ticket collection
        const ticketData = await Ticket.create(data);
        console.log(ticketData);

        // Render the seller page with a success message
        res.render('seller', { message: 'Ticket added successfully!', success: true });
    } catch (error) {
        console.log(error);
        // Render the seller page with an error message
        res.render('seller', { message: 'Failed to add ticket.', success: false });
    }
};


const home = async (req, res) => {
    try {
        const searchSource = req.query.source; // Get the search input from the query string
        let tickets;

        if (searchSource) {
            // Fetch tickets that match the source using a case-insensitive search
            tickets = await Ticket.find({ source: { $regex: searchSource, $options: 'i' } });
        } else {
            // If no search query, return all tickets
            tickets = await Ticket.find();  
        }

        // Render the home page with the filtered tickets
        res.render('home', { username: req.body.username, tickets: tickets, searchQuery: searchSource || '' });
    } catch (error) {
        console.error(error);
        res.render('home', { username: req.body.username, tickets: [], searchQuery: '', message: 'Search failed. Please try again.' });
    }
};

const ticket =async (req, res) => {
    try {
        const ticketId = req.params.id; // Get the specific ticket ID from the URL
        const ticket = await Ticket.findById(ticketId); // Fetch the ticket with this ID
        
        if (!ticket) {
            return res.status(404).send('Ticket not found');
        }

        const tickets = await Ticket.find(); // Fetch all tickets for the sidebar

        // Render 'ticket.ejs' and pass both 'ticket' and 'tickets'
        res.render('ticket', { ticket, tickets });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};


module.exports={
    login,loginLoad,signup,signupLoad,seller,sellerLoad,home,ticket
}


