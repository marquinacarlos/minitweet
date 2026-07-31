const ERROR_MESSAGES = Object.freeze({
  'auth/email-already-in-use': 'Este correo ya esta registrado.',
  'auth/invalid-email': 'El correo no es valido.',
  'auth/weak-password': 'La contrasena debe tener al menos 6 caracteres.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'La contrasena es incorrecta.',
  'auth/invalid-credential': 'Las credenciales son incorrectas.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta mas tarde.',
  'auth/configuration-not-found': 'Error de configuracion del servicio de autenticacion.',
  'profile/not-found': 'No se encontro el perfil del usuario.',
})

export function getFirebaseErrorMessage(errorCode) {
  return ERROR_MESSAGES[errorCode] ?? 'Ocurrio un error inesperado. Intenta de nuevo.'
}
