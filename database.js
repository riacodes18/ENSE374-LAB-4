// add all your boilerplate code up here
const mongoose = require("mongoose");

// connect mongoose to a database called testdb
mongoose.connect("mongodb://localhost:27017/userdb", 
                {useNewUrlParser: true, 
                 useUnifiedTopology: true});

// because mongoose functions are asynchronous, there is
// no guarantee they will finish in order. To force this,
// we will call them in an async function using the "await"
// keyword after each database read / write

async function databaseCalls () {
    // create a user schema - like a document temlpate
    const userSchema = new mongoose.Schema ({
        username: String,
        password: Number
        
    })

    
    // create a collection of games using the gameSchema
    // using vague rules, mongoose will create the collection "games"
    const User = mongoose.model("User", userSchema);

    // create a new game in the Game collection
    const user = new User ({
        username: "joy123",
        password: "321yoj"
        
    });

    // save your record - comment me out if you don't want multiple saves!
    await user.save()

    const taskSchema = new mongoose.Schema({
        _id: Int16Array,
        owner:String,
        creator: userSchema,
        done: Boolean,
        cleared: Boolean
    })

    const task = new Task({
        _id:123,
        name: "joy",
        owner: user,
        creator: user,
        done: false,
        cleared: false
    
    })
    

    await task.save()

    await Task.find({name:"Adam"}, function(err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log(results)
        }
        // dangerous to close in an async function without await!
        mongoose.connection.close()
    });
}

databaseCalls()