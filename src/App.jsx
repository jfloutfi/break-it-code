import { useGameState } from './hooks/useGameState.js'
import SetupScreen from './components/SetupScreen.jsx'
import GameBoard from './components/GameBoard.jsx'
import EndScreen from './components/EndScreen.jsx'
import './App.css'

export default function App() {
  const game = useGameState()

  if (game.screen === 'setup') {
    return (
      <SetupScreen
        settings={game.settings}
        onUpdate={game.updateSettings}
        onStart={game.startGame}
      />
    )
  }

  if (game.screen === 'playing') {
    return (
      <GameBoard
        settings={game.settings}
        guesses={game.guesses}
        activeGuess={game.activeGuess}
        selectedColor={game.selectedColor}
        attemptNumber={game.attemptNumber}
        maxAttempts={game.maxAttempts}
        canSubmit={game.canSubmit}
        onSelectColor={game.selectColor}
        onPlaceColor={game.placeColor}
        onClearSlot={game.clearSlot}
        onSubmit={() => game.submitGuess()}
        onGiveUp={game.giveUp}
      />
    )
  }

  if (game.screen === 'end') {
    return (
      <EndScreen
        result={game.result}
        code={game.code}
        finalScore={game.finalScore}
        attemptNumber={game.attemptNumber}
        maxAttempts={game.maxAttempts}
        onPlayAgain={game.playAgain}
      />
    )
  }

  return null
}
