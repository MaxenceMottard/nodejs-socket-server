import * as React from 'react/index'
import styled from 'styled-components'
import {MessageItem} from './MessageItem'
import {MessageForm} from './MessageForm'

class Messages extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            messages: []
        }

        this.props.socket.on('client-message', message => {
            if (this.props.uuid === message.conversationId) {
                this.newMessage(message)
            }
        })
    }

    render () {
        return (
            <MessagesSection className="messages">
                <MessageList className="messageList">
                    {this.state.messages.map( (message, key) => (
                        <MessageItem key={key} message={message} />
                    ))}
                </MessageList>
                <MessageForm uuid={this.props.uuid} newMessage={this.newMessage} socket={this.props.socket}/>
            </MessagesSection>
        )
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        const messageListElement = document.querySelector('.messageList')
        messageListElement.scrollTop = messageListElement.scrollHeight
    }

    componentWillUpdate (nextProps, nextState, nextContext) {
        if (nextProps.uuid && nextProps.uuid !== this.props.uuid) {
            this.requestMessages(nextProps.uuid)
        }
    }

    requestMessages = (uuid) => {
        fetch(`http://localhost:8000/conversation/${uuid}/messages`, {method: 'GET'})
            .then(result => result.json())
            .then((messages) => {
                this.setState({ messages })
            })
    }

    newMessage = (message) => {
        const messages = this.state.messages
        messages.push(message)

        this.setState({ messages })
    }
}

const MessageList = styled.ul`
 margin: 0;
 overflow-y: scroll;
 padding: 40px 30px;
 display: flex;
 flex-direction: column;
 height: 100%;
 
 li {
  margin: 4px 0;
 }
 
  li.admin + li:not(.admin),
  li:not(.admin) + li.admin{
    margin-top: 25px;
  }
`

const MessagesSection = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
`

export {Messages}
