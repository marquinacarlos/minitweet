//------------------------------------------------------------------- FIREBASE CONFIG
import { db } from '@/services/firebase.service';
//------------------------------------------------------------------- FIREBASE SERVICES
import { collection, addDoc, getDocs, query, where, serverTimestamp, limit, orderBy, onSnapshot } from 'firebase/firestore';
//------------------------------------------------------------------- VARIABLES
const privateChatCollectionRef = collection(db, 'privateChats');
//------------------------------------------------------------------- FUNCIONES
/**
 * Obtiene o crea un documento de chat privado entre dos usuarios.
 * @param {string} senderID 
 * @param {string} receiverID 
 * @returns {Promise<DocumentReference>}
 */
async function getChatDocument(senderID, receiverID) {
	try {
		const q = query(privateChatCollectionRef, where('users', '==', {
			[senderID]: true,
			[receiverID]: true
		}), limit(1));

		const chatSnapshot = await getDocs(q);
		let chatDocument = null;

		if (chatSnapshot.empty) {
			chatDocument = await addDoc(privateChatCollectionRef, {
				users: {
					[senderID]: true,
					[receiverID]: true
				}
			});
		} else {
			chatDocument = chatSnapshot.docs[0];
		}
		return chatDocument;
	} catch (error) {
		console.error('Error obteniendo/creando documento de chat:', error);
		throw error;
	}
}

/**
 * Guarda un mensaje privado en la base de datos.
 * @param {String} senderID ID del usuario que envía el mensaje
 * @param {String} receiverID ID del usuario que recibe el mensaje
 * @param {String} message Mensaje a enviar
 */
export async function savePrivateMessage(senderID, receiverID, message) {
	try {
		const chatDocument = await getChatDocument(senderID, receiverID);
		const messagesRef = collection(db, `privateChats/${chatDocument.id}/messages`);
		await addDoc(messagesRef, {
			userID: senderID,
			message,
			created_at: serverTimestamp()
		});
	} catch (error) {
		console.error('Error guardando mensaje privado:', error);
		throw error;
	}
}

/**
 * Obtiene mensajes privados en tiempo real entre dos usuarios.
 * @param {String} senderID ID del usuario que envía el mensaje
 * @param {String} receiverID ID del usuario que recibe el mensaje
 * @param {Function} callback Función de callback para manejar los mensajes
 * @returns {Function} Función para cancelar la suscripción al listener
 */
export function getUserChats(userUID, callback) {
	const q = query(privateChatCollectionRef, where(`users.${userUID}`, '==', true));
	const unsubscribe = onSnapshot(q, (snapshot) => {
		const chats = snapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data()
		}));
		callback(chats);
	});
	return unsubscribe;
}

export function getPrivateMessages(senderID, receiverID, callback) {
	let unsubscribe = null;

	try {
		getChatDocument(senderID, receiverID).then(chatDocument => {
			const messagesRef = collection(db, `privateChats/${chatDocument.id}/messages`);
			const q = query(messagesRef, orderBy('created_at', 'asc'));

			unsubscribe = onSnapshot(q, (snapshot) => {
				const messages = snapshot.docs.map(doc => ({
					id: doc.id,
					userID: doc.data().userID,
					message: doc.data().message,
					created_at: doc.data().created_at?.toDate()
				}));
				callback(messages);
			});
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	} catch (error) {
		console.error('Error obteniendo mensajes privados:', error);
		throw error;
	}
}