---
title: 代码块
description: 各种代码块，用来检查站点怎样显示它们。
---

## 高亮

每种语言都用站点的两套主题，放在站点的底色上：TypeScript、Go 和一条 shell 命令。首行注释里的文件名会变成代码块的标题。

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

## 长行

比页面宽的行在代码块里横向滚动，用的是系统自带的滚动条。

```sh
bunx astro build --site https://nsgo-dev.github.io --base /nsgo-website --outDir ./dist --verbose
```

## 长代码块

超过限高的代码块在框里滚动，周围的页面不会被拉长。

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

## 行内代码

行内代码如 `store.Open` 或 `bun run dev` 嵌在行里；放在链接里时，如 [`defineSite`](../../quick-start/)，它随链接的颜色。
