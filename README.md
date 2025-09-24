# Association Quiz

A personality quiz-esque associative quiz app, built with React, Next.js, TypeScript, and Tailwind CSS.

The prototype for this was [literary-criticism-quiz](https://github.com/ackledotdev/literary-criticism-quiz), which was made to design and create the quiz system itself. This version is a generalized version that can be accept custom-made quizzes.

[Example quiz data](./src/public/literary-criticism-quiz.json), sourced from the original literary criticism quiz, is included.

## Functionality

Questions are multiple choice, with weighted answers that correspond to different results. At the end of the quiz, users receive a breakdown of their results, showing which options they align with most closely.

Quiz data is stored in JSON format (or, in this singular limited case, a TS file exporting an object). The app is designed to be easily extendable, allowing for the addition of more questions or results in the future.
