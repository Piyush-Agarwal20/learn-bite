-- Migration: Add ELI5 (Explain Like I'm 5) content column to lessons
-- Created: 2025-10-29
-- Description: Adds a column for simplified explanations of lesson content

-- Add content_eli5 column to lessons table
ALTER TABLE lessons
ADD COLUMN IF NOT EXISTS content_eli5 TEXT;

-- Add comment to document the column
COMMENT ON COLUMN lessons.content_eli5 IS 'Simplified explanation of lesson content for easier understanding (Explain Like I''m 5)';

-- Update existing lessons with sample ELI5 content for Python lessons
UPDATE lessons
SET content_eli5 = 'Imagine Python as a magic notebook where you can tell the computer what to do using simple words!

Think of it like this: When you want your friend to draw a cat, you just say "draw a cat!" You don''t need to explain how to hold the pencil or which lines to draw first. Python is like that - you tell it what you want in simple words, and it figures out the details!

**Your First Magic Spell**

```python
print("Hello, World!")
```

This is like saying "Computer, please say Hello, World!" And the computer does it!

**Why is Python Special?**

1. **Easy Words**: It uses words like "print" instead of complicated codes
2. **Friendly**: If you make a mistake, it tells you nicely what went wrong
3. **Popular**: Lots of people use it, so you''ll have many friends to help you!

Think of Python as your friendly robot assistant that understands English and helps you create amazing things! 🤖✨'
WHERE title = 'Introduction to Python';

UPDATE lessons
SET content_eli5 = 'Variables are like labeled boxes where you can store different things!

**The Box Analogy**

Imagine you have different colored boxes:
- A box labeled "name" holds your friend''s name
- A box labeled "age" holds how old they are
- A box labeled "favorite_color" holds their favorite color

In Python, we create these boxes like this:
```python
name = "Emma"
age = 8
favorite_color = "blue"
```

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

UPDATE lessons
SET content_eli5 = 'Functions are like recipes that you can use over and over again!

**The Recipe Analogy**

Imagine you have a recipe for making a sandwich:

```python
def make_sandwich():
    print("Get bread")
    print("Add peanut butter")
    print("Add jelly")
    print("Put bread slices together")

make_sandwich()  # Makes a sandwich!
```

Every time you call `make_sandwich()`, it follows all the steps!

**Recipes with Ingredients (Parameters)**

What if you want different types of sandwiches? You can add "ingredients":

```python
def make_sandwich(filling):
    print(f"Making a {filling} sandwich!")
    print("Get bread")
    print(f"Add {filling}")
    print("Done!")

make_sandwich("peanut butter")  # Makes PB sandwich
make_sandwich("cheese")         # Makes cheese sandwich
```

**Getting Something Back (Return)**

Sometimes recipes give you something back:

```python
def add_numbers(num1, num2):
    answer = num1 + num2
    return answer

result = add_numbers(3, 5)
print(result)  # Shows 8
```

It''s like asking "What''s 3 + 5?" and getting "8" as the answer!

**Why Functions are Cool**

1. **Reusable**: Write once, use many times
2. **Organized**: Keeps your code tidy
3. **Easy to Fix**: If something breaks, you know where to look

Functions are like your personal helpers that do specific jobs whenever you ask them! 🎯'
WHERE title = 'Functions and Parameters';
