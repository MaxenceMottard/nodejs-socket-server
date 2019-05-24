import * as React from 'react/index'
import styled from 'styled-components'
import {ConversationItem} from './ConversationItem'

class Conversations extends React.Component {

    constructor (props) {
        super(props)

        this.state = {
            conversations: []
        }

        this.requestConversations()

        this.props.socket.on('client-message', message => {
            const conversations = this.state.conversations

            conversations.forEach((conversation, key) => {
                if (conversation.uuid === message.conversationId) {
                    conversations[key].lastMessage = message
                }
            })

            this.setState({conversations})
        })

        this.props.socket.on('client-connection', conversation => {
            this.newConversation(conversation)
        })
    }

    render () {
        return (
            <Conversation className='conversations'>
                {this.state.conversations.map((conversation, key) => {

                    if (conversation.lastMessage.timestamp === 0) {
                        return <React.Fragment key={key}/>
                    }

                    return (
                        <ConversationItem key={key} conversation={conversation}
                                          setCurrentConversation={this.props.setCurrentConversation}/>
                    )
                })}
            </Conversation>
        )
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (this.state.conversations.length > 0 && prevState.conversations.length === 0) {
            this.props.setCurrentConversation(this.state.conversations[0].uuid)
        }
    }

    componentWillUpdate (nextProps, nextState, nextContext) {
        this.sortArray(nextState.conversations)
    }

    newConversation = (conversation) => {
        const conversations = this.state.conversations
        conversations.push(conversation)

        this.setState({ conversations })
    }

    requestConversations = async () => {
        fetch('http://localhost:8000/conversations', {method: 'GET'})
            .then(result => result.json())
            .then((conversations) => {
                conversations = conversations.filter(el => el != null && !!el.lastMessage)
                this.sortArray(conversations)

                this.setState({conversations})
            })
    }

    sortArray = (array) => {
        array.sort((a, b) => {
            if (a.lastMessage.timestamp > b.lastMessage.timestamp) {
                return -1
            }
            if (a.lastMessage.timestamp < b.lastMessage.timestamp) {
                return 1
            }
            return 0
        })
    }
}

const Conversation = styled.ul`
  margin: 0;
  overflow-y: scroll;
  padding: 0;
  box-shadow: rgba(0, 0, 0, 0.1) 2px 0px 4px 0px;
  height: 100vh;
`

export {Conversations}
