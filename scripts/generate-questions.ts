import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });
import mysql from 'mysql2/promise';

// Expanded Dictionary of REAL questions
const courseQuestionsMap: Record<string, any[]> = {
  "Frontend": [
    { question: "Which HTML tag is used to define an internal style sheet?", options: ["<style>", "<script>", "<css>", "<link>"], answer: "<style>" },
    { question: "Which property is used to change the background color in CSS?", options: ["bgcolor", "color", "background-color", "bg-color"], answer: "background-color" },
    { question: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"], answer: "Cascading Style Sheets" },
    { question: "Which HTML attribute specifies an alternate text for an image?", options: ["title", "src", "alt", "longdesc"], answer: "alt" },
    { question: "Which CSS property controls the text size?", options: ["font-style", "text-size", "text-style", "font-size"], answer: "font-size" },
    { question: "How do you select an element with id 'demo' in CSS?", options: [".demo", "demo", "#demo", "*demo"], answer: "#demo" },
    { question: "What is the correct syntax for referring to an external script called 'app.js'?", options: ["<script src='app.js'>", "<script href='app.js'>", "<script name='app.js'>", "<link src='app.js'>"], answer: "<script src='app.js'>" },
    { question: "How do you write 'Hello World' in an alert box?", options: ["msg('Hello World');", "alertBox('Hello World');", "alert('Hello World');", "msgBox('Hello World');"], answer: "alert('Hello World');" },
    { question: "How do you create a function in JavaScript?", options: ["function myFunction()", "function:myFunction()", "create myFunction()", "def myFunction()"], answer: "function myFunction()" },
    { question: "How to write an IF statement in JavaScript?", options: ["if i = 5 then", "if i == 5 then", "if (i == 5)", "if i = 5"], answer: "if (i == 5)" },
    { question: "How does a WHILE loop start?", options: ["while (i <= 10; i++)", "while i = 1 to 10", "while (i <= 10)", "while (i <= 10) do"], answer: "while (i <= 10)" },
    { question: "Which array method adds new elements to the end of an array?", options: ["pop()", "push()", "shift()", "unshift()"], answer: "push()" },
    { question: "What will typeof NaN return?", options: ["number", "NaN", "string", "undefined"], answer: "number" },
    { question: "Which HTML5 element is used to specify a footer for a document?", options: ["<bottom>", "<section>", "<footer>", "<end>"], answer: "<footer>" },
    { question: "In React, what is used to pass data to a component from outside?", options: ["setState", "props", "PropTypes", "Render"], answer: "props" }
  ],
  "Backend": [
    { question: "Which of the following is a core module in Node.js?", options: ["http", "express", "mongoose", "sequelize"], answer: "http" },
    { question: "What does REST stand for in web services?", options: ["Representational State Transfer", "Remote State Transfer", "Representational Service Transfer", "Reliable State Transfer"], answer: "Representational State Transfer" },
    { question: "Which method is used to update a document in MongoDB?", options: ["updateOne()", "modifyOne()", "changeOne()", "setOne()"], answer: "updateOne()" },
    { question: "In Express.js, how do you access URL parameters?", options: ["req.body", "req.query", "req.params", "req.data"], answer: "req.params" },
    { question: "Which HTTP status code signifies a successful GET request?", options: ["201", "200", "404", "500"], answer: "200" },
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Strong Question Language", "Structured Question Language", "System Query Language"], answer: "Structured Query Language" },
    { question: "Which command is used to install an npm package globally?", options: ["npm install package", "npm i package -local", "npm install -g package", "npm global install package"], answer: "npm install -g package" },
    { question: "What is middleware in Express.js?", options: ["A database layer", "Functions that have access to the req and res objects", "A routing engine", "A template engine"], answer: "Functions that have access to the req and res objects" },
    { question: "Which of the following is NOT a NoSQL database?", options: ["MongoDB", "Cassandra", "PostgreSQL", "Redis"], answer: "PostgreSQL" },
    { question: "How do you hash a password in Node.js?", options: ["Using the bcrypt package", "Using the crypto.hash method", "Using the encrypt() built-in", "Passwords are automatically hashed"], answer: "Using the bcrypt package" },
    { question: "What does CORS stand for?", options: ["Cross-Origin Resource Sharing", "Cross-Origin Routing System", "Cross-Object Resource Sharing", "Central Origin Routing System"], answer: "Cross-Origin Resource Sharing" },
    { question: "Which HTTP method is typically used to create a new resource?", options: ["PUT", "PATCH", "POST", "GET"], answer: "POST" },
    { question: "In a relational database, what is a Primary Key?", options: ["A key to encrypt data", "A unique identifier for a row", "A foreign relationship", "An index for searching"], answer: "A unique identifier for a row" },
    { question: "What is JSON?", options: ["JavaScript Object Notation", "Java Standard Object Notation", "JavaScript Oriented Notation", "Java Synchronized Object Network"], answer: "JavaScript Object Notation" },
    { question: "Which command starts a local Node.js server from a file named server.js?", options: ["node start server", "node server.js", "npm start server", "node run server.js"], answer: "node server.js" }
  ],
  "DataScience": [
    { question: "Which Python library is primarily used for data manipulation and analysis?", options: ["NumPy", "Matplotlib", "Pandas", "Scikit-learn"], answer: "Pandas" },
    { question: "What does CSV stand for?", options: ["Comma Separated Values", "Common Standard Values", "Computer System Values", "Code Separated Variables"], answer: "Comma Separated Values" },
    { question: "In Pandas, what is a 1-dimensional labeled array called?", options: ["DataFrame", "Series", "Array", "Matrix"], answer: "Series" },
    { question: "Which algorithm is used for classification problems?", options: ["Linear Regression", "Logistic Regression", "K-Means", "PCA"], answer: "Logistic Regression" },
    { question: "What does EDA stand for in Data Science?", options: ["Exploratory Data Analysis", "External Data Analysis", "Evaluated Data Algorithm", "Exploratory Data Algorithm"], answer: "Exploratory Data Analysis" },
    { question: "Which metric is used to evaluate a regression model?", options: ["Accuracy", "F1 Score", "Mean Squared Error", "Precision"], answer: "Mean Squared Error" },
    { question: "What does 'k' represent in the K-Means clustering algorithm?", options: ["Number of iterations", "Number of clusters", "Number of features", "Number of dimensions"], answer: "Number of clusters" },
    { question: "Which visualization library is built on top of Matplotlib and provides a high-level interface?", options: ["Seaborn", "Plotly", "Bokeh", "Ggplot"], answer: "Seaborn" },
    { question: "What is overfitting in machine learning?", options: ["Model performs well on training data but poorly on unseen data", "Model performs poorly on all data", "Model is too simple", "Model requires more data"], answer: "Model performs well on training data but poorly on unseen data" },
    { question: "Which technique is used to handle missing data?", options: ["Imputation", "Clustering", "Normalization", "Tokenization"], answer: "Imputation" },
    { question: "What is the purpose of train_test_split in Scikit-Learn?", options: ["To clean data", "To split data into training and testing sets", "To train the model", "To normalize data"], answer: "To split data into training and testing sets" },
    { question: "In probability, what does PDF stand for?", options: ["Portable Document Format", "Probability Density Function", "Predictive Data Function", "Probabilistic Data Feature"], answer: "Probability Density Function" },
    { question: "Which feature scaling technique bounds values between 0 and 1?", options: ["Standardization", "Min-Max Normalization", "Z-score normalization", "Log transformation"], answer: "Min-Max Normalization" },
    { question: "What is a confusion matrix used for?", options: ["Evaluating classification model performance", "Clustering data", "Cleaning text data", "Scaling features"], answer: "Evaluating classification model performance" },
    { question: "Which of these is an ensemble learning method?", options: ["Decision Tree", "Random Forest", "Support Vector Machine", "Naive Bayes"], answer: "Random Forest" }
  ],
  "Python": [
    { question: "How do you create a variable with the numeric value 5 in Python?", options: ["x = 5", "x == 5", "int x = 5", "let x = 5"], answer: "x = 5" },
    { question: "What is the correct file extension for Python files?", options: [".pt", ".pyt", ".py", ".pyth"], answer: ".py" },
    { question: "How do you output 'Hello World' in Python?", options: ["echo 'Hello World'", "print('Hello World')", "p('Hello World')", "console.log('Hello World')"], answer: "print('Hello World')" },
    { question: "Which of these is a Python list?", options: ["(1, 2, 3)", "{1, 2, 3}", "[1, 2, 3]", "<1, 2, 3>"], answer: "[1, 2, 3]" },
    { question: "How do you start a function in Python?", options: ["function my_func():", "def my_func():", "create my_func():", "def my_func()"], answer: "def my_func():" },
    { question: "How do you insert comments in Python code?", options: ["// This is a comment", "/* This is a comment */", "# This is a comment", ""], answer: "# This is a comment" },
    { question: "What does the len() function do?", options: ["Returns the length of an object", "Returns the type of an object", "Loops through an object", "Deletes an object"], answer: "Returns the length of an object" },
    { question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["Tuple", "Set", "Dictionary", "List"], answer: "List" },
    { question: "How do you handle exceptions in Python?", options: ["try/except", "catch/throw", "if/else", "try/catch"], answer: "try/except" },
    { question: "What keyword is used to return a value from a function?", options: ["output", "send", "return", "yield"], answer: "return" },
    { question: "Which method can be used to convert a string to uppercase?", options: ["upperCase()", "toUpperCase()", "upper()", "uppercase()"], answer: "upper()" },
    { question: "What is the result of 3 ** 2?", options: ["6", "9", "32", "5"], answer: "9" },
    { question: "How do you open a file 'data.txt' for reading in Python?", options: ["open('data.txt', 'w')", "read('data.txt')", "open('data.txt', 'r')", "file('data.txt')"], answer: "open('data.txt', 'r')" },
    { question: "Which operator is used to test if two variables point to the same object?", options: ["==", "is", "equals", "==="], answer: "is" },
    { question: "What is 'self' in Python classes?", options: ["A keyword to define a class", "A reference to the current instance of the class", "A static method", "A built-in variable"], answer: "A reference to the current instance of the class" }
  ],
  "Linux": [
    { question: "Which command is used to list directory contents?", options: ["cd", "pwd", "ls", "rm"], answer: "ls" },
    { question: "How do you print the current working directory?", options: ["dir", "pwd", "cwd", "path"], answer: "pwd" },
    { question: "Which command is used to copy files?", options: ["mv", "cp", "copy", "rm"], answer: "cp" },
    { question: "How do you change the permissions of a file?", options: ["chown", "chmod", "chgrp", "passwd"], answer: "chmod" },
    { question: "Which symbol is used to pipe the output of one command into another?", options: [">", "<", "|", "&"], answer: "|" },
    { question: "How do you display the contents of a file to the terminal?", options: ["cat", "read", "show", "open"], answer: "cat" },
    { question: "Which command is used to search for a specific string within a file?", options: ["find", "grep", "search", "locate"], answer: "grep" },
    { question: "How do you create an empty file or update its timestamp?", options: ["mkdir", "touch", "create", "make"], answer: "touch" },
    { question: "Which command removes a directory and all its contents recursively?", options: ["rm -r", "rmdir", "del", "remove"], answer: "rm -r" },
    { question: "What does the 'sudo' command do?", options: ["Switches user", "Executes a command as the superuser", "Starts the shell", "Suspends a process"], answer: "Executes a command as the superuser" },
    { question: "How do you safely terminate a running process by its PID?", options: ["stop", "kill", "end", "terminate"], answer: "kill" },
    { question: "Which command shows running system processes dynamically?", options: ["ps", "top", "proc", "tasklist"], answer: "top" },
    { question: "What symbol redirects command output to append to a file?", options: [">", ">>", "<", "<<"], answer: ">>" },
    { question: "Which command fetches a file from the internet via URL?", options: ["wget", "get", "fetch", "pull"], answer: "wget" },
    { question: "How do you view the manual page for a command?", options: ["help", "info", "man", "guide"], answer: "man" }
  ],
  "Java": [
    { question: "What is the entry point of a Java program?", options: ["main()", "start()", "init()", "run()"], answer: "main()" },
    { question: "Which of these is not a primitive data type in Java?", options: ["int", "boolean", "String", "double"], answer: "String" },
    { question: "What keyword is used to inherit a class in Java?", options: ["implements", "extends", "inherits", "super"], answer: "extends" },
    { question: "What is the size of an int variable in Java?", options: ["8 bits", "16 bits", "32 bits", "64 bits"], answer: "32 bits" },
    { question: "Which method is used to print to the console in Java?", options: ["System.print()", "Console.log()", "print()", "System.out.println()"], answer: "System.out.println()" },
    { question: "Which of these access specifiers allows visibility everywhere?", options: ["private", "protected", "public", "default"], answer: "public" },
    { question: "What is the default value of a boolean variable?", options: ["true", "false", "0", "null"], answer: "false" },
    { question: "Which collection class allows duplicate elements?", options: ["HashSet", "TreeSet", "ArrayList", "HashMap"], answer: "ArrayList" },
    { question: "How do you declare an array in Java?", options: ["int[] arr;", "int arr[];", "Both are correct", "None of the above"], answer: "Both are correct" },
    { question: "Which of the following is an interface?", options: ["Thread", "Runnable", "String", "System"], answer: "Runnable" },
    { question: "What is used to handle exceptions in Java?", options: ["try-catch block", "if-else block", "switch block", "for loop"], answer: "try-catch block" },
    { question: "Which keyword creates an object?", options: ["class", "object", "new", "create"], answer: "new" },
    { question: "What does JVM stand for?", options: ["Java Virtual Machine", "Java Variable Machine", "Java Visual Machine", "Java Version Manager"], answer: "Java Virtual Machine" },
    { question: "Can we overload the main method in Java?", options: ["Yes", "No", "Only in child classes", "Only if it returns int"], answer: "Yes" },
    { question: "Which package is imported by default in Java?", options: ["java.util", "java.io", "java.lang", "java.net"], answer: "java.lang" }
  ],
  "CSharp": [
    { question: "Which company developed C#?", options: ["Google", "Apple", "Microsoft", "Oracle"], answer: "Microsoft" },
    { question: "What is the correct way to output 'Hello' in C#?", options: ["print('Hello');", "Console.WriteLine('Hello');", "cout << 'Hello';", "System.out.print('Hello');"], answer: "Console.WriteLine('Hello');" },
    { question: "Which keyword is used to create a class in C#?", options: ["class", "struct", "object", "type"], answer: "class" },
    { question: "How do you declare a single-line comment in C#?", options: ["/* comment", "", "// comment", "# comment"], answer: "// comment" },
    { question: "Which data type is used to store text?", options: ["String", "string", "text", "Char"], answer: "string" },
    { question: "What does LINQ stand for?", options: ["Language Integrated Network Query", "Language Integrated Query", "Logical Integrated Query", "List Integrated Query"], answer: "Language Integrated Query" },
    { question: "Which access modifier restricts access to the containing class only?", options: ["public", "protected", "private", "internal"], answer: "private" },
    { question: "How do you inherit a class in C#?", options: ["extends", "inherits", ":", "->"], answer: ":" },
    { question: "Which interface is the root of the .NET collection hierarchy?", options: ["IList", "ICollection", "IEnumerable", "IDictionary"], answer: "IEnumerable" },
    { question: "What is a 'delegate' in C#?", options: ["A type that represents references to methods", "A value type", "A class definition", "An interface type"], answer: "A type that represents references to methods" },
    { question: "How do you handle exceptions in C#?", options: ["try-catch", "throw-catch", "try-finally", "catch-finally"], answer: "try-catch" },
    { question: "Which keyword is used to define an asynchronous method?", options: ["async", "await", "Task", "Thread"], answer: "async" },
    { question: "What is the default access modifier for a class?", options: ["public", "private", "internal", "protected"], answer: "internal" },
    { question: "How do you explicitly convert a double to an int in C#?", options: ["(int)myDouble", "int(myDouble)", "myDouble.toInt()", "Convert.ToInt(myDouble)"], answer: "(int)myDouble" },
    { question: "Which operator is used to check if an object is of a specific type?", options: ["as", "is", "typeof", "=="], answer: "is" }
  ],
  "AutoCAD": [
    { question: "What does CAD stand for?", options: ["Computer Aided Design", "Computer Architecture Design", "Calculated Auto Design", "Control And Design"], answer: "Computer Aided Design" },
    { question: "Which file extension is native to AutoCAD?", options: [".dxf", ".dwg", ".cad", ".drw"], answer: ".dwg" },
    { question: "Which command is used to draw a line?", options: ["L", "LINE", "Both L and LINE", "DRAW"], answer: "Both L and LINE" },
    { question: "How do you undo the last action in AutoCAD?", options: ["Ctrl+Z", "U command", "Both", "Ctrl+Y"], answer: "Both" },
    { question: "What is the function of OSNAP?", options: ["Object Snapping", "Object Sorting", "Orthogonal Snapping", "Object Scaling"], answer: "Object Snapping" },
    { question: "Which key toggles Ortho mode?", options: ["F3", "F8", "F9", "F10"], answer: "F8" },
    { question: "What does the OFFSET command do?", options: ["Deletes an object", "Moves an object", "Creates parallel lines or concentric curves", "Scales an object"], answer: "Creates parallel lines or concentric curves" },
    { question: "How do you select all objects in a drawing?", options: ["Ctrl+A", "SELECT ALL", "Click and drag", "All of the above"], answer: "All of the above" },
    { question: "Which command rounds the edges of objects?", options: ["CHAMFER", "FILLET", "TRIM", "ROUND"], answer: "FILLET" },
    { question: "What is a viewport?", options: ["A layer property", "A window to view the model space from paper space", "A rendering tool", "A dimension style"], answer: "A window to view the model space from paper space" },
    { question: "Which command combines multiple objects into a single object?", options: ["JOIN", "GROUP", "BLOCK", "All of the above"], answer: "All of the above" },
    { question: "What is the command to create a block?", options: ["B", "BLOCK", "MAKEBLOCK", "Both B and BLOCK"], answer: "Both B and BLOCK" },
    { question: "How do you pan across a drawing?", options: ["Press and hold the middle mouse button", "Arrow keys", "Scroll wheel up/down", "Left click and drag"], answer: "Press and hold the middle mouse button" },
    { question: "Which command removes a portion of an object between two intersecting lines?", options: ["ERASE", "BREAK", "TRIM", "CUT"], answer: "TRIM" },
    { question: "What is paper space used for?", options: ["Drawing 3D models", "Creating layouts for plotting/printing", "Writing scripts", "Applying materials"], answer: "Creating layouts for plotting/printing" }
  ]
};

async function generateMissingQuestions() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'nit_db',
  });

  try {
    const [deleteResult]: any = await pool.query('DELETE FROM questions');
    console.log(`Cleared ${deleteResult.affectedRows} existing questions to prepare for real inserts.`);

    const [courses]: any = await pool.query('SELECT id, title FROM courses WHERE type = "course"');
    console.log(`Found ${courses.length} courses to process...`);

    let totalInserted = 0;

    for (const course of courses) {
      const title = course.title.toLowerCase();
      let realQuestions = null;

      // Fuzzy matching logic to ensure each course gets the right questions
      if (title.includes('frontend') || title.includes('full stack') || title.includes('react') || title.includes('web')) {
        realQuestions = courseQuestionsMap["Frontend"];
      } else if (title.includes('backend') || title.includes('node') || title.includes('express')) {
        realQuestions = courseQuestionsMap["Backend"];
      } else if (title.includes('data science') || title.includes('analytics')) {
        realQuestions = courseQuestionsMap["DataScience"];
      } else if (title.includes('python') || title.includes('data structure')) {
        realQuestions = courseQuestionsMap["Python"];
      } else if (title.includes('app') || title.includes('mobile') || title.includes('flutter')) {
        realQuestions = courseQuestionsMap["App Development"];
      } else if (title.includes('linux') || title.includes('shell') || title.includes('ubuntu')) {
        realQuestions = courseQuestionsMap["Linux"];
      } else if (title.includes('java')) {
        realQuestions = courseQuestionsMap["Java"];
      } else if (title.includes('c#') || title.includes('c sharp')) {
        realQuestions = courseQuestionsMap["CSharp"];
      } else if (title.includes('autocad') || title.includes('design')) {
        realQuestions = courseQuestionsMap["AutoCAD"];
      }

      // NO DEFAULT FALLBACK! If it doesn't match, skip it.
      if (!realQuestions) {
        console.log(`⚠️ Skipping course: [${course.title}] - No matching questions found in dictionary. Add them manually!`);
        continue;
      }

      const values = realQuestions.slice(0, 15).map(q => [
        course.id,
        q.question,
        JSON.stringify(q.options),
        q.answer
      ]);

      if (values.length > 0) {
        await pool.query(
          'INSERT INTO questions (course_id, question_text, options, correct_answer) VALUES ?',
          [values]
        );
        console.log(`✅ Successfully generated and inserted ${values.length} REAL questions for [${course.title}].`);
        totalInserted += values.length;
      }
    }

    console.log(`\n🎉 Process Complete! Total real questions inserted: ${totalInserted}`);

  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    await pool.end();
  }
}

generateMissingQuestions();