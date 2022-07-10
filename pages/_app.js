import '../styles/globals.css'
import {auth, db} from "../firebase";
import LoginPage from "./login";
import {useAuthState} from "react-firebase-hooks/auth";
import {Loading} from "./loading";
import {useEffect} from "react";

import {doc, serverTimestamp, collection, addDoc, setDoc} from "firebase/firestore"

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth)

  useEffect(() => {
    const addUser = async () => {
      if (user) {
        // set doc with user ID..
        await setDoc(doc(db, 'users', user.uid), {
          email: user.email,
          lastSeen: serverTimestamp(),
          photoURL: user.photoURL,
        })
      }
    }
     addUser()
  }, [user])

  if (loading) return <Loading />
  if (!user) return <LoginPage />

  return <Component {...pageProps} />
}

export default MyApp
