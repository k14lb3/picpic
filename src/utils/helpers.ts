import {
  User as AuthUser,
  deleteUser,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  Timestamp,
  serverTimestamp,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  serverTimestampDoc,
  usersCol,
  usersUnverifiedCol,
  userUnverifiedDoc,
} from '@/firebase/refs';
import { User, UserUnverified } from '@/recoil/atoms';
import { auth } from '@/firebase/config';

export const getServerTimestamp = async (): Promise<Timestamp> => {
  await setDoc(serverTimestampDoc, {
    timestamp: serverTimestamp(),
  });

  const { timestamp } = (await getDoc(serverTimestampDoc)).data() as {
    timestamp: Timestamp;
  };

  return timestamp;
};

export const getUsers = async (): Promise<User[]> => {
  const usersDocs = (await getDocs(usersCol)).docs;

  const users = usersDocs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as User[];

  return users;
};

export const getUser = async (username: string): Promise<User | undefined> => {
  const users = await getUsers();

  const user = users.filter((user) => user.username === username)[0];

  return user;
};

export const getUsersUnverified = async (): Promise<UserUnverified[]> => {
  const usersUnverifiedDocs = (await getDocs(usersUnverifiedCol)).docs;
  const usersUnverified = usersUnverifiedDocs.map((doc) => ({
    uid: doc.id,
    ...doc.data(),
  })) as UserUnverified[];

  return usersUnverified;
};

export const getEmailFromUsername = async (
  username: string
): Promise<string> => {
  const usersDocs = (await getDocs(usersCol)).docs;
  const users = usersDocs.map((doc) => doc.data());
  const email = users.filter((data) => data.username === username)[0]?.email;

  if (email === undefined) {
    const usersUnverifiedDocs = (await getDocs(usersUnverifiedCol)).docs;
    const _users = usersUnverifiedDocs.map((doc) => doc.data());
    const _email = _users.filter((data) => data.username === username)[0]
      ?.email;

    if (_email) return _email;

    throw new Error('Firebase: Error (auth/user-not-found).');
  }

  return email;
};

export const deleteUnverifiedUsers = async (): Promise<void> => {
  const currentTimestamp = await getServerTimestamp();

  const usersUnverified = await getUsersUnverified();

  usersUnverified.forEach(
    async ({ uid, email, password, timestamp: userTimestamp }) => {
      const currentDate = new Date(currentTimestamp.toDate());
      const userDate = new Date(userTimestamp!.toDate());

      const duration: number =
        (currentDate.getTime() - userDate.getTime()) / 1000 / 60;

      if (duration > 1) {
        const currentUser = auth.currentUser as AuthUser;

        await signInWithEmailAndPassword(
          auth,
          email as string,
          password as string
        );

        await deleteUser(currentUser);
        await deleteDoc(userUnverifiedDoc(uid));
      }
    }
  );
};

export const resizeImage = (
  imgFile: any,
  width: number = 150,
  height: number = 150
): Promise<any> =>
  new Promise((resolve, reject) => {
    if (!imgFile) return;

    if (!isValidImageFile(imgFile.name)) return;

    const reader = new FileReader();

    const img = document.createElement('img');
    const canvas = document.createElement('canvas');

    canvas.width = width;
    canvas.height = height;

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };

    img.onload = () => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

      ctx.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL(imgFile.type));
    };

    reader.readAsDataURL(imgFile);
  });

// https://www.simplilearn.com/tutorials/javascript-tutorial/email-validation-in-javascript

export const isValidEmail = (email: string): boolean =>
  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

export const isValidUsername = (username: string): boolean =>
  /^[a-zA-Z0-9\_\.]+$/.test(username);

export const isValidImageFile = (filename: string): boolean =>
  /.*\.(jpg|jpeg|png)/i.test(filename);
