import { useState, useRef } from "react"
import "./Game.css"

// Recebe todas as informações do componente pai (App.jsx) via props
const Game = ({verifyLatter, pickedWord, pickedCategory, letters, guessedLetters, wrongLetters, guesses, score}) => {

  // Guarda a letra digitada pelo jogador no input
  const [letter, setLetter] = useState("")

  // Cria uma referência direta ao input para poder manipulá-lo
  const letterInputRef = useRef(null)

  const handleSubmit = (e) => {
    // Impede a página de recarregar ao enviar o formulário
    e.preventDefault();

    // Envia a letra para a função de verificação no App.jsx
    verifyLatter(letter)

    // Limpa o input após enviar
    setLetter("");

    // Volta o foco para o input automaticamente após enviar
    letterInputRef.current.focus()
  }

  return (
    <div className="game">

      {/* Exibe a pontuação atual recebida via props */}
      <p className="points">
        <span>Pontuação: {score}</span>
      </p>

      <h1>Adivinhe a palavra</h1>

      {/* Exibe a categoria da palavra sorteada recebida via props */}
      <h3 className="tip">Dica sobre a palavra: <span>{pickedCategory}</span></h3>

      {/* Exibe quantas tentativas ainda restam recebidas via props */}
      <p>Voce ainda tem {guesses} tentativas</p>

      <div className="wordCointainer">
        {/* Percorre cada letra da palavra sorteada */}
        {/* Se a letra foi acertada pelo jogador → mostra a letra */}
        {/* Se ainda não foi acertada → mostra um quadrado vazio */}
        {letters.map((letters, i) => (
          guessedLetters.includes(letters) ? (
            <span key={i} className="letter">{letters}</span>
          ) : (
            <span key={i} className="blankSquare"></span>
          )
        ))}
      </div>

      <div className="letterContainer">
        <p>Tente novamente uma letra da palavra:</p>

        {/* Ao enviar o formulário chama a função handleSubmit */}
        <form onSubmit={handleSubmit}>

          {/* Input conectado ao state "letter" e à referência letterInputRef */}
          {/* maxLength="1" limita a apenas uma letra por vez */}
          <input 
            type="text" 
            name="letter" 
            maxLength="1" 
            required 
            onChange={(e) => setLetter(e.target.value)} 
            value={letter} 
            ref={letterInputRef}
          />
          <button>Jogar!</button>
        </form>
      </div>

      <div className="wrongLettersContainer">
        <p>Letras ja utilizadas:</p>

        {/* Se tiver letras erradas → lista todas elas */}
        {/* Se não tiver nenhuma → exibe uma mensagem */}
        {wrongLetters.length > 0 ? (
          wrongLetters.map((letters, i) => (
            <span key={i}>{letters}</span>
          ))
        ) : (
          <p style={{color: '#bdc3c7', marginTop: '10px'}}>Nenhuma letra errada ainda</p>
        )}
      </div>

    </div>
  )
}

export default Game