---
title: Code blocks
description: Every kind of code block, to check how the site shows them.
---

## Highlighting

Each language in the site's two themes, on its surface: TypeScript, Go and a shell command. A file name in a first-line comment becomes the block's title.

```ts
// site.config.ts
import { defineSite } from 'nsgo-website/config';

export default defineSite({
	languages: ['en', 'zh'],
	name: 'Sample Notes',
	repo: 'https://github.com/nsgo-dev/nsgo-website',
	roadmap: { tracking: 1 },
});
```

```go
func Root(cx *core.Scope) core.Node {
	notes := store.Open(cx, "~/Notes")
	return core.View{Children: []core.Node{
		notes.List{},
		ui.Button{Text: "New note", OnPress: notes.New},
	}}
}
```

```sh
bun add github:nsgo-dev/nsgo-website
bun run build
```

## Long lines

A line wider than the page scrolls sideways inside its block, with the system's own scrollbar.

```sh
bunx astro build --site https://nsgo-dev.github.io --base /nsgo-website --outDir ./dist --verbose
```

## Long blocks

A block taller than its capped height scrolls inside, so the page around it stays short.

```go
package store

import (
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

// Note is one plain-text file in the notes folder.
type Note struct {
	Path     string
	Title    string
	Body     string
	Modified time.Time
}

// Load reads every note in dir, newest first.
func Load(dir string) ([]Note, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, err
	}
	var notes []Note
	for _, e := range entries {
		if e.IsDir() || filepath.Ext(e.Name()) != ".txt" {
			continue
		}
		path := filepath.Join(dir, e.Name())
		data, err := os.ReadFile(path)
		if err != nil {
			return nil, err
		}
		info, err := e.Info()
		if err != nil {
			return nil, err
		}
		body := string(data)
		title, _, _ := strings.Cut(body, "\n")
		notes = append(notes, Note{Path: path, Title: title, Body: body, Modified: info.ModTime()})
	}
	sort.Slice(notes, func(i, j int) bool {
		return notes[i].Modified.After(notes[j].Modified)
	})
	return notes, nil
}

// Search keeps the notes whose text contains query, ignoring case.
func Search(notes []Note, query string) []Note {
	q := strings.ToLower(query)
	var found []Note
	for _, n := range notes {
		if strings.Contains(strings.ToLower(n.Body), q) {
			found = append(found, n)
		}
	}
	return found
}
```

## Inline code

Inline code such as `store.Open` or `bun run dev` sits in the line; inside a link, as in [`defineSite`](../../quick-start/), it takes the link's color.
