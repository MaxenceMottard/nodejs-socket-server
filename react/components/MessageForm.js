import * as React from 'react/index'
import styled from 'styled-components'

class MessageForm extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            form: null,
            messageValue: ''
        }
    }

    render () {
        return (
            <MessageFormElement className="inputSend" onSubmit={this.handleSubmitForm}>
                <textarea name="message" placeholder="Ecrivez votre message .." value={this.state.messageValue} onChange={this.handleChangeTextareaValue}/>
                <button id="sendMessage" />
            </MessageFormElement>
        )
    }

    componentDidMount () {
        this.setState({
            form: document.querySelector('.inputSend'),
        })
    }

    componentDidUpdate (prevProps, prevState, snapshot) {
        if (!prevState.form && !!this.state.form) {
            this.state.form.addEventListener('keypress', (e) => {
                if (e.code === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    this.sendMessage()
                }
            })
        }
    }

    handleChangeTextareaValue = (e) => {
        this.setState({
            messageValue: e.target.value
        })
    }

    handleSubmitForm = (e) => {
        e.preventDefault()
        this.sendMessage()
    }

    sendMessage = () => {
        if (!this.state.messageValue) {
            return
        }
        const message = String(this.state.messageValue)
        this.setState({
            messageValue: ''
        })

        const newMessage = {
            message,
            isAdmin: true,
            timestamp: Date.now(),
            conversationId: this.props.uuid
        }

        this.props.socket.emit('admin-message', newMessage)

        this.props.newMessage(newMessage)
    }
}

const MessageFormElement = styled.form`
  background-color: white;
  height: 50px;
  margin: 0;
  box-shadow: rgba(0, 0, 0, 0.1) 2px 0px 4px 0;
  padding: 13px 8px;
  display: flex;
  
  textarea {
    border: none;
    resize: none;
    height: 100%;
    font-family: 'Roboto', sans-serif;
    width: 100%;
    margin-left: 15px;
    font-weight: 300;
    font-size: 15px;
    
    &:focus {
      outline: none;
    }
  }
  
  button {
    width: 50px;
    border: none;
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 25px 25px;
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZWYwMDc4IiBkPSJNMi4wMSAyMUwyMyAxMiAyLjAxIDMgMiAxMGwxNSAyLTE1IDJ6Ii8+PC9zdmc+);
    
    &:focus {
      outline: none;
    }
  }
`

export {MessageForm}
