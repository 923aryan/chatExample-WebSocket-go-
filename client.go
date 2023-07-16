package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type ClientList map[*Client]bool

type Client struct {
	conneciton *websocket.Conn
	manager    *Manager

	egress chan []byte
}

func NewClient(conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		conneciton: conn,
		manager:    manager,
		egress:     make(chan []byte),
	}
}

func (c *Client) readMessages() {
	defer func() {
		c.manager.removeClient(c)
	}()
	for {
		messageType, payload, err := c.conneciton.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway,
				websocket.CloseAbnormalClosure) {
				log.Printf("error reading message: %v", err)

			}
			break
		}

		for wsclient := range c.manager.clients {
			wsclient.egress <- payload
		}

		log.Println(messageType)
		log.Println(string(payload))
	}

}

func (c *Client) writeMessages() {
	defer func() {
		c.manager.removeClient(c)
	}()

	for {
		select {
		//c.egress is a channel of type []byte, which means it can send and receive slices of bytes.
		// It returns a message and a boolean value. The message is the slice of bytes that was sent to the channel.
		// The boolean value is true if the channel is open and false if the channel is closed.
		case message, ok := <-c.egress:
			if !ok {
				if err := c.conneciton.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Println("connection closed: ", err)
				}
				return
			}

			if err := c.conneciton.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Printf("failed to send message : %v", err)
			}

			log.Println("message sent")
		}
	}
}
