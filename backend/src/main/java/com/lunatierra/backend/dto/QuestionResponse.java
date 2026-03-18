package com.lunatierra.backend.dto;

public class QuestionResponse {

    private final String answer;

    public QuestionResponse(String answer) {
        this.answer = answer;
    }

    public String getAnswer() {
        return answer;
    }
}
