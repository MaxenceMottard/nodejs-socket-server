import * as React from 'react/index'
import styled from 'styled-components'
import moment from 'moment/moment'
import 'moment/locale/fr'

class ConversationItem extends React.Component {
    constructor (props) {
        super(props)
    }

    render () {
        const messageTime = moment(this.props.conversation.lastMessage.timestamp).format('LT')

        return (
            <Conversation data-uuid={this.props.conversation.uuid} onClick={this.handleClick}>
                <h2 className="uuid">{this.props.conversation.uuid}</h2>
                <div className="lastMessage">
                    <p className="lastMessage__content">{this.props.conversation.lastMessage.message}</p>
                    <time className="lastMessage__time">{messageTime}</time>
                </div>
            </Conversation>
        )
    }

    handleClick = () => {
        this.props.setCurrentConversation(this.props.conversation.uuid)
    }
}

const Conversation = styled.li`
  display: block;
  margin: 0;
  padding: 25px 18px;
  position: relative;
  transition: background-color 0.5s;
  cursor: pointer;
  
  &:hover,
  &.current {
    background-color: rgba(245, 245, 245, 1);
  }
  
  &::after {
    content: '';
    display: block;
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 95%;
    transform: translateX(-50%);
    background-color: #F5F5F5;
    height: 1px;
  }
  
  .uuid {
    font-size: 15px;
    color: #2d2d2d;
    margin: 0;
  }
  
  .lastMessage {
    display: flex;
    align-items: center;
    margin-top: 8px;
    color: rgba(153, 153, 153, 1);
    
    &__content {
      width: 100%;
      margin: 0;
      font-size: 14px;
      font-weight: 300;
      //text-overflow: ellipsis;
      //word-break: break-all;
      max-height: 48px;
      overflow: hidden;
    }
    
    &__time {
      margin-left: 10px;
      font-size: 12px;
      width: 60px;
      text-align: right;
      font-weight: 300;
      padding-right: 15px;
    }
  }
`

export {ConversationItem}
