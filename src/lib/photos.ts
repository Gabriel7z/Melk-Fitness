export type PhotoSlot = "frente" | "lado";

const DB_NAME = "melk";
const STORE = "month-photos";

const listeners = new Set<() => void>();
let revision = 0;

function emit() {
  revision += 1;
  listeners.forEach((listener) => listener());
}

export function subscribePhotos(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getPhotoRevision() {
  return revision;
}

function photoKey(month: string, slot: PhotoSlot) {
  return `${month}:${slot}`;
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function run<T>(
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore, done: (value: T) => void, fail: (error: unknown) => void) => void,
) {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(STORE, mode);
        const store = tx.objectStore(STORE);
        let value: T;
        let failed = false;
        action(
          store,
          (next) => {
            value = next;
          },
          (error) => {
            failed = true;
            reject(error);
          },
        );
        tx.oncomplete = () => {
          db.close();
          if (!failed) resolve(value);
        };
        tx.onerror = () => {
          db.close();
          reject(tx.error);
        };
      }),
  );
}

export async function shrinkPhoto(file: Blob) {
  const bitmap = await createImageBitmap(file);
  const longest = Math.max(bitmap.width, bitmap.height);
  const scale = longest > 960 ? 960 / longest : 1;
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    bitmap.close();
    throw new Error("canvas");
  }
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/jpeg", 0.72);
  });
  if (!blob) throw new Error("jpeg");
  return blob;
}

export async function saveMonthPhoto(month: string, slot: PhotoSlot, file: Blob) {
  const blob = await shrinkPhoto(file);
  await run<void>("readwrite", (store, done, fail) => {
    const request = store.put(blob, photoKey(month, slot));
    request.onsuccess = () => done(undefined);
    request.onerror = () => fail(request.error);
  });
  emit();
}

export async function deleteMonthPhoto(month: string, slot: PhotoSlot) {
  await run<void>("readwrite", (store, done, fail) => {
    const request = store.delete(photoKey(month, slot));
    request.onsuccess = () => done(undefined);
    request.onerror = () => fail(request.error);
  });
  emit();
}

export async function readMonthPhoto(month: string, slot: PhotoSlot) {
  if (!month) return null;
  return run<Blob | null>("readonly", (store, done, fail) => {
    const request = store.get(photoKey(month, slot));
    request.onsuccess = () => {
      const result = request.result;
      done(result instanceof Blob ? result : null);
    };
    request.onerror = () => fail(request.error);
  });
}

export async function clearMonthPhotos() {
  await run<void>("readwrite", (store, done, fail) => {
    const request = store.clear();
    request.onsuccess = () => done(undefined);
    request.onerror = () => fail(request.error);
  });
  emit();
}
