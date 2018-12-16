'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Chat
 * @description
 * # Service to communicate with the chat backend
 */

angular.module('breazehomeDesktop').factory('Chat', (CHAT_HOST, $rootScope, $http, Users) => {
  return {
    getSocket: () => { return this.socket },
    getChannel: () => { return this.channel },
    getMessages: () => { return this.messages },
    getPagination: () => { return this.pagination },
    pushMessage: (message) => { this.messages.push(message) },
    connectToSocket: () => {
      return Users.get().then((res) => {
        this.socket = new Phoenix.Socket(`${CHAT_HOST}socket`, {
          params: { user_id: res.id },
          // logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
        })
        this.socket.connect()
      })
    },
    connectToChannel: (channel) => {
      if (!this.socket) { return false }
      this.channel = this.socket.channel(channel)
      return new Promise((res, rej) => {
        this.channel.join()
          .receive('ok', (response) => {
            this.pagination = response.pagination
            this.messages = response.messages.reverse()
            res(this.channel)
          })
          .receive('error', rej)
      })
    },
    createMessage: (data, image=null) => {
      if (image) {
        // let payload = {...data, image: true}
        let payload = Object.assign({image: true}, data)
        let reader = new FileReader()
        return new Promise((res, rej) => {
          reader.onloadend = res
          reader.readAsDataURL(image)
        }).then((data) => {
          const extension = image.name.split(".").pop()
          payload.image_extension = extension
          payload.image_data = {
            base64: data.target.result.split(",")[1],
            extension
          }
          return new Promise((res, rej) => {
            this.channel.push("new_message", payload)
              .receive("ok", res)
              .receive("error", rej)
          })
        })
      }
      return new Promise((res, rej) => {
        this.channel.push("new_message", data)
          .receive("ok", res)
          .receive("error", rej)
      })
    },
    loadOlderMessages: (params) => {
      return new Promise((res, rej) => {
        return $http({
          method: 'GET',
          url: `${CHAT_HOST.replace("ws", "http")}api/messages`,
          headers :   { 'Content-Type': 'application/json' },
          params
        }).then((response) => {
          this.messages = response.data.data.reverse().concat(this.messages)
          this.pagination = response.data.pagination
          res({messages: this.messages, pagination: this.pagination})
        }, rej)
      })
    }
  }
});