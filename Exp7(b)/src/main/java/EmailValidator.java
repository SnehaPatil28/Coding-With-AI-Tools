public class EmailValidator {

    /**
     * Checks whether an email has a basic valid format.
     *
     * @param email email address to validate
     * @return true if valid, otherwise false
     */
    public static boolean isValidEmail(String email) {

        if (email == null || email.trim().isEmpty()) {
            return false;
        }

        String regex = "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$";

        return email.matches(regex);
    }
}