module.exports = {
    presets: "@babel/preset-env",
    testEnvironment: "node", // Використовується середовище Node.js для тестів
    moduleFileExtensions: ["js"], // Дозволені розширення файлів
    roots: ["<rootDir>"], // Коренева директорія для тестів
    transform: {"^.+\\.[t|j]sx?$": "babel-jest"}, // Немає трансформацій (якщо ви використовуєте TypeScript, тут треба додати babel або ts-jest)
  };
  