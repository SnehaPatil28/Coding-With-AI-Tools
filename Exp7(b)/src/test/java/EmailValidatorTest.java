package test.java;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailValidatorTest {

    // Normal test cases
    @Test
    void shouldAcceptValidEmail() {
        assertTrue(
            EmailValidator.isValidEmail("student@example.com")
        );
    }

    @Test
    void shouldAcceptEmailWithSubdomain() {
        assertTrue(
            EmailValidator.isValidEmail("user@mail.example.com")
        );
    }

    // Boundary test cases
    @Test
    void shouldRejectEmptyEmail() {
        assertFalse(EmailValidator.isValidEmail(""));
    }

    @Test
    void shouldRejectWhitespaceOnlyEmail() {
        assertFalse(EmailValidator.isValidEmail("   "));
    }

    // Invalid input test cases
    @Test
    void shouldRejectEmailWithoutAtSymbol() {
        assertFalse(
            EmailValidator.isValidEmail("studentexample.com")
        );
    }

    @Test
    void shouldRejectEmailWithoutDomainExtension() {
        assertFalse(
            EmailValidator.isValidEmail("student@example")
        );
    }

    @Test
    void shouldRejectEmailContainingSpaces() {
        assertFalse(
            EmailValidator.isValidEmail("student @example.com")
        );
    }

    @Test
    void shouldRejectNullEmail() {
        assertFalse(EmailValidator.isValidEmail(null));
    }

    @Test
    void shouldRejectEmailWithInvalidFormat() {
        assertFalse(EmailValidator.isValidEmail("@example.com"));
    }
}
