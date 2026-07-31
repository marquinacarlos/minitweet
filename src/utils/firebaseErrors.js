const ERROR_MESSAGES = Object.freeze({
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-email': 'The email is not valid.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'The password is incorrect.',
  'auth/invalid-credential': 'Invalid credentials.',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/configuration-not-found': 'Authentication service configuration error.',
  'profile/not-found': 'User profile not found.',
})

export function getFirebaseErrorMessage(errorCode) {
  return ERROR_MESSAGES[errorCode] ?? 'An unexpected error occurred. Please try again.'
}
