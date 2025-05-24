-- Delete all existing problems
TRUNCATE TABLE coding_problem_constraints;
TRUNCATE TABLE coding_problem RESTART IDENTITY CASCADE;

-- Insert "Today" problem
INSERT INTO coding_problem (title, description, initial_code)
VALUES (
    'Fibonacci Sequence',
    'Write a function that returns the nth Fibonacci number. The Fibonacci sequence is defined as:
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2)',
    'def fib(n):\n    # your code here\n    ...'
);

-- Get the inserted ID
-- Assuming it's ID = 1
INSERT INTO coding_problem_constraints (coding_problem_id, constraints)
VALUES 
  (1, '0 ≤ n ≤ 30'),
  (1, 'Your solution should be efficient and clean');

-- Insert "Tomorrow" problem
INSERT INTO coding_problem (title, description, initial_code)
VALUES (
    'Factorial Function',
    'Write a function that returns the factorial of a given number n. The factorial is defined as:
n! = n × (n-1) × (n-2) × ... × 1, with 0! = 1.',
    'def factorial(n):\n    # your code here\n    ...'
);

-- Assuming ID = 2
INSERT INTO coding_problem_constraints (coding_problem_id, constraints)
VALUES 
  (2, '0 ≤ n ≤ 20'),
  (2, 'Use recursion or iteration');
