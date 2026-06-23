//css
import './App.css'

//react
import { useCallback, useEffect, useState } from 'react'

//data
import {wordsList} from "./data/words"

//componentes
import StartScreen from './components/StartScreen'
import Game from './components/Game'
import GameOver from './components/GameOver'

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" }
]

function App() {
  const [gameStage, setGameStage] = useState (stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickeWord] = useState("")
  const [pickedCategory, setPickeCategory] = useState("")
  const [letters, setLetters] = useState([])

  const [guessedLetters, setGuessedLetters] = useState([])
  const [wrongLetters, setWrongLetters] = useState([])
  const [guesses, setGuesses] = useState(3)
  const [score, setScore] = useState(0)

  // Memoriza a função para não recriar toda vez que o componente re-renderizar
  const pickWordAndCategory = useCallback(() => {

    // Pega os nomes das categorias do objeto words e transforma em array
    // ex: ["frutas", "animais", "cores"]
    const categories = Object.keys(words)

    // Sorteia uma categoria aleatória do array
    // Math.random() gera um número entre 0 e 1
    // Multiplica pelo tamanho do array para ter um índice válido
    // Math.floor() remove a vírgula para virar um índice inteiro
    const category = categories[Math.floor(Math.random() * categories.length)]

    // Entra na categoria sorteada e sorteia uma palavra aleatória
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    // Retorna os dois valores para serem usados em startGame
    return { word, category }

  }, [words]) // Só recria a função se "words" mudar


  // Memoriza a função para poder ser usada como dependência no useEffect
  const startGame = useCallback(() => {

    // Limpa as letras certas e erradas da rodada anterior
    clearLetterStates()

    // Pega a palavra e categoria sorteadas pela função acima
    const { word, category } = pickWordAndCategory()

    // Quebra a palavra em um array de letras
    // ex: "gato" → ["g", "a", "t", "o"]
    let wordLetters = word.split('')

    // Converte todas as letras para minúsculo para comparar com o que o jogador digita
    wordLetters = wordLetters.map((l) => l.toLowerCase())

    // Salva a palavra, categoria e letras nos states
    setPickeWord(word)
    setPickeCategory(category)
    setLetters(wordLetters)

    // Muda a tela para a tela do jogo
    setGameStage(stages[1].name)

  }, [pickWordAndCategory]) // Só recria a função se "pickWordAndCategory" mudar

  //process the latter input
  const verifyLatter = (letter) => {
    const normalizedLetter = letter.toLowerCase()
    // checa se a letra esta sendo utilizada
    if(
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ){
      return
    }

    console.log('Letra entrada:', normalizedLetter)
    console.log('Letras da palavra:', letters)
    console.log('Contém a letra?', letters.includes(normalizedLetter))

    if(letters.includes(normalizedLetter)){
      console.log('Letra correta adicionada')
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters, normalizedLetter
      ])
    } else {
      console.log('Letra errada adicionada:', normalizedLetter)
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters, normalizedLetter
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1)
    }
  }

  const clearLetterStates = () => {
    setGuessedLetters([])
    setWrongLetters([])
  }

  useEffect(()=>{
    if(guesses <= 0){
       setGameStage(stages[2].name)
    }
  }, [guesses, setGameStage, stages])

  useEffect(() =>{
    const uniqueLetters = [...new Set(letters)]

    // Não executar na montagem inicial quando ainda não há letras
    if (uniqueLetters.length === 0) return

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore + 100)
      startGame()
    }

  }, [guessedLetters, letters, startGame])

  // DEBUG
  useEffect(() => {
    console.log('🎮 Estado do jogo atualizado:')
    console.log('📝 wrongLetters:', wrongLetters)
    console.log('✅ guessedLetters:', guessedLetters)
    console.log('🎯 letters da palavra:', letters)
  }, [wrongLetters, guessedLetters, letters])

  //restarts the game
  const retry = () => {
    setScore(0)
    setGuesses(3)
    setGameStage(stages[0].name)
  }

  return(
    <div className='App'>
      {gameStage ===  "start" && <StartScreen startGame={startGame} />}
      {gameStage ===  "game" && 
        <Game 
          verifyLatter={verifyLatter} 
          pickedWord={pickedWord} 
          pickedCategory={pickedCategory} 
          letters={letters} 
          guessedLetters={guessedLetters} 
          wrongLetters={wrongLetters} 
          guesses={guesses} 
          score={score}
        />
      }
      {gameStage === "end" && <GameOver retry={retry} score={score}/>}
    </div>
  )
}

export default App
