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

  const pickWordAndCategory = useCallback(() => {
    //pick a random category
    const categories = Object.keys(words)
    const category = categories[Math.floor(Math.random() * Object.keys(categories).length)]

    //pick a random word
    const word = words[category][Math.floor(Math.random() * words[category].length)]

    return {word, category}
  },[words])

  //start the secret word game 
  const startGame = useCallback(() => {
    //clear all latter
    clearLetterStates()

    // pick word and pick category
    const {word, category} = pickWordAndCategory()

    //create an array of latters
    let wordLetters = word.split('')

    wordLetters = wordLetters.map((l) => l.toLowerCase())


    //fill states
    setPickeWord(word)
    setPickeCategory(category)
    setLetters(wordLetters)

    setGameStage(stages[1].name)
  },[pickWordAndCategory])

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

    if(guessedLetters.length === uniqueLetters.length){
      setScore((actualScore) => actualScore += 100)
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
