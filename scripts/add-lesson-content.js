#!/usr/bin/env node

/**
 * Add sample content to lessons
 */

import dbManager from './db-manager/index.js';

async function addLessonContent() {
  console.log('📝 Adding sample content to lessons...\n');

  dbManager.initialize();

  try {
    // Update lesson 1: Introduction to Python
    await dbManager.executeSQL(`
      UPDATE lessons
      SET
        content = 'Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python emphasizes code readability with its use of significant indentation.

**Why Learn Python?**

Python is one of the most popular programming languages today. It''s used in:
- Web Development (Django, Flask)
- Data Science and Machine Learning
- Automation and Scripting
- Scientific Computing
- Artificial Intelligence

**Your First Python Program**

Let''s start with the classic "Hello, World!" program:

\`\`\`python
print("Hello, World!")
\`\`\`

When you run this code, Python will display "Hello, World!" on your screen. The \`print()\` function is used to output text or other data.

**Key Concepts**

1. **Easy to Read**: Python code reads almost like English
2. **Indentation Matters**: Python uses indentation to define code blocks
3. **Versatile**: From websites to AI, Python does it all
4. **Large Community**: Millions of developers and tons of resources

**Practice Exercise**

Try writing a program that prints your name:
\`\`\`python
print("My name is [Your Name]")
\`\`\`',
        content_eli5 = 'Imagine Python as a magic notebook where you can tell the computer what to do using simple words!

Think of it like this: When you want your friend to draw a cat, you just say "draw a cat!" You don''t need to explain how to hold the pencil or which lines to draw first. Python is like that - you tell it what you want in simple words, and it figures out the details!

**Your First Magic Spell**

\`\`\`python
print("Hello, World!")
\`\`\`

This is like saying "Computer, please say Hello, World!" And the computer does it!

**Why is Python Special?**

1. **Easy Words**: It uses words like "print" instead of complicated codes
2. **Friendly**: If you make a mistake, it tells you nicely what went wrong
3. **Popular**: Lots of people use it, so you''ll have many friends to help you!

Think of Python as your friendly robot assistant that understands English and helps you create amazing things! 🤖✨'
      WHERE title = 'Introduction to Python';
    `);

    //  Update lesson 2: Variables and Data Types
    await dbManager.executeSQL(`
      UPDATE lessons
      SET
        content = 'In Python, variables are containers for storing data values. Unlike other programming languages, Python has no command for declaring a variable. A variable is created the moment you first assign a value to it.

**Creating Variables**

\`\`\`python
name = "Alice"
age = 25
height = 5.6
is_student = True
\`\`\`

**Data Types in Python**

Python has several built-in data types:

1. **Text Type**: str (string)
   \`\`\`python
   greeting = "Hello, Python!"
   \`\`\`

2. **Numeric Types**: int, float
   \`\`\`python
   count = 10        # integer
   price = 19.99     # float
   \`\`\`

3. **Boolean Type**: bool
   \`\`\`python
   is_active = True
   is_completed = False
   \`\`\`

4. **Sequence Types**: list, tuple
   \`\`\`python
   fruits = ["apple", "banana", "cherry"]
   coordinates = (10, 20)
   \`\`\`

**Variable Naming Rules**

- Must start with a letter or underscore
- Can only contain alpha-numeric characters and underscores
- Case-sensitive (age, Age, and AGE are different variables)
- Cannot be Python keywords like "if", "for", "while"

**Type Conversion**

You can convert between types:
\`\`\`python
x = str(3)      # "3"
y = int("3")    # 3
z = float("3")  # 3.0
\`\`\`',
        content_eli5 = 'Variables are like labeled boxes where you can store different things!

**The Box Analogy**

Imagine you have different colored boxes:
- A box labeled "name" holds your friend''s name
- A box labeled "age" holds how old they are
- A box labeled "favorite_color" holds their favorite color

In Python, we create these boxes like this:
\`\`\`python
name = "Emma"
age = 8
favorite_color = "blue"
\`\`\`

**Different Types of Boxes**

Just like you have different types of containers at home:
- **Text Box** (string): Holds words like "Hello"
- **Number Box** (integer): Holds whole numbers like 5
- **Decimal Box** (float): Holds numbers with decimals like 3.14
- **Yes/No Box** (boolean): Holds True or False

**Box Naming Rules**

When naming your boxes (variables):
- Use lowercase letters
- Use underscores for spaces: favorite_toy (not favorite toy)
- Make names meaningful: age is better than x

Think of variables as your personal storage system where Python remembers things for you! 📦'
      WHERE title = 'Variables and Data Types';
    `);

    // Update lesson 3: Functions and Parameters
    await dbManager.executeSQL(`
      UPDATE lessons
      SET
        content = 'Functions are reusable blocks of code that perform a specific task. They help organize your code and make it more modular and maintainable.

**Defining Functions**

Use the \`def\` keyword to create a function:

\`\`\`python
def greet():
    print("Hello, World!")

# Call the function
greet()  # Output: Hello, World!
\`\`\`

**Functions with Parameters**

Parameters allow you to pass information into functions:

\`\`\`python
def greet_person(name):
    print(f"Hello, {name}!")

greet_person("Alice")  # Output: Hello, Alice!
greet_person("Bob")    # Output: Hello, Bob!
\`\`\`

**Multiple Parameters**

Functions can accept multiple parameters:

\`\`\`python
def add_numbers(a, b):
    result = a + b
    return result

sum = add_numbers(5, 3)
print(sum)  # Output: 8
\`\`\`

**Default Parameters**

You can provide default values for parameters:

\`\`\`python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Alice")                 # Output: Hello, Alice!
greet("Bob", "Good morning")   # Output: Good morning, Bob!
\`\`\`

**Return Values**

Functions can return values using the \`return\` keyword:

\`\`\`python
def square(number):
    return number * number

result = square(4)
print(result)  # Output: 16
\`\`\`

**Best Practices**

1. Use descriptive function names
2. Keep functions focused on one task
3. Document your functions with comments
4. Use type hints for better code clarity',
        content_eli5 = 'Functions are like recipes that you can use over and over again!

**The Recipe Analogy**

Imagine you have a recipe for making a sandwich:

\`\`\`python
def make_sandwich():
    print("Get bread")
    print("Add peanut butter")
    print("Add jelly")
    print("Put bread slices together")

make_sandwich()  # Makes a sandwich!
\`\`\`

Every time you call \`make_sandwich()\`, it follows all the steps!

**Recipes with Ingredients (Parameters)**

What if you want different types of sandwiches? You can add "ingredients":

\`\`\`python
def make_sandwich(filling):
    print(f"Making a {filling} sandwich!")
    print("Get bread")
    print(f"Add {filling}")
    print("Done!")

make_sandwich("peanut butter")  # Makes PB sandwich
make_sandwich("cheese")         # Makes cheese sandwich
\`\`\`

**Getting Something Back (Return)**

Sometimes recipes give you something back:

\`\`\`python
def add_numbers(num1, num2):
    answer = num1 + num2
    return answer

result = add_numbers(3, 5)
print(result)  # Shows 8
\`\`\`

It''s like asking "What''s 3 + 5?" and getting "8" as the answer!

**Why Functions are Cool**

1. **Reusable**: Write once, use many times
2. **Organized**: Keeps your code tidy
3. **Easy to Fix**: If something breaks, you know where to look

Functions are like your personal helpers that do specific jobs whenever you ask them! 🎯'
      WHERE title = 'Functions and Parameters';
    `);

    console.log('✅ All lessons updated with content!\n');

    // Verify
    const result = await dbManager.executeSQL(`
      SELECT id, title,
        LENGTH(content) as content_length,
        LENGTH(content_eli5) as eli5_length
      FROM lessons
      ORDER BY "order";
    `);

    if (result.success) {
      console.log('📊 Updated Lessons:\n');
      console.table(result.data);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await dbManager.close();
  }
}

addLessonContent().catch(console.error);
