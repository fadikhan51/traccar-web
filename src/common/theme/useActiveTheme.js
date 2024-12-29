import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { colorsAtom } from "../../recoil/atoms/colorsAtom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from "/src/firebase_config/firebase";

function useActiveTheme() {
  const setTheme = useSetRecoilState(colorsAtom);

  useEffect(() => {
    const q = query(collection(db, "themes"), where("active", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setTheme(doc.data());
      });
    });

    return () => unsubscribe();
  }, [setTheme]);
}

export default useActiveTheme;
