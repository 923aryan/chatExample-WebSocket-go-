package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

var (
	webSocketUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

type Manager struct {
	clients ClientList
	sync.RWMutex
}

func NewManager() *Manager {
	return &Manager{
		clients: make(ClientList),
	}
}

func (m *Manager) serveWS(w http.ResponseWriter, r *http.Request) {

	log.Println("New Connection")
	conn, err := webSocketUpgrader.Upgrade(w, r, nil)

	if err != nil {
		log.Println(err)
		return
	}

	client := NewClient(conn, m)
	m.addClient(client)

	// start client processes

	go client.readMessages()
	go client.writeMessages()

}

func (m *Manager) addClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	m.clients[client] = true
}

func (m *Manager) removeClient(client *Client) {
	m.Lock()
	defer m.Unlock()
	if _, ok := m.clients[client]; ok {
		client.conneciton.Close()
		delete(m.clients, client)
	}

}
