// IndexedDB storage utilities

const DB_NAME = "LearningAssistantDB";
const DB_VERSION = 1;
const STORE_QUESTIONS = "questions";
const STORE_REVIEWS = "reviews";
const STORE_STATS = "stats";

export interface Question {
  id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  nextReview: string;
  interval: number;
  easeFactor: number;
  sourceText?: string;
}

export interface ReviewLog {
  id: string;
  questionId: string;
  quality: number;
  reviewedAt: string;
  timeTaken: number;
}

class StorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create questions store
        if (!db.objectStoreNames.contains(STORE_QUESTIONS)) {
          const questionStore = db.createObjectStore(STORE_QUESTIONS, {
            keyPath: "id",
          });
          questionStore.createIndex("nextReview", "nextReview", { unique: false });
          questionStore.createIndex("createdAt", "createdAt", { unique: false });
        }

        // Create reviews store
        if (!db.objectStoreNames.contains(STORE_REVIEWS)) {
          const reviewStore = db.createObjectStore(STORE_REVIEWS, {
            keyPath: "id",
          });
          reviewStore.createIndex("questionId", "questionId", {
            unique: false,
          });
        }

        // Create stats store
        if (!db.objectStoreNames.contains(STORE_STATS)) {
          db.createObjectStore(STORE_STATS, { keyPath: "date" });
        }
      };
    });
  }

  async addQuestion(question: Question): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_QUESTIONS], "readwrite");
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.add(question);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getDueQuestions(): Promise<Question[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_QUESTIONS], "readonly");
      const store = transaction.objectStore(STORE_QUESTIONS);
      const index = store.index("nextReview");
      const request = index.openCursor(IDBKeyRange.upperBound(new Date().toISOString()));

      const results: Question[] = [];

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  async updateQuestion(question: Question): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_QUESTIONS], "readwrite");
      const store = transaction.objectStore(STORE_QUESTIONS);
      const request = store.put(question);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async addReviewLog(log: ReviewLog): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_REVIEWS], "readwrite");
      const store = transaction.objectStore(STORE_REVIEWS);
      const request = store.add(log);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getReviewLogs(questionId: string): Promise<ReviewLog[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([STORE_REVIEWS], "readonly");
      const store = transaction.objectStore(STORE_REVIEWS);
      const index = store.index("questionId");
      const request = index.getAll(questionId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export default new StorageManager();
