package com.lunatierra.backend.controller;

import com.lunatierra.backend.dto.QuestionRequest;
import com.lunatierra.backend.dto.QuestionResponse;
import com.lunatierra.backend.service.QuestionAnswerService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    private final QuestionAnswerService questionAnswerService;

    public QuestionController(QuestionAnswerService questionAnswerService) {
        this.questionAnswerService = questionAnswerService;
    }

    @PostMapping
    public QuestionResponse ask(@Valid @RequestBody QuestionRequest request,
                                @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        if (!RequestUserContext.hasUserContext(authorizationHeader)) {
            return new QuestionResponse("");
        }
        return new QuestionResponse(questionAnswerService.answer(request.getQuestion()));
    }
}
