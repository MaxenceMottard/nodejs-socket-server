import * as React from 'react/index'
import {Conversations} from './Conversations'
import {Messages} from './Messages'
import io from 'socket.io-client'

class App extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            conversationId: null,
            socket: io.connect('https://node-js-ynov.herokuapp.com/')
        }

        this.state.socket.emit('admin')
    }

    render () {
        return (
            <>
                <Conversations setCurrentConversation={this.setCurrentConversation} socket={this.state.socket}/>
                <Messages uuid={this.state.conversationId} socket={this.state.socket}/>
            </>
        )
    }

    setCurrentConversation = (uuid) => {
        this.setState({ conversationId: uuid })

        document.querySelectorAll('.conversations li').forEach(element => {
            element.classList.remove('current')
        })
        const currentItem = document.querySelector(`[data-uuid="${uuid}"]`)
        currentItem.classList.add('current')
    }
}

export {App}
