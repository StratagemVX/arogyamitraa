import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore';
import { firestore } from '@/integrations/firebase/client';
import type { Message } from '@/types/conversation';
import type { Language } from '@/components/LanguageSelector';

const COLLECTION_NAME = 'conversation_messages';
const HISTORY_LIMIT = 50;

interface PersistedMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  text: string;
  language: Language;
  createdAt?: { toDate: () => Date } | null;
  clientTimestamp?: string | null;
}

const getSafeUserId = (userId?: string) => (userId ? userId.trim() : '');

export function useConversationHistory(userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const safeUserId = getSafeUserId(userId);

  useEffect(() => {
    if (!safeUserId) {
      setIsLoaded(true);
      return;
    }

    const loadHistory = async () => {
      try {
        const messagesRef = collection(firestore, COLLECTION_NAME);
        const historyQuery = query(
          messagesRef,
          where('userId', '==', safeUserId),
          orderBy('createdAt', 'asc'),
          limit(HISTORY_LIMIT)
        );

        const snapshot = await getDocs(historyQuery);
        const loaded = snapshot.docs.map((doc) => {
          const data = doc.data() as PersistedMessage;
          const fallbackDate = data.clientTimestamp ? new Date(data.clientTimestamp) : new Date();
          const timestamp = data.createdAt?.toDate?.() ?? fallbackDate;

          return {
            id: doc.id,
            type: data.role,
            text: data.text,
            timestamp,
          } satisfies Message;
        });

        setMessages(loaded);
      } catch (error) {
        console.error('Failed to load conversation history:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadHistory();
  }, [safeUserId]);

  const appendMessage = useCallback(
    async (message: Message, language: Language) => {
      setMessages((prev) => [...prev, message]);

      if (!safeUserId) {
        return;
      }

      try {
        const messagesRef = collection(firestore, COLLECTION_NAME);
        await addDoc(messagesRef, {
          userId: safeUserId,
          role: message.type,
          text: message.text,
          language,
          createdAt: serverTimestamp(),
          clientTimestamp: message.timestamp.toISOString(),
        });
      } catch (error) {
        console.error('Failed to persist conversation message:', error);
      }
    },
    [safeUserId]
  );

  return { messages, setMessages, appendMessage, isLoaded };
}
