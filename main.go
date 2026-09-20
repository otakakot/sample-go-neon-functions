//go:build js && wasm

package main

import (
	"fmt"
	"net/http"

	"github.com/syumai/workers-go"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Hello Neon!")
	})
	workers.ServeNonBlock(nil)
	workers.Ready()
	select {}
}
