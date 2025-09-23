import React from 'react';
import { TagHighlighter } from '../modules/TagHighlighter';
import { TrainingData } from '../types';

interface ConversationListProps {
  conversations: TrainingData;
  indices: number[];
  tagHighlighter: TagHighlighter;
}

interface ConversationItemProps {
  conversation: any;
  index: number;
  tagHighlighter: TagHighlighter;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  index,
  tagHighlighter
}) => {
  const highlightContent = (content: string) => {
    return tagHighlighter.highlightTags(content);
  };

  return (
    <div className="conversation">
      <div className="conversation-header">
        <h3>Conversation {index + 1}</h3>
        {conversation.language && (
          <span className="conversation-language">{conversation.language}</span>
        )}
      </div>
      
      <div className="messages">
        {conversation.messages?.map((message: any, messageIndex: number) => {
          return (
            <div key={messageIndex} className={`message ${message.role}`}>
              <div className="message-header">
                <span className="message-role">{message.role}</span>
              </div>
              
              <div 
                className="message-content preserve-whitespace"
                dangerouslySetInnerHTML={{
                  __html: highlightContent(message.content)
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  indices,
  tagHighlighter
}) => {
  if (conversations.length === 0) {
    return <div className="no-conversations">No conversations to display</div>;
  }

  return (
    <div className="messages-container">
      {conversations.map((conversation, index) => (
        <ConversationItem
          key={indices[index]}
          conversation={conversation}
          index={indices[index]}
          tagHighlighter={tagHighlighter}
        />
      ))}
    </div>
  );
};

export default ConversationList;
