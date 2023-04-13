/// --------------
// CONFIGURATION : Express imports & other imports and express config   
/// --------------
//write the javascript to import express
const express = require("express")
const app = express()
const HTTP_PORT = process.env.PORT || 8080
const exphbs = require("express-handlebars");
app.engine(".hbs", exphbs.engine({
 extname: ".hbs",
 helpers: {
     json: (context) => { return JSON.stringify(context) }
 }
}));
app.set("view engine", ".hbs");
app.use(express.urlencoded({ extended: true }))



/// --------------
// DATA SOURCE
/// --------------

// TODO: Create a data source here
// connect to the database
const taskList = [
    {id:"TASK001", name:"Do homework", isHighPriority:true},
    {id:"TASK002", name:"Watch movies", isHighPriority:false},
    {id:"TASK003", name:"Walk the dog", isHighPriority:false},
    {id:"TASK004", name:"Make dinner", isHighPriority:true}
]
/// --------------
// ENDPOINTS : 
/// --------------


app.post("/update/:idToUpdate", (req, res) => {
    // 0. output debug messages
    console.log(`[DEBUG] Request received at /delete POST endpoint`)    
    console.log(req.params)

    // 1. get the id from the URL parameter
    const idFromURL = req.params.idToUpdate

    // 2. get the data from the form fields
    const nameFromForm = req.body.taskName
    const priorityFromForm = req.body.priority

    // convert the priority level from the form to a boolean value
    let highPriority = false
    if (priorityFromForm === "high") {
        highPriority = true
    }
    else if (priorityFromForm === "low") {
        highPriority = false
    }

    // 3. Search task list for a matching task
    let pos = -1
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === idFromURL) {
            pos = i
            break   // exit the loop
        }        
    }
    // 4. if found, update
    // 5. if not found, error messag
    if (pos === -1) {
        // not found
        res.send(`ERROR, could not find task with id: ${idFromURL}`)
        return
    }
    else {
        // found
        // - get the task
        console.log(`[DEBUG] Task found, task to update is: `)
        console.log(taskList[pos])

        // - upate the task based on form field entries
        taskList[pos].isHighPriority = highPriority
        taskList[pos].name = nameFromForm
        // we do not need to update the task id
        
        // - display the home page, but with the updated list of tasks
        res.render("home", {layout:false, tasks:taskList, msg:"SUCCESS: Item updated!"})
        // res.send(`SUCCESS: Item updated!`)
        return
    }
    
})




app.post("/delete/:idToDelete", (req, res) => {
    // 0. output debug messages
    console.log(`[DEBUG] Request received at /delete POST endpoint`)
    // output everything that is in the req.params object
    console.log(req.params)
    // 1. get the id from the URL parameter
    const idFromURL = req.params.idToDelete
    // 2. search the array for a matching task
    let pos = -1
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === idFromURL) {
            pos = i
            break   // exit the loop
        }        
    }
    // 3. if found, delete
    // 4. if not found, error messag
    if (pos === -1) {
        // not found
        res.send(`ERROR, could not find task with id: ${idFromURL}`)
        return
    }
    else {
        // delete it
        // .splice(pos, 1)
        taskList.splice(pos, 1)
        res.send(`SUCCESS: Item deleted!`)
        return
    }
    
})






// when visiting / , you se an UI where you can sese all your tasks
app.get("/", (req,res)=>{
    res.render("home", {layout:false, tasks:taskList})
})

app.get("/add-tasks", (req,res)=>{    
    res.render("add", {layout:false})
})
// TODO 5: Create an endpoint for inserting tasks
app.post("/insert", (req,res)=>{
    console.log(`[DEBUG] POST request made to /insert endpoint`)

    /// 1. Get the values from the form
    const taskNameFromUI = req.body.taskName;
    const priorityFromUI = req.body.priority
    const idFromUI = req.body.taskId
    console.log(`The task name is: ${taskNameFromUI}`)
    console.log(`The priority is: ${priorityFromUI}`)
    console.log(`The priority is: ${idFromUI}`)

    // 1b. convert the priroity to a true or false valuse
    let priorityLevel = false;
    if (priorityFromUI === "high") {
        priorityLevel = true
    }
    else if (priorityFromUI === "low") {
        priorityLevel = false
    }
    // 2. Create a new task object literal
    const taskToAdd = {id: idFromUI, name: taskNameFromUI, isHighPriority:priorityLevel}

    // 3. Add the new task to the tasks list
    taskList.push(taskToAdd)
    // 4. Output a success for now
    res.send("Task added!")
    // 5. TODO: Navigate them back to the first page
})




/// --------------
// START THE SERVER : 
/// --------------
// function that will run when the server starts
const onHttpStart = () => {
   console.log(`Server is running on port ${HTTP_PORT}`)
   console.log(`Press CTRL+C to exit`)
}
// the code that actually runs the web server app
app.listen(8080, onHttpStart)
