import { ExecutorProps } from "../Executor";
import { useState, useEffect, useRef } from "react";
import "./SpaceInvaders.css";

type GameState = {
  playerX: number;
  bullets: Array<{ x: number; y: number }>;
  enemies: Array<{ x: number; y: number; width: number; height: number }>;
  score: number;
  gameOver: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SpaceInvadersExecutor(_props: ExecutorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(true);
  const [gameState, setGameState] = useState<GameState>({
    playerX: 150,
    bullets: [],
    enemies: [
      { x: 20, y: 30, width: 40, height: 30 },
      { x: 100, y: 30, width: 40, height: 30 },
      { x: 180, y: 30, width: 40, height: 30 },
      { x: 260, y: 30, width: 40, height: 30 },
      { x: 20, y: 100, width: 40, height: 30 },
      { x: 100, y: 100, width: 40, height: 30 },
      { x: 180, y: 100, width: 40, height: 30 },
      { x: 260, y: 100, width: 40, height: 30 },
    ],
    score: 0,
    gameOver: false,
  });

  const keysPressed = useRef<Set<string>>(new Set());
  const enemyDirectionRef = useRef(1);
  const levelRef = useRef(1);

  const createEnemyWave = (level: number) => {
    const enemies = [];
    const rowSpacing = 70;
    const baseY = -rowSpacing * (level + 1);
    
    for (let row = 0; row < level + 1; row++) {
      const y = baseY + row * rowSpacing;
      enemies.push(
        { x: 20, y, width: 40, height: 30 },
        { x: 100, y, width: 40, height: 30 },
        { x: 180, y, width: 40, height: 30 },
        { x: 260, y, width: 40, height: 30 }
      );
    }
    return enemies;
  };

  const GAME_WIDTH = 340;
  const GAME_HEIGHT = 400;
  const PLAYER_WIDTH = 40;
  const PLAYER_HEIGHT = 30;
  const PLAYER_SPEED = 5;
  const BULLET_SPEED = 7;
  const ENEMY_SPEED = 5;
  const ENEMY_DESCENT_SPEED = 0.5;

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase());
      if (e.key === " ") {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        if (prevState.gameOver) return prevState;

        const newState = { ...prevState };

        // Move player
        if (keysPressed.current.has("arrowleft") && newState.playerX > 0) {
          newState.playerX -= PLAYER_SPEED;
        }
        if (
          keysPressed.current.has("arrowright") &&
          newState.playerX < GAME_WIDTH - PLAYER_WIDTH
        ) {
          newState.playerX += PLAYER_SPEED;
        }

        // Shoot bullet
        if (keysPressed.current.has(" ")) {
          if (newState.bullets.length < 5) {
            newState.bullets = [
              ...newState.bullets,
              {
                x: newState.playerX + PLAYER_WIDTH / 2 - 2,
                y: GAME_HEIGHT - PLAYER_HEIGHT - 10,
              },
            ];
          }
        }

        // Move bullets
        newState.bullets = newState.bullets
          .map((bullet) => ({ ...bullet, y: bullet.y - BULLET_SPEED }))
          .filter((bullet) => bullet.y > 0);

        // Move enemies
        let changeDirection = false;
        newState.enemies = newState.enemies.map((enemy) => {
          const newX = enemy.x + enemyDirectionRef.current * ENEMY_SPEED;
          if (newX <= 0 || newX + enemy.width >= GAME_WIDTH) {
            changeDirection = true;
          }
          return { ...enemy, x: newX, y: enemy.y + ENEMY_DESCENT_SPEED };
        });

        if (changeDirection) {
          enemyDirectionRef.current *= -1;
        }

        // Check collisions with bullets
        const bulletsToRemove = new Set<number>();
        const enemiesToRemove = new Set<number>();

        newState.bullets.forEach((bullet, bulletIndex) => {
          newState.enemies.forEach((enemy, enemyIndex) => {
            if (
              bullet.x < enemy.x + enemy.width &&
              bullet.x + 4 > enemy.x &&
              bullet.y < enemy.y + enemy.height &&
              bullet.y + 10 > enemy.y
            ) {
              bulletsToRemove.add(bulletIndex);
              enemiesToRemove.add(enemyIndex);
              newState.score += 10;
            }
          });
        });

        newState.bullets = newState.bullets.filter(
          (_, index) => !bulletsToRemove.has(index)
        );
        newState.enemies = newState.enemies.filter(
          (_, index) => !enemiesToRemove.has(index)
        );

        // Check if any enemy reached bottom (player loses)
        if (newState.enemies.some((enemy) => enemy.y + enemy.height >= GAME_HEIGHT - PLAYER_HEIGHT)) {
          newState.gameOver = true;
        }

        // Check if all enemies defeated
        if (newState.enemies.length === 0) {
          levelRef.current += 1;
          newState.enemies = createEnemyWave(levelRef.current);
        }

        return newState;
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    levelRef.current = 1;
    setGameState({
      playerX: 150,
      bullets: [],
      enemies: [
        { x: 20, y: 30, width: 40, height: 30 },
        { x: 100, y: 30, width: 40, height: 30 },
        { x: 180, y: 30, width: 40, height: 30 },
        { x: 260, y: 30, width: 40, height: 30 },
        { x: 20, y: 100, width: 40, height: 30 },
        { x: 100, y: 100, width: 40, height: 30 },
        { x: 180, y: 100, width: 40, height: 30 },
        { x: 260, y: 100, width: 40, height: 30 },
      ],
      score: 0,
      gameOver: false,
    });
    enemyDirectionRef.current = 1;
  };

  if (!isOpen) {
    return <div></div>;
  }

  return (
    <div className="space-invaders-modal-overlay">
      <div className="space-invaders-modal">
        <div className="space-invaders-header">
          <h2>Space Invaders</h2>
          <button className="space-invaders-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="space-invaders-info">
          <p>Score: {gameState.score}</p>
          {gameState.gameOver && <p className="game-over-text">GAME OVER!</p>}
        </div>

        <div className="space-invaders-game" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
          {/* Player */}
          <div
            className="player"
            style={{
              left: `${gameState.playerX}px`,
              bottom: "0px",
              width: `${PLAYER_WIDTH}px`,
              height: `${PLAYER_HEIGHT}px`,
            }}
          ></div>

          {/* Enemies */}
          {gameState.enemies.map((enemy, index) => (
            <div
              key={index}
              className="enemy"
              style={{
                left: `${enemy.x}px`,
                top: `${enemy.y}px`,
                width: `${enemy.width}px`,
                height: `${enemy.height}px`,
              }}
            ></div>
          ))}

          {/* Bullets */}
          {gameState.bullets.map((bullet, index) => (
            <div
              key={index}
              className="bullet"
              style={{
                left: `${bullet.x}px`,
                top: `${bullet.y}px`,
              }}
            ></div>
          ))}
        </div>

        <div className="space-invaders-controls">
          <p>← → Arrow Keys to Move | Spacebar to Shoot</p>
          {gameState.gameOver && (
            <button className="space-invaders-reset-btn" onClick={handleReset}>
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
