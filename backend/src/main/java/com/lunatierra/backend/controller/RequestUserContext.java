package com.lunatierra.backend.controller;

final class RequestUserContext {

    private RequestUserContext() {
    }

    static boolean hasUserContext(String authorizationHeader) {
        return authorizationHeader != null && !authorizationHeader.isBlank();
    }
}
