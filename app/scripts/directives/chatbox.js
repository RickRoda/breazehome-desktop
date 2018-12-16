'use strict';

/**
 * @ngdoc service
 * @name breazehomeDesktop.Chatbox
 * @description
 * # Directive to show a chat box
 */

angular.module('breazehomeDesktop').directive('chatbox', (Chat, $timeout) => {
  return {
    restrict: 'E',
    scope: {
      user: '=user',
      messages: '=messages',
      channel: '=channel'
    },
    link: (scope, element, attrs) => {
      scope.message = ""
      scope.image = null
      scope.pagination = Chat.getPagination()
      scope.isActive = false
      scope.toggleChatBox = () => {
        scope.isActive = !scope.isActive
        if (scope.isActive) {
          let el = element.find(".messages-container")
          setTimeout(() => { el[0].scrollTop = el[0].scrollHeight })
        }
      }
      scope.channel.on("message_created", (message) => {
        $timeout(() => {
          scope.messages.push(message)
          let el = element.find(".messages-container")
          if (el[0].scrollHeight - el.scrollTop() < el[0].clientHeight + 200) {
            setTimeout(() => { el[0].scrollTop = el[0].scrollHeight })
          }
        })
      })
      scope.newMessage = () => {
        if (scope.message || scope.image) {
          Chat.createMessage({ text: scope.message }, scope.image)
          scope.pagination = Chat.getPagination()
          scope.message = ""
          scope.image = null
        }
      }
      element.bind("wheel", () => {
        if (!scope.pagination) { scope.pagination = Chat.getPagination() }
        if (scope.pagination.total_pages > scope.pagination.page_number &&
          element.find(".messages-container").scrollTop() < 20)
        {
          Chat.loadOlderMessages({last_seen_id: scope.messages[0].id})
            .then((data) => {
              $timeout(() => {
                scope.messages = data.messages
                scope.pagination = data.pagination
              })
            })
        }
      })
    },
    templateUrl: "views/chatbox.html"
  }
})