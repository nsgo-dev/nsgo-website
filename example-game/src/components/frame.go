func (g *Game) Update(cx *engine.Frame) {
	g.player.Move(cx.Input.Axis("move"), cx.Delta)
	if cx.Input.Pressed("jump") {
		g.player.Jump()
		cx.Audio.Play("jump.wav")
	}
}
