import { db } from '@/services/firebase.service';
import { collection, addDoc, getDocs, query, where, serverTimestamp, limit, orderBy, onSnapshot } from 'firebase/firestore';

const privateChatCollectionRef = collection(db, 'privateChats');

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
		console.error('Error getting/creating chat document:', error);
		throw error;
	}
}

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
		console.error('Error saving private message:', error);
		throw error;
	}
}

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
		console.error('Error getting private messages:', error);
		throw error;
	}
}
