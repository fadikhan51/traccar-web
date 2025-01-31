import { atom } from "recoil";

export const companyLogoAtom = atom({
  key: "logoState", // Unique key
  default: "data:image/svg+xml;base64,ICA8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjQwMCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDQwMCA4MCI+DQogICAgPGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMzQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzRBNEE0QSIgc3Ryb2tlLXdpZHRoPSIyIi8+DQogICAgPHRleHQgeD0iNTAiIHk9IjQwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM0QTRBNEEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkxPR088L3RleHQ+DQogICAgPHRleHQgeD0iMTIwIiB5PSI0NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjMwIiBmaWxsPSIjNEE0QTRBIiB0ZXh0LWFuY2hvcj0ic3RhcnQiPkNPTVBBTlkgTkFNRTwvdGV4dD4NCiAgPC9zdmc+", // (base64 string or URL for default logo)
});
