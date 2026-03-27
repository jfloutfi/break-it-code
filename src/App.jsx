import { useLayoutEffect } from 'react'
import { useGameState } from './hooks/useGameState.js'
import SetupScreen from './components/SetupScreen.jsx'
import GameBoard from './components/GameBoard.jsx'
import EndScreen from './components/EndScreen.jsx'
import './App.css'

export default function App() {
  const game = useGameState()

  // Reset scroll on every screen transition before the browser paints.
  // overflow-x:hidden on body makes it the scroll container, so reset both.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [game.screen])

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
        onClearGuess={game.clearGuess}
        onSubmit={(opts) => game.submitGuess(opts)}
        onGiveUp={game.giveUp}
      />
    )
  }

  if (game.screen === 'end') {
    return (
      <EndScreen
        result={game.result}
        gaveUp={game.gaveUp}
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
