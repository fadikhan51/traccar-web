import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { companyLogoAtom } from "/src/recoil/atoms/companyLogoAtom";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import db from "/src/firebase_config/firebase";

// const DEFAULT_LOGO = "data:image/svg+xml;base64,ICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwMCA4MCI+DQogICAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRBNEE0QSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogICAgPHRleHQgeD0iNTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM0QTRBNEEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxPR088L3RleHQ+DQogICAgPHRleHQgeD0iMTIwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMwIiBmaWxsPSIjNEE0QTRBIiB0ZXh0LWFuY2hvcj0ic3RhcnQiPkNPTVBBTlkgTkFNRTwvdGV4dD4NCiAgPC9zdmc+"; // Replace with your default logo's base64 string

function useCompanyLogo() {
  const setCompanyLogo = useSetRecoilState(companyLogoAtom);

  useEffect(() => {
    // Reference to the Firestore collection for logo chunks
    const logoChunksCollectionRef = collection(db, "settings");
    const q = query(logoChunksCollectionRef, orderBy("chunkNumber", "asc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot) {
        // setCompanyLogo(DEFAULT_LOGO);
        return;
      }

      const chunks = [];

      querySnapshot.forEach((doc) => {
        if (!doc) return;
        
        const data = doc.data();
        if (data?.logoChunk) {
          chunks.push(data.logoChunk); // Collect each chunk
        }
      });

      if (chunks.length > 0) {
        // Combine all chunks into a single Base64 string
        const completeLogo = chunks.join("");
        setCompanyLogo(completeLogo);
      } else {
        // No chunks found, set default logo
        // setCompanyLogo(DEFAULT_LOGO);
      }
    });

    return () => unsubscribe();
  }, [setCompanyLogo]);

  return null;
}

export default useCompanyLogo;