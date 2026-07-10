package com.credpay.userservice.service;

import com.credpay.userservice.dto.AddCardRequest;
import com.credpay.userservice.dto.CardResponse;
import com.credpay.userservice.entity.Card;
import com.credpay.userservice.exception.InvalidCardException;
import com.credpay.userservice.exception.UserNotFoundException;
import com.credpay.userservice.repository.CardRepository;
import com.credpay.userservice.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final CardRepository cardRepository;
    private final UserRepository userRepository;

    /**
     * Adds a card for an existing user. Only the masked card number is stored.
     *
     * @throws UserNotFoundException if userId does not exist
     * @throws InvalidCardException  if expiry year is in the past
     */
    @Transactional
    public void addCard(AddCardRequest request) {
        // 1. User must exist
        if (!userRepository.existsById(request.getUserId())) {
            throw new UserNotFoundException("User not found with id: " + request.getUserId());
        }

        // 2. Expiry year must be >= current year
        int currentYear = Year.now().getValue();
        if (request.getExpiryYear() < currentYear) {
            throw new InvalidCardException("expiryYear must be greater than or equal to " + currentYear);
        }

        // 3. Store ONLY the masked card number
        Card card = Card.builder()
                .userId(request.getUserId())
                .cardHolder(request.getCardHolder())
                .cardNumber(maskCardNumber(request.getCardNumber()))
                .cardNetwork(request.getCardNetwork())
                .expiryMonth(request.getExpiryMonth().shortValue())
                .expiryYear(request.getExpiryYear().shortValue())
                .build();

        cardRepository.save(card);
    }

    /** Lists all cards belonging to a user (masked). */
    @Transactional(readOnly = true)
    public List<CardResponse> getCardsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }
        return cardRepository.findByUserId(userId).stream()
                .map(CardResponse::fromEntity)
                .toList();
    }

    /**
     * Masks all but the last four digits, e.g.
     * "1234567812345678" -> "**** **** **** 5678".
     */
    private String maskCardNumber(String cardNumber) {
        String lastFour = cardNumber.substring(cardNumber.length() - 4);
        return "**** **** **** " + lastFour;
    }
}
