package com.credpay.userservice.controller;

import com.credpay.userservice.dto.AddCardRequest;
import com.credpay.userservice.dto.CardResponse;
import com.credpay.userservice.dto.MessageResponse;
import com.credpay.userservice.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/add")
    public ResponseEntity<MessageResponse> addCard(@Valid @RequestBody AddCardRequest request) {
        cardService.addCard(request);
        return ResponseEntity.ok(new MessageResponse("Card added successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardResponse>> getCardsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(cardService.getCardsByUser(userId));
    }
}
