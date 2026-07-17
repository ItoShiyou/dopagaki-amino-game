import { useGameEngine } from './hooks/useGameEngine'
import { TitleScreen } from './components/TitleScreen'
import { GameScreen } from './components/GameScreen'
import { GameOverScreen } from './components/GameOverScreen'

export default function App() {
  const { state, startGame, submitAnswer, tapRevival, togglePause, returnToTitle } = useGameEngine()

  return (
    <div className="mx-auto flex h-[100dvh] max-w-md flex-col overflow-hidden bg-black text-white">
      {state.screen === 'title' && <TitleScreen onStart={startGame} />}
      {state.screen === 'playing' && (
        <GameScreen
          state={state}
          onAnswer={submitAnswer}
          onRevivalTap={tapRevival}
          onTogglePause={togglePause}
        />
      )}
      {state.screen === 'gameover' && (
        <GameOverScreen
          score={state.score}
          maxCombo={state.maxCombo}
          onRetry={() => startGame(state.mode, state.stage)}
          onTitle={returnToTitle}
        />
      )}
    </div>
  )
}
