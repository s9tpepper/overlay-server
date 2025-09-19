const PrivMessage = (_privMessage) => {
  // Nothing to do for privmessage
};

const RedeemMessage = (redeemMessage) => {
  const { display_name, profile_url, title } = redeemMessage;

  const messageHandler = redemptions[title];
  if (typeof messageHandler === "function") {
    messageHandler(null, display_name, null, null, profile_url);
  }
};

const twitchMessages = {
  PrivMessage,
  RedeemMessage,
};

const playIntro = (_id, display_name, _title, _prompt, profile_url) => {
  console.log("playIntro()");

  const intros = document.querySelector("#intros");

  const img = document.createElement("img");
  img.src = profile_url;
  img.classList.add("profile_pic");

  const intro_div = document.createElement("div");
  intro_div.id = `intro_${Math.ceil(Math.random() * 999999)}`;
  intro_div.classList.add("intro");

  intro_div.append(img);

  const intro_p = document.createElement("p");
  intro_p.innerHTML = `${display_name} has entered the chat`;
  intro_div.append(intro_p);

  const script = document.createElement("script");
  script.innerText = `
      setTimeout(() => {
        const intro = document.querySelector('#${intro_div.id}');
        intro.parentElement.removeChild(intro);
      }, 8000);
  `;
  intro_div.append(script);

  intros.append(intro_div);
};

const redemptions = {
  "Play Intro": playIntro,
};

const connect = () => {
  // const url = "ws://127.0.0.1:54321";
  const url = "ws://quintessa:8766";
  const socket = new WebSocket(url);

  socket.addEventListener("open", () => {
    console.log("Socket open...");
  });

  socket.addEventListener("message", (event) => {
    const { data } = event;
    const message = JSON.parse(data);

    const { RedeemMessage } = message;
    if (RedeemMessage) {
      twitchMessages.RedeemMessage(RedeemMessage);
    }

    console.log(JSON.stringify(message, null, 2));
  });
};

(() => {
  connect();
})();
