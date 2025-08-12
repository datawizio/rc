export interface IUser {
  full_name: string;
  email: string;
  photo: string;
  user_id?: number;
}

export interface IClient {
  id: number;
  name: string;
}

declare global {
  interface Window {
    $crisp: any;
    CRISP_RUNTIME_CONFIG: {
      locale: string;
      [key: string]: any;
    };
    CRISP_TOKEN_ID?: string | number;
    CRISP_WEBSITE_ID: string;
    CONFIG: Record<string, any>;
  }
}

export const initChat = ({
  user,
  lang,
  client,
  clients
}: {
  user: IUser;
  lang: string;
  client?: string;
  clients?: IClient[];
}) => {
  if (window.$crisp) {
    window.$crisp.push(["set", "user:email", user.email]);
    window.$crisp.push(["set", "user:nickname", user.full_name]);
    window.$crisp.push(["set", "user:avatar", user.photo]);
    window.$crisp.push(["safe", true]);

    if (client) {
      window.$crisp.push(["set", "session:data", [[["Client", client]]]]);
    }

    if (clients) {
      window.$crisp.push([
        "set",
        "session:data",
        [[["Clients", clients.map(client => client.name).join(", ")]]]
      ]);
    }
  }

  window.CRISP_RUNTIME_CONFIG = {
    locale: lang
  };
  window.CRISP_TOKEN_ID = user.user_id;
  window.CRISP_WEBSITE_ID = window.CONFIG.crispWebsiteId;

  (function () {
    const d = document;
    const s = d.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    d.getElementsByTagName("head")[0].appendChild(s);
  })();
};

export const resetChat = () => {
  window.CRISP_TOKEN_ID = "";
  window.$crisp.push(["do", "session:reset"]);
};

export const openChat = (
  error: any,
  _errorInfo: any,
  sentryErrorId: string
) => {
  const obj = sentryErrorId ? { sentryErrorId } : { error };

  window.$crisp.push([
    "set",
    "session:event",
    [[["report_problem", obj, "red"]]]
  ]);

  window.$crisp.push(["do", "chat:open"]);
};
