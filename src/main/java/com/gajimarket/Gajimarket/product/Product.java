package com.gajimarket.Gajimarket.product;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

// product 모델
@Getter
@Setter
public class Product {

    private Integer productIdx; // 인덱스
    private String category; // 카테고리
    private String title; // 글 제목
    private Integer price; // 상품 가격
    private LocalDateTime createdAt; // 게시글 업로드 시간
    private String location; // 위치
    private Integer chatNum; // 채팅 수
    private Integer heartNum; //하트 수
    private String selling;  // 'sell' or 'get'
    private String image; //이미지
    private Integer sellerIdx; // 판매자 인덱스
    private String sellerName; //판매자 닉네임
    private String status; // 거래 상태
    private Integer buyerIdx; //구매자 인덱스
    private Boolean review; //리뷰 존재 여부
    private String content; // 내용
    

    public Product(int productIdx, String category, String title, int price, LocalDateTime createdAt, String location, int chatNum, int heartNum, String selling, String image, int sellerIdx, String sellerName, String status, Integer buyerIdx, boolean review, String content) {
        this.productIdx = productIdx;
        this.category = category;
        this.title = title;
        this.price = price;
        this.createdAt = createdAt;
        this.location = location;
        this.chatNum = chatNum;
        this.heartNum = heartNum;
        this.selling = selling;
        this.image = image;
        this.sellerIdx = sellerIdx;
        this.sellerName = sellerName;
        this.status = status;
        this.buyerIdx = buyerIdx;
        this.review = review;
        this.content=content;
    }
}