# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the Project

Open `index.html` directly in a browser. No build tools, bundlers, or dependencies — pure vanilla HTML/CSS/JS.

## Architecture

This is a 2D top-down shooter ("Neon Survivor") built on the HTML5 Canvas API with synthesized audio via Web Audio API.

### Script Load Order (matters — no module system)

```
bullet.js → particle.js → player.js → enemy.js → game.js
```

Each file defines a global class. `player.js` references `Bullet`, so it must load after `bullet.js`. `game.js` references all classes and must load last.

### Responsibility Split

- **Entity classes** (`Player`, `Enemy`, `Bullet`, `Particle`): Own their state, physics, and rendering via `update()` and `draw(ctx)` methods. No cross-references between entities except `Player.shoot()` creates `Bullet` instances.
- **`game.js` (IIFE)**: Orchestrates everything — game loop (`requestAnimationFrame`), input tracking, state machine, collision detection, spawning logic, HUD updates, and audio. This is the only file that touches the DOM or manages entity arrays.

### State Machine

Game state is a string: `menu` → `playing` ↔ `paused` → `gameover` → `playing`. State transitions toggle CSS class `hidden` on overlay `<div>`s defined in `index.html`.

### Collision Detection

Circle-circle only (every entity has a `radius`). Checked in `game.js` update loop: bullets↔enemies and enemies↔player.

### Enemy Type System

`Enemy` constructor takes a `type` string (`basic`, `fast`, `tank`) that sets radius, speed, health, damage, score value, color, and polygon sides. `Enemy.spawnAtEdge()` is a static factory that picks a random screen edge.

### Difficulty Scaling

Wave increments every 600 frames. Each wave: spawn interval decreases (min 20 frames), enemy speed gets `+0.15`, and higher-tier enemy types unlock (fast at wave 3, tank at wave 5).

## Conventions

- Entities use an `alive` boolean flag; `game.js` splices dead entities from arrays during the update loop (iterate in reverse).
- Canvas glow effects use `ctx.shadowColor`/`ctx.shadowBlur` — always reset `shadowBlur = 0` after drawing.
- Audio uses short-lived `OscillatorNode`s created per sound; no audio files.
