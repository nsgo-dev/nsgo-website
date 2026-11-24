---
title: Quick start
description: Start a made-up game in a few lines.
---

Create a game and run it with hot reload:

```sh
sample-engine new space-hopper
cd space-hopper && sample-engine dev
```

```go title="game.go"
func (g *Game) Update(cx *engine.Frame) {
	g.player.Move(cx.Input.Axis("move"), cx.Delta)
	if cx.Input.Pressed("jump") {
		g.player.Jump()
	}
}
```

:::tip
Every name above is made up, as the engine is.
:::
