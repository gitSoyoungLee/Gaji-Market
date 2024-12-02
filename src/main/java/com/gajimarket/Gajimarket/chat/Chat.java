package com.gajimarket.Gajimarket.chat;

import java.time.LocalDateTime;

public class Chat {
    private int chatId;            // 채팅 ID (Primary Key)
    private int senderId;          // 발신자 ID
    private int recipientId;       // 수신자 ID
    private String messageContent; // 채팅 메시지 내용
    private LocalDateTime sentAt;  // 메시지 전송 시간
    private int relatedProductId;  // 관련 상품 ID

    // Getters and Setters
    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(int recipientId) {
        this.recipientId = recipientId;
    }

    public String getMessageContent() {
        return messageContent;
    }

    public void setMessageContent(String messageContent) {
        this.messageContent = messageContent;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public int getRelatedProductId() {
        return relatedProductId;
    }

    public void setRelatedProductId(int relatedProductId) {
        this.relatedProductId = relatedProductId;
    }

    @Override
    public String toString() {
        return "Chat{" +
                "chatId=" + chatId +
                ", senderId=" + senderId +
                ", recipientId=" + recipientId +
                ", messageContent='" + messageContent + '\'' +
                ", sentAt=" + sentAt +
                ", relatedProductId=" + relatedProductId +
                '}';
    }
}