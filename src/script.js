document.addEventListener("DOMContentLoaded", function () {
  const generateButton = document.getElementById("generate-button");
  const solveButton = document.getElementById("solve-button");
  const card = document.querySelector(".card");
  const solution = document.getElementById("solution");

  // Função para gerar uma carta do jogo do 24
  function generateCard() {
    const numbers = generateRandomNumbers();

    numbers.forEach((number, index) => {
      const numberDiv = card.children[index];
      numberDiv.innerText = number;
    });

    solution.innerText = "";
  }

  // Função para resolver o jogo do 24
  function solveGame() {
    const numbers = Array.from(card.children).map((numberDiv) =>
      parseInt(numberDiv.innerText)
    );

    if (hasSolution(numbers)) {
      const solutionText = getSolution(numbers);
      solution.innerText = `Solução: ${solutionText}`;
    } else {
      solution.innerText = "Não há solução para os números fornecidos.";
    }
  }

  // Função auxiliar para gerar números aleatórios para a carta do jogo do 24
  function generateRandomNumbers() {
    const numbers = [];
    for (let i = 0; i < 4; i++) {
      const number = Math.floor(Math.random() * 9) + 1; // Números de 1 a 9
      numbers.push(number);
    }
    return numbers;
  }

  // Função auxiliar para verificar se há solução para o jogo do 24
  function hasSolution(numbers) {
    return permute(numbers);
  }

  // Função auxiliar para obter a solução do jogo do 24
  function getSolution(numbers) {
    const operators = ["+", "-", "*", "/"];
    const solution = findSolution(numbers, operators);
    return solution ? solution.join(" ") : "Não há solução encontrada.";
  }

  function formatSolution(solution) {
    let formattedSolution = "";
    let currentResult = "";

    for (let i = 0; i < solution.length; i += 4) {
      const num1 = solution[i];
      const operator1 = solution[i + 1];
      const num2 = solution[i + 2];
      const operator2 = solution[i + 3];
      const num3 = solution[i + 4];
      const operator3 = solution[i + 5];
      const num4 = solution[i + 6];
      const result = solution[i + 7];

      if (typeof result === "number") {
        currentResult += result;
      } else {
        const expression = `(${num1} ${operator1} ${num2}) ${operator2} ${num3} ${operator3} ${num4}`;
        if (currentResult) {
          formattedSolution += `${currentResult} ${operator2} ${num3} ${operator3} ${num4} = ${result}\n`;
          currentResult = "";
        } else {
          formattedSolution += `${expression}\n = ${result}\n`;
        }
      }
    }

    // Adiciona o resultado final na última linha
    formattedSolution += currentResult;

    return formattedSolution.trim();
  }

  // Função auxiliar para permutar os números e encontrar uma solução válida
  function permute(numbers) {
    if (numbers.length === 1) {
      return [numbers];
    }

    const result = [];
    for (let i = 0; i < numbers.length; i++) {
      const current = numbers[i];
      const remaining = numbers.slice(0, i).concat(numbers.slice(i + 1));

      const permutations = permute(remaining);
      for (let j = 0; j < permutations.length; j++) {
        result.push([current].concat(permutations[j]));
      }
    }

    return result;
  }

  // Função auxiliar para encontrar uma solução válida utilizando as operações matemáticas
  function findSolution(numbers, operators) {
    if (numbers.length === 1) {
      return Math.abs(numbers[0] - 24) < 0.0001 ? [numbers[0]] : null;
    }

    for (let i = 0; i < numbers.length; i++) {
      for (let j = 0; j < numbers.length; j++) {
        if (i !== j) {
          const num1 = numbers[i];
          const num2 = numbers[j];

          for (let k = 0; k < operators.length; k++) {
            const operator = operators[k];

            const remainingNumbers = numbers.filter(
              (_, index) => index !== i && index !== j
            );
            const remainingOperators = operators.filter(
              (_, index) => index !== k
            );

            if (operator === "+") {
              const result = findSolution(
                [num1 + num2, ...remainingNumbers],
                remainingOperators
              );
              if (result) {
                return [num1, "+", num2, ...result];
              }
            } else if (operator === "-") {
              const result = findSolution(
                [num1 - num2, ...remainingNumbers],
                remainingOperators
              );
              if (result) {
                return [num1, "-", num2, ...result];
              }
            } else if (operator === "*") {
              const result = findSolution(
                [num1 * num2, ...remainingNumbers],
                remainingOperators
              );
              if (result) {
                return [num1, "*", num2, ...result];
              }
            } else if (operator === "/") {
              if (Math.abs(num2) > 0.0001) {
                const result = findSolution(
                  [num1 / num2, ...remainingNumbers],
                  remainingOperators
                );
                if (result) {
                  return [num1, "/", num2, ...result];
                }
              }
            }
          }
        }
      }
    }

    return null;
  }

  // Evento de clique no botão "Gerar Carta"
  generateButton.addEventListener("click", generateCard);

  // Evento de clique no botão "Solução"
  solveButton.addEventListener("click", solveGame);

  // Gerar uma carta quando a página for carregada
  generateCard();
});
