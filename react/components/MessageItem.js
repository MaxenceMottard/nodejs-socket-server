import * as React from 'react/index'
import styled from 'styled-components'

class MessageItem extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        return (
            <MessageItemElement className={this.props.message.isAdmin ? 'admin messageList__item' : 'messageList__item'}>
                <p>{this.props.message.message}</p>
            </MessageItemElement>
        )
    }
}

const MessageItemElement = styled.li`
  display: block;
  max-width: 200px;
  padding: 6px 12px;
  border-radius: 8px;
  align-self: flex-start;
  background-color: #f1f0f0;
  color: black;
  font-weight: 300;
  word-break: break-all;
  
  &:first-of-type {
    margin-top: auto;
  }
  
  &.admin {
    align-self: flex-end;
    color: white;
    background-color: #ef0078;
  }
  
  p {
    margin: 0;
  }
`

export {MessageItem}
