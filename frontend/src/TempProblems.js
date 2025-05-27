const exampleProblem = {
  title: "Fibonacci Sequence",
  description: `Write a Python function that returns the nth Fibonacci number. The Fibonacci sequence is defined as:
F(0) = 0
F(1) = 1
F(n) = F(n-1) + F(n-2)
Your function should take an integer n and return the nth Fibonacci number.`,
  constraints: [
    "0 ≤ n ≤ 30",
    "Your solution should be efficient and clean"
  ],
  initialCode: `def fib(n):\n    # your code here\n    ...`,
  unitTest: `\nif fib(5) == 5 and fib(2) == 1 and fib(10) == 55:\n  print("PASS")\nelse:\n  print("FAIL")`
}

const exampleProblem2 = {
  title: "Length of Last Word",
  description: `Given a string s consisting of words and spaces, return the length of the last word in the string.
A word is a maximal substring consisting of non-space characters only.
Note that the string s may contain leading, trailing, or multiple spaces in between two words.
You need to ignore all leading and trailing spaces in s.`,
  constraints: [
    "1 ≤ s.length ≤ 10^4",
    "s consists of only English letters and spaces ' '.",
    "There will be at least one word in s.",
    "The words in s are separated by at least one space."
  ],
  initialCode: `def lengthOfLastWord(s):\n    # your code here\n    ...`,
  unitTest: `\nif lengthOfLastWord("Hello World") == 5:\n  print("PASS BITCH")\nelse:\n print("FAIL BITCH")`
}

export const problems = [exampleProblem, exampleProblem2]

/**
 * THIS IS A TEMPORARY FILE
 * 
 * This file contains example problems for the Discode Daily app.
 * It is not meant to be permanent and will be replaced with a proper
 * database or API call in the future.
 * 
 */