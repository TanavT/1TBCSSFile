//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
export const validationMethods = {
    checkString(str, minLength, maxLength, fieldName = "String") {
        if (typeof str !== 'string') {
            throw `Error: ${fieldName} must be a string!`;
        }
        
        const trimmed = str.trim();
        if (trimmed.length === 0) {
            throw `Error: ${fieldName} cannot be empty or just spaces!`;
        }
        
        if (trimmed.length < minLength) {
            throw `Error: ${fieldName} must be at least ${minLength} characters long!`;
        }
        
        if (trimmed.length > maxLength) {
            throw `Error: ${fieldName} must be no more than ${maxLength} characters long!`;
        }
        
        return trimmed;
    },
    
    checkUsername(username) {
        const trimmed = this.checkString(username, 5, Infinity, "Username");
        
        // No spaces or special characters
        if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
            throw `Error: Username can only contain letters and numbers, no spaces or special characters!`;
        }
        
        // Cannot be just numbers
        if (/^\d+$/.test(trimmed)) {
            throw `Error: Username cannot be only numbers!`;
        }
        
        // Must contain at least one letter
        if (!/[a-zA-Z]/.test(trimmed)) {
            throw `Error: Username must contain at least one letter!`;
        }
        
        return trimmed.toLowerCase(); // Case insensitive
    },

    checkPassword(password) {
        if (typeof password !== 'string') {
            throw `Error: Password must be a string!`;
        }
        
        if (password.length < 8) {
            throw `Error: Password must be at least 8 characters long!`;
        }
        
        if (/\s/.test(password)) {
            throw `Error: Password cannot contain spaces!`;
        }
        
        if (!/(?=.*[a-z])/.test(password)) {
            throw `Error: Password must contain at least one lowercase letter!`;
        }
        
        if (!/(?=.*[A-Z])/.test(password)) {
            throw `Error: Password must contain at least one uppercase letter!`;
        }
        
        if (!/(?=.*\d)/.test(password)) {
            throw `Error: Password must contain at least one number!`;
        }
        
        if (!/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
            throw `Error: Password must contain at least one special character!`;
        }
        
        return password;
    }
}