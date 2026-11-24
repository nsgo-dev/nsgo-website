---
title: 快速开始
description: 几行代码开始一个虚构的游戏。
---

创建一个游戏，带热重载运行：

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
和引擎一样，上面的名字都是虚构的。
:::
